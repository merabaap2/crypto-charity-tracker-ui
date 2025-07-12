import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const charityId = searchParams.get('charity_id');
    const donor = searchParams.get('donor');

    const offset = (page - 1) * limit;

    let query = supabase
      .from('donations')
      .select(`
        id,
        hash,
        donor,
        amount_usdc,
        ts,
        block_number,
        charities!charity_id (
          id,
          name,
          address
        )
      `, { count: 'exact' });

    // Apply filters
    if (charityId) {
      query = query.eq('charity_id', parseInt(charityId));
    }

    if (donor) {
      query = query.eq('donor', donor.toLowerCase());
    }

    // Apply pagination and ordering
    const { data: donations, error, count } = await query
      .order('ts', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      donations: donations?.map(donation => ({
        id: donation.id,
        hash: donation.hash,
        donor: donation.donor,
        amount: donation.amount_usdc,
        timestamp: donation.ts,
        blockNumber: donation.block_number,
        charity: donation.charities,
      })) || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      lastUpdated: new Date().toISOString(),
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });

  } catch (error) {
    console.error('Donations API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch donations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}