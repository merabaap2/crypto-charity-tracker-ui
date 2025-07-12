/*
  # Initial Schema for Charity Tracker

  1. New Tables
    - `charities` - Store verified charity information
    - `donations` - Track all donation transactions from blockchain
    
  2. Security
    - Enable RLS on donations table
    - Add policy for public read access to donations
    - Charities table is publicly readable
    
  3. Indexes
    - Add indexes for efficient querying
    - Unique constraints for data integrity
*/

-- Create charities table
CREATE TABLE IF NOT EXISTS public.charities (
  id          smallint PRIMARY KEY,
  name        text NOT NULL,
  address     text NOT NULL UNIQUE,
  logo_url    text,
  description text,
  mission     text,
  created_at  timestamptz DEFAULT now()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS public.donations (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  hash        text UNIQUE NOT NULL,
  donor       text NOT NULL,
  charity_id  smallint REFERENCES public.charities(id),
  amount_wei  numeric(38,0) NOT NULL,
  amount_usdc numeric(12,6) GENERATED ALWAYS AS (amount_wei::numeric / 1000000) STORED,
  block_number bigint,
  ts          timestamptz DEFAULT now(),
  created_at  timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access for donations"
  ON public.donations
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public read access for charities"
  ON public.charities
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_donations_charity_id ON public.donations(charity_id);
CREATE INDEX IF NOT EXISTS idx_donations_donor ON public.donations(donor);
CREATE INDEX IF NOT EXISTS idx_donations_ts ON public.donations(ts DESC);
CREATE INDEX IF NOT EXISTS idx_donations_hash ON public.donations(hash);

-- Insert initial charity data
INSERT INTO public.charities (id, name, address, description, mission) VALUES
(0, 'Clean Water Foundation', '0x742d35Cc6635C0532925a3b8D6Ac6E4a03a3BBD9', 'Providing clean water access to communities worldwide', 'Our mission is to ensure every person has access to clean, safe drinking water. We build wells, water treatment facilities, and educate communities about water conservation.'),
(1, 'Education for All', '0x8a0A5CCa7B7C6EC3EC7093E6Eb8A4C3F6D4E5fA2', 'Supporting education initiatives in underserved areas', 'We believe education is the key to breaking the cycle of poverty. Our programs provide schools, teachers, and educational materials to children in need.'),
(2, 'Medical Relief International', '0x9B1E2C3D4A5B6C7D8E9F0A1B2C3D4E5F6A7B8C9D', 'Emergency medical aid and healthcare infrastructure', 'Delivering critical medical care to areas affected by natural disasters, conflicts, and health crises while building sustainable healthcare systems.'),
(3, 'Environmental Conservation', '0xA1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0', 'Protecting forests and wildlife habitats', 'Preserving our planet''s biodiversity through forest conservation, wildlife protection, and sustainable development initiatives.')
ON CONFLICT (id) DO NOTHING;

-- Create view for charity statistics
CREATE OR REPLACE VIEW public.charity_stats AS
SELECT 
  c.id,
  c.name,
  c.address,
  c.description,
  c.mission,
  COALESCE(SUM(d.amount_usdc), 0) as total_donated,
  COUNT(d.id) as donation_count,
  COUNT(DISTINCT d.donor) as unique_donors,
  MAX(d.ts) as last_donation
FROM public.charities c
LEFT JOIN public.donations d ON c.id = d.charity_id
GROUP BY c.id, c.name, c.address, c.description, c.mission;

-- Create function for real-time stats
CREATE OR REPLACE FUNCTION public.get_platform_stats()
RETURNS json
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT json_build_object(
    'total_donated', COALESCE(SUM(amount_usdc), 0),
    'total_donations', COUNT(*),
    'unique_donors', COUNT(DISTINCT donor),
    'active_charities', (SELECT COUNT(*) FROM charities)
  )
  FROM donations;
$$;