import type { Agency, FeaturedMember, Mediator, Rate, Registration, Testimonial } from './types';

export const defaultSiteSettings = {
  admin_username: 'admin',
  admin_password: 'admin123',
  support_whatsapp: '',
  support_telegram: '',
};

export const countries = [
  { name: 'مصر', code: '+20' },
  { name: 'السعودية', code: '+966' },
  { name: 'الإمارات', code: '+971' },
  { name: 'الكويت', code: '+965' },
  { name: 'قطر', code: '+974' },
  { name: 'البحرين', code: '+973' },
  { name: 'عمان', code: '+968' },
  { name: 'الأردن', code: '+962' },
  { name: 'العراق', code: '+964' },
  { name: 'لبنان', code: '+961' },
  { name: 'فلسطين', code: '+970' },
  { name: 'المغرب', code: '+212' },
  { name: 'الجزائر', code: '+213' },
  { name: 'تونس', code: '+216' },
  { name: 'ليبيا', code: '+218' },
  { name: 'السودان', code: '+249' },
  { name: 'اليمن', code: '+967' },
  { name: 'سوريا', code: '+963' },
  { name: 'تركيا', code: '+90' },
  { name: 'الولايات المتحدة', code: '+1' },
  { name: 'بريطانيا', code: '+44' },
];

export const faqs: [string, string][] = [
  ['كيف أنضم إلى الوكالة؟', 'سجّل بياناتك من صفحة التسجيل، وسيتواصل معك فريق خدمة العملاء للتأكيد.'],
  ['ما الفرق بين المضيف والداعم والمساهم؟', 'المضيف يقدم المحتوى ويبني جمهوره داخل الغرف الصوتية، والداعم يساند الغرف ويشارك في نشاطها، والمساهم هو الشخص الذي يشارك في جميع الأنشطة والفعاليات.'],
  ['ما الذي أحتاجه للتسجيل؟', 'اسمك الثلاثي ورقم هاتفك والدولة والوكالة، وسيضع فريقنا رقم حسابك في التطبيق أثناء التأكيد.'],
  ['كيف أصبح وسيطاً؟', 'تسجّل معنا كمضيف أو داعم، ثم تقدّم طلباً للإدارة لترقية حسابك إلى وسيط، وبعد الموافقة تنشئ كلمة مرورك وتختار نسبة العمولة المناسبة لك.'],
  ['متى هو موعد تلقي الراتب؟', 'تتم احتساب التارجت كل 15 يوماً: تبدأ الفترة الأولى من يوم 1 في الشهر وتنتهي يوم 15، وتبدأ الفترة التالية من يوم 16 حتى نهاية الشهر.'],
  ['كم يستغرق سحب الأرباح؟', 'تتم معالجة طلب السحب خلال 3 إلى 5 أيام عمل.'],
  ['كيف أتواصل مع خدمة العملاء؟', 'يمكنك إرسال شكواك عبر تيليجرام أو واتساب، وسيتم تحويلك مباشرة إلى الإدارة.'],
  ['هل بياناتي الشخصية آمنة؟', 'نعم، لا تتم مشاركة أي معلومات شخصية مع أي طرف خارجي، وتُستخدم فقط للتواصل التجاري.'],
  ['ما هي مزايا الحسابات VIP والاحترافي والعادي؟', 'كلما ارتقى حسابك زادت المزايا — المضيفون والداعمون والوسطاء المتميزون يتمتعون بمزايا أعلى.'],
];

export const services = [
  { number: '01', title: 'من نحن؟', detail: 'نحن أول شركة في الشرق الأوسط في هذا المجال، وندير أكبر شبكة وكالات تضم وكالات لايف ووكالات صوتية.' },
  { number: '02', title: 'تطوير المضيفين', detail: 'نرافق المضيفين من أول يوم بتدريب مستمر وخطط نمو واضحة ومتابعة يومية لتحسين الأداء.' },
  { number: '03', title: 'شبكة الداعمين', detail: 'مجتمع من الداعمين النشطين يمنح الغرف الصوتية حيوية وتفاعلاً مستمراً.' },
  { number: '04', title: 'برنامج الوسطاء', detail: 'فرص ربح واضحة للوسطاء مع نسب عمولة مرنة وتقارير شفافة لكل تارجت.' },
  { number: '05', title: 'الدعم والأمان', detail: 'فريق خدمة عملاء متاح لمتابعة طلباتك وشكاواك بسرعة وسرية تامة.' },
  { number: '06', title: 'مساحة للتطور', detail: 'مسار واضح يربط بين الحضور، الإنجاز، الترقية، والمكافآت داخل مجتمعنا.' },
];

export const defaultRates: Rate[] = [
  { id: 'rate-1', target_amount: 50000, salary_amount: 250, label: 'البداية' },
  { id: 'rate-2', target_amount: 150000, salary_amount: 750, label: 'المستوى البرونزي' },
  { id: 'rate-3', target_amount: 300000, salary_amount: 1500, label: 'المستوى الفضي' },
  { id: 'rate-4', target_amount: 600000, salary_amount: 3000, label: 'المستوى الذهبي' },
];

export const defaultAgencies: Agency[] = [
  { id: 'a1', name: 'Shadow Voice', logo_url: '', app_account_code: 'SH-1024', member_count: 328 },
  { id: 'a2', name: 'Luna Live', logo_url: '', app_account_code: 'LN-2208', member_count: 241 },
  { id: 'a3', name: 'NOVA Community', logo_url: '', app_account_code: 'NV-8819', member_count: 196 },
];

export const defaultMembers: FeaturedMember[] = [
  { id: 'm1', name: 'سارة محمد', role: 'host', image_url: null },
  { id: 'm2', name: 'عمر خالد', role: 'supporter', image_url: null },
  { id: 'm3', name: 'ليان أحمد', role: 'contributor', image_url: null },
];

export const defaultTestimonials: Testimonial[] = [
  { id: 't1', author_name: 'نور الهدى', role: 'مضيفة', message: 'من أول أسبوع حسّيت إن في فريق حقيقي واقف معي. التدريب والمتابعة فرقوا معي كثير.' },
  { id: 't2', author_name: 'محمد علي', role: 'وسيط', message: 'التقارير واضحة والعمولات منظمة، والأهم أن التواصل مع الإدارة سريع ومحترم.' },
  { id: 't3', author_name: 'ريم', role: 'داعمة', message: 'المجتمع هنا مختلف، فيه طاقة جميلة ومساحة للجميع حتى يشارك ويكبر.' },
];

export const defaultMediators: Mediator[] = [
  { id: 'med-1', name: 'محمد عبدالله', code: 'SH-MD-2048', agency_id: 'a1', commission: '50%', is_active: true, password: null },
  { id: 'med-2', name: 'سلمى أحمد', code: 'SH-SA-1180', agency_id: 'a2', commission: '25%', is_active: true, password: null },
];

export const defaultRegistrations: Registration[] = [
  { id: 'reg-demo-1', full_name: 'أحمد سامي', role: 'host', country: 'مصر', gender: 'male', phone_code: '+20', phone_number: '01012345678', agency_id: 'a1', status: 'active', app_id: 'APP-001', account_type: 'normal', is_banned: false, created_at: '2026-11-15T10:00:00Z', mediator_id: 'med-1', activation_date: '2026-11-15T10:00:00Z', expiry_date: '2026-12-15T10:00:00Z', achieved_target: 150000 },
  { id: 'reg-demo-2', full_name: 'ليان خالد', role: 'supporter', country: 'السعودية', gender: 'female', phone_code: '+966', phone_number: '0501234567', agency_id: 'a1', status: 'active', app_id: 'APP-002', account_type: 'pro', is_banned: false, created_at: '2026-11-16T10:00:00Z', mediator_id: 'med-1', activation_date: '2026-11-16T10:00:00Z', expiry_date: '2026-12-16T10:00:00Z', achieved_target: 50000 },
  { id: 'reg-demo-3', full_name: 'خالد نور', role: 'contributor', country: 'الكويت', gender: 'male', phone_code: '+965', phone_number: '99887766', agency_id: 'a2', status: 'pending', app_id: null, account_type: 'normal', is_banned: false, created_at: '2026-11-20T08:00:00Z', mediator_id: null, activation_date: null, expiry_date: null, achieved_target: 0 },
];
