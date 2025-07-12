import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const charityId = parseInt(params.id);
    
    if (isNaN(charityId)) {
      return NextResponse.json(
        { error: 'Invalid charity ID' },
        { status: 400 }
      );
    }

    // Get charity details with stats
    const { data: charity, error: charityError } = await supabase
      .from('charity_stats')
      .select('*')
      .eq('id', charityId)
      .single();

    if (charityError) {
      if (charityError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Charity not found' },
          { status: 404 }
        );
      }
      throw charityError;
    }

    // Get recent donations for this charity
    const { data: donations, error: donationsError } = await supabase
      .from('donations')
      .select('id, hash, donor, amount_usdc, ts, block_number')
      .eq('charity_id', charityId)
      .order('ts', { ascending: false })
      .limit(20);

    if (donationsError) {
      throw donationsError;
    }

    return NextResponse.json({
      charity,
      donations: donations || [],
      lastUpdated: new Date().toISOString(),
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });

  } catch (error) {
    console.error('Charity Detail API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch charity details',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}