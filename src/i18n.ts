export type Lang = 'ar' | 'en';

const ar = {
  dir: 'rtl' as const,
  nav_home: 'الرئيسية',
  nav_target: 'احسب تارجتك',
  nav_mediator: 'دخول الوسيط',
  nav_faq: 'الأسئلة الشائعة',
  btn_start: 'ابدأ رحلتك',
  btn_mediator_login: 'دخول الوسيط',
  btn_back_home: 'العودة للرئيسية',

  hero_badge: 'مجتمع صناع المحتوى الصوتي والمرئي',
  hero_live: 'بث مستمر',
  hero_title1: 'SHADOW',
  hero_title2: 'AGENCIES',
  hero_title3: 'COMMUNITY',
  hero_sub: 'أطلق صوتك وابنِ مجتمعك مع أقوى شبكة للوكالات الصوتية.',
  hero_sub2: 'نمنح الموهبة صوتاً، ونحوّل الشغف إلى تأثير حقيقي.',
  hero_cta: 'ابدأ رحلتك',
  hero_explore: 'اكتشف المجتمع',
  hero_whatsapp: 'تواصل عبر واتساب',
  hero_telegram: 'تواصل عبر تيليجرام',
  hero_card_badge: 'صوتك يصنع الفرق',
  hero_card_title: 'منصة واحدة. مجتمع كامل',
  hero_growth_label: 'نمو مستمر',
  hero_growth_value: '+42% هذا الشهر',
  stat1_v: '+6M', stat1_l: 'الزوار الشهري',
  stat2_v: '+3,252', stat2_l: 'داعم',
  stat3_v: '+6,019', stat3_l: 'مضيف نشط',

  why_eyebrow: 'لماذا Shadow؟',
  why_title: 'ما الذي نقدمه لك؟',
  why_copy: 'مساحتك الآمنة للنمو، التواصل، وتحويل حضورك اليومي إلى مسيرة حقيقية.',
  service_flip: 'مرّر لمعرفة المزيد',
  service_tagline: 'نصنع المساحة. ونرافقك في الطريق.',

  stats_agencies: 'وكالة شريكة',
  stats_members: 'عضو في الشبكة',
  stats_support: 'دعم ومتابعة',
  stats_satisfaction: 'رضا المجتمع',

  stars_eyebrow: 'الأشخاص الذين يصنعون الفرق',
  stars_title: 'نجوم مجتمعنا',
  stars_copy: 'أصوات وداعمين ومساهمين يضيفون كل يوم شيئاً جديداً إلى هذه المساحة.',
  stars_empty: 'لا يوجد أعضاء مميزون حالياً.',
  role_host: 'مضيف',
  role_supporter: 'داعم',
  role_contributor: 'مساهم',
  role_in_community: 'في المجتمع',

  agencies_eyebrow: 'شركاء النجاح',
  agencies_title: 'أقوى الوكالات',
  agency_members: 'عضو نشط',

  videos_eyebrow: 'من مجتمعنا',
  videos_title: 'الفيديوهات',

  testimonials_eyebrow: 'كلمات من المجتمع',
  testimonials_title: 'نحن نكبر معاً',
  testimonials_copy: 'النجاح هنا لا يُقاس بالأرقام فقط، بل بالأثر الذي نتركه في حياة بعضنا.',
  testimonials_empty: 'لا توجد كلمات شكر حالياً.',
  testimonial_role_default: 'عضو في المجتمع',

  cta_eyebrow: 'خطوتك التالية تبدأ هنا',
  cta_title: 'جاهز تطلق صوتك؟',
  cta_sub: 'انضم إلى مجتمع يقدّر حضورك ويؤمن بإمكانياتك.',
  cta_btn: 'سجّل الآن',

  faq_eyebrow: 'نجيبك بوضوح',
  faq_title: 'الأسئلة الشائعة',

  footer_explore: 'استكشف',
  footer_follow: 'تابعنا',
  footer_copy: 'أطلق صوتك، ابنِ مجتمعك، وكن جزءاً من شبكة تؤمن بما تستطيع أن تصنعه.',
  footer_rights: '© 2026 Shadow Agencies Community',
  footer_privacy: 'خصوصيتك وأمانك أولويتنا',

  loading: 'جارٍ التحميل...',
  page_not_found_title: 'الصفحة غير موجودة',
  page_not_found_sub: 'عذراً، الرابط الذي تبحث عنه غير موجود أو تم نقله.',
};

const en: typeof ar = {
  dir: 'ltr' as const,
  nav_home: 'Home',
  nav_target: 'Target Calculator',
  nav_mediator: 'Mediator Login',
  nav_faq: 'FAQ',
  btn_start: 'Get Started',
  btn_mediator_login: 'Mediator Login',
  btn_back_home: 'Back to Home',

  hero_badge: 'Audio & Visual Content Creators Community',
  hero_live: 'Live Streaming',
  hero_title1: 'SHADOW',
  hero_title2: 'AGENCIES',
  hero_title3: 'COMMUNITY',
  hero_sub: 'Launch your voice and build your community with the most powerful audio agency network.',
  hero_sub2: 'We give talent a voice and turn passion into real impact.',
  hero_cta: 'Get Started',
  hero_explore: 'Explore Community',
  hero_whatsapp: 'Contact via WhatsApp',
  hero_telegram: 'Contact via Telegram',
  hero_card_badge: 'Your Voice Makes a Difference',
  hero_card_title: 'One Platform. Full Community',
  hero_growth_label: 'Continuous Growth',
  hero_growth_value: '+42% This Month',
  stat1_v: '+6M', stat1_l: 'Monthly Visitors',
  stat2_v: '+3,252', stat2_l: 'Supporters',
  stat3_v: '+6,019', stat3_l: 'Active Hosts',

  why_eyebrow: 'Why Shadow?',
  why_title: 'What We Offer You',
  why_copy: 'Your safe space to grow, connect, and turn your daily presence into a real career.',
  service_flip: 'Hover to learn more',
  service_tagline: 'We create the space. We walk with you.',

  stats_agencies: 'Partner Agencies',
  stats_members: 'Network Members',
  stats_support: '24/7 Support',
  stats_satisfaction: 'Community Satisfaction',

  stars_eyebrow: 'People Who Make the Difference',
  stars_title: 'Community Stars',
  stars_copy: 'Voices, supporters and contributors adding something new to this space every day.',
  stars_empty: 'No featured members yet.',
  role_host: 'Host',
  role_supporter: 'Supporter',
  role_contributor: 'Contributor',
  role_in_community: 'in the Community',

  agencies_eyebrow: 'Partners in Success',
  agencies_title: 'Top Agencies',
  agency_members: 'active members',

  videos_eyebrow: 'From Our Community',
  videos_title: 'Videos',

  testimonials_eyebrow: 'Words From the Community',
  testimonials_title: 'We Grow Together',
  testimonials_copy: "Success here is measured not just in numbers, but in the impact we leave in each other's lives.",
  testimonials_empty: 'No testimonials yet.',
  testimonial_role_default: 'Community Member',

  cta_eyebrow: 'Your Next Step Starts Here',
  cta_title: 'Ready to Launch Your Voice?',
  cta_sub: 'Join a community that values your presence and believes in your potential.',
  cta_btn: 'Register Now',

  faq_eyebrow: 'Clear Answers',
  faq_title: 'Frequently Asked Questions',

  footer_explore: 'Explore',
  footer_follow: 'Follow Us',
  footer_copy: 'Launch your voice, build your community, and be part of a network that believes in what you can create.',
  footer_rights: '© 2026 Shadow Agencies Community',
  footer_privacy: 'Your privacy and security are our priority',

  loading: 'Loading...',
  page_not_found_title: 'Page Not Found',
  page_not_found_sub: 'Sorry, the link you are looking for does not exist or has been moved.',
};

export const translations = { ar, en };
export type TranslationKey = keyof typeof ar;
export function t(lang: Lang, key: TranslationKey): string {
  return translations[lang][key] as string;
}
