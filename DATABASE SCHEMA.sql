-- ============================================
-- RUN THIS IN SUPABASE, SQL EDITOR
-- ============================================

create table public.inquiries (
  id uuid not null default gen_random_uuid (),
  name text not null,
  email text not null,
  phone text null,
  message text not null,
  property_title text null,
  read boolean not null default false,
  created_at timestamp with time zone not null default now(),
  constraint inquiries_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists inquiries_created_at_idx on public.inquiries using btree (created_at desc) TABLESPACE pg_default;


create table public.properties (
  id uuid not null default gen_random_uuid (),
  title text not null,
  description text not null,
  price text not null,
  location text not null,
  category text not null,
  type text not null,
  status text not null default 'For Sale'::text,
  image_url text not null,
  beds integer null,
  baths integer null,
  area text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  images text[] null,
  make text null,
  model text null,
  year integer null,
  mileage text null,
  transmission text null,
  fuel_type text null,
  video_url text null,
  constraint properties_pkey primary key (id),
  constraint properties_category_check check (
    (
      category = any (
        array[
          'Real Estate'::text,
          'Rentals'::text,
          'Vehicles'::text,
          'Motorcycles'::text
        ]
      )
    )
  ),
  constraint properties_status_check check (
    (
      status = any (
        array['For Sale'::text, 'For Rent'::text, 'Sold'::text]
      )
    )
  )
) TABLESPACE pg_default;

create trigger update_properties_updated_at BEFORE
update on properties for EACH row
execute FUNCTION update_updated_at_column ();


create table public.settings (
  id uuid not null default gen_random_uuid (),
  company_name text not null default 'Hass Quality Properties'::text,
  tagline text null default 'Find Your Dream Property in Fort Portal Tourism City'::text,
  phone text null default ''::text,
  whatsapp text null default ''::text,
  email text null default ''::text,
  address text null default ''::text,
  facebook_url text null default ''::text,
  instagram_url text null default ''::text,
  tiktok_url text null default ''::text,
  google_maps_embed text null default ''::text,
  updated_at timestamp with time zone not null default now(),
  constraint settings_pkey primary key (id)
) TABLESPACE pg_default;

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE POLICIES FOR inquiries TABLE
-- ============================================

-- 1. Allow anyone to submit inquiries (INSERT)
CREATE POLICY "Anyone can submit inquiries" ON public.inquiries
    FOR INSERT
    WITH CHECK (true);

-- 2. Allow authenticated users (admins) to view all inquiries
CREATE POLICY "Authenticated users can view inquiries" ON public.inquiries
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- 3. Allow authenticated users (admins) to update inquiries (e.g., mark as read)
CREATE POLICY "Authenticated users can update inquiries" ON public.inquiries
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 4. Allow authenticated users (admins) to delete inquiries
CREATE POLICY "Authenticated users can delete inquiries" ON public.inquiries
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- ============================================
-- CREATE POLICIES FOR properties TABLE
-- ============================================

-- 1. Allow anyone to view properties (public read)
CREATE POLICY "Anyone can view properties" ON public.properties
    FOR SELECT
    USING (true);

-- 2. Allow authenticated users (admins) to insert properties
CREATE POLICY "Authenticated users can insert properties" ON public.properties
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- 3. Allow authenticated users (admins) to update properties
CREATE POLICY "Authenticated users can update properties" ON public.properties
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 4. Allow authenticated users (admins) to delete properties
CREATE POLICY "Authenticated users can delete properties" ON public.properties
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- ============================================
-- CREATE POLICIES FOR settings TABLE
-- ============================================

-- 1. Allow anyone to view settings (public read)
CREATE POLICY "Anyone can view settings" ON public.settings
    FOR SELECT
    USING (true);

-- 2. Allow authenticated users (admins) to insert settings
CREATE POLICY "Authenticated users can insert settings" ON public.settings
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- 3. Allow authenticated users (admins) to update settings
CREATE POLICY "Authenticated users can update settings" ON public.settings
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 4. Allow authenticated users (admins) to delete settings
CREATE POLICY "Authenticated users can delete settings" ON public.settings
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- ============================================
-- OPTIONAL: ADD MORE GRANULAR POLICIES
-- ============================================

-- For properties: Allow users to only see active properties
-- (uncomment if you want to filter by status)
/*
CREATE POLICY "Anyone can view active properties" ON public.properties
    FOR SELECT
    USING (status IN ('For Sale', 'For Rent'));
*/

-- For inquiries: Only allow users to see their own inquiries if you add user_id
-- (uncomment if you add user_id column to inquiries)
/*
CREATE POLICY "Users can view their own inquiries" ON public.inquiries
    FOR SELECT
    USING (auth.uid() = user_id);
*/

-- ============================================
-- VERIFY POLICIES
-- ============================================

-- Check all policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;