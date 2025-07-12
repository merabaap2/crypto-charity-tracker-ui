import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Get platform-wide statistics
    const { data: stats, error: statsError } = await supabase
      .rpc('get_platform_stats');

    if (statsError) {
      console.error('Stats error:', statsError);
      throw statsError;
    }

    // Get charity-specific statistics
    const { data: charityStats, error: charityError } = await supabase
      .from('charity_stats')
      .select('*')
      .order('total_donated', { ascending: false });

    if (charityError) {
      console.error('Charity stats error:', charityError);
      throw charityError;
    }

    // Get recent donations for activity feed
    const { data: recentDonations, error: donationsError } = await supabase
      .from('donations')
      .select(`
        id,
        hash,
        donor,
        amount_usdc,
        ts,
        charities!charity_id (
          name,
          address
        )
      `)
      .order('ts', { ascending: false })
      .limit(10);

    if (donationsError) {
      console.error('Recent donations error:', donationsError);
      throw donationsError;
    }

    const response = {
      platform: stats,
      charities: charityStats,
      recentDonations: recentDonations?.map(donation => ({
        id: donation.id,
        hash: donation.hash,
        donor: donation.donor,
        amount: donation.amount_usdc,
        timestamp: donation.ts,
        charity: donation.charities,
      })) || [],
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}