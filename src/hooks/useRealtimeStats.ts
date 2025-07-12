import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import useSWR, { mutate } from 'swr';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PlatformStats {
  total_donated: number;
  total_donations: number;
  unique_donors: number;
  active_charities: number;
}

interface CharityStats {
  id: number;
  name: string;
  address: string;
  description: string;
  mission: string;
  total_donated: number;
  donation_count: number;
  unique_donors: number;
  last_donation: string | null;
}

interface RecentDonation {
  id: number;
  hash: string;
  donor: string;
  amount: number;
  timestamp: string;
  charity: {
    name: string;
    address: string;
  };
}

interface StatsResponse {
  platform: PlatformStats;
  charities: CharityStats[];
  recentDonations: RecentDonation[];
  lastUpdated: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useRealtimeStats() {
  const [isConnected, setIsConnected] = useState(false);
  
  const { data, error, isLoading } = useSWR<StatsResponse>('/api/stats', fetcher, {
    refreshInterval: 30000, // Fallback polling every 30 seconds
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  useEffect(() => {
    // Subscribe to real-time changes
    const channel = supabase
      .channel('donations-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'donations'
        },
        (payload) => {
          console.log('Real-time donation update:', payload);
          // Trigger SWR revalidation
          mutate('/api/stats');
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    data,
    error,
    isLoading,
    isConnected,
    mutate: () => mutate('/api/stats'),
  };
}

export function useCharityStats(charityId: number) {
  const { data, error, isLoading } = useSWR<{
    charity: CharityStats;
    donations: any[];
    lastUpdated: string;
  }>(`/api/charities/${charityId}`, fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  });

  useEffect(() => {
    if (!charityId) return;

    const channel = supabase
      .channel(`charity-${charityId}-realtime`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'donations',
          filter: `charity_id=eq.${charityId}`
        },
        (payload) => {
          console.log(`Real-time update for charity ${charityId}:`, payload);
          mutate(`/api/charities/${charityId}`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [charityId]);

  return {
    data,
    error,
    isLoading,
    mutate: () => mutate(`/api/charities/${charityId}`),
  };
}