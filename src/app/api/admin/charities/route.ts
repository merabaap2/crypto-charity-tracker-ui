import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Schema for charity creation/update
const CharitySchema = z.object({
  id: z.number().int().min(0),
  name: z.string().min(1).max(255),
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  description: z.string().max(500),
  mission: z.string().max(1000),
  logo_url: z.string().url().optional(),
});

// Simple auth check - in production, use proper JWT validation
async function checkAdminAuth(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  
  // Verify the token with Supabase
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return false;
  }

  // Check if user has admin role (you'd implement this based on your auth setup)
  // For demo purposes, we'll check user metadata
  return user.user_metadata?.role === 'admin';
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = CharitySchema.parse(body);

    const { data: charity, error } = await supabase
      .from('charities')
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Charity with this ID or address already exists' },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      charity,
      message: 'Charity created successfully',
    }, { status: 201 });

  } catch (error) {
    console.error('Admin Charity Creation Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to create charity',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Check authentication
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = CharitySchema.parse(body);

    const { data: charity, error } = await supabase
      .from('charities')
      .update(validatedData)
      .eq('id', validatedData.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Charity not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      charity,
      message: 'Charity updated successfully',
    });

  } catch (error) {
    console.error('Admin Charity Update Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to update charity',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}