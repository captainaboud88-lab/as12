/*
# Create Shadow Agencies public content and registration data

1. New Tables
- `registrations`: visitor applications for Host, Supporter, and Contributor roles, including contact, country, talent, discovery source, and optional referral code.
- `agencies`: agency directory entries with name, logo URL, app account code, and active status.
- `featured_members`: editable spotlight cards for hosts, supporters, and contributors.
- `media_links`: editable gallery and video links shown on the public site.
- `testimonials`: editable thank-you messages and display names.
- `target_rates`: target-to-salary rules used by the target calculator.

2. Security
- Row-level security is enabled on every table.
- Public visitors can read only content marked active or published.
- Public visitors can submit registrations but cannot read, edit, or delete submissions.
- Anonymous and authenticated roles receive only the minimum grants needed by the public website.
- Administrative mutations are intentionally not exposed through the public Data API.

3. Important Notes
- Registration data is private by default and is insert-only from the public form.
- Links are stored as text so an administrator can curate external gallery and video content later.
- Target rules are ordered by target threshold and can be changed without rebuilding the calculator.
*/

CREATE TABLE IF NOT EXISTS public.registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 3 AND 120),
  gender text NOT NULL CHECK (gender IN ('male', 'female')),
  country text NOT NULL,
  phone_code text NOT NULL,
  phone_number text NOT NULL CHECK (char_length(phone_number) BETWEEN 5 AND 30),
  role text NOT NULL CHECK (role IN ('host', 'supporter', 'contributor')),
  talent text,
  discovery_source text NOT NULL,
  referral_code text,
  agency_id uuid,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'blocked', 'rejected')),
  application_note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.agencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  logo_url text,
  app_account_code text,
  member_count integer NOT NULL DEFAULT 0 CHECK (member_count >= 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.featured_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  role text NOT NULL CHECK (role IN ('host', 'supporter', 'contributor')),
  image_url text,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.media_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_type text NOT NULL CHECK (media_type IN ('gallery', 'video')),
  title text NOT NULL,
  url text NOT NULL,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL CHECK (char_length(author_name) BETWEEN 2 AND 120),
  message text NOT NULL CHECK (char_length(message) BETWEEN 5 AND 500),
  role text,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.target_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_amount numeric(12,2) NOT NULL CHECK (target_amount >= 0),
  salary_amount numeric(12,2) NOT NULL CHECK (salary_amount >= 0),
  label text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.featured_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.target_rates ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON public.registrations TO anon, authenticated;
GRANT SELECT ON public.agencies, public.featured_members, public.media_links, public.testimonials, public.target_rates TO anon, authenticated;

DROP POLICY IF EXISTS "public can submit registrations" ON public.registrations;
CREATE POLICY "public can submit registrations" ON public.registrations
  FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending');

DROP POLICY IF EXISTS "public can view active agencies" ON public.agencies;
CREATE POLICY "public can view active agencies" ON public.agencies
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "public can view published members" ON public.featured_members;
CREATE POLICY "public can view published members" ON public.featured_members
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS "public can view published media" ON public.media_links;
CREATE POLICY "public can view published media" ON public.media_links
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS "public can view published testimonials" ON public.testimonials;
CREATE POLICY "public can view published testimonials" ON public.testimonials
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS "public can view active target rates" ON public.target_rates;
CREATE POLICY "public can view active target rates" ON public.target_rates
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE INDEX IF NOT EXISTS registrations_status_created_at_idx ON public.registrations (status, created_at DESC);
CREATE INDEX IF NOT EXISTS registrations_phone_number_idx ON public.registrations (phone_number);
CREATE INDEX IF NOT EXISTS target_rates_sort_order_idx ON public.target_rates (sort_order, target_amount);
