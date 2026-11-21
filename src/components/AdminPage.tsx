import { useState, type FormEvent } from 'react';
import {
  ArrowLeft, ArrowRight, Bell, Copy, Edit3,
  LayoutDashboard, Link as LinkIcon, Mic2, Plus, Search,
  ShieldCheck, Star, Trash2, Users, Video, WalletCards, X,
  Ban, CheckCircle, Target, Settings as SettingsIcon, Lock,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type {
  AccountType, AdminTab, Agency, AgencyStaff, FeaturedMember,
  FeaturedRole, Mediator, Rate, RegisterRole, Registration, SiteSettings,
  SocialLink, Testimonial, VideoLink,
} from '@/types';

type Props = {
  isAdmin: boolean;
  setIsAdmin: (v: boolean) => void;
  agencies: Agency[];
  setAgencies: (v: Agency[]) => void;
  members: FeaturedMember[];
  setMembers: (v: FeaturedMember[]) => void;
  testimonials: Testimonial[];
  setTestimonials: (v: Testimonial[]) => void;
  registrations: Registration[];
  setRegistrations: (v: Registration[]) => void;
  videoLinks: VideoLink[];
  setVideoLinks: (v: VideoLink[]) => void;
  socialLinks: SocialLink[];
  setSocialLinks: (v: SocialLink[]) => void;
  mediators: Mediator[];
  setMediators: (v: Mediator[]) => void;
  agencyStaff: AgencyStaff[];
  setAgencyStaff: (v: AgencyStaff[]) => void;
  rates: Rate[];
  setRates: (v: Rate[]) => void;
  siteSettings: SiteSettings;
  setSiteSettings: (v: SiteSettings) => void;
};

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-5">
      <h2 className="m-0 text-2xl font-black">{title}</h2>
      <p className="m-0 mt-1 text-sm text-[#858b92]">{description}</p>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof Users }) {
  return (
    <div className="rounded-2xl border border-white/[.08] bg-[#11141a] p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#858b92]">{label}</span>
        <Icon size={18} className="text-[#ec9e65]" />
      </div>
      <p className="m-0 mt-4 text-3xl font-black">{typeof value === 'number' ? value.toLocaleString('en-US') : value}</p>
    </div>
  );
}

function AccountTypeBadge({ type }: { type: AccountType }) {
  const map = { normal: ['عادي', 'bg-white/5 text-white/60'], pro: ['محترف', 'bg-blue-500/15 text-blue-300'], vip: ['VIP', 'bg-[#f4a56b]/15 text-[#f4a56b]'] } as const;
  const [label, cls] = map[type];
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${cls}`}>{label}</span>;
}

function RoleBadge({ role }: { role: RegisterRole }) {
  const map = { host: ['مضيف', 'text-[#f4a56b]'], supporter: ['داعم', 'text-blue-300'], contributor: ['مساهم', 'text-green-400'] } as const;
  const [label, cls] = map[role];
  return <span className={`text-xs font-bold ${cls}`}>{label}</span>;
}

// ─── Overview ────────────────────────────────────────────────────────────────
function AdminOverview({ agencies, members, registrations, mediators }: Pick<Props, 'agencies' | 'members' | 'registrations' | 'mediators'>) {
  const active = registrations.filter(r => r.status === 'active' && !r.is_banned);
  const pending = registrations.filter(r => r.status === 'pending');
  const banned = registrations.filter(r => r.is_banned);
  return (
    <div>
      <SectionTitle title="النظرة العامة" description="صورة سريعة عن أداء مجتمع Shadow." />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="الوكالات" value={agencies.length} icon={Users} />
        <StatCard label="الأعضاء النشطون" value={active.length} icon={Mic2} />
        <StatCard label="الوسطاء" value={mediators.length} icon={WalletCards} />
        <StatCard label="المميزون (نجوم)" value={members.length} icon={Star} />
        <StatCard label="الطلبات المعلقة" value={pending.length} icon={Bell} />
        <StatCard label="المحظورون" value={banned.length} icon={Ban} />
      </div>
      <div className="mt-5 rounded-2xl border border-white/[.08] bg-[#11141a] p-5">
        <div className="flex items-center justify-between">
          <h3 className="m-0 font-bold">حالة النظام</h3>
          <span className="flex items-center gap-2 text-xs text-[#6bc7aa]"><span className="h-2 w-2 rounded-full bg-[#6bc7aa]" />كل الأنظمة تعمل</span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-[#0d1015] p-4"><p className="m-0 text-xs text-[#858b92]">الأمان</p><p className="m-0 mt-2 font-bold text-[#70cbaa]">محمي</p></div>
          <div className="rounded-xl bg-[#0d1015] p-4"><p className="m-0 text-xs text-[#858b92]">الطلبات</p><p className="m-0 mt-2 font-bold text-[#eea269]">تحتاج مراجعة</p></div>
          <div className="rounded-xl bg-[#0d1015] p-4"><p className="m-0 text-xs text-[#858b92]">آخر نسخة احتياطية</p><p className="m-0 mt-2 font-bold">اليوم، 03:00 ص</p></div>
        </div>
      </div>
    </div>
  );
}

// ─── Agency Member Row ────────────────────────────────────────────────────────
function MemberRow({ reg, onUpdate, onDelete }: {
  reg: Registration;
  onUpdate: (id: string, patch: Partial<Registration>) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [appId, setAppId] = useState(reg.app_id ?? '');
  const saveAppId = () => { onUpdate(reg.id, { app_id: appId }); setEditing(false); };

  return (
    <tr className="border-b border-white/[.06] last:border-0 text-sm">
      <td className="p-3 text-[10px] font-mono text-[#858b92]">{reg.id.slice(0, 8)}</td>
      <td className="p-3 font-bold text-[#eceae5]">{reg.full_name}</td>
      <td className="p-3">
        {editing ? (
          <div className="flex gap-1">
            <input value={appId} onChange={e => setAppId(e.target.value)} className="w-24 rounded bg-[#0d1015] px-2 py-1 text-xs text-white border border-[#404550]" placeholder="APP-000" />
            <button onClick={saveAppId} className="rounded bg-[#f4a56b] px-2 py-1 text-[10px] font-bold text-black">حفظ</button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="flex items-center gap-1 text-xs text-[#9ca0a5] hover:text-[#f4a56b]">
            {reg.app_id ?? '—'} <Edit3 size={12} />
          </button>
        )}
      </td>
      <td className="p-3 text-xs text-[#9ca0a5]">{reg.phone_code} {reg.phone_number}</td>
      <td className="p-3 text-xs text-[#9ca0a5]">{reg.country}</td>
      <td className="p-3 text-xs text-[#9ca0a5]">{reg.gender === 'male' ? 'ذكر' : 'أنثى'}</td>
      <td className="p-3"><AccountTypeBadge type={reg.account_type} /></td>
      <td className="p-3">
        <div className="flex items-center gap-1 flex-wrap">
          <select
            value={reg.account_type}
            onChange={e => onUpdate(reg.id, { account_type: e.target.value as AccountType })}
            className="rounded bg-[#1b1e25] px-2 py-1 text-[10px] text-white border border-[#404550]"
          >
            <option value="normal">عادي</option>
            <option value="pro">محترف</option>
            <option value="vip">VIP</option>
          </select>
          <button
            onClick={() => onUpdate(reg.id, { is_banned: !reg.is_banned })}
            className={`rounded px-2 py-1 text-[10px] font-bold ${reg.is_banned ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}
          >
            {reg.is_banned ? 'فك الحظر' : 'حظر'}
          </button>
          <button onClick={() => onDelete(reg.id)} className="rounded p-1 text-red-400 hover:bg-red-500/10">
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Agency Detail ────────────────────────────────────────────────────────────
function AgencyDetail({ agency, registrations, agencyStaff, setAgencyStaff, onUpdate, onDelete, onBack }: {
  agency: Agency;
  registrations: Registration[];
  agencyStaff: AgencyStaff[];
  setAgencyStaff: (v: AgencyStaff[]) => void;
  onUpdate: (id: string, patch: Partial<Registration>) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}) {
  const [roleTab, setRoleTab] = useState<RegisterRole | 'all'>('all');
  const [newStaff, setNewStaff] = useState({ name: '', role: 'manager' as 'manager' | 'supervisor', phone: '' });
  const myStaff = agencyStaff.filter(s => s.agency_id === agency.id);

  const addStaff = async (e: FormEvent) => {
    e.preventDefault();
    if (!newStaff.name) return;
    const staff = { id: `staff-${Date.now()}`, agency_id: agency.id, ...newStaff };
    setAgencyStaff([...agencyStaff, staff]);
    setNewStaff({ name: '', role: 'manager', phone: '' });
    if (supabase) {
      const { error } = await supabase.from('agency_staff').insert({ agency_id: agency.id, name: staff.name, role: staff.role, phone: staff.phone || null });
      if (error) console.error('add staff failed', error);
    }
  };

  const removeStaff = async (id: string) => {
    setAgencyStaff(agencyStaff.filter(s => s.id !== id));
    if (supabase) {
      const { error } = await supabase.from('agency_staff').delete().eq('id', id);
      if (error) console.error('delete staff failed', error);
    }
  };

  const myRegs = registrations.filter(r => r.agency_id === agency.id);
  const filtered = roleTab === 'all' ? myRegs : myRegs.filter(r => r.role === roleTab);

  return (
    <div>
      <button onClick={onBack} className="mb-5 flex items-center gap-2 text-sm text-[#f4a56b] hover:opacity-80">
        <ArrowRight size={16} /> العودة إلى الوكالات
      </button>
      <div className="mb-6 flex items-center gap-4">
        {agency.logo_url ? (
          <img src={agency.logo_url} alt={agency.name} className="h-14 w-14 rounded-xl object-cover" />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#2d211b] text-2xl font-black text-[#eea169]">{agency.name[0]}</div>
        )}
        <div>
          <h2 className="m-0 text-2xl font-black">{agency.name}</h2>
          <p className="m-0 text-sm text-[#858b92]">{agency.app_account_code} · {myRegs.length} عضو</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-[#60432f] bg-[#1c1512] p-5">
        <h3 className="m-0 mb-4 font-bold text-[#f4a56b]">مسؤولو الوكالة ومشرفوها</h3>
        {myStaff.length > 0 && (
          <div className="mb-4 grid gap-2 sm:grid-cols-2">
            {myStaff.map(s => (
              <div key={s.id} className="flex items-center justify-between rounded-xl bg-[#0d1015] px-4 py-3">
                <div>
                  <p className="m-0 text-sm font-bold">{s.name}</p>
                  <p className="m-0 text-xs text-[#858b92]">{s.role === 'manager' ? 'مسؤول الوكالة' : 'مشرف'} {s.phone && `· ${s.phone}`}</p>
                </div>
                <button onClick={() => removeStaff(s.id)} className="text-red-400 hover:opacity-80"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={addStaff} className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
          <input value={newStaff.name} onChange={e => setNewStaff({ ...newStaff, name: e.target.value })} className="input-field" placeholder="الاسم" />
          <select value={newStaff.role} onChange={e => setNewStaff({ ...newStaff, role: e.target.value as 'manager' | 'supervisor' })} className="input-field">
            <option value="manager">مسؤول الوكالة</option>
            <option value="supervisor">مشرف</option>
          </select>
          <input value={newStaff.phone} onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })} className="input-field" placeholder="رقم الهاتف (اختياري)" />
          <button className="button-primary"><Plus size={15} /></button>
        </form>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {(['all', 'host', 'supporter', 'contributor'] as const).map(r => (
          <button key={r} onClick={() => setRoleTab(r)} className={`rounded-full px-4 py-2 text-xs font-bold transition ${roleTab === r ? 'bg-[#f4a56b] text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
            {r === 'all' ? 'الكل' : r === 'host' ? 'المضيفون' : r === 'supporter' ? 'الداعمون' : 'المساهمون'}
            <span className="mr-1 opacity-70">({r === 'all' ? myRegs.length : myRegs.filter(x => x.role === r).length})</span>
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/[.08] bg-[#11141a]">
        <table className="w-full min-w-[900px] text-right">
          <thead>
            <tr className="border-b border-white/10 text-[11px] text-[#737981]">
              <th className="p-3">ID النظام</th>
              <th className="p-3">الاسم</th>
              <th className="p-3">ID التطبيق</th>
              <th className="p-3">الهاتف</th>
              <th className="p-3">الدولة</th>
              <th className="p-3">الجنس</th>
              <th className="p-3">النوع</th>
              <th className="p-3">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="p-8 text-center text-sm text-[#858b92]">لا يوجد أعضاء في هذه الفئة</td></tr>
            )}
            {filtered.map(r => (
              <MemberRow key={r.id} reg={r} onUpdate={onUpdate} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Agencies List ────────────────────────────────────────────────────────────
function AgenciesAdmin({ agencies, setAgencies, onSelectAgency }: {
  agencies: Agency[];
  setAgencies: (v: Agency[]) => void;
  onSelectAgency: (id: string) => void;
}) {
  const [form, setForm] = useState({ name: '', code: '', logo: '' });

  const addAgency = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    const agency = { id: `agency-${Date.now()}`, name: form.name, logo_url: form.logo, app_account_code: form.code || 'NEW-0000', member_count: 0 };
    setAgencies([...agencies, agency]);
    setForm({ name: '', code: '', logo: '' });
    if (supabase) {
      const { error } = await supabase.from('agencies').insert({ name: agency.name, logo_url: agency.logo_url || null, app_account_code: agency.app_account_code, member_count: 0, is_active: true });
      if (error) console.error('add agency failed', error);
    }
  };

  const removeAgency = async (id: string) => {
    setAgencies(agencies.filter(a => a.id !== id));
    if (supabase) {
      const { error } = await supabase.from('agencies').delete().eq('id', id);
      if (error) console.error('delete agency failed', error);
    }
  };

  return (
    <div>
      <SectionTitle title="إدارة الوكالات" description="أنشئ وعدّل بيانات الوكالات، واضغط على وكالة لعرض أعضائها." />
      <form onSubmit={addAgency} className="mb-5 grid gap-2 rounded-2xl border border-[#60432f] bg-[#1c1512] p-4 sm:grid-cols-[1fr_1fr_1fr_auto]">
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="اسم الوكالة" />
        <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} className="input-field" placeholder="كود الوكالة" />
        <input value={form.logo} onChange={e => setForm({ ...form, logo: e.target.value })} className="input-field" placeholder="رابط الشعار (اختياري)" />
        <button className="button-primary"><Plus size={16} />إضافة</button>
      </form>
      <div className="grid gap-3">
        {agencies.map(agency => (
          <div key={agency.id} className="flex items-center gap-4 rounded-2xl border border-white/[.08] bg-[#11141a] p-4 hover:border-[#9f6a49] transition cursor-pointer" onClick={() => onSelectAgency(agency.id)}>
            {agency.logo_url ? (
              <img src={agency.logo_url} alt={agency.name} className="h-12 w-12 rounded-xl object-cover border border-white/10" />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2d211b] font-black text-[#eea169]">{agency.name[0]}</div>
            )}
            <div className="flex-1 min-w-0">
              <p className="m-0 font-bold">{agency.name}</p>
              <p className="m-0 mt-1 text-xs text-[#858b92]">{agency.app_account_code} · {agency.member_count} عضو</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#f4a56b]">عرض الأعضاء</span>
              <button onClick={e => { e.stopPropagation(); removeAgency(agency.id); }} className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mediator Detail ──────────────────────────────────────────────────────────
function MediatorDetail({ mediator, agencies, registrations, onBack, onUpdate }: {
  mediator: Mediator;
  agencies: Agency[];
  registrations: Registration[];
  onBack: () => void;
  onUpdate: (id: string, patch: Partial<Mediator>) => void;
}) {
  const agency = agencies.find(a => a.id === mediator.agency_id);
  const invited = registrations.filter(r => r.mediator_id === mediator.id);
  const [editPass, setEditPass] = useState(false);
  const [editCommission, setEditCommission] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [newCommission, setNewCommission] = useState(mediator.commission);
  const [msg, setMsg] = useState('');

  const savePassword = async () => {
    if (newPass.trim().length < 4) { setMsg('كلمة المرور يجب أن تكون 4 أحرف على الأقل'); return; }
    onUpdate(mediator.id, { password: newPass });
    setMsg('تم تحديث كلمة المرور');
    setNewPass('');
    setEditPass(false);
  };

  const saveCommission = async () => {
    onUpdate(mediator.id, { commission: newCommission });
    setMsg('تم تحديث نسبة العمولة');
    setEditCommission(false);
  };

  return (
    <div>
      <button onClick={onBack} className="mb-5 flex items-center gap-2 text-sm text-[#f4a56b] hover:opacity-80"><ArrowRight size={16} />العودة إلى الوسطاء</button>
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#2d211b] text-2xl font-black text-[#eea169]">{mediator.name[0]}</div>
        <div>
          <h2 className="m-0 text-2xl font-black">{mediator.name}</h2>
          <p className="m-0 text-sm text-[#858b92]">{mediator.code} · {agency?.name ?? 'بدون وكالة'} · عمولة {mediator.commission}</p>
        </div>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#59412f] bg-[#1c1512] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Lock size={16} className="text-[#f4a56b]" /><span className="text-sm font-bold">كلمة المرور</span></div>
            <button onClick={() => setEditPass(!editPass)} className="text-xs text-[#f4a56b] hover:opacity-80">{editPass ? 'إلغاء' : 'تغيير'}</button>
          </div>
          {editPass && (
            <div className="mt-3 flex gap-2">
              <input value={newPass} onChange={e => setNewPass(e.target.value)} type="password" className="input-field" dir="ltr" placeholder="كلمة مرور جديدة" />
              <button onClick={savePassword} className="button-primary !px-4">حفظ</button>
            </div>
          )}
          {!editPass && <p className="m-0 mt-3 text-xs text-[#858b92]">{mediator.password ? '••••••••' : 'لم تُعيّن بعد'}</p>}
        </div>
        <div className="rounded-2xl border border-[#59412f] bg-[#1c1512] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><WalletCards size={16} className="text-[#f4a56b]" /><span className="text-sm font-bold">نسبة العمولة</span></div>
            <button onClick={() => setEditCommission(!editCommission)} className="text-xs text-[#f4a56b] hover:opacity-80">{editCommission ? 'إلغاء' : 'تغيير'}</button>
          </div>
          {editCommission ? (
            <div className="mt-3 flex gap-2">
              <select value={newCommission} onChange={e => setNewCommission(e.target.value)} className="input-field">
                <option value="50%">50% — تارجتين / 30 يوم</option>
                <option value="25%">25% — 4 تارجتات / 60 يوم</option>
              </select>
              <button onClick={saveCommission} className="button-primary !px-4">حفظ</button>
            </div>
          ) : (
            <p className="m-0 mt-3 text-xs text-[#858b92]">{mediator.commission === '50%' ? '50% — تارجتين / 30 يوم' : '25% — 4 تارجتات / 60 يوم'}</p>
          )}
        </div>
      </div>
      {msg && <p className="mb-4 text-sm text-green-400">{msg}</p>}

      <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#59412f] bg-[#1c1512] px-5 py-4">
        <Copy size={18} className="text-[#f4a56b]" />
        <div>
          <p className="m-0 text-xs text-[#858b92]">كود الدعوة</p>
          <p className="m-0 font-mono font-bold text-[#f3b47f]">{mediator.code}</p>
        </div>
      </div>
      <SectionTitle title={`المضيفون المدعوون (${invited.length})`} description="الأعضاء الذين انضموا عبر كود هذا الوسيط." />
      <div className="overflow-x-auto rounded-2xl border border-white/[.08] bg-[#11141a]">
        <table className="w-full min-w-[600px] text-right text-sm">
          <thead><tr className="border-b border-white/10 text-xs text-[#737981]"><th className="p-4">الاسم</th><th className="p-4">النوع</th><th className="p-4">الدولة</th><th className="p-4">الحالة</th></tr></thead>
          <tbody>
            {invited.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-sm text-[#858b92]">لا يوجد أعضاء مدعوون</td></tr>}
            {invited.map(r => (
              <tr key={r.id} className="border-b border-white/[.06] last:border-0">
                <td className="p-4 font-bold">{r.full_name}</td>
                <td className="p-4"><RoleBadge role={r.role} /></td>
                <td className="p-4 text-xs text-[#9ca0a5]">{r.country}</td>
                <td className="p-4"><span className={`rounded-full px-3 py-1 text-[11px] ${r.is_banned ? 'bg-red-500/15 text-red-400' : 'bg-[#5fc3a5]/10 text-[#70cfb1]'}`}>{r.is_banned ? 'محظور' : 'نشط'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Mediators Admin ──────────────────────────────────────────────────────────
function MediatorsAdmin({ mediators, setMediators, agencies, registrations, onSelect }: {
  mediators: Mediator[];
  setMediators: (v: Mediator[]) => void;
  agencies: Agency[];
  registrations: Registration[];
  onSelect: (id: string) => void;
}) {
  const [form, setForm] = useState({ name: '', code: '', agency_id: '', commission: '50%', password: '' });
  const [error, setError] = useState('');

  const addMediator = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.code.trim()) { setError('الاسم والكود مطلوبان'); return; }
    if (form.password.trim().length < 4) { setError('كلمة المرور يجب أن تكون 4 أحرف على الأقل'); return; }

    const matchReg = registrations.find(r =>
      r.full_name.trim().toLowerCase() === form.name.trim().toLowerCase() &&
      r.app_id && r.app_id.toLowerCase() === form.code.trim().toLowerCase()
    );
    if (!matchReg) {
      setError('الاسم أو الكود غير مسجل ك مضيف/داعم. يجب أن يكون مسجلاً في طلبات الانضمام أولاً');
      return;
    }

    const mediator = { id: `med-${Date.now()}`, name: form.name.trim(), code: form.code.trim(), agency_id: form.agency_id || null, commission: form.commission, is_active: true, password: form.password };
    setMediators([...mediators, mediator]);
    setForm({ name: '', code: '', agency_id: '', commission: '50%', password: '' });
    if (supabase) {
      const { error } = await supabase.from('mediators').insert({ name: mediator.name, code: mediator.code, agency_id: mediator.agency_id, commission: mediator.commission, is_active: true, password: mediator.password });
      if (error) console.error('add mediator failed', error);
    }
  };

  const removeMediator = async (id: string) => {
    setMediators(mediators.filter(m => m.id !== id));
    if (supabase) {
      const { error } = await supabase.from('mediators').delete().eq('id', id);
      if (error) console.error('delete mediator failed', error);
    }
  };

  return (
    <div>
      <SectionTitle title="إدارة الوسطاء" description="راجع الوسطاء ونسب العمولة. اضغط على وسيط لعرض أعضائه وتعديل بياناته." />
      <form onSubmit={addMediator} className="mb-5 grid gap-2 rounded-2xl border border-[#60432f] bg-[#1c1512] p-4 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto]">
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="اسم الوسيط (مسجل لدينا)" />
        <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} className="input-field" placeholder="كود التطبيق (app_id)" dir="ltr" />
        <input value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} type="password" className="input-field" placeholder="كلمة المرور" dir="ltr" />
        <select value={form.agency_id} onChange={e => setForm({ ...form, agency_id: e.target.value })} className="input-field">
          <option value="">اختر الوكالة</option>
          {agencies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <select value={form.commission} onChange={e => setForm({ ...form, commission: e.target.value })} className="input-field">
          <option value="50%">50% — تارجتين</option>
          <option value="25%">25% — 4 تارجتات</option>
        </select>
        <button className="button-primary"><Plus size={16} />إضافة</button>
      </form>
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      <div className="grid gap-3">
        {mediators.map(med => {
          const agency = agencies.find(a => a.id === med.agency_id);
          return (
            <div key={med.id} className="flex flex-col justify-between gap-3 rounded-2xl border border-white/[.08] bg-[#11141a] p-5 sm:flex-row sm:items-center cursor-pointer hover:border-[#9f6a49] transition" onClick={() => onSelect(med.id)}>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2e211b] text-[#eea069]"><WalletCards size={18} /></div>
                <div>
                  <p className="m-0 font-bold">{med.name}</p>
                  <p className="m-0 mt-0.5 font-mono text-xs text-[#858b92]">{med.code} · {agency?.name ?? 'بدون وكالة'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="font-bold text-[#eea269]">{med.commission}</span>
                <span className="text-xs text-[#f4a56b]">عرض التفاصيل</span>
                <button onClick={e => { e.stopPropagation(); removeMediator(med.id); }} className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"><Trash2 size={16} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Homepage Editor ──────────────────────────────────────────────────────────
function HomepageEditor({ members, setMembers, testimonials, setTestimonials, videoLinks, setVideoLinks, socialLinks, setSocialLinks }: Pick<Props, 'members' | 'setMembers' | 'testimonials' | 'setTestimonials' | 'videoLinks' | 'setVideoLinks' | 'socialLinks' | 'setSocialLinks'>) {
  const [section, setSection] = useState<'members' | 'testimonials' | 'videos' | 'social'>('members');
  const [newMember, setNewMember] = useState({ name: '', role: 'host' as FeaturedRole, image_url: '' });
  const [newTestimonial, setNewTestimonial] = useState({ author_name: '', message: '', role: '' });
  const [newVideo, setNewVideo] = useState({ title: '', url: '' });
  const [newSocial, setNewSocial] = useState({ platform: 'facebook', url: '', label: '' });

  const addMember = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMember.name) return;
    const member = { id: `m-${Date.now()}`, name: newMember.name, role: newMember.role, image_url: newMember.image_url || null };
    setMembers([...members, member]);
    setNewMember({ name: '', role: 'host', image_url: '' });
    if (supabase) {
      const { error } = await supabase.from('featured_members').insert({ name: member.name, role: member.role, image_url: member.image_url, is_published: true });
      if (error) console.error('add member failed', error);
    }
  };

  const removeMember = async (id: string) => {
    setMembers(members.filter(x => x.id !== id));
    if (supabase) {
      const { error } = await supabase.from('featured_members').delete().eq('id', id);
      if (error) console.error('delete member failed', error);
    }
  };

  const addTestimonial = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.author_name || !newTestimonial.message) return;
    const t = { id: `t-${Date.now()}`, author_name: newTestimonial.author_name, message: newTestimonial.message, role: newTestimonial.role || null };
    setTestimonials([...testimonials, t]);
    setNewTestimonial({ author_name: '', message: '', role: '' });
    if (supabase) {
      const { error } = await supabase.from('testimonials').insert({ author_name: t.author_name, message: t.message, role: t.role, is_published: true });
      if (error) console.error('add testimonial failed', error);
    }
  };

  const removeTestimonial = async (id: string) => {
    setTestimonials(testimonials.filter(x => x.id !== id));
    if (supabase) {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) console.error('delete testimonial failed', error);
    }
  };

  const addVideo = async (e: FormEvent) => {
    e.preventDefault();
    if (!newVideo.url) return;
    const v = { id: `v-${Date.now()}`, title: newVideo.title || 'فيديو', url: newVideo.url, is_published: true, sort_order: videoLinks.length };
    setVideoLinks([...videoLinks, v]);
    setNewVideo({ title: '', url: '' });
    if (supabase) {
      const { error } = await supabase.from('video_links').insert({ title: v.title, url: v.url, is_published: true, sort_order: v.sort_order });
      if (error) console.error('add video failed', error);
    }
  };

  const removeVideo = async (id: string) => {
    setVideoLinks(videoLinks.filter(x => x.id !== id));
    if (supabase) {
      const { error } = await supabase.from('video_links').delete().eq('id', id);
      if (error) console.error('delete video failed', error);
    }
  };

  const addSocial = async (e: FormEvent) => {
    e.preventDefault();
    if (!newSocial.url) return;
    const s = { id: `sl-${Date.now()}`, platform: newSocial.platform, url: newSocial.url, label: newSocial.label || newSocial.platform, sort_order: socialLinks.length };
    setSocialLinks([...socialLinks, s]);
    setNewSocial({ platform: 'facebook', url: '', label: '' });
    if (supabase) {
      const { error } = await supabase.from('social_links').insert({ platform: s.platform, url: s.url, label: s.label, sort_order: s.sort_order, is_active: true });
      if (error) console.error('add social failed', error);
    }
  };

  const removeSocial = async (id: string) => {
    setSocialLinks(socialLinks.filter(x => x.id !== id));
    if (supabase) {
      const { error } = await supabase.from('social_links').delete().eq('id', id);
      if (error) console.error('delete social failed', error);
    }
  };

  const tabs = [
    { id: 'members' as const, label: 'نجوم المجتمع' },
    { id: 'testimonials' as const, label: 'كلمات الشكر' },
    { id: 'videos' as const, label: 'الفيديوهات' },
    { id: 'social' as const, label: 'روابط التواصل' },
  ];

  return (
    <div>
      <SectionTitle title="تعديل الصفحة الرئيسية" description="أدر محتوى الصفحة الرئيسية — الأعضاء، الشهادات، الفيديوهات، وروابط التواصل. كل ما تضيفه يظهر فوراً في الصفحة الرئيسية." />
      <div className="mb-6 flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setSection(t.id)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${section === t.id ? 'bg-[#f4a56b] text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>{t.label}</button>
        ))}
      </div>

      {section === 'members' && (
        <div>
          <form onSubmit={addMember} className="mb-4 grid gap-2 rounded-2xl border border-[#60432f] bg-[#1c1512] p-4 sm:grid-cols-[1fr_1fr_1fr_auto]">
            <input value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} className="input-field" placeholder="اسم العضو" />
            <select value={newMember.role} onChange={e => setNewMember({ ...newMember, role: e.target.value as FeaturedRole })} className="input-field">
              <option value="host">مضيف</option>
              <option value="supporter">داعم</option>
              <option value="contributor">مساهم</option>
            </select>
            <input value={newMember.image_url} onChange={e => setNewMember({ ...newMember, image_url: e.target.value })} className="input-field" placeholder="رابط الصورة (اختياري)" />
            <button className="button-primary"><Plus size={16} />إضافة</button>
          </form>
          <div className="grid gap-2 sm:grid-cols-2">
            {members.map(m => (
              <div key={m.id} className="flex items-center gap-3 rounded-xl border border-white/[.08] bg-[#11141a] p-3">
                <div className="h-10 w-10 overflow-hidden rounded-lg border border-white/10 bg-[#1e2129]">
                  {m.image_url ? <img src={m.image_url} className="h-full w-full object-cover" alt={m.name} /> : <div className="h-full w-full bg-[radial-gradient(circle_at_50%_30%,#9d6347,#28282d)]" />}
                </div>
                <div className="flex-1"><p className="m-0 text-sm font-bold">{m.name}</p><RoleBadge role={m.role} /></div>
                <button onClick={() => removeMember(m.id)} className="text-red-400 hover:opacity-80"><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {section === 'testimonials' && (
        <div>
          <form onSubmit={addTestimonial} className="mb-4 rounded-2xl border border-[#60432f] bg-[#1c1512] p-4 grid gap-2">
            <div className="grid gap-2 sm:grid-cols-2">
              <input value={newTestimonial.author_name} onChange={e => setNewTestimonial({ ...newTestimonial, author_name: e.target.value })} className="input-field" placeholder="اسم صاحب الكلمة" />
              <input value={newTestimonial.role} onChange={e => setNewTestimonial({ ...newTestimonial, role: e.target.value })} className="input-field" placeholder="الصفة (مضيف، داعم، ...)" />
            </div>
            <textarea value={newTestimonial.message} onChange={e => setNewTestimonial({ ...newTestimonial, message: e.target.value })} className="input-field min-h-[80px] resize-none" placeholder="نص الكلمة..." />
            <button className="button-primary w-fit"><Plus size={16} />إضافة كلمة</button>
          </form>
          <div className="grid gap-3 sm:grid-cols-2">
            {testimonials.map(t => (
              <div key={t.id} className="rounded-xl border border-white/[.08] bg-[#11141a] p-4">
                <p className="m-0 text-sm text-[#c7c6c3]">"{t.message}"</p>
                <div className="mt-3 flex items-center justify-between">
                  <div><p className="m-0 text-sm font-bold">{t.author_name}</p><p className="m-0 text-xs text-[#858b92]">{t.role ?? ''}</p></div>
                  <button onClick={() => removeTestimonial(t.id)} className="text-red-400 hover:opacity-80"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {section === 'videos' && (
        <div>
          <form onSubmit={addVideo} className="mb-4 grid gap-2 rounded-2xl border border-[#60432f] bg-[#1c1512] p-4 sm:grid-cols-[1fr_2fr_auto]">
            <input value={newVideo.title} onChange={e => setNewVideo({ ...newVideo, title: e.target.value })} className="input-field" placeholder="عنوان الفيديو" />
            <input value={newVideo.url} onChange={e => setNewVideo({ ...newVideo, url: e.target.value })} className="input-field" dir="ltr" placeholder="رابط اليوتيوب أو المنصة" />
            <button className="button-primary"><Plus size={16} />إضافة</button>
          </form>
          {videoLinks.length === 0 && <p className="text-sm text-[#858b92]">لا توجد فيديوهات بعد. أضف رابطاً لتظهر في الصفحة الرئيسية.</p>}
          <div className="grid gap-3">
            {videoLinks.map(v => (
              <div key={v.id} className="flex items-center gap-3 rounded-xl border border-white/[.08] bg-[#11141a] p-4">
                <Video size={18} className="text-[#f4a56b] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="m-0 font-bold">{v.title}</p>
                  <p className="m-0 text-xs text-[#858b92] truncate">{v.url}</p>
                </div>
                <button onClick={() => removeVideo(v.id)} className="text-red-400 hover:opacity-80"><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {section === 'social' && (
        <div>
          <form onSubmit={addSocial} className="mb-4 grid gap-2 rounded-2xl border border-[#60432f] bg-[#1c1512] p-4 sm:grid-cols-[1fr_2fr_1fr_auto]">
            <select value={newSocial.platform} onChange={e => setNewSocial({ ...newSocial, platform: e.target.value })} className="input-field">
              <option value="facebook">فيسبوك</option>
              <option value="youtube">يوتيوب</option>
              <option value="instagram">إنستغرام</option>
              <option value="telegram">تيليجرام</option>
              <option value="whatsapp">واتساب</option>
              <option value="tiktok">تيك توك</option>
            </select>
            <input value={newSocial.url} onChange={e => setNewSocial({ ...newSocial, url: e.target.value })} className="input-field" dir="ltr" placeholder="الرابط" />
            <input value={newSocial.label} onChange={e => setNewSocial({ ...newSocial, label: e.target.value })} className="input-field" placeholder="تسمية (اختياري)" />
            <button className="button-primary"><Plus size={16} /></button>
          </form>
          <div className="grid gap-2">
            {socialLinks.map(s => (
              <div key={s.id} className="flex items-center gap-3 rounded-xl border border-white/[.08] bg-[#11141a] p-4">
                <LinkIcon size={16} className="text-[#f4a56b]" />
                <div className="flex-1"><p className="m-0 text-sm font-bold">{s.label}</p><p className="m-0 text-xs text-[#858b92]">{s.platform} · {s.url}</p></div>
                <button onClick={() => removeSocial(s.id)} className="text-red-400 hover:opacity-80"><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Targets Admin ────────────────────────────────────────────────────────────
function TargetsAdmin({ rates, setRates }: { rates: Rate[]; setRates: (v: Rate[]) => void }) {
  const [form, setForm] = useState({ label: '', target_amount: '', salary_amount: '' });

  const addRate = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.label || !form.target_amount || !form.salary_amount) return;
    const rate = { id: `rate-${Date.now()}`, label: form.label, target_amount: Number(form.target_amount), salary_amount: Number(form.salary_amount) };
    setRates([...rates, rate]);
    setForm({ label: '', target_amount: '', salary_amount: '' });
    if (supabase) {
      const { error } = await supabase.from('target_rates').insert({ label: rate.label, target_amount: rate.target_amount, salary_amount: rate.salary_amount, sort_order: rates.length, is_active: true });
      if (error) console.error('add rate failed', error);
    }
  };

  const removeRate = async (id: string) => {
    setRates(rates.filter(r => r.id !== id));
    if (supabase) {
      const { error } = await supabase.from('target_rates').delete().eq('id', id);
      if (error) console.error('delete rate failed', error);
    }
  };

  return (
    <div>
      <SectionTitle title="إدارة التارجت والراتب" description="أضف وعدّل مستويات التارجت والراتب المتوقع. تظهر هذه المستويات في صفحة احسب تارجتك." />
      <form onSubmit={addRate} className="mb-5 grid gap-2 rounded-2xl border border-[#60432f] bg-[#1c1512] p-4 sm:grid-cols-[1fr_1fr_1fr_auto]">
        <input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} className="input-field" placeholder="اسم المستوى (مثال: البداية)" />
        <input value={form.target_amount} onChange={e => setForm({ ...form, target_amount: e.target.value })} type="number" className="input-field" dir="ltr" placeholder="قيمة التارجت" />
        <input value={form.salary_amount} onChange={e => setForm({ ...form, salary_amount: e.target.value })} type="number" className="input-field" dir="ltr" placeholder="الراتب ($)" />
        <button className="button-primary"><Plus size={16} />إضافة</button>
      </form>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rates.map(rate => (
          <div key={rate.id} className="flex items-center justify-between rounded-2xl border border-white/[.08] bg-[#11141a] p-5">
            <div>
              <p className="m-0 text-xs font-bold text-[#f4a56b]">{rate.label}</p>
              <p className="m-0 mt-2 text-2xl font-black">{rate.target_amount.toLocaleString('en-US')}</p>
              <p className="m-0 text-xs text-[#9b9da2]">راتب {rate.salary_amount.toLocaleString('en-US')} $</p>
            </div>
            <button onClick={() => removeRate(rate.id)} className="text-red-400 hover:opacity-80"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Settings Admin ───────────────────────────────────────────────────────────
function SettingsAdmin({ siteSettings, setSiteSettings }: { siteSettings: SiteSettings; setSiteSettings: (v: SiteSettings) => void }) {
  const [form, setForm] = useState(siteSettings);
  const [saved, setSaved] = useState(false);

  const saveSettings = async (e: FormEvent) => {
    e.preventDefault();
    setSiteSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    if (supabase) {
      const entries: { key: keyof SiteSettings; value: string }[] = [
        { key: 'admin_username', value: form.admin_username },
        { key: 'admin_password', value: form.admin_password },
        { key: 'support_whatsapp', value: form.support_whatsapp },
        { key: 'support_telegram', value: form.support_telegram },
      ];
      for (const entry of entries) {
        const { error } = await supabase.from('site_settings').upsert({ key: entry.key, value: entry.value });
        if (error) console.error('update setting failed', entry.key, error);
      }
    }
  };

  return (
    <div>
      <SectionTitle title="إعدادات الموقع" description="عدّل بيانات حساب الإدارة وروابط الدعم عبر واتساب وتيليجرام." />
      <form onSubmit={saveSettings} className="grid gap-5">
        <div className="rounded-2xl border border-[#60432f] bg-[#1c1512] p-5">
          <h3 className="m-0 mb-4 font-bold text-[#f4a56b]">حساب الإدارة</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="field-label">اسم المستخدم</label>
              <input value={form.admin_username} onChange={e => setForm({ ...form, admin_username: e.target.value })} className="input-field" dir="ltr" placeholder="admin" />
            </div>
            <div>
              <label className="field-label">كلمة المرور</label>
              <input value={form.admin_password} onChange={e => setForm({ ...form, admin_password: e.target.value })} type="password" className="input-field" dir="ltr" placeholder="••••••••" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[#60432f] bg-[#1c1512] p-5">
          <h3 className="m-0 mb-4 font-bold text-[#f4a56b]">روابط الدعم</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="field-label">رابط واتساب</label>
              <input value={form.support_whatsapp} onChange={e => setForm({ ...form, support_whatsapp: e.target.value })} className="input-field" dir="ltr" placeholder="https://wa.me/..." />
            </div>
            <div>
              <label className="field-label">رابط تيليجرام</label>
              <input value={form.support_telegram} onChange={e => setForm({ ...form, support_telegram: e.target.value })} className="input-field" dir="ltr" placeholder="https://t.me/..." />
            </div>
          </div>
          <p className="m-0 mt-3 text-xs text-[#858b92]">تظهر هذه الروابط كأزرار تواصل في الصفحة الرئيسية.</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" className="button-primary"><ShieldCheck size={16} />حفظ الإعدادات</button>
          {saved && <span className="text-sm text-green-400">تم الحفظ بنجاح</span>}
        </div>
      </form>
    </div>
  );
}

// ─── Requests Admin ───────────────────────────────────────────────────────────
function RequestsAdmin({ registrations, setRegistrations, mediators }: Pick<Props, 'registrations' | 'setRegistrations' | 'mediators'>) {
  const [query, setQuery] = useState('');
  const pending = registrations.filter(r => r.status === 'pending');
  const filtered = pending.filter(r => r.full_name.includes(query));

  const approve = async (id: string) => {
    const reg = registrations.find(r => r.id === id);
    if (!reg) return;
    const now = new Date();
    let patch: Partial<Registration> = { status: 'active' };
    if (reg.mediator_id) {
      const mediator = mediators.find(m => m.id === reg.mediator_id);
      if (mediator) {
        const days = mediator.commission === '50%' ? 30 : 60;
        const expiry = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        patch = { ...patch, activation_date: now.toISOString(), expiry_date: expiry.toISOString() };
      }
    }
    setRegistrations(registrations.map(r => r.id === id ? { ...r, ...patch } : r));
    if (supabase) {
      const { error } = await supabase.from('registrations').update(patch).eq('id', id);
      if (error) console.error('approve registration failed', error);
    }
  };

  const reject = async (id: string) => {
    setRegistrations(registrations.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    if (supabase) {
      const { error } = await supabase.from('registrations').update({ status: 'rejected' }).eq('id', id);
      if (error) console.error('reject registration failed', error);
    }
  };

  return (
    <div>
      <SectionTitle title="الطلبات المعلقة" description="راجع طلبات الانضمام وفعّل الحسابات الجديدة. يتم حساب تاريخ الانتهاء تلقائياً حسب نسبة عمولة الوسيط." />
      <div className="relative mb-5">
        <Search size={17} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737983]" />
        <input value={query} onChange={e => setQuery(e.target.value)} className="input-field pr-11" placeholder="ابحث بالاسم..." />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/[.08] bg-[#11141a]">
        <table className="w-full min-w-[640px] text-right text-sm">
          <thead><tr className="border-b border-white/10 text-xs text-[#737981]"><th className="p-4">الاسم</th><th className="p-4">النوع</th><th className="p-4">الدولة</th><th className="p-4">الهاتف</th><th className="p-4">الإجراء</th></tr></thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-sm text-[#858b92]">لا يوجد طلبات معلقة</td></tr>}
            {filtered.map(r => (
              <tr key={r.id} className="border-b border-white/[.06] last:border-0">
                <td className="p-4 font-bold">{r.full_name}</td>
                <td className="p-4"><RoleBadge role={r.role} /></td>
                <td className="p-4 text-xs text-[#9ca0a5]">{r.country}</td>
                <td className="p-4 text-xs text-[#9ca0a5]">{r.phone_code} {r.phone_number}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => approve(r.id)} className="flex items-center gap-1 rounded-lg bg-green-500/15 px-3 py-1.5 text-xs font-bold text-green-400 hover:bg-green-500/25"><CheckCircle size={13} />تفعيل</button>
                  <button onClick={() => reject(r.id)} className="flex items-center gap-1 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/20"><X size={13} />رفض</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Admin Login ──────────────────────────────────────────────────────────────
function AdminLogin({ siteSettings, onLogin }: { siteSettings: SiteSettings; onLogin: () => void }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (form.username === siteSettings.admin_username && form.password === siteSettings.admin_password) { setError(false); onLogin(); }
    else setError(true);
  };
  return (
    <main className="min-h-[700px] bg-[#0b0e13] py-24">
      <div className="mx-auto max-w-md px-5">
        <div className="mb-8 text-center">
          <div className="mx-auto h-16 w-16 overflow-hidden rounded-2xl border border-[#8b654b] bg-[#30231b]">
            <img src="/0a3e789f-716c-4251-9569-7f98ecab5ee9.jpg" alt="Shadow" className="h-full w-full object-cover" />
          </div>
          <div className="section-eyebrow mt-6">بوابة الإدارة</div>
          <h1 className="section-title mt-2 !text-4xl">دخول آمن</h1>
          <p className="mt-3 text-sm text-[#858b92]">إدارة المحتوى والطلبات والوكالات</p>
        </div>
        <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-[#12151b] p-7">
          <label className="field-label">اسم المستخدم</label>
          <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="input-field" dir="ltr" placeholder="admin" />
          <label className="field-label mt-5">كلمة المرور</label>
          <input value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} type="password" className="input-field" dir="ltr" placeholder="••••••••" />
          {error && <p className="mt-4 text-sm text-[#ed9085]">بيانات الدخول غير صحيحة.</p>}
          <button className="button-primary mt-7 w-full">دخول الإدارة <ArrowLeft size={17} /></button>
        </form>
      </div>
    </main>
  );
}

// ─── Main AdminPage ───────────────────────────────────────────────────────────
export default function AdminPage(props: Props) {
  const [tab, setTab] = useState<AdminTab>('overview');
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null);
  const [selectedMediatorId, setSelectedMediatorId] = useState<string | null>(null);

  if (!props.isAdmin) return <AdminLogin siteSettings={props.siteSettings} onLogin={() => props.setIsAdmin(true)} />;

  const changeTab = (t: AdminTab) => { setTab(t); setSelectedAgencyId(null); setSelectedMediatorId(null); };

  const updateRegistration = (id: string, patch: Partial<Registration>) => {
    props.setRegistrations(props.registrations.map(r => r.id === id ? { ...r, ...patch } : r));
    if (supabase) {
      supabase.from('registrations').update(patch).eq('id', id).then(({ error }) => {
        if (error) console.error('update registration failed', error);
      });
    }
  };

  const deleteRegistration = (id: string) => {
    props.setRegistrations(props.registrations.filter(r => r.id !== id));
    if (supabase) {
      supabase.from('registrations').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('delete registration failed', error);
      });
    }
  };

  const updateMediator = (id: string, patch: Partial<Mediator>) => {
    props.setMediators(props.mediators.map(m => m.id === id ? { ...m, ...patch } : m));
    if (supabase) {
      supabase.from('mediators').update(patch).eq('id', id).then(({ error }) => {
        if (error) console.error('update mediator failed', error);
      });
    }
  };

  const selectedAgency = props.agencies.find(a => a.id === selectedAgencyId);
  const selectedMediator = props.mediators.find(m => m.id === selectedMediatorId);

  const sidebarItems: { id: AdminTab; label: string; icon: typeof Users }[] = [
    { id: 'overview', label: 'النظرة العامة', icon: LayoutDashboard },
    { id: 'requests', label: 'الطلبات المعلقة', icon: Bell },
    { id: 'agencies', label: 'الوكالات', icon: Users },
    { id: 'mediators', label: 'الوسطاء', icon: WalletCards },
    { id: 'homepage', label: 'الصفحة الرئيسية', icon: Star },
    { id: 'targets', label: 'التارجت والراتب', icon: Target },
    { id: 'settings', label: 'الإعدادات', icon: SettingsIcon },
  ];

  return (
    <main className="min-h-[700px] bg-[#0b0e13] py-10">
      <div className="container-wide">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <div className="section-eyebrow">Shadow control center</div>
            <h1 className="section-title !text-4xl">لوحة الإدارة</h1>
          </div>
          <button onClick={() => props.setIsAdmin(false)} className="button-outline !px-4 !py-2.5">تسجيل الخروج <ArrowRight size={16} /></button>
        </div>
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <aside className="h-fit rounded-2xl border border-white/[.08] bg-[#11141a] p-3">
            <div className="mb-4 flex items-center gap-3 border-b border-white/[.08] px-3 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ed9e65]/15 text-[#ed9e65]"><ShieldCheck size={19} /></div>
              <div><p className="m-0 text-sm font-bold">{props.siteSettings.admin_username}</p><p className="m-0 text-[10px] text-[#7e858c]">مسؤول النظام</p></div>
            </div>
            {sidebarItems.map(item => (
              <button key={item.id} onClick={() => changeTab(item.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-right text-sm font-bold transition ${tab === item.id ? 'bg-[#ed9e65] text-[#19120f]' : 'text-[#969ba2] hover:bg-white/5 hover:text-white'}`}>
                <item.icon size={17} />
                {item.label}
                {item.id === 'requests' && props.registrations.filter(r => r.status === 'pending').length > 0 && (
                  <span className="mr-auto rounded-full bg-[#ed9e65]/15 px-2 py-0.5 text-[10px] text-[#f1a36e]">{props.registrations.filter(r => r.status === 'pending').length}</span>
                )}
              </button>
            ))}
          </aside>
          <section>
            {tab === 'overview' && <AdminOverview agencies={props.agencies} members={props.members} registrations={props.registrations} mediators={props.mediators} />}
            {tab === 'requests' && <RequestsAdmin registrations={props.registrations} setRegistrations={props.setRegistrations} mediators={props.mediators} />}
            {tab === 'agencies' && !selectedAgencyId && <AgenciesAdmin agencies={props.agencies} setAgencies={props.setAgencies} onSelectAgency={setSelectedAgencyId} />}
            {tab === 'agencies' && selectedAgencyId && selectedAgency && (
              <AgencyDetail
                agency={selectedAgency}
                registrations={props.registrations}
                agencyStaff={props.agencyStaff}
                setAgencyStaff={props.setAgencyStaff}
                onUpdate={updateRegistration}
                onDelete={deleteRegistration}
                onBack={() => setSelectedAgencyId(null)}
              />
            )}
            {tab === 'mediators' && !selectedMediatorId && (
              <MediatorsAdmin
                mediators={props.mediators} setMediators={props.setMediators}
                agencies={props.agencies}
                registrations={props.registrations}
                onSelect={setSelectedMediatorId}
              />
            )}
            {tab === 'mediators' && selectedMediatorId && selectedMediator && (
              <MediatorDetail
                mediator={selectedMediator}
                agencies={props.agencies}
                registrations={props.registrations}
                onBack={() => setSelectedMediatorId(null)}
                onUpdate={updateMediator}
              />
            )}
            {tab === 'homepage' && (
              <HomepageEditor
                members={props.members} setMembers={props.setMembers}
                testimonials={props.testimonials} setTestimonials={props.setTestimonials}
                videoLinks={props.videoLinks} setVideoLinks={props.setVideoLinks}
                socialLinks={props.socialLinks} setSocialLinks={props.setSocialLinks}
              />
            )}
            {tab === 'targets' && <TargetsAdmin rates={props.rates} setRates={props.setRates} />}
            {tab === 'settings' && <SettingsAdmin siteSettings={props.siteSettings} setSiteSettings={props.setSiteSettings} />}
          </section>
        </div>
      </div>
    </main>
  );
}
