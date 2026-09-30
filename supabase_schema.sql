-- ==============================================================================
-- AuraClean - Supabase Database Schema
-- ==============================================================================

-- 1. Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service TEXT DEFAULT 'Regular cleaning',
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'))
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow anonymous and public visitors to submit booking requests
DROP POLICY IF EXISTS "Allow public booking submissions" ON public.bookings;
CREATE POLICY "Allow public booking submissions"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 4. Policy: Allow service role full management access
DROP POLICY IF EXISTS "Allow service role full access" ON public.bookings;
CREATE POLICY "Allow service role full access"
ON public.bookings
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 5. Helpful index on email and creation date for search & filtering
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON public.bookings (email);
