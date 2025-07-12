import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data: charities, error } = await supabase
      .from('charity_stats')
      .select('*')
      .order('total_donated', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      charities: charities || [],
      count: charities?.length || 0,
      lastUpdated: new Date().toISOString(),
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });

  } catch (error) {
    console.error('Charities API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch charities',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}