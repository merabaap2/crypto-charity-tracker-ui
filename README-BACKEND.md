# 🚀 Charity Tracker Backend

Complete backend implementation for the charity donation tracker with real-time blockchain indexing.

## 🏗️ Architecture

```
┌──── Frontend (Next.js) ─────┐
│ donate() tx → Monad chain   │
└────────────┬───────────────┘
             │ ①Donation event
             ▼
    Node Indexer (viem + zod)
             │ ②INSERT rows
             ▼
   Supabase Postgres + Realtime
             │ ③REST / WS
             ▼
┌────  Next.js API  ─────┐
│ stats, list, admin     │
└─────────┬──────────────┘
          ▼
    Browser live counters
```

## 🚀 Quick Start

### 1. Database Setup (Supabase)

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and keys from Settings > API
3. Run the migration in Supabase SQL Editor:

```sql
-- Copy the contents of supabase/migrations/001_initial_schema.sql
```

### 2. Indexer Deployment (Fly.io)

```bash
cd indexer
npm install
cp .env.example .env
# Fill in your environment variables

# Deploy to Fly.io
fly launch --dockerfile
fly secrets set RPC_URL=https://testnet-rpc.monad.xyz
fly secrets set CONTRACT_ADDR=0x...
fly secrets set SUPABASE_URL=https://...
fly secrets set SUPABASE_SERVICE_ROLE_KEY=...
fly deploy
```

### 3. Frontend API Setup

```bash
# In your main project directory
cp .env.example .env.local
# Fill in your Supabase credentials

# The API routes are already implemented in src/app/api/
```

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/stats` | GET | Platform-wide statistics |
| `/api/charities` | GET | List all charities with stats |
| `/api/charities/[id]` | GET | Charity details and donations |
| `/api/donations` | GET | Paginated donations list |
| `/api/admin/charities` | POST/PUT | Admin charity management |

## 🔄 Real-time Updates

The system uses Supabase Realtime for live updates:

```typescript
// Example usage in React component
import { useRealtimeStats } from '@/hooks/useRealtimeStats';

function StatsComponent() {
  const { data, isConnected } = useRealtimeStats();
  
  return (
    <div>
      <Badge variant={isConnected ? 'default' : 'secondary'}>
        {isConnected ? 'Live' : 'Offline'}
      </Badge>
      <p>Total Donated: ${data?.platform.total_donated}</p>
    </div>
  );
}
```

## 🛠️ Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Indexer (.env)
```env
RPC_URL=https://testnet-rpc.monad.xyz
CONTRACT_ADDR=0x1234567890123456789012345678901234567890
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 📊 Database Schema

### Tables
- **charities**: Verified charity organizations
- **donations**: All donation transactions from blockchain

### Views
- **charity_stats**: Aggregated statistics per charity

### Functions
- **get_platform_stats()**: Platform-wide donation statistics

## 🔍 Monitoring

### Health Checks
The indexer includes built-in health checks:
```bash
# Check indexer health
curl https://your-indexer.fly.dev/health
```

### Logging
All components include structured logging:
- Indexer: Console logs with timestamps
- API: Next.js built-in logging
- Database: Supabase dashboard

## 🚀 Deployment

### Vercel (Frontend + API)
```bash
vercel --prod
```

### Fly.io (Indexer)
```bash
cd indexer
fly deploy
```

## 🧪 Demo Flow

1. **Connect wallet** → MetaMask on Monad testnet
2. **Make donation** → 5 USDC to any charity
3. **Watch live update** → Counter updates in 2-3 seconds
4. **Check persistence** → Refresh page, data persists
5. **View transaction** → Click through to blockchain explorer

## 🔧 Development

### Local Development
```bash
# Start the indexer locally
cd indexer
npm run dev

# Start the frontend
npm run dev
```

### Testing
```bash
# Test database connection
npm run test:db

# Test indexer
npm run test:indexer
```

## 📈 Performance

- **Database**: Supabase Postgres with optimized indexes
- **Caching**: API responses cached for 30-60 seconds
- **Real-time**: WebSocket connections for live updates
- **Scaling**: Indexer runs on single Fly.io instance (can scale horizontally)

## 🔒 Security

- **RLS**: Row Level Security enabled on all tables
- **API Keys**: Service role key for backend, anon key for frontend
- **Validation**: Zod schemas for all data validation
- **Auth**: JWT-based authentication for admin endpoints

## 🎯 Key Features

✅ **Real-time updates** - Live donation counters  
✅ **Type safety** - Full TypeScript with Zod validation  
✅ **Scalable** - Horizontal scaling ready  
✅ **Monitored** - Health checks and logging  
✅ **Cached** - Optimized API response caching  
✅ **Secure** - RLS and proper authentication  

## 🆘 Troubleshooting

### Common Issues

1. **Indexer not receiving events**
   - Check RPC URL and contract address
   - Verify network connectivity
   - Check Fly.io logs: `fly logs`

2. **Database connection failed**
   - Verify Supabase credentials
   - Check service role key permissions
   - Test connection in Supabase dashboard

3. **Real-time not working**
   - Check anon key permissions
   - Verify RLS policies
   - Test WebSocket connection

### Support

For issues and questions:
1. Check the logs in Supabase dashboard
2. Review Fly.io deployment logs
3. Test API endpoints directly
4. Verify environment variables

---

**Total setup time: ~45 minutes**  
**Monthly cost: ~$0 (free tiers)**  
**Demo ready: ✅**