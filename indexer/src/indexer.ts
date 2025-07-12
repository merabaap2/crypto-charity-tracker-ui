import { createClient } from '@supabase/supabase-js';
import { createPublicClient, http, parseAbiItem, type Log } from 'viem';
import { z } from 'zod';
import * as dotenv from 'dotenv';
import { DonationEventSchema, DonationRowSchema, CHARITY_MAPPING, type IndexerConfig } from './types';

// Load environment variables
dotenv.config();

// Validate environment variables
const EnvSchema = z.object({
  RPC_URL: z.string().url(),
  CONTRACT_ADDR: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  START_BLOCK: z.string().optional().default('latest'),
  BATCH_SIZE: z.string().optional().default('100'),
  RETRY_ATTEMPTS: z.string().optional().default('3'),
  RETRY_DELAY: z.string().optional().default('5000'),
  LOG_LEVEL: z.string().optional().default('info'),
});

const env = EnvSchema.parse(process.env);

// Configuration
const config: IndexerConfig = {
  rpcUrl: env.RPC_URL,
  contractAddress: env.CONTRACT_ADDR as `0x${string}`,
  supabaseUrl: env.SUPABASE_URL,
  supabaseServiceKey: env.SUPABASE_SERVICE_ROLE_KEY,
  startBlock: env.START_BLOCK === 'latest' ? undefined : BigInt(env.START_BLOCK),
  batchSize: parseInt(env.BATCH_SIZE),
  retryAttempts: parseInt(env.RETRY_ATTEMPTS),
  retryDelay: parseInt(env.RETRY_DELAY),
};

// Initialize clients
const rpc = createPublicClient({
  transport: http(config.rpcUrl, {
    retryCount: config.retryAttempts,
    retryDelay: config.retryDelay,
  }),
});

const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);

// ABI for the Donation event
const DONATION_EVENT_ABI = [
  parseAbiItem('event Donation(address indexed donor, address indexed charity, uint256 amount, uint256 timestamp)')
];

// Logging utility
const log = {
  info: (msg: string, data?: any) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`, data || ''),
  error: (msg: string, error?: any) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, error || ''),
  warn: (msg: string, data?: any) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`, data || ''),
};

// Process donation logs and insert into database
async function processDonationLogs(logs: Log[]) {
  if (logs.length === 0) return;

  try {
    const rows: DonationRow[] = logs.map(logEntry => {
      // Parse the log arguments
      const args = logEntry.args as {
        donor: string;
        charity: string;
        amount: bigint;
        timestamp: bigint;
      };

      // Validate the event data
      const validatedEvent = DonationEventSchema.parse(args);

      // Map charity address to charity ID
      const charityId = CHARITY_MAPPING[validatedEvent.charity.toLowerCase()];
      if (charityId === undefined) {
        throw new Error(`Unknown charity address: ${validatedEvent.charity}`);
      }

      // Create donation row
      const row: DonationRow = {
        hash: logEntry.transactionHash!,
        donor: validatedEvent.donor.toLowerCase(),
        charity_id: charityId,
        amount_wei: validatedEvent.amount.toString(),
        block_number: Number(logEntry.blockNumber),
        ts: new Date(Number(validatedEvent.timestamp) * 1000),
      };

      // Validate the row before insertion
      return DonationRowSchema.parse(row);
    });

    // Insert into Supabase with conflict resolution
    const { data, error } = await supabase
      .from('donations')
      .insert(rows)
      .select('id, hash, amount_usdc, charity_id');

    if (error) {
      // Handle duplicate key errors gracefully
      if (error.code === '23505') {
        log.warn(`Duplicate transactions detected, skipping: ${logs.map(l => l.transactionHash).join(', ')}`);
        return;
      }
      throw error;
    }

    log.info(`Successfully indexed ${data?.length || 0} donations`, {
      transactions: logs.map(l => l.transactionHash),
      totalAmount: rows.reduce((sum, row) => sum + BigInt(row.amount_wei), 0n).toString(),
    });

  } catch (error) {
    log.error('Failed to process donation logs', error);
    throw error;
  }
}

// Main indexer function
async function startIndexer() {
  log.info('Starting charity donation indexer', {
    contract: config.contractAddress,
    rpcUrl: config.rpcUrl,
    startBlock: config.startBlock?.toString() || 'latest',
  });

  try {
    // Test database connection
    const { data: testData, error: testError } = await supabase
      .from('charities')
      .select('count')
      .limit(1);

    if (testError) {
      throw new Error(`Database connection failed: ${testError.message}`);
    }

    log.info('Database connection successful');

    // Test RPC connection
    const blockNumber = await rpc.getBlockNumber();
    log.info(`Connected to blockchain, current block: ${blockNumber}`);

    // Start watching for events
    const unwatch = rpc.watchEvent({
      address: config.contractAddress,
      abi: DONATION_EVENT_ABI,
      eventName: 'Donation',
      fromBlock: config.startBlock || 'latest',
      onLogs: async (logs) => {
        try {
          await processDonationLogs(logs);
        } catch (error) {
          log.error('Error processing logs', error);
          // Continue watching even if processing fails
        }
      },
      onError: (error) => {
        log.error('Event watching error', error);
      },
    });

    log.info('Event watcher started successfully');

    // Graceful shutdown
    process.on('SIGINT', () => {
      log.info('Received SIGINT, shutting down gracefully...');
      unwatch();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      log.info('Received SIGTERM, shutting down gracefully...');
      unwatch();
      process.exit(0);
    });

  } catch (error) {
    log.error('Failed to start indexer', error);
    process.exit(1);
  }
}

// Health check endpoint for monitoring
async function healthCheck() {
  try {
    // Check database
    const { error: dbError } = await supabase
      .from('charities')
      .select('count')
      .limit(1);

    if (dbError) throw new Error(`DB: ${dbError.message}`);

    // Check RPC
    await rpc.getBlockNumber();

    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    return { 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString() 
    };
  }
}

// Start the indexer
if (require.main === module) {
  startIndexer().catch((error) => {
    log.error('Indexer startup failed', error);
    process.exit(1);
  });
}

export { startIndexer, healthCheck, processDonationLogs };