/*
# Extend registrations and add agency management structures

1. Changes
- registrations: add app_id, account_type, is_banned columns
- New table: video_links — embeddable video URLs managed by admin
- New table: social_links — footer/contact social platform links
- New table: mediators — mediator accounts with commission settings
- New table: agency_staff — managers and supervisors per agency

2. Security
- RLS enabled on all new tables
- Public read for published/active records
- Insert-only for registrations from anon
- All writes restricted (no anon write on new tables)
*/

ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS app_id text,
  ADD COLUMN IF NOT EXISTS account_type text NOT NULL DEFAULT 'normal' CHECK (account_type IN ('normal', 'pro', 'vip')),
  ADD COLUMN IF NOT EXISTS is_banned boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS phone_code text DEFAULT '+20';

CREATE TABLE IF NOT EXISTS public.video_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  label text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.mediators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  agency_id uuid REFERENCES public.agencies(id) ON DELETE SET NULL,
  commission text NOT NULL DEFAULT '50%',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.agency_staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('manager', 'supervisor')),
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.video_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mediators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_staff ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.video_links, public.social_links TO anon, authenticated;
GRANT SELECT ON public.mediators, public.agency_staff TO anon, authenticated;

DROP POLICY IF EXISTS "public read video_links" ON public.video_links;
CREATE POLICY "public read video_links" ON public.video_links FOR SELECT TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "public read social_links" ON public.social_links;
CREATE POLICY "public read social_links" ON public.social_links FOR SELECT TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "public read mediators" ON public.mediators;
CREATE POLICY "public read mediators" ON public.mediators FOR SELECT TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "public read agency_staff" ON public.agency_staff;
CREATE POLICY "public read agency_staff" ON public.agency_staff FOR SELECT TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS video_links_sort_idx ON public.video_links (sort_order, created_at DESC);
CREATE INDEX IF NOT EXISTS social_links_sort_idx ON public.social_links (sort_order);
CREATE INDEX IF NOT EXISTS agency_staff_agency_idx ON public.agency_staff (agency_id);
CREATE INDEX IF NOT EXISTS registrations_agency_id_idx ON public.registrations (agency_id);
