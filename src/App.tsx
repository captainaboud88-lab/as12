import { useEffect, useState, createContext, useContext, type FormEvent } from 'react';
import { type Lang, t } from './i18n';
import {
  ArrowLeft, ArrowRight, BarChart3, Check, ChevronDown, Facebook,
  FileCheck2, Headphones, Instagram, LockKeyhole, MessageCircle, Play, Send,
  ShieldCheck, Sparkles, Star, Target, Trophy, Users, WalletCards, X, Youtube, Zap,
  Mic2, Menu,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AdminPage from '@/components/AdminPage';
import {
  countries, faqs, services, defaultRates, defaultAgencies, defaultMembers,
  defaultTestimonials, defaultMediators, defaultRegistrations, defaultSiteSettings,
} from '@/constants';
import type {
  Agency, FeaturedMember, Mediator, Rate, Registration, SocialLink,
  Testimonial, VideoLink, AgencyStaff, View,
} from '@/types';

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'ar', setLang: () => {} });
function useLang() { return useContext(LangCtx); }

type RegisterRole = 'host' | 'supporter' | 'contributor';
type IconComponent = typeof Users;

const navItems: { id: View; label: string }[] = [
  { id: 'home', label: 'الرئيسية' },
  { id: 'target', label: 'احسب تارجتك' },
  { id: 'mediator', label: 'دخول الوسيط' },
];

function getHashView(): View {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
  if (hash === 'admin' || path.endsWith('/admin') || path === '/admin') return 'admin';
  return 'home';
}

function App() {
  const [view, setView] = useState<View>(getHashView());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState<Lang>('ar');
  const [loading, setLoading] = useState(true);
  const [agencies, setAgencies] = useState<Agency[]>(defaultAgencies);
  const [members, setMembers] = useState<FeaturedMember[]>(defaultMembers);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [rates, setRates] = useState<Rate[]>(defaultRates);
  const [mediators, setMediators] = useState<Mediator[]>(defaultMediators);
  const [agencyStaff, setAgencyStaff] = useState<AgencyStaff[]>([]);
  const [videoLinks, setVideoLinks] = useState<VideoLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>(defaultRegistrations);
  const [siteSettings, setSiteSettings] = useState(defaultSiteSettings);

  useEffect(() => {
    let active = true;
    async function loadPublicContent() {
      if (!supabase) return;
      const [agencyResult, memberResult, testimonialResult, ratesResult, medResult, videoResult, socialResult, regResult, staffResult, settingsResult] = await Promise.all([
        supabase.from('agencies').select('id,name,logo_url,app_account_code,member_count,is_active').order('created_at', { ascending: true }),
        supabase.from('featured_members').select('id,name,role,image_url,is_published').eq('is_published', true),
        supabase.from('testimonials').select('id,author_name,message,role,is_published').eq('is_published', true),
        supabase.from('target_rates').select('id,target_amount,salary_amount,label,is_active,sort_order').eq('is_active', true).order('sort_order'),
        supabase.from('mediators').select('id,name,code,agency_id,commission,is_active,password'),
        supabase.from('video_links').select('id,title,url,is_published,sort_order').eq('is_published', true).order('sort_order'),
        supabase.from('social_links').select('id,platform,url,label,sort_order').eq('is_active', true).order('sort_order'),
        supabase.from('registrations').select('id,full_name,role,country,gender,phone_code,phone_number,agency_id,status,app_id,account_type,is_banned,created_at,mediator_id,activation_date,expiry_date,achieved_target').order('created_at', { ascending: false }),
        supabase.from('agency_staff').select('id,agency_id,name,role,phone'),
        supabase.from('site_settings').select('key,value'),
      ]);
      if (!active) return;
      const aData = agencyResult.data as (Agency & { is_active: boolean })[] | null;
      if (aData?.length) setAgencies(aData.filter(a => a.is_active).map((a) => { const { is_active, ...rest } = a; void is_active; return rest; }));
      if (memberResult.data?.length) setMembers(memberResult.data as FeaturedMember[]);
      if (testimonialResult.data?.length) setTestimonials(testimonialResult.data as Testimonial[]);
      if (ratesResult.data?.length) setRates(ratesResult.data as Rate[]);
      if (medResult.data?.length) setMediators(medResult.data as Mediator[]);
      if (videoResult.data?.length) setVideoLinks(videoResult.data as VideoLink[]);
      if (socialResult.data?.length) setSocialLinks(socialResult.data as SocialLink[]);
      if (regResult.data?.length) setRegistrations(regResult.data as Registration[]);
      if (staffResult.data?.length) setAgencyStaff(staffResult.data as AgencyStaff[]);
      if (settingsResult.data?.length) {
        const map: Record<string, string> = {};
        for (const row of settingsResult.data as { key: string; value: string }[]) map[row.key] = row.value;
        setSiteSettings({
          admin_username: map.admin_username ?? defaultSiteSettings.admin_username,
          admin_password: map.admin_password ?? defaultSiteSettings.admin_password,
          support_whatsapp: map.support_whatsapp ?? '',
          support_telegram: map.support_telegram ?? '',
        });
      }
    }
    void loadPublicContent().finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const sync = () => {
      const target = getHashView();
      setView(target);
      setMobileOpen(false);
    };
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => { window.removeEventListener('hashchange', sync); window.removeEventListener('popstate', sync); };
  }, []);

  const go = (next: View) => {
    if (next === 'admin') {
      window.location.hash = 'admin';
    } else {
      if (window.location.hash) window.history.replaceState(null, '', window.location.pathname);
      setView(next);
    }
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (view === 'error') return <LangCtx.Provider value={{ lang, setLang }}><ErrorPage onNavigate={() => go('home')} /></LangCtx.Provider>;

  return (
    <LangCtx.Provider value={{ lang, setLang }}>
    <div className="page-shell" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Header view={view} onNavigate={go} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      {view === 'home' && <HomePage onNavigate={go} agencies={agencies} members={members} testimonials={testimonials} videoLinks={videoLinks} socialLinks={socialLinks} supportWhatsapp={siteSettings.support_whatsapp} supportTelegram={siteSettings.support_telegram} />}
      {view === 'register' && <RegisterPage agencies={agencies} mediators={mediators} onNavigate={go} onSubmitted={(registration) => setRegistrations((current) => [registration, ...current])} />}
      {view === 'target' && <TargetPage rates={rates} onNavigate={go} />}
      {view === 'mediator' && <MediatorPage onNavigate={go} mediators={mediators} agencies={agencies} registrations={registrations} />}
      {view === 'admin' && (
        <AdminPage
          isAdmin={isAdmin} setIsAdmin={setIsAdmin}
          agencies={agencies} setAgencies={setAgencies}
          members={members} setMembers={setMembers}
          testimonials={testimonials} setTestimonials={setTestimonials}
          registrations={registrations} setRegistrations={setRegistrations}
          videoLinks={videoLinks} setVideoLinks={setVideoLinks}
          socialLinks={socialLinks} setSocialLinks={setSocialLinks}
          mediators={mediators} setMediators={setMediators}
          agencyStaff={agencyStaff} setAgencyStaff={setAgencyStaff}
          rates={rates} setRates={setRates}
          siteSettings={siteSettings} setSiteSettings={setSiteSettings}
        />
      )}
      <Footer onNavigate={go} socialLinks={socialLinks} />
    </div>
    {loading && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090b0f]" style={{ animation: 'fadeOut 0.4s 0.8s forwards', opacity: 1 }}>
        <div className="flex flex-col items-center gap-4">
          <img src="/0a3e789f-716c-4251-9569-7f98ecab5ee9.jpg" alt="SAC" className="h-16 w-16 rounded-2xl border border-[#8b6a4f] object-cover shadow-2xl" style={{ animation: 'pulse 1s infinite' }} />
          <div className="h-1 w-32 overflow-hidden rounded-full bg-[#2a2d33]"><div className="h-full w-1/2 rounded-full bg-[#f0a267]" style={{ animation: 'shimmer 1s infinite' }} /></div>
        </div>
      </div>
    )}
    </LangCtx.Provider>
  );
}

function Header({ view, onNavigate, mobileOpen, setMobileOpen }: { view: View; onNavigate: (view: View) => void; mobileOpen: boolean; setMobileOpen: (open: boolean) => void }) {
  const { lang, setLang } = useLang();
  const navLabels: Record<string, string> = { home: t(lang, 'nav_home'), target: t(lang, 'nav_target'), mediator: t(lang, 'nav_mediator') };
  return (
    <header className="relative z-30 border-b border-white/[.07] bg-[#090b0f]/90 backdrop-blur-xl">
      <div className="container-wide flex h-[74px] items-center justify-between gap-4">
        <button className="flex items-center gap-3" onClick={() => onNavigate('home')} aria-label="Shadow Agencies Community">
          <div className="h-11 w-11 overflow-hidden rounded-xl border border-[#8b6a4f] bg-[#17191e] shadow-[0_0_20px_rgba(238,154,89,.1)]"><img src="/0a3e789f-716c-4251-9569-7f98ecab5ee9.jpg" alt="SAC Logo" className="h-full w-full object-cover" /></div>
          <div className="hidden sm:block"><div className="text-[12px] font-black tracking-[.2em] text-[#f0ede8]">SHADOW</div><div className="text-[9px] font-bold tracking-[.24em] text-[#b0764f]">AGENCIES COMMUNITY</div></div>
        </button>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => <button key={item.id} onClick={() => onNavigate(item.id)} className={`text-sm font-bold transition-colors ${view === item.id ? 'text-[#f5a468]' : 'text-[#a5a4a4] hover:text-[#f0ede8]'}`}>{navLabels[item.id] ?? item.label}</button>)}
          <button onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-bold text-[#a5a4a4] hover:text-[#f0ede8]">{t(lang, 'nav_faq')}</button>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="rounded-lg border border-white/10 bg-white/[.03] px-3 py-1.5 text-xs font-bold text-[#c0bbb6] transition hover:border-[#f0a267]/40 hover:text-[#f0a267]">{lang === 'ar' ? 'EN' : 'عر'}</button>
          <button onClick={() => onNavigate('register')} className="button-primary !rounded-full !px-5 !py-2 text-sm">{t(lang, 'btn_start')} <ArrowLeft size={15} /></button>
          <button onClick={() => onNavigate('mediator')} className="button-outline !px-3 !py-2 text-sm">{t(lang, 'btn_mediator_login')}</button>
        </div>
        <button className="rounded-lg border border-white/10 p-2 text-[#f2a26a] md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">{mobileOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
      {mobileOpen && <div className="border-t border-white/[.07] bg-[#0d1015] p-4 md:hidden"><div className="flex flex-col gap-2">{navItems.map((item) => <button key={item.id} onClick={() => onNavigate(item.id)} className="rounded-lg px-4 py-3 text-right font-bold text-[#c6c3be] hover:bg-white/5">{navLabels[item.id] ?? item.label}</button>)}<button onClick={() => onNavigate('register')} className="button-primary mt-2">{t(lang, 'btn_start')} <ArrowLeft size={16} /></button><button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="mt-2 rounded-lg border border-white/10 py-2 text-sm font-bold text-[#c0bbb6]">{lang === 'ar' ? 'English' : 'العربية'}</button></div></div>}
    </header>
  );
}

function HomePage({ onNavigate, agencies, members, testimonials, videoLinks, supportWhatsapp, supportTelegram }: {
  onNavigate: (view: View) => void; agencies: Agency[]; members: FeaturedMember[]; testimonials: Testimonial[];
  videoLinks: VideoLink[]; supportWhatsapp: string; supportTelegram: string;
}) {
  const { lang } = useLang();
  const servicesWithIcons = services.map((s) => ({ ...s, icon: iconForService(s.number) }));
  return <main>
    <section className="noise relative overflow-hidden border-b border-white/[.05] bg-[#0b0e13]" style={{ backgroundImage: 'url(/pexels-photo-23384400.avif)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'overlay' }}>
      <div className="glow-a -left-40 top-24" /><div className="glow-b right-[35%] top-[-150px]" /><div className="grid-overlay absolute inset-0 opacity-60" />
      <div className="container-wide relative grid min-h-[665px] items-center gap-14 py-20 lg:grid-cols-[1fr_390px] lg:gap-16 lg:py-24">
        <div className="reveal max-w-[690px] text-right">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#8e6546] bg-[#1b1716]/80 px-4 py-2 text-xs font-bold text-[#f6b078]"><Sparkles size={14} /> {t(lang, 'hero_badge')} <span className="h-2 w-2 rounded-full bg-[#69d3bc] shadow-[0_0_10px_#69d3bc]" /></div>
          <h1 className="m-0 text-[clamp(48px,8vw,100px)] font-black leading-[.95] tracking-[-.07em]"><span className="block text-[#ffd08e]">SHADOW</span><span className="block text-[#f1f0ee]">AGENCIES</span><span className="block text-[#df704b]">COMMUNITY</span></h1>
          <p className="mt-8 max-w-[610px] text-lg leading-[2] text-[#a8a8ab]">{t(lang, 'hero_sub')} <span className="text-[#d7d1c8]">{t(lang, 'hero_sub2')}</span></p>
          <div className="hero-actions mt-8 flex gap-3">
            <button onClick={() => onNavigate('register')} className="button-primary">{t(lang, 'hero_cta')} <MessageCircle size={17} /></button>
            <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="button-outline">{t(lang, 'hero_explore')} <ArrowLeft size={17} /></button>
          </div>
          {(supportWhatsapp || supportTelegram) && (
            <div className="mt-6 flex gap-3">
              {supportWhatsapp && <a href={supportWhatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-sm font-bold text-green-300 transition hover:bg-green-500/20"><MessageCircle size={16} /> {t(lang, 'hero_whatsapp')}</a>}
              {supportTelegram && <a href={supportTelegram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-sm font-bold text-blue-300 transition hover:bg-blue-500/20"><Send size={16} /> {t(lang, 'hero_telegram')}</a>}
            </div>
          )}
          <div className="mt-12 grid max-w-[620px] grid-cols-3 border-t border-white/10 pt-7"><Stat value={t(lang,'stat1_v')} label={t(lang,'stat1_l')} /><Stat value={t(lang,'stat2_v')} label={t(lang,'stat2_l')} /><Stat value={t(lang,'stat3_v')} label={t(lang,'stat3_l')} /></div>
        </div>
        <div className="relative hidden lg:block">
          <div className="absolute -inset-12 rounded-full bg-[#a85435]/10 blur-3xl" />
          <div className="relative rounded-[28px] border border-[#30343e] bg-[#12151b] p-3 shadow-[0_28px_80px_rgba(0,0,0,.38)]">
            <div className="relative flex h-[430px] flex-col justify-between overflow-hidden rounded-[20px] bg-[radial-gradient(circle_at_30%_25%,rgba(184,112,70,.3),transparent_32%),linear-gradient(145deg,#27211e,#0d1117_68%)] p-6">
              <div className="absolute -left-14 top-12 h-72 w-72 rounded-full border-[28px] border-[#bb865c]/35 blur-[1px]" /><div className="absolute left-7 top-20 h-72 w-12 rotate-[28deg] rounded-full bg-gradient-to-r from-[#1c1e24] via-[#8c6349] to-[#1b1c20] opacity-80 shadow-[0_0_28px_rgba(234,155,97,.3)]" />
              <div className="relative flex items-center justify-between"><span className="text-[10px] font-bold tracking-[.24em] text-[#f2ad77]">SHADOW / 01</span><span className="flex items-center gap-2 text-xs text-[#b5b8bd]"><span className="h-2 w-2 rounded-full bg-[#60c8ad]" /> {t(lang,'hero_live')}</span></div>
              <div className="relative flex items-end justify-between"><div><p className="mb-1 text-xs font-bold text-[#e98b58]">{t(lang,'hero_card_badge')}</p><h3 className="m-0 text-2xl font-black text-white">{t(lang,'hero_card_title')}</h3></div><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f4a267] text-[#171311]"><Play size={19} fill="currentColor" /></div></div>
            </div>
          </div>
          <div className="float-slow absolute -bottom-8 -right-8 rounded-2xl border border-white/10 bg-[#171a20]/90 px-5 py-4 shadow-2xl"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e27751]/15 text-[#f2a36b]"><Headphones size={19} /></div><div><p className="m-0 text-[10px] text-[#8d929b]">{t(lang,'hero_growth_label')}</p><p className="m-0 text-sm font-bold">{t(lang,'hero_growth_value')}</p></div></div></div>
        </div>
      </div>
    </section>
    <section id="services" className="section-space bg-[#0d1015]"><div className="container-wide"><div className="text-center"><div className="section-eyebrow">{t(lang,'why_eyebrow')}</div><h2 className="section-title">{t(lang,'why_title')}</h2><p className="section-copy">{t(lang,'why_copy')}</p></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{servicesWithIcons.map((service) => <ServiceCard key={service.number} icon={service.icon} number={service.number} title={service.title} detail={service.detail} />)}</div></div></section>
    <StatsStrip />
    <section className="section-space bg-[#0d1015]"><div className="container-wide"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><div className="section-eyebrow">{t(lang,'stars_eyebrow')}</div><h2 className="section-title !text-4xl">{t(lang,'stars_title')}</h2></div><p className="max-w-sm text-sm leading-7 text-[#90949b]">{t(lang,'stars_copy')}</p></div>{members.length > 0 ? <div className="mt-10 grid gap-3 sm:grid-cols-4 lg:grid-cols-6">{members.map((member) => <MemberCard key={member.id} member={member} />)}</div> : <p className="mt-10 text-center text-sm text-[#858b92]">{t(lang,'stars_empty')}</p>}</div></section>
    <section className="section-space border-y border-white/[.05] bg-[#0a0d12]"><div className="container-wide"><div className="text-center"><div className="section-eyebrow">{t(lang,'agencies_eyebrow')}</div><h2 className="section-title !text-4xl">{t(lang,'agencies_title')}</h2></div><div className="mt-10 grid gap-4 sm:grid-cols-3">{agencies.map((agency) => <AgencyCard key={agency.id} agency={agency} />)}</div></div></section>
    {videoLinks.length > 0 && (
      <section className="section-space bg-[#0d1015]"><div className="container-wide"><div className="text-center"><div className="section-eyebrow">{t(lang,'videos_eyebrow')}</div><h2 className="section-title !text-4xl">{t(lang,'videos_title')}</h2></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{videoLinks.map((v) => <VideoCard key={v.id} video={v} />)}</div></div></section>
    )}
    <section className=”section-space bg-[#0d1015]”><div className=”container-wide”><div className=”grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center”><div><div className=”section-eyebrow”>{t(lang,'testimonials_eyebrow')}</div><h2 className=”section-title !text-4xl”>{t(lang,'testimonials_title')}</h2><p className=”mt-5 leading-8 text-[#969ba2]”>{t(lang,'testimonials_copy')}</p></div>{testimonials.length > 0 ? <div className=”grid gap-4 sm:grid-cols-3”>{testimonials.map((item) => <div key={item.id} className=”glass rounded-2xl p-5”><div className=”mb-5 flex items-center gap-1 text-[#f4a56c]”>{[1,2,3,4,5].map((star) => <Star key={star} size={13} fill=”currentColor” />)}</div><p className=”min-h-[108px] text-sm leading-7 text-[#c7c6c3]”>”{item.message}”</p><div className=”mt-5 border-t border-white/10 pt-4”><p className=”m-0 text-sm font-bold text-[#f3f0eb]”>{item.author_name}</p><p className=”m-0 text-xs text-[#8c9198]”>{item.role ?? t(lang,'testimonial_role_default')}</p></div></div>)}</div> : <p className=”text-sm text-[#858b92]”>{t(lang,'testimonials_empty')}</p>}</div></div></section>
    <FAQ />
    <section className="relative overflow-hidden bg-[#17120f] py-20"><div className="glow-b -left-20 top-0" /><div className="container-wide relative flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-right"><div><div className="section-eyebrow">{t(lang,'cta_eyebrow')}</div><h2 className="mt-3 text-3xl font-black text-[#fff4e8] md:text-4xl">{t(lang,'cta_title')}</h2><p className="mt-3 text-[#b6a89e]">{t(lang,'cta_sub')}</p></div><button onClick={() => onNavigate('register')} className="button-primary !px-8">{t(lang,'cta_btn')} <ArrowLeft size={18} /></button></div></section>
  </main>;
}

function iconForService(number: string): IconComponent {
  const map: Record<string, IconComponent> = { '01': Sparkles, '02': Zap, '03': Users, '04': WalletCards, '05': ShieldCheck, '06': Trophy };
  return map[number] ?? Sparkles;
}

function Stat({ value, label }: { value: string; label: string }) { return <div className="text-center"><div className="text-3xl font-black text-[#f4a56b]">{value}</div><div className="mt-1 text-xs text-[#8b8d92]">{label}</div></div>; }
function ServiceCard({ icon: Icon, title, detail, number }: { icon: IconComponent; title: string; detail: string; number: string }) { return <div className="flip-card" tabIndex={0}><div className="flip-card-inner"><div className="flip-face"><div className="flex items-start justify-between"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f2a167]/10 text-[#f2a167]"><Icon size={22} /></div><span className="font-mono text-sm text-[#5e626a]">{number}</span></div><div><h3 className="m-0 text-xl font-extrabold text-[#f1efeb]">{title}</h3><p className="mt-2 text-xs text-[#7f858d]">مرّر لمعرفة المزيد</p></div></div><div className="flip-face flip-back"><span className="text-sm font-black text-[#f4ad73]">{number} / Shadow approach</span><p className="my-auto text-base leading-8 text-[#f1e4d8]">{detail}</p><span className="text-xs text-[#ae9280]">نصنع المساحة. ونرافقك في الطريق.</span></div></div></div>; }
function StatsStrip() { const { lang } = useLang(); return <section className="border-y border-white/[.06] bg-[#11141a] py-9"><div className="container-wide grid grid-cols-2 gap-8 md:grid-cols-4"><Stat value="+12" label={t(lang,'stats_agencies')} /><Stat value="+18K" label={t(lang,'stats_members')} /><Stat value="24/7" label={t(lang,'stats_support')} /><Stat value="98%" label={t(lang,'stats_satisfaction')} /></div></section>; }
function MemberCard({ member }: { member: FeaturedMember }) {
  const { lang } = useLang();
  const roleKey = member.role === 'host' ? 'role_host' : member.role === 'supporter' ? 'role_supporter' : 'role_contributor';
  const roleLabel = t(lang, roleKey);
  const roleColors: Record<string, string> = { host: 'bg-[#f4a56b]/10 text-[#f4a56b] border-[#f4a56b]/20', supporter: 'bg-blue-500/10 text-blue-300 border-blue-500/20', contributor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' };
  return <div className="group flex flex-col items-center gap-3 rounded-2xl border border-white/[.07] bg-[#13161b] p-4 text-center transition hover:-translate-y-1 hover:border-[#9f6a49] hover:bg-[#17191f]">
    <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#8b6a4f]/40 bg-[radial-gradient(circle_at_40%_30%,#6c4939,#1e2128)] shadow-lg transition group-hover:scale-105">
      <span className="text-lg font-black text-[#f4a56b]">{member.name.slice(0,1)}</span>
      <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#60c8ad] shadow">
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
      </span>
    </div>
    <div>
      <h3 className="m-0 text-sm font-bold text-[#f1efec]">{member.name}</h3>
      <span className={`mt-1.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${roleColors[member.role]}`}>{roleLabel}</span>
    </div>
  </div>;
}
function AgencyCard({ agency }: { agency: Agency }) { const { lang } = useLang(); return <div className="group flex items-center gap-4 rounded-2xl border border-white/[.08] bg-[#14171c] p-5 transition hover:border-[#9f6a49] hover:bg-[#191b20] hover:shadow-[0_4px_24px_rgba(238,163,109,.08)]"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[#8e674d] bg-gradient-to-br from-[#3a2419] to-[#1e1a14] text-lg font-black text-[#eea36d] shadow-inner">{agency.name.slice(0, 1)}</div><div className="min-w-0 flex-1"><h3 className="m-0 truncate font-bold text-[#efeeec]">{agency.name}</h3><p className="m-0 mt-1 text-xs text-[#858a91]">{agency.member_count} {t(lang,'agency_members')}</p></div><span className="shrink-0 rounded-lg border border-white/[.06] bg-white/[.03] px-2 py-1 text-[10px] font-mono text-[#6c727b]">{agency.app_account_code}</span></div>; }
function VideoCard({ video }: { video: VideoLink }) {
  const isYoutube = video.url.includes('youtube.com') || video.url.includes('youtu.be');
  const embedUrl = isYoutube
    ? video.url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')
    : video.url;
  return <div className="overflow-hidden rounded-2xl border border-white/[.08] bg-[#14171c]"><div className="aspect-video w-full">{isYoutube ? <iframe src={embedUrl} title={video.title} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <a href={video.url} target="_blank" rel="noopener noreferrer" className="flex h-full w-full items-center justify-center gap-2 text-sm font-bold text-[#f4a56b] hover:text-[#f6b078]"><Play size={20} /> {video.title}</a>}</div><div className="p-4"><h3 className="m-0 text-sm font-bold text-[#efeeec]">{video.title}</h3></div></div>;
}

function FAQ() { const { lang } = useLang(); const [open, setOpen] = useState(0); return <section id="faq" className="section-space bg-[#0a0d12]"><div className="container-wide max-w-4xl"><div className="text-center"><div className="section-eyebrow">{t(lang,'faq_eyebrow')}</div><h2 className="section-title !text-4xl">{t(lang,'faq_title')}</h2></div><div className="mt-10 divide-y divide-white/[.08] rounded-2xl border border-white/[.08] bg-[#101319] px-5">{faqs.map(([question, answer], index) => <div key={question}><button className="flex w-full items-center justify-between gap-5 py-5 text-right" onClick={() => setOpen(open === index ? -1 : index)}><span className={`font-bold ${open === index ? 'text-[#f4a56d]' : 'text-[#dfdedb]'}`}>{question}</span><ChevronDown size={18} className={`shrink-0 text-[#f0a269] transition-transform ${open === index ? 'rotate-180' : ''}`} /></button>{open === index && <p className="max-w-3xl pb-5 pl-8 text-sm leading-8 text-[#969ba2]">{answer}</p>}</div>)}</div></div></section>; }

function RegisterPage({ agencies, mediators, onNavigate, onSubmitted }: { agencies: Agency[]; mediators: Mediator[]; onNavigate: (view: View) => void; onSubmitted: (registration: Registration) => void }) {
  const [role, setRole] = useState<RegisterRole>('host');
  const [country, setCountry] = useState(countries[0]);
  const [form, setForm] = useState({ fullName: '', gender: 'male', phone: '', talent: '', source: 'facebook', referral: '', agency: agencies[0]?.id ?? '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const showReferral = role === 'host' && form.source === 'friend';
  const update = (key: string, value: string) => { setForm((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: '' })); };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (form.fullName.trim().length < 3) e.fullName = 'الاسم يجب أن يكون ثلاثياً على الأقل';
    if (!form.phone.trim() || form.phone.trim().length < 5) e.phone = 'رقم الهاتف غير صحيح';
    if (role === 'host' && !form.talent.trim()) e.talent = 'اكتب موهبتك';
    if (showReferral && !form.referral.trim()) e.referral = 'كود الصديق/الوسيط مطلوب عند اختيار "عن طريق صديق"';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    const referralCode = showReferral ? form.referral.trim() : null;
    const linkedMediator = referralCode ? mediators.find(m => m.code.toLowerCase() === referralCode.toLowerCase()) ?? null : null;
    if (supabase) {
      const { error } = await supabase.from('registrations').insert({ full_name: form.fullName.trim(), gender: form.gender, country: country.name, phone_code: country.code, phone_number: form.phone.trim(), role, talent: role === 'host' ? form.talent.trim() : null, discovery_source: form.source, referral_code: referralCode, agency_id: form.agency || null, mediator_id: linkedMediator?.id ?? null });
      if (error) { console.error('registration submission failed', error); setStatus('error'); return; }
    }
    onSubmitted({ id: `registration-${Date.now()}`, full_name: form.fullName.trim(), role, country: country.name, gender: form.gender, phone_code: country.code, phone_number: form.phone.trim(), agency_id: form.agency || null, status: 'pending', app_id: null, account_type: 'normal', is_banned: false, created_at: new Date().toISOString(), mediator_id: linkedMediator?.id ?? null, activation_date: null, expiry_date: null, achieved_target: 0 });
    setStatus('success');
  };
  if (status === 'success') return <main className="min-h-[700px] bg-[#0b0e13] py-24"><div className="container-wide flex max-w-xl flex-col items-center text-center"><div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#67c7aa]/30 bg-[#67c7aa]/10 text-[#67c7aa]"><Check size={36} /></div><div className="section-eyebrow mt-7">تم استلام طلبك</div><h1 className="section-title mt-3 !text-4xl">أهلاً بك في مجتمع Shadow</h1><p className="mt-5 leading-8 text-[#a6a9ae]">وصلت بياناتك بنجاح. سيتواصل معك فريق خدمة العملاء قريباً لتأكيد الطلب والخطوة التالية.</p><button onClick={() => onNavigate('home')} className="button-primary mt-8">العودة للرئيسية <ArrowRight size={17} /></button></div></main>;
  return <main className="min-h-[700px] bg-[#0b0e13] py-16"><div className="container-wide"><div className="mx-auto max-w-3xl text-center"><div className="section-eyebrow">انضم إلى الشبكة</div><h1 className="section-title">ابدأ رحلتك معنا</h1><p className="section-copy">اختر المسار الأقرب لك، وأرسل بياناتك. فريقنا هنا ليأخذ بيدك من أول خطوة.</p></div><div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/[.09] bg-[#11141a] p-5 shadow-2xl md:p-9"><div className="grid grid-cols-3 gap-2 rounded-xl bg-[#0b0e13] p-1.5">{([['host', 'مضيف', Mic2], ['supporter', 'داعم', Headphones], ['contributor', 'مساهم', Users]] as const).map(([id, label, Icon]) => <button key={id} type="button" onClick={() => setRole(id)} className={`flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition ${role === id ? 'bg-[#ee9d62] text-[#1a1310] shadow-lg' : 'text-[#888d95] hover:text-white'}`}><Icon size={16} />{label}</button>)}</div><form onSubmit={submit} className="mt-8 grid gap-5 md:grid-cols-2" noValidate><div><label className="field-label">الاسم الثلاثي</label><input required value={form.fullName} onChange={(e) => update('fullName', e.target.value)} className={`input-field ${errors.fullName ? '!border-red-500' : ''}`} placeholder="اكتب اسمك الكامل" /><FormError msg={errors.fullName} /></div><div><label className="field-label">الجنس</label><select value={form.gender} onChange={(e) => update('gender', e.target.value)} className="input-field"><option value="male">ولد</option><option value="female">بنت</option></select></div><div><label className="field-label">الدولة</label><select value={country.name} onChange={(e) => setCountry(countries.find((item) => item.name === e.target.value) ?? countries[0])} className="input-field">{countries.map((item) => <option key={item.name}>{item.name}</option>)}</select></div><div><label className="field-label">رقم الهاتف</label><div className="flex gap-2"><input value={country.code} readOnly className="input-field w-24 text-center text-[#f2a36b]" /><input required value={form.phone} onChange={(e) => update('phone', e.target.value)} className={`input-field ${errors.phone ? '!border-red-500' : ''}`} dir="ltr" placeholder="01xxxxxxxxx" /></div><FormError msg={errors.phone} /></div>{role === 'host' && <div><label className="field-label">موهبتك</label><input required value={form.talent} onChange={(e) => update('talent', e.target.value)} className={`input-field ${errors.talent ? '!border-red-500' : ''}`} placeholder="غناء، حوار، ألعاب، ..." /><FormError msg={errors.talent} /></div>}{showReferral && <div><label className="field-label">كود الصديق / الوسيط <span className="text-red-400">*</span></label><input required value={form.referral} onChange={(e) => update('referral', e.target.value)} className={`input-field ${errors.referral ? '!border-red-500' : ''}`} placeholder="أدخل الكود" /><FormError msg={errors.referral} /></div>}<div><label className="field-label">كيف تعرفت علينا؟</label><select value={form.source} onChange={(e) => update('source', e.target.value)} className="input-field"><option value="facebook">فيسبوك</option><option value="youtube">يوتيوب</option><option value="tiktok">تيك توك</option><option value="friend">عن طريق صديق</option><option value="google">بحث Google</option></select></div><div><label className="field-label">الوكالة المفضلة</label><select value={form.agency} onChange={(e) => update('agency', e.target.value)} className="input-field"><option value="">اختر الوكالة</option>{agencies.map((agency) => <option key={agency.id} value={agency.id}>{agency.name}</option>)}</select></div><div className="md:col-span-2"><div className="flex items-start gap-3 rounded-xl border border-[#2b3139] bg-[#0d1015] p-4 text-xs leading-6 text-[#858a92]"><ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#eaa06b]" />بياناتك محمية وتستخدم فقط للتواصل التجاري وتأكيد طلب الانضمام. لن تتم مشاركة رقم هاتفك مع أي طرف خارجي.</div></div><div className="md:col-span-2">{status === 'error' && <p className="mb-3 text-sm text-[#ef8d80]">تعذر إرسال الطلب حالياً. حاول مرة أخرى بعد قليل.</p>}<button disabled={status === 'sending'} className="button-primary w-full disabled:cursor-wait disabled:opacity-60">{status === 'sending' ? 'جارٍ إرسال الطلب...' : 'إرسال طلب الانضمام'} <ArrowLeft size={17} /></button></div></form></div></div></main>;
}

function FormError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-xs text-red-400">{msg}</p>;
}

function TargetPage({ rates, onNavigate }: { rates: Rate[]; onNavigate: (view: View) => void }) {
  const [current, setCurrent] = useState('');
  const amount = Number(current) || 0;
  const sortedRates = [...rates].sort((a, b) => a.target_amount - b.target_amount);
  const currentRate = [...sortedRates].reverse().find((rate) => amount >= rate.target_amount) ?? null;
  const nextRate = sortedRates.find((rate) => amount < rate.target_amount) ?? null;
  const salary = currentRate?.salary_amount ?? 0;
  const remaining = nextRate ? Math.max(nextRate.target_amount - amount, 0) : 0;
  return <main className="min-h-[700px] bg-[#0b0e13] py-16"><div className="container-wide"><div className="mx-auto max-w-3xl text-center"><div className="section-eyebrow">أداة Shadow الذكية</div><h1 className="section-title">احسب تارجتك</h1><p className="section-copy">أدخل التارجت الحالي، وشاهد راتبك المتوقع والمسافة المتبقية إلى المستوى التالي.</p></div><div className="mx-auto mt-12 grid max-w-5xl gap-5 lg:grid-cols-[.78fr_1.22fr] lg:items-stretch"><div className="rounded-3xl border border-[#523a2a] bg-[linear-gradient(145deg,#281d18,#13161c)] p-7"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0a16a]/15 text-[#f0a16a]"><Target size={25} /></div><h2 className="mt-7 text-2xl font-black text-[#fff2e5]">التارجت الحالي</h2><p className="mt-2 text-sm leading-7 text-[#aaa09a]">كل هدف صغير يقربك من نتيجة أكبر.</p><label className="field-label mt-8">قيمة التارجت</label><div className="relative"><input type="number" min="0" value={current} onChange={(e) => setCurrent(e.target.value)} className="input-field pl-16 text-2xl font-black" dir="ltr" placeholder="0" /><span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-[#d48b5c]">نقطة</span></div><div className="mt-8 flex items-center gap-3 text-xs text-[#8e969e]"><div className="h-2 flex-1 overflow-hidden rounded-full bg-[#3b2c24]"><div className="h-full rounded-full bg-[#ec9d65] transition-all" style={{ width: `${nextRate ? Math.min((amount / nextRate.target_amount) * 100, 100) : amount ? 100 : 0}%` }} /></div><span>{nextRate ? `${Math.round(Math.min((amount / nextRate.target_amount) * 100, 100))}%` : 'مكتمل'}</span></div><div className="grid gap-4 sm:grid-cols-2">{sortedRates.map((rate) => <div key={rate.id} className={`rounded-xl border p-4 ${currentRate?.id === rate.id ? 'border-[#8a5b3d] bg-[#2a1c16]' : 'border-white/[.06] bg-[#15181e]'}`}><div className="flex items-center justify-between"><span className="text-xs font-bold text-[#f4a56b]">{rate.label}</span>{currentRate?.id === rate.id && <Check size={14} className="text-green-400" />}</div><p className="m-0 mt-2 text-lg font-black text-[#eeeae4]">{rate.target_amount.toLocaleString('en-US')}</p><p className="m-0 text-xs text-[#9b9da2]">راتب {rate.salary_amount.toLocaleString('en-US')} $</p></div>)}</div><div className="grid gap-4 sm:grid-cols-2"><ResultCard icon={WalletCards} label="الراتب المتوقع" value={`${salary.toLocaleString('en-US')} $`} accent /><ResultCard icon={Trophy} label="التارجت التالي" value={nextRate ? nextRate.target_amount.toLocaleString('en-US') : 'أعلى مستوى'} /><ResultCard icon={ArrowUpRightIcon} label="المبلغ المتبقي" value={nextRate ? remaining.toLocaleString('en-US') : '—'} /><ResultCard icon={FileCheck2} label="مستواك الحالي" value={currentRate?.label ?? 'لم يبدأ بعد'} /></div></div></div><div className="mx-auto mt-10 flex max-w-5xl flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#11141a] p-5 text-center sm:flex-row sm:text-right"><div><p className="m-0 font-bold text-[#eea069]">تحتاج مساعدة في اختيار المسار؟</p><p className="m-0 mt-1 text-sm text-[#858b92]">تواصل مع فريقنا، وسنشرح لك كل التفاصيل.</p></div><button onClick={() => onNavigate('register')} className="button-outline !px-5 !py-2.5">تواصل معنا <ArrowLeft size={16} /></button></div></div></main>;
}

function ArrowUpRightIcon({ size = 18 }: { size?: number }) { return <ArrowLeft size={size} className="rotate-45" />; }
function ResultCard({ icon: Icon, label, value, accent = false }: { icon: IconComponent | typeof ArrowUpRightIcon; label: string; value: string; accent?: boolean }) { return <div className={`rounded-2xl border p-5 ${accent ? 'border-[#8a5b3d] bg-[#2a1c16]' : 'border-white/[.08] bg-[#15181e]'}`}><div className="flex items-center gap-3 text-[#ef9e64]"><Icon size={18} /><span className="text-xs text-[#9b9da2]">{label}</span></div><p className={`m-0 mt-4 text-2xl font-black ${accent ? 'text-[#ffc38f]' : 'text-[#eeeae4]'}`}>{value}</p></div>; }

function MediatorPage({ onNavigate, mediators, agencies, registrations }: { onNavigate: (view: View) => void; mediators: Mediator[]; agencies: Agency[]; registrations: Registration[] }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [currentMediator, setCurrentMediator] = useState<Mediator | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const found = mediators.find(m => m.code.toLowerCase() === code.trim().toLowerCase());
    if (!found) { setError('كود النظام غير موجود'); return; }
    if (!found.password) { setError('لم يتم تعيين كلمة مرور لهذا الوسيط. تواصل مع الإدارة'); return; }
    if (found.password !== password) { setError('كلمة المرور غير صحيحة'); return; }
    setCurrentMediator(found);
    setLoggedIn(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loggedIn && currentMediator) return <MediatorDashboard mediator={currentMediator} agencies={agencies} registrations={registrations} onNavigate={onNavigate} onLogout={() => { setLoggedIn(false); setCurrentMediator(null); setCode(''); setPassword(''); }} />;
  return <main className="min-h-[700px] bg-[#0b0e13] py-20"><div className="container-wide grid max-w-5xl gap-10 lg:grid-cols-[1fr_.8fr] lg:items-center"><div><div className="section-eyebrow">مساحتك الإدارية</div><h1 className="section-title !text-5xl">دخول الوسيط</h1><p className="mt-5 max-w-lg leading-8 text-[#969ba2]">تابع مضيفيك، اعرف تقدمهم، وشاهد تفاصيل التارجت والعمولة في لوحة واحدة واضحة.</p><div className="mt-8 flex flex-wrap gap-3 text-xs text-[#858b92]"><span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[.03] px-4 py-2"><ShieldCheck size={14} className="text-[#68c6aa]" />دخول محمي</span><span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[.03] px-4 py-2"><BarChart3 size={14} className="text-[#ef9f67]" />تقارير واضحة</span></div></div><form onSubmit={submit} className="rounded-3xl border border-white/[.1] bg-[#12151b] p-7 shadow-2xl"><div className="mb-7 flex items-center justify-between"><div><h2 className="m-0 text-xl font-black">تسجيل دخول الوسيط</h2><p className="m-0 mt-1 text-xs text-[#858b92]">استخدم كود النظام وكلمة المرور</p></div><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0a068]/10 text-[#ef9e65]"><LockKeyhole size={21} /></div></div><label className="field-label">كود النظام</label><input required value={code} onChange={(e) => setCode(e.target.value)} className="input-field" dir="ltr" placeholder="SH-0000" /><label className="field-label mt-5">كلمة المرور</label><input required value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="input-field" dir="ltr" placeholder="••••••••" />{error && <p className="mt-4 text-sm text-[#ed9085]">{error}</p>}<button className="button-primary mt-7 w-full">دخول إلى اللوحة <ArrowLeft size={17} /></button><button type="button" onClick={() => onNavigate('register')} className="mt-5 w-full text-center text-xs text-[#a8a3a0] hover:text-[#eea36a]">لست وسيطاً بعد؟ ابدأ من هنا</button></form></div></main>;
}

function MediatorDashboard({ mediator, agencies, registrations, onLogout }: {
  mediator: Mediator; agencies: Agency[]; registrations: Registration[]; onLogout: () => void;
}) {
  const agency = agencies.find(a => a.id === mediator.agency_id);
  const [showChangePass, setShowChangePass] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState('');

  const myHosts = registrations.filter(r => r.mediator_id === mediator.id);

  const changePassword = async () => {
    if (newPass.trim().length < 4) { setPassMsg('كلمة المرور يجب أن تكون 4 أحرف على الأقل'); return; }
    if (supabase) {
      const { error } = await supabase.from('mediators').update({ password: newPass }).eq('id', mediator.id);
      if (error) { setPassMsg('تعذر تحديث كلمة المرور'); return; }
    }
    setPassMsg('تم تغيير كلمة المرور بنجاح');
    setNewPass('');
    setShowChangePass(false);
  };

  const commissionLabel = mediator.commission === '50%' ? '50% — تارجتين' : '25% — 4 تارجتات';
  const activeCount = myHosts.filter(h => h.status === 'active' && !h.is_banned).length;

  return <main className="min-h-[700px] bg-[#0b0e13] py-12"><div className="container-wide"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><div className="section-eyebrow">لوحة الوسيط</div><h1 className="section-title !text-4xl">أهلاً، {mediator.name}</h1><p className="mt-2 text-sm text-[#858b92]">الوكالة: {agency?.name ?? 'بدون وكالة'} · نسبة الربح: {commissionLabel}</p></div><div className="flex gap-2"><button onClick={() => setShowChangePass(!showChangePass)} className="button-outline !px-4 !py-2.5 text-xs">تغيير كلمة المرور</button><button onClick={onLogout} className="button-outline !px-4 !py-2.5">خروج <ArrowRight size={16} /></button></div></div>{showChangePass && <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-[#59412f] bg-[#1c1512] p-5 sm:flex-row sm:items-end"><div className="flex-1"><label className="field-label">كلمة المرور الجديدة</label><input value={newPass} onChange={(e) => setNewPass(e.target.value)} type="password" className="input-field" dir="ltr" placeholder="••••••••" /></div><button onClick={changePassword} className="button-primary">حفظ</button></div>}{passMsg && <p className={`mt-2 text-sm ${passMsg.includes('نجاح') ? 'text-green-400' : 'text-red-400'}`}>{passMsg}</p>}<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><DashboardStat icon={Users} label="المضيفون المدعوون" value={String(myHosts.length)} /><DashboardStat icon={Check} label="النشطون" value={String(activeCount)} /><DashboardStat icon={WalletCards} label="نسبة العمولة" value={mediator.commission} /><DashboardStat icon={Trophy} label="إجمالي التارجت" value={myHosts.reduce((sum, h) => sum + (h.achieved_target || 0), 0).toLocaleString('en-US')} /></div><div className="mt-8 rounded-2xl border border-white/[.08] bg-[#11141a] p-5"><div className="mb-5 flex items-center justify-between"><div><h2 className="m-0 text-lg font-black">المضيفون الذين دعوتهم</h2><p className="m-0 mt-1 text-xs text-[#81878f]">تابع حالة كل حساب وتقدمه</p></div></div><div className="overflow-x-auto"><table className="w-full min-w-[820px] text-right text-sm"><thead><tr className="border-b border-white/10 text-xs text-[#737981]"><th className="pb-3 font-medium">اسم المضيف</th><th className="pb-3 font-medium">كود التطبيق</th><th className="pb-3 font-medium">تاريخ التفعيل</th><th className="pb-3 font-medium">تاريخ الانتهاء</th><th className="pb-3 font-medium">الحالة</th><th className="pb-3 font-medium">التارجت المحقق</th></tr></thead><tbody>{myHosts.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-sm text-[#858b92]">لا يوجد مضيفون مدعوون بعد</td></tr>}{myHosts.map((h) => <tr key={h.id} className="border-b border-white/[.06] last:border-0"><td className="py-4 font-bold text-[#ece9e4]">{h.full_name}</td><td className="py-4 font-mono text-xs text-[#9ca0a5]">{h.app_id ?? '—'}</td><td className="py-4 text-xs text-[#9599a0]">{h.activation_date ? new Date(h.activation_date).toLocaleDateString('en-GB') : '—'}</td><td className="py-4 text-xs text-[#9599a0]">{h.expiry_date ? new Date(h.expiry_date).toLocaleDateString('en-GB') : '—'}</td><td className="py-4"><span className={`rounded-full px-3 py-1 text-[11px] ${h.is_banned ? 'bg-red-500/15 text-red-400' : h.status === 'active' ? 'bg-[#5fc3a5]/10 text-[#70cfb1]' : 'bg-[#ee9e65]/10 text-[#efa46d]'}`}>{h.is_banned ? 'محظور' : h.status === 'active' ? 'نشط' : 'معلق'}</span></td><td className="py-4 text-xs text-[#efab75]">{(h.achieved_target || 0).toLocaleString('en-US')}</td></tr>)}</tbody></table></div></div></div></main>;
}

function DashboardStat({ icon: Icon, label, value }: { icon: IconComponent; label: string; value: string }) { return <div className="rounded-2xl border border-white/[.08] bg-[#11141a] p-5"><div className="flex items-center justify-between"><span className="text-xs text-[#858b92]">{label}</span><Icon size={18} className="text-[#ec9e65]" /></div><div className="mt-5 text-3xl font-black text-[#f1ede7]">{value}</div></div>; }

function Footer({ onNavigate, socialLinks }: { onNavigate: (view: View) => void; socialLinks: SocialLink[] }) {
  const { lang } = useLang();
  const findLink = (platform: string) => socialLinks.find(s => s.platform === platform)?.url;
  return <footer className="border-t border-white/[.08] bg-[#090b0f] py-12"><div className="container-wide"><div className="flex flex-col justify-between gap-10 md:flex-row"><div><button onClick={() => onNavigate('home')} className="flex items-center gap-3"><div className="h-10 w-10 overflow-hidden rounded-xl border border-[#76573e] bg-[#2c211b]"><img src="/0a3e789f-716c-4251-9569-7f98ecab5ee9.jpg" alt="شعار Shadow Agencies Community" className="h-full w-full object-cover" /></div><div className="text-right"><div className="text-[11px] font-black tracking-[.2em]">SHADOW</div><div className="text-[8px] font-bold tracking-[.2em] text-[#a26b48]">AGENCIES COMMUNITY</div></div></button><p className="mt-5 max-w-xs text-sm leading-7 text-[#81868d]">أطلق صوتك، ابنِ مجتمعك، وكن جزءاً من شبكة تؤمن بما تستطيع أن تصنعه.</p></div><div className="flex flex-wrap gap-10"><div><p className="mb-4 text-xs font-bold text-[#f0ece6]">استكشف</p><button onClick={() => onNavigate('home')} className="block py-1 text-sm text-[#81868d] hover:text-[#eea269]">الرئيسية</button><button onClick={() => onNavigate('target')} className="block py-1 text-sm text-[#81868d] hover:text-[#eea269]">احسب تارجتك</button><button onClick={() => onNavigate('mediator')} className="block py-1 text-sm text-[#81868d] hover:text-[#eea269]">دخول الوسيط</button></div><div><p className="mb-4 text-xs font-bold text-[#f0ece6]">تابعنا</p><div className="flex gap-2">{findLink('facebook') && <a href={findLink('facebook')} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#aeb1b5] hover:border-[#eea269] hover:text-[#eea269]" aria-label="فيسبوك"><Facebook size={16} /></a>}{findLink('youtube') && <a href={findLink('youtube')} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#aeb1b5] hover:border-[#eea269] hover:text-[#eea269]" aria-label="يوتيوب"><Youtube size={16} /></a>}{findLink('instagram') && <a href={findLink('instagram')} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#aeb1b5] hover:border-[#eea269] hover:text-[#eea269]" aria-label="إنستغرام"><Instagram size={16} /></a>}</div></div></div></div><div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/[.07] pt-5 text-xs text-[#656b73] sm:flex-row"><span>© 2026 Shadow Agencies Community</span><span className="flex items-center gap-2"><ShieldCheck size={14} className="text-[#69c6aa]" />خصوصيتك وأمانك أولويتنا</span></div></div></footer>;
}

function ErrorPage({ onNavigate }: { onNavigate: (v: View) => void }) {
  return <main className="flex min-h-screen items-center justify-center bg-[#0b0e13] px-5"><div className="text-center"><div className="text-[120px] font-black leading-none text-[#f4a56b]">404</div><h1 className="mt-4 text-2xl font-black text-[#f1f0ee]">الصفحة غير موجودة</h1><p className="mt-3 text-sm text-[#858b92]">عذراً، الرابط الذي تبحث عنه غير موجود أو تم نقله.</p><button onClick={() => onNavigate('home')} className="button-primary mt-8">العودة للرئيسية <ArrowRight size={17} /></button></div></main>;
}

export default App;
