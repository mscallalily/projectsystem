import React, { useState } from 'react';
import {
  Shield, Home, ParkingSquare, Clock, Bell, User, QrCode, Car,
  ChevronRight, LogOut, Smartphone, Eye, EyeOff, LogIn, UserPlus,
  CheckCircle, AlertTriangle, Info, MapPin, ArrowLeft, Settings,
  Activity, CreditCard, X, Menu
} from 'lucide-react';
import { ZONE_CAPACITY, MOCK_RFID_EVENTS, MOCK_NOTIFS } from '../data/mock';

type MobileScreen = 'welcome' | 'login' | 'register' | 'home' | 'parking' | 'history' | 'notifications' | 'profile' | 'qr' | 'guest-home';
type MobileRole = 'student' | 'faculty' | 'employee' | 'security' | 'parking_admin' | 'guest' | null;

interface MobileUser { name: string; role: MobileRole; email: string; }

// Simulated mobile accounts (same as desktop)
const MOBILE_ACCOUNTS: Record<string, MobileUser> = {
  'student@pass.edu': { name: 'Maria Santos', role: 'student', email: 'student@pass.edu' },
  'faculty@pass.edu': { name: 'Juan dela Cruz', role: 'faculty', email: 'faculty@pass.edu' },
  'security@pass.edu': { name: 'Liza Gonzales', role: 'security', email: 'security@pass.edu' },
  'parking@pass.edu': { name: 'Parking Admin', role: 'parking_admin', email: 'parking@pass.edu' },
  'guest@pass.edu': { name: 'John Smith', role: 'guest', email: 'guest@pass.edu' },
};

function MobileFrame({ children, bg = 'bg-[#F0F6FC]' }: { children: React.ReactNode; bg?: string }) {
  return (
    <div className={`h-full ${bg} overflow-y-auto`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {children}
    </div>
  );
}

function WelcomeScreen({ onLogin, onRegister, onGuest }: { onLogin: () => void; onRegister: () => void; onGuest: () => void }) {
  return (
    <MobileFrame bg="bg-gradient-to-b from-[#123B6D] to-[#2563EB]">
      <div className="flex flex-col items-center justify-center min-h-full px-8 py-12 text-white text-center">
        <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-6 border border-white/20">
          <Shield size={40} className="text-[#38BDF8]" />
        </div>
        <h1 className="text-3xl font-bold mb-1">PASS</h1>
        <p className="text-blue-200 text-sm mb-2">Parking Access & Security System</p>
        <p className="text-blue-300 text-xs mb-12">Mobile App</p>

        <div className="w-full space-y-3">
          <button onClick={onLogin}
            className="w-full py-4 bg-white text-[#123B6D] font-bold rounded-2xl hover:bg-blue-50 active:scale-95 transition-all flex items-center justify-center gap-2">
            <LogIn size={20} /> Sign In
          </button>
          <button onClick={onRegister}
            className="w-full py-4 bg-[#38BDF8]/20 border border-[#38BDF8]/30 text-white font-bold rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2">
            <UserPlus size={20} /> Create Account
          </button>
          <button onClick={onGuest}
            className="w-full py-3 text-blue-300 text-sm font-medium active:opacity-70 transition-opacity">
            Continue as Guest
          </button>
        </div>

        <p className="text-blue-400 text-xs mt-10 leading-relaxed max-w-xs">
          Sign in to access your parking dashboard, view slot availability, and manage your QR pass.
        </p>
      </div>
    </MobileFrame>
  );
}

function LoginScreen({ onBack, onSuccess }: { onBack: () => void; onSuccess: (user: MobileUser) => void }) {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const DEMOS = [
    { label: 'Student', email: 'student@pass.edu' },
    { label: 'Faculty', email: 'faculty@pass.edu' },
    { label: 'Security', email: 'security@pass.edu' },
    { label: 'Guest', email: 'guest@pass.edu' },
  ];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    const found = MOBILE_ACCOUNTS[email.toLowerCase()];
    if (found) {
      onSuccess(found);
    } else {
      setError('Invalid credentials. Try a demo account below.');
    }
  };

  return (
    <MobileFrame bg="bg-white">
      <div className="px-6 py-8">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[#2563EB] text-sm mb-6 font-medium">
          <ArrowLeft size={18} /> Back
        </button>
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#123B6D] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#123B6D]">Sign In</h2>
          <p className="text-slate-400 text-sm mt-1">PASS Mobile</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm mb-5 flex gap-2">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />{error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Email or ID</label>
            <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@university.edu"
              className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Password</label>
            <div className="relative">
              <input type={showPwd ? 'text' : 'password'} value={pwd} onChange={e => setPwd(e.target.value)} placeholder="••••••••"
                className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-sm pr-12 focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
              <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading || !email}
            className="w-full py-4 bg-[#2563EB] text-white font-bold rounded-xl disabled:opacity-50 active:scale-95 transition-all">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center mb-3">Demo accounts</p>
          <div className="grid grid-cols-4 gap-2">
            {DEMOS.map(d => (
              <button key={d.email} onClick={() => setEmail(d.email)}
                className="text-xs py-2 px-1 rounded-xl bg-blue-50 text-[#2563EB] font-medium text-center">
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}

function RegisterScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', type: 'student' });

  if (submitted) return (
    <MobileFrame bg="bg-white">
      <div className="px-6 py-12 text-center flex flex-col items-center justify-center min-h-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-5">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-[#123B6D] mb-2">Account Created!</h2>
        <p className="text-slate-500 text-sm mb-8">Your registration is pending admin approval. Sign in once approved.</p>
        <button onClick={onDone} className="w-full py-4 bg-[#2563EB] text-white font-bold rounded-xl">Go to Sign In</button>
      </div>
    </MobileFrame>
  );

  return (
    <MobileFrame bg="bg-white">
      <div className="px-6 py-8">
        <button onClick={step === 0 ? onBack : () => setStep(0)} className="flex items-center gap-1.5 text-[#2563EB] text-sm mb-6 font-medium">
          <ArrowLeft size={18} /> Back
        </button>
        <h2 className="text-2xl font-bold text-[#123B6D] mb-1">Create Account</h2>
        <p className="text-slate-400 text-sm mb-6">Step {step + 1} of 2</p>
        <div className="flex gap-2 mb-8">
          {[0, 1].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-[#2563EB]' : 'bg-slate-100'}`} />)}
        </div>

        {step === 0 && (
          <div className="space-y-4">
            <div><label className="text-sm font-medium text-slate-700 block mb-1.5">Full Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Juan dela Cruz"
                className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" /></div>
            <div><label className="text-sm font-medium text-slate-700 block mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="juan@university.edu"
                className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" /></div>
            <div><label className="text-sm font-medium text-slate-700 block mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••"
                className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" /></div>
            <button onClick={() => setStep(1)} disabled={!form.name || !form.email || !form.password}
              className="w-full py-4 bg-[#2563EB] text-white font-bold rounded-xl disabled:opacity-50">Continue</button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                {['student', 'faculty', 'employee', 'guest'].map(t => (
                  <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                    className={`py-3 rounded-xl border-2 text-sm font-medium capitalize ${form.type === t ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]' : 'border-slate-200 text-slate-500'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <select className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white">
              <option value="">Select Department</option>
              {['College of Engineering', 'College of Science', 'College of Business', 'HR Department'].map(d => <option key={d}>{d}</option>)}
            </select>
            <input placeholder="Contact Number: 09XX XXX XXXX" className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
            <button onClick={() => setSubmitted(true)} className="w-full py-4 bg-green-600 text-white font-bold rounded-xl">Submit Registration</button>
          </div>
        )}
      </div>
    </MobileFrame>
  );
}

// Role-based home screens
function HomeScreen({ user, onNavigate, onLogout }: { user: MobileUser; onNavigate: (s: MobileScreen) => void; onLogout: () => void }) {
  const isGuest = user.role === 'guest';
  const isSecurity = user.role === 'security';
  const isParkingAdmin = user.role === 'parking_admin';

  if (isGuest) {
    return (
      <MobileFrame bg="bg-[#F0F6FC]">
        <div className="bg-[#123B6D] px-5 pt-8 pb-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-blue-300 text-sm">Welcome, Guest!</p>
              <h2 className="text-white font-bold text-xl">{user.name}</h2>
            </div>
            <div className="bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs px-2 py-1 rounded-full">Guest</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-3">
            <Info size={18} className="text-[#38BDF8]" />
            <p className="text-blue-200 text-xs leading-relaxed flex-1">Guest accounts have limited access. Show your QR pass at the campus gate.</p>
          </div>
        </div>
        <div className="px-5 -mt-4 space-y-4">
          <button onClick={() => onNavigate('qr')} className="w-full bg-gradient-to-r from-[#2563EB] to-[#123B6D] text-white rounded-2xl p-5 flex items-center justify-between shadow-lg active:scale-95 transition-all">
            <div className="flex items-center gap-3">
              <QrCode size={28} />
              <div className="text-left"><p className="font-bold">My QR Pass</p><p className="text-blue-200 text-xs">Valid Today</p></div>
            </div>
            <ChevronRight size={20} />
          </button>
          <button onClick={() => onNavigate('parking')} className="w-full bg-white rounded-2xl p-5 flex items-center justify-between border border-blue-100 shadow-sm active:scale-95 transition-all">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><MapPin size={18} className="text-[#2563EB]" /></div>
              <div><p className="font-semibold text-slate-700">Parking Availability</p><p className="text-xs text-slate-400">View available slots</p></div>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
        </div>
      </MobileFrame>
    );
  }

  if (isSecurity) {
    return (
      <MobileFrame bg="bg-[#F0F6FC]">
        <div className="bg-[#123B6D] px-5 pt-8 pb-10">
          <p className="text-blue-300 text-sm">Security Personnel</p>
          <h2 className="text-white font-bold text-xl">{user.name}</h2>
          <p className="text-blue-300 text-sm mt-1">Gate Security Operations</p>
        </div>
        <div className="px-5 -mt-4 grid grid-cols-2 gap-3">
          {[
            { label: 'RFID Auth', icon: <CreditCard size={22} />, color: 'bg-blue-500' },
            { label: 'QR Verify', icon: <QrCode size={22} />, color: 'bg-green-500' },
            { label: 'Gate Ops', icon: <Car size={22} />, color: 'bg-amber-500' },
            { label: 'Entry Monitor', icon: <Activity size={22} />, color: 'bg-purple-500' },
          ].map(a => (
            <button key={a.label} className={`${a.color} text-white rounded-2xl p-5 flex flex-col items-center gap-2 shadow active:scale-95 transition-all`}>
              {a.icon}
              <span className="text-sm font-semibold">{a.label}</span>
            </button>
          ))}
        </div>
        <div className="px-5 mt-4">
          <div className="bg-white rounded-2xl border border-blue-100 p-4">
            <p className="font-semibold text-slate-700 mb-3 text-sm">Today's Stats</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div><p className="text-2xl font-bold text-green-600">127</p><p className="text-xs text-slate-400">Entries</p></div>
              <div><p className="text-2xl font-bold text-blue-600">89</p><p className="text-xs text-slate-400">Exits</p></div>
              <div><p className="text-2xl font-bold text-red-600">3</p><p className="text-xs text-slate-400">Denied</p></div>
            </div>
          </div>
        </div>
      </MobileFrame>
    );
  }

  if (isParkingAdmin) {
    return (
      <MobileFrame bg="bg-[#F0F6FC]">
        <div className="bg-[#123B6D] px-5 pt-8 pb-10">
          <p className="text-blue-300 text-sm">Parking Administrator</p>
          <h2 className="text-white font-bold text-xl">{user.name}</h2>
        </div>
        <div className="px-5 -mt-4 grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl border border-blue-100 p-4 col-span-2 grid grid-cols-2 gap-4">
            {[{ label: 'Total Slots', value: '180', color: 'text-[#123B6D]' }, { label: 'Occupied', value: '103', color: 'text-red-500' }, { label: 'Available', value: '77', color: 'text-green-500' }, { label: 'Maintenance', value: '3', color: 'text-amber-500' }].map(s => (
              <div key={s.label} className="text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
          {[
            { label: 'Slot Management', icon: <ParkingSquare size={22} />, color: 'bg-[#2563EB]' },
            { label: 'Occupancy', icon: <Activity size={22} />, color: 'bg-green-500' },
          ].map(a => (
            <button key={a.label} className={`${a.color} text-white rounded-2xl p-5 flex flex-col items-center gap-2 shadow active:scale-95 transition-all`}>
              {a.icon}
              <span className="text-xs font-semibold text-center">{a.label}</span>
            </button>
          ))}
        </div>
      </MobileFrame>
    );
  }

  // Student/Faculty/Employee home
  return (
    <MobileFrame bg="bg-[#F0F6FC]">
      <div className="bg-[#123B6D] px-5 pt-8 pb-12">
        <div className="flex justify-between items-start mb-1">
          <div>
            <p className="text-blue-300 text-sm">Good morning 👋</p>
            <h2 className="text-white font-bold text-xl">{user.name}</h2>
          </div>
          <button onClick={() => onNavigate('notifications')} className="relative p-2 bg-white/10 rounded-xl">
            <Bell size={18} className="text-white" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full" />
          </button>
        </div>
        <div className="bg-white/10 border border-white/20 rounded-2xl p-4 mt-4 flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-xs font-medium">Current Status</p>
            <p className="text-white font-bold">Not Parked</p>
          </div>
          <div className="text-right">
            <p className="text-blue-200 text-xs font-medium">Vehicle</p>
            <p className="text-white font-semibold font-mono">ABC-1234</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-5 space-y-3">
        {/* QR Pass */}
        <button onClick={() => onNavigate('qr')} className="w-full bg-gradient-to-r from-[#38BDF8] to-[#2563EB] text-white rounded-2xl p-5 flex items-center justify-between shadow-lg active:scale-95 transition-all">
          <div className="flex items-center gap-3">
            <QrCode size={28} />
            <div className="text-left"><p className="font-bold text-lg">My QR Pass</p><p className="text-blue-100 text-xs">Tap to view at gate</p></div>
          </div>
          <ChevronRight size={20} />
        </button>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Availability', icon: <ParkingSquare size={20} />, color: 'bg-white', text: 'text-[#2563EB]', screen: 'parking' as MobileScreen },
            { label: 'History', icon: <Clock size={20} />, color: 'bg-white', text: 'text-green-600', screen: 'history' as MobileScreen },
            { label: 'Profile', icon: <User size={20} />, color: 'bg-white', text: 'text-purple-600', screen: 'profile' as MobileScreen },
          ].map(a => (
            <button key={a.label} onClick={() => onNavigate(a.screen)} className={`${a.color} border border-blue-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-all`}>
              <div className={a.text}>{a.icon}</div>
              <span className="text-xs font-semibold text-slate-600">{a.label}</span>
            </button>
          ))}
        </div>

        {/* Parking availability preview */}
        <div className="bg-white rounded-2xl border border-blue-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-slate-700 text-sm">Parking Available</p>
            <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />77 slots
            </span>
          </div>
          <div className="space-y-2.5">
            {ZONE_CAPACITY.slice(0, 3).map(z => {
              const free = z.capacity - z.occupied;
              return (
                <div key={z.zone} className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-400 w-12">{z.zone}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${free < 5 ? 'bg-red-500' : free < 15 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${(free / z.capacity) * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-600 w-8 text-right">{free}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl border border-blue-100 p-4 shadow-sm">
          <p className="font-semibold text-slate-700 text-sm mb-3">Recent Activity</p>
          <div className="space-y-2">
            {[{ date: 'Sep 1', entry: '7:32 AM', exit: '5:45 PM', duration: '10h 13m' }, { date: 'Aug 30', entry: '8:10 AM', exit: '6:00 PM', duration: '9h 50m' }].map((h, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50">
                <div><p className="text-sm font-medium text-slate-700">{h.date}</p><p className="text-xs text-slate-400">{h.entry} → {h.exit}</p></div>
                <span className="text-sm font-bold text-[#2563EB]">{h.duration}</span>
              </div>
            ))}
          </div>
          <button onClick={() => onNavigate('history')} className="text-xs text-[#2563EB] font-semibold mt-2">View all history →</button>
        </div>
      </div>
      <div className="h-24" />
    </MobileFrame>
  );
}

function ParkingScreen() {
  return (
    <MobileFrame bg="bg-[#F0F6FC]">
      <div className="px-5 pt-6 pb-4">
        <h2 className="text-xl font-bold text-[#123B6D]">Parking Availability</h2>
        <p className="text-sm text-slate-400">Live slot status</p>
      </div>

      <div className="mx-5 bg-gradient-to-r from-[#123B6D] to-[#2563EB] rounded-2xl p-5 text-white mb-5 shadow-lg">
        <p className="text-blue-200 text-xs font-medium">Total Available Now</p>
        <p className="text-5xl font-bold text-[#38BDF8]">77</p>
        <p className="text-blue-200 text-sm">of 180 total slots</p>
        <p className="text-xs text-blue-300 mt-2 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          Last updated just now
        </p>
      </div>

      <div className="px-5 space-y-3 mb-5">
        {ZONE_CAPACITY.map(z => {
          const free = z.capacity - z.occupied;
          const pct = (free / z.capacity) * 100;
          return (
            <div key={z.zone} className="bg-white rounded-2xl border border-blue-100 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-slate-700">{z.zone}</p>
                <span className={`text-lg font-bold ${free < 5 ? 'text-red-500' : free < 15 ? 'text-amber-500' : 'text-green-500'}`}>{free} free</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${free < 5 ? 'bg-red-500' : free < 15 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                <span>{z.occupied} occupied</span>
                <span>{z.reserved} reserved</span>
                <span>{z.capacity} total</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 mb-5">
        <div className="bg-white rounded-2xl border border-blue-100 p-4">
          <p className="font-semibold text-slate-700 text-sm mb-3">Filter by Vehicle Type</p>
          <div className="flex gap-2 flex-wrap">
            {['All', 'Sedan', 'SUV', 'Motorcycle', 'Van'].map(t => (
              <button key={t} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${t === 'All' ? 'bg-[#2563EB] text-white border-[#2563EB]' : 'border-slate-200 text-slate-500'}`}>{t}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="h-24" />
    </MobileFrame>
  );
}

function HistoryScreen() {
  const sessions = [
    { date: 'Sep 1, 2024', entry: '7:32 AM', exit: '5:45 PM', zone: 'Zone A', plate: 'ABC-1234', duration: '10h 13m', method: 'RFID' },
    { date: 'Aug 30, 2024', entry: '8:10 AM', exit: '6:00 PM', zone: 'Zone B', plate: 'ABC-1234', duration: '9h 50m', method: 'RFID' },
    { date: 'Aug 28, 2024', entry: '7:55 AM', exit: '4:30 PM', zone: 'Zone A', plate: 'ABC-1234', duration: '8h 35m', method: 'RFID' },
    { date: 'Aug 26, 2024', entry: '9:00 AM', exit: '3:00 PM', zone: 'Zone C', plate: 'ABC-1234', duration: '6h 00m', method: 'RFID' },
  ];

  return (
    <MobileFrame bg="bg-[#F0F6FC]">
      <div className="px-5 pt-6 pb-4">
        <h2 className="text-xl font-bold text-[#123B6D]">Parking History</h2>
        <p className="text-sm text-slate-400">ABC-1234 — Toyota Vios</p>
      </div>
      <div className="px-5 mb-4">
        <input type="search" placeholder="Search by date..." className="w-full bg-white border border-blue-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] shadow-sm" />
      </div>
      <div className="px-5 space-y-3">
        {sessions.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-blue-100 p-4 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-bold text-slate-700">{s.date}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.zone} · {s.method}</p>
              </div>
              <span className="text-[#2563EB] font-bold text-sm">{s.duration}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs mt-3 text-slate-500">
              <div><p className="text-slate-300">Entry</p><p className="font-semibold text-slate-600">{s.entry}</p></div>
              <div><p className="text-slate-300">Exit</p><p className="font-semibold text-slate-600">{s.exit}</p></div>
              <div><p className="text-slate-300">Plate</p><p className="font-semibold font-mono text-[#123B6D]">{s.plate}</p></div>
            </div>
          </div>
        ))}
      </div>
      <div className="h-24" />
    </MobileFrame>
  );
}

function NotificationScreen() {
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);
  const unread = notifs.filter(n => !n.read).length;

  return (
    <MobileFrame bg="bg-[#F0F6FC]">
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#123B6D]">Notifications</h2>
          {unread > 0 && <p className="text-sm text-slate-400">{unread} unread</p>}
        </div>
        {unread > 0 && (
          <button onClick={() => setNotifs(n => n.map(i => ({ ...i, read: true })))} className="text-xs text-[#2563EB] font-semibold">Mark all read</button>
        )}
      </div>
      <div className="px-5 space-y-3">
        {notifs.map(n => (
          <div key={n.id} onClick={() => setNotifs(ns => ns.map(i => i.id === n.id ? { ...i, read: true } : i))}
            className={`bg-white rounded-2xl border p-4 shadow-sm cursor-pointer active:scale-[0.98] transition-all ${!n.read ? 'border-blue-300 bg-blue-50/30' : 'border-blue-100'}`}>
            <div className="flex items-start justify-between gap-2">
              <p className={`text-sm font-semibold ${n.read ? 'text-slate-500' : 'text-slate-800'}`}>{n.title}</p>
              {!n.read && <span className="w-2 h-2 bg-[#2563EB] rounded-full mt-1.5 shrink-0" />}
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.body}</p>
            <p className="text-xs text-slate-300 mt-2">{n.time}</p>
          </div>
        ))}
      </div>
      <div className="h-24" />
    </MobileFrame>
  );
}

function QRPassScreen({ user }: { user: MobileUser }) {
  const isGuest = user.role === 'guest';
  return (
    <MobileFrame bg="bg-[#F0F6FC]">
      <div className="px-5 pt-6 pb-4">
        <h2 className="text-xl font-bold text-[#123B6D]">My QR Pass</h2>
        <p className="text-sm text-slate-400">Show at campus gate</p>
      </div>
      <div className="px-5">
        <div className="bg-gradient-to-br from-[#123B6D] via-[#1E4F8A] to-[#2563EB] rounded-3xl p-6 text-white shadow-2xl">
          <div className="flex items-center gap-2 mb-5">
            <Shield size={18} className="text-[#38BDF8]" />
            <div>
              <p className="text-xs text-blue-200 font-medium">PASS — {isGuest ? 'Visitor' : 'Campus'} QR Access Pass</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-blue-300 text-xs mt-0.5">{isGuest ? 'Guest Account' : `${user.role} — ${user.email}`}</p>
          <div className="my-6 bg-white rounded-2xl p-4 flex items-center justify-center">
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 49 }).map((_, i) => (
                <div key={i} className={`w-5 h-5 rounded-sm ${[0,1,2,3,4,5,6,7,14,21,28,35,42,43,44,45,46,47,48,16,17,18,19,24,25].includes(i) ? 'bg-[#123B6D]' : 'bg-white'}`} />
              ))}
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-300">Valid Until</span>
              <span className="font-semibold">Today, 11:59 PM</span>
            </div>
            {!isGuest && (
              <div className="flex justify-between">
                <span className="text-blue-300">Vehicle</span>
                <span className="font-semibold font-mono">ABC-1234</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-blue-300">Access</span>
              <span className="font-semibold">{isGuest ? 'Visitor Zone' : 'All Zones'}</span>
            </div>
          </div>
          <p className="text-[10px] text-blue-400 text-center mt-5 border-t border-white/10 pt-4">
            Present this QR code at the campus entrance gate
          </p>
        </div>
        <button className="w-full mt-4 py-3.5 border border-[#2563EB] text-[#2563EB] font-semibold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all">
          <QrCode size={18} /> Refresh QR Pass
        </button>
      </div>
      <div className="h-24" />
    </MobileFrame>
  );
}

function ProfileScreen({ user, onLogout }: { user: MobileUser; onLogout: () => void }) {
  return (
    <MobileFrame bg="bg-[#F0F6FC]">
      <div className="bg-[#123B6D] px-5 pt-8 pb-12">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#38BDF8]/20 border-2 border-[#38BDF8]/30 flex items-center justify-center text-3xl font-bold text-white mb-3">
            {user.name[0]}
          </div>
          <h2 className="text-white font-bold text-xl">{user.name}</h2>
          <p className="text-blue-300 text-sm">{user.email}</p>
          <span className="mt-2 bg-[#38BDF8]/20 text-[#38BDF8] text-xs px-3 py-1 rounded-full font-medium capitalize">{user.role?.replace('_', ' ')}</span>
        </div>
      </div>
      <div className="px-5 -mt-4 space-y-3">
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
          {[
            { label: 'Edit Profile', icon: <User size={18} /> },
            { label: 'My Vehicles', icon: <Car size={18} /> },
            { label: 'RFID Card', icon: <CreditCard size={18} /> },
            { label: 'Notifications', icon: <Bell size={18} /> },
            { label: 'Settings', icon: <Settings size={18} /> },
          ].map((item, i) => (
            <button key={item.label} className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-blue-50/50 active:bg-blue-50 transition-colors text-left ${i > 0 ? 'border-t border-slate-50' : ''}`}>
              <span className="text-[#2563EB]">{item.icon}</span>
              <span className="text-sm font-medium text-slate-700 flex-1">{item.label}</span>
              <ChevronRight size={16} className="text-slate-300" />
            </button>
          ))}
        </div>
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 border border-red-200 text-red-600 font-semibold rounded-2xl active:scale-95 transition-all">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
      <div className="h-24" />
    </MobileFrame>
  );
}

// Bottom nav tabs based on role
function getNavItems(role: MobileRole) {
  if (role === 'security' || role === 'parking_admin') {
    return [
      { key: 'home', label: 'Dashboard', icon: <Home size={22} /> },
      { key: 'parking', label: 'Parking', icon: <ParkingSquare size={22} /> },
      { key: 'notifications', label: 'Alerts', icon: <Bell size={22} /> },
      { key: 'profile', label: 'Profile', icon: <User size={22} /> },
    ];
  }
  if (role === 'guest') {
    return [
      { key: 'home', label: 'Home', icon: <Home size={22} /> },
      { key: 'qr', label: 'QR Pass', icon: <QrCode size={22} /> },
      { key: 'parking', label: 'Parking', icon: <ParkingSquare size={22} /> },
      { key: 'profile', label: 'Profile', icon: <User size={22} /> },
    ];
  }
  return [
    { key: 'home', label: 'Home', icon: <Home size={22} /> },
    { key: 'parking', label: 'Parking', icon: <ParkingSquare size={22} /> },
    { key: 'history', label: 'History', icon: <Clock size={22} /> },
    { key: 'notifications', label: 'Notifs', icon: <Bell size={22} /> },
    { key: 'profile', label: 'Profile', icon: <User size={22} /> },
  ];
}

export default function MobileApp() {
  const [authScreen, setAuthScreen] = useState<'welcome' | 'login' | 'register'>('welcome');
  const [mobileUser, setMobileUser] = useState<MobileUser | null>(null);
  const [activeTab, setActiveTab] = useState<MobileScreen>('home');

  const handleLogin = (user: MobileUser) => {
    setMobileUser(user);
    setActiveTab('home');
  };

  const handleLogout = () => {
    setMobileUser(null);
    setAuthScreen('welcome');
  };

  const handleGuest = () => {
    setMobileUser({ name: 'Guest User', role: 'guest', email: 'guest@pass.edu' });
    setActiveTab('home');
  };

  const navItems = mobileUser ? getNavItems(mobileUser.role) : [];

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to site link */}
        <div className="text-center mb-4">
          <a href="/" className="text-sm text-slate-500 hover:text-[#2563EB] flex items-center justify-center gap-1.5 transition-colors">
            <ArrowLeft size={14} /> Back to PASS Web
          </a>
        </div>

        {/* Phone frame */}
        <div className="relative mx-auto" style={{ width: '375px' }}>
          <div className="bg-slate-800 rounded-[3rem] p-3 shadow-2xl">
            <div className="bg-black rounded-[2.5rem] overflow-hidden" style={{ height: '780px' }}>
              {/* Status bar */}
              <div className="bg-black flex items-center justify-between px-6 py-2 text-white text-xs">
                <span>9:41 AM</span>
                <div className="w-28 h-5 bg-black rounded-full" />
                <div className="flex items-center gap-1 text-[10px]">
                  <span>●●●</span><span>WiFi</span><span>100%</span>
                </div>
              </div>

              {/* App content */}
              <div className="bg-white" style={{ height: mobileUser ? 'calc(780px - 48px - 68px)' : 'calc(780px - 48px)', overflow: 'hidden' }}>
                <div style={{ height: '100%', overflow: 'hidden' }}>
                  {!mobileUser && (
                    <>
                      {authScreen === 'welcome' && <WelcomeScreen onLogin={() => setAuthScreen('login')} onRegister={() => setAuthScreen('register')} onGuest={handleGuest} />}
                      {authScreen === 'login' && <LoginScreen onBack={() => setAuthScreen('welcome')} onSuccess={handleLogin} />}
                      {authScreen === 'register' && <RegisterScreen onBack={() => setAuthScreen('welcome')} onDone={() => setAuthScreen('login')} />}
                    </>
                  )}

                  {mobileUser && (
                    <div style={{ height: '100%', overflowY: 'auto' }}>
                      {activeTab === 'home' && <HomeScreen user={mobileUser} onNavigate={tab => setActiveTab(tab)} onLogout={handleLogout} />}
                      {activeTab === 'parking' && <ParkingScreen />}
                      {activeTab === 'history' && <HistoryScreen />}
                      {activeTab === 'notifications' && <NotificationScreen />}
                      {activeTab === 'qr' && <QRPassScreen user={mobileUser} />}
                      {activeTab === 'profile' && <ProfileScreen user={mobileUser} onLogout={handleLogout} />}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom nav */}
              {mobileUser && (
                <div className="bg-white border-t border-slate-100 flex items-center justify-around px-2" style={{ height: '68px' }}>
                  {navItems.map(item => (
                    <button
                      key={item.key}
                      onClick={() => setActiveTab(item.key as MobileScreen)}
                      className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${activeTab === item.key ? 'text-[#2563EB]' : 'text-slate-300'}`}
                    >
                      {item.icon}
                      <span className="text-[10px] font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Home indicator */}
          <div className="flex justify-center mt-3">
            <div className="w-32 h-1 bg-slate-600 rounded-full" />
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">PASS Mobile — Simulated Web Preview</p>
      </div>
    </div>
  );
}
