/*
# Extend schema for mediator login, target management, site settings, and full admin CRUD

1. New Columns
- mediators.password: password for mediator login (client-side auth)
- registrations.mediator_id: links a registration to the mediator who invited them
- registrations.activation_date: when the member was activated
- registrations.expiry_date: when the member's targets expire (calculated from mediator commission: 50% = 2 targets x 15 days, 25% = 4 targets x 15 days)
- registrations.achieved_target: the member's latest achieved target value (set by admin)

2. New Table
- site_settings: key-value store for admin credentials (admin_username, admin_password) and support contact links (support_whatsapp, support_telegram)

3. Security - New Policies
- site_settings: full CRUD for anon, authenticated (no-auth app)
- registrations: added SELECT, UPDATE, DELETE policies (was insert-only, so admin could never load submissions)
- agencies, featured_members, testimonials, video_links, social_links, target_rates, agency_staff: added INSERT, UPDATE, DELETE policies (were select-only, so admin edits never persisted — root cause of homepage editor bug)
- mediators: broadened SELECT to all records (admin needs inactive mediators), added INSERT, UPDATE, DELETE

4. Important Notes
- This is a no-auth app: all operations run as anon. Admin and mediator logins are client-side checks against DB values.
- The missing INSERT/UPDATE/DELETE policies were the root cause of homepage editor changes not persisting to the database.
*/

-- 1. Add columns
ALTER TABLE public.mediators ADD COLUMN IF NOT EXISTS password text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS mediator_id uuid REFERENCES public.mediators(id) ON DELETE SET NULL;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS activation_date timestamptz;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS expiry_date timestamptz;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS achieved_target numeric(12,2) NOT NULL DEFAULT 0;

-- 2. Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO anon, authenticated;
INSERT INTO public.site_settings (key, value) VALUES
  ('admin_username', 'admin'),
  ('admin_password', 'admin123'),
  ('support_whatsapp', ''),
  ('support_telegram', '')
ON CONFLICT (key) DO NOTHING;

-- 3. site_settings policies
DROP POLICY IF EXISTS "site_settings_select" ON public.site_settings;
CREATE POLICY "site_settings_select" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "site_settings_insert" ON public.site_settings;
CREATE POLICY "site_settings_insert" ON public.site_settings FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "site_settings_update" ON public.site_settings;
CREATE POLICY "site_settings_update" ON public.site_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "site_settings_delete" ON public.site_settings;
CREATE POLICY "site_settings_delete" ON public.site_settings FOR DELETE TO anon, authenticated USING (true);

-- 4. registrations: add SELECT, UPDATE, DELETE
DROP POLICY IF EXISTS "registrations_select" ON public.registrations;
CREATE POLICY "registrations_select" ON public.registrations FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "registrations_update" ON public.registrations;
CREATE POLICY "registrations_update" ON public.registrations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "registrations_delete" ON public.registrations;
CREATE POLICY "registrations_delete" ON public.registrations FOR DELETE TO anon, authenticated USING (true);

-- 5. agencies: add INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "agencies_insert" ON public.agencies;
CREATE POLICY "agencies_insert" ON public.agencies FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "agencies_update" ON public.agencies;
CREATE POLICY "agencies_update" ON public.agencies FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "agencies_delete" ON public.agencies;
CREATE POLICY "agencies_delete" ON public.agencies FOR DELETE TO anon, authenticated USING (true);

-- 6. featured_members: add INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "featured_members_insert" ON public.featured_members;
CREATE POLICY "featured_members_insert" ON public.featured_members FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "featured_members_update" ON public.featured_members;
CREATE POLICY "featured_members_update" ON public.featured_members FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "featured_members_delete" ON public.featured_members;
CREATE POLICY "featured_members_delete" ON public.featured_members FOR DELETE TO anon, authenticated USING (true);

-- 7. testimonials: add INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "testimonials_insert" ON public.testimonials;
CREATE POLICY "testimonials_insert" ON public.testimonials FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "testimonials_update" ON public.testimonials;
CREATE POLICY "testimonials_update" ON public.testimonials FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "testimonials_delete" ON public.testimonials;
CREATE POLICY "testimonials_delete" ON public.testimonials FOR DELETE TO anon, authenticated USING (true);

-- 8. video_links: add INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "video_links_insert" ON public.video_links;
CREATE POLICY "video_links_insert" ON public.video_links FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "video_links_update" ON public.video_links;
CREATE POLICY "video_links_update" ON public.video_links FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "video_links_delete" ON public.video_links;
CREATE POLICY "video_links_delete" ON public.video_links FOR DELETE TO anon, authenticated USING (true);

-- 9. social_links: add INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "social_links_insert" ON public.social_links;
CREATE POLICY "social_links_insert" ON public.social_links FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "social_links_update" ON public.social_links;
CREATE POLICY "social_links_update" ON public.social_links FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "social_links_delete" ON public.social_links;
CREATE POLICY "social_links_delete" ON public.social_links FOR DELETE TO anon, authenticated USING (true);

-- 10. target_rates: add INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "target_rates_insert" ON public.target_rates;
CREATE POLICY "target_rates_insert" ON public.target_rates FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "target_rates_update" ON public.target_rates;
CREATE POLICY "target_rates_update" ON public.target_rates FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "target_rates_delete" ON public.target_rates;
CREATE POLICY "target_rates_delete" ON public.target_rates FOR DELETE TO anon, authenticated USING (true);

-- 11. mediators: replace SELECT (broaden to all), add INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "public read mediators" ON public.mediators;
CREATE POLICY "mediators_select" ON public.mediators FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "mediators_insert" ON public.mediators;
CREATE POLICY "mediators_insert" ON public.mediators FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "mediators_update" ON public.mediators;
CREATE POLICY "mediators_update" ON public.mediators FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "mediators_delete" ON public.mediators;
CREATE POLICY "mediators_delete" ON public.mediators FOR DELETE TO anon, authenticated USING (true);

-- 12. agency_staff: add INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "agency_staff_insert" ON public.agency_staff;
CREATE POLICY "agency_staff_insert" ON public.agency_staff FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "agency_staff_update" ON public.agency_staff;
CREATE POLICY "agency_staff_update" ON public.agency_staff FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "agency_staff_delete" ON public.agency_staff;
CREATE POLICY "agency_staff_delete" ON public.agency_staff FOR DELETE TO anon, authenticated USING (true);

-- 13. Index for mediator dashboard queries
CREATE INDEX IF NOT EXISTS registrations_mediator_id_idx ON public.registrations (mediator_id);
