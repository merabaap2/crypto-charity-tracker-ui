import { z } from 'zod';

// Zod schemas for type safety
export const DonationEventSchema = z.object({
  donor: z.string(),
  charity: z.string(),
  amount: z.bigint(),
  timestamp: z.bigint(),
});

export const DonationRowSchema = z.object({
  hash: z.string(),
  donor: z.string(),
  charity_id: z.number(),
  amount_wei: z.string(),
  block_number: z.number().optional(),
  ts: z.date(),
});

export type DonationEvent = z.infer<typeof DonationEventSchema>;
export type DonationRow = z.infer<typeof DonationRowSchema>;

// Charity mapping - maps contract charity IDs to database IDs
export const CHARITY_MAPPING: Record<string, number> = {
  '0x742d35Cc6635C0532925a3b8D6Ac6E4a03a3BBD9': 0, // Clean Water Foundation
  '0x8a0A5CCa7B7C6EC3EC7093E6Eb8A4C3F6D4E5fA2': 1, // Education for All
  '0x9B1E2C3D4A5B6C7D8E9F0A1B2C3D4E5F6A7B8C9D': 2, // Medical Relief International
  '0xA1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0': 3, // Environmental Conservation
};

export interface IndexerConfig {
  rpcUrl: string;
  contractAddress: `0x${string}`;
  supabaseUrl: string;
  supabaseServiceKey: string;
  startBlock?: bigint;
  batchSize: number;
  retryAttempts: number;
  retryDelay: number;
}