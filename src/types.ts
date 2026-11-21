export type View = 'home' | 'register' | 'target' | 'mediator' | 'admin' | 'error';
export type RegisterRole = 'host' | 'supporter' | 'contributor';
export type FeaturedRole = 'host' | 'supporter' | 'contributor';
export type AdminTab = 'overview' | 'agencies' | 'homepage' | 'mediators' | 'requests' | 'targets' | 'settings';
export type AccountType = 'normal' | 'pro' | 'vip';

export type Agency = {
  id: string;
  name: string;
  logo_url: string;
  app_account_code: string;
  member_count: number;
};

export type FeaturedMember = {
  id: string;
  name: string;
  role: FeaturedRole;
  image_url: string | null;
};

export type Testimonial = {
  id: string;
  author_name: string;
  message: string;
  role: string | null;
};

export type Rate = {
  id: string;
  target_amount: number;
  salary_amount: number;
  label: string;
};

export type Registration = {
  id: string;
  full_name: string;
  role: RegisterRole;
  country: string;
  gender: string;
  phone_code: string;
  phone_number: string;
  agency_id: string | null;
  status: string;
  app_id: string | null;
  account_type: AccountType;
  is_banned: boolean;
  created_at: string;
  mediator_id: string | null;
  activation_date: string | null;
  expiry_date: string | null;
  achieved_target: number;
};

export type VideoLink = {
  id: string;
  title: string;
  url: string;
  is_published: boolean;
  sort_order: number;
};

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
  label: string;
  sort_order: number;
};

export type Mediator = {
  id: string;
  name: string;
  code: string;
  agency_id: string | null;
  commission: string;
  is_active: boolean;
  password: string | null;
};

export type AgencyStaff = {
  id: string;
  agency_id: string;
  name: string;
  role: 'manager' | 'supervisor';
  phone: string;
};

export type SiteSettings = {
  admin_username: string;
  admin_password: string;
  support_whatsapp: string;
  support_telegram: string;
};
