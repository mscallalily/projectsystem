import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Check, User, Eye, EyeOff, Info, ChevronRight, Car } from 'lucide-react';

export default function GuestRegisterPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [hasVehicle, setHasVehicle] = useState(false);
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPwd: '',
    plate: '',
    agree: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email || !form.email.includes('@')) e.email = 'Valid email is required';
    if (!form.phone.trim()) e.phone = 'Contact number is required';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPwd) e.confirmPwd = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && form.agree) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F0F6FC] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#123B6D] mb-3">Guest Account Created!</h2>
          <p className="text-slate-500 mb-8">Your guest account has been registered. Sign in to access your guest dashboard and get your temporary QR parking pass.</p>
          <Link to="/login" className="w-full block py-3 bg-[#2563EB] text-white font-semibold rounded-xl hover:bg-[#1D4ED8] transition-colors">
            Go to Login
          </Link>
          <p className="text-xs text-slate-400 mt-4">
            <Link to="/guest" className="hover:text-[#2563EB]">← Back to Guest Page</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F6FC] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#123B6D] rounded-2xl shadow-lg mb-3">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#123B6D]">Guest Registration</h1>
          <p className="text-sm text-slate-500 mt-1">Create a guest account for temporary campus parking access</p>
        </div>

        {/* Guest Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 mb-6">
          <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-700">
            <strong>Guest accounts</strong> provide limited, temporary access. You will receive a QR pass for single-visit parking. For regular campus parking, register with your institutional ID.
          </div>
        </div>

        <form onSubmit={submit} className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 space-y-5">
          {/* Personal Info */}
          <div>
            <h3 className="font-semibold text-[#123B6D] flex items-center gap-2 mb-4"><User size={16} /> Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <input value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="Juan dela Cruz"
                  className={`w-full border ${errors.fullName ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]`} />
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Email Address <span className="text-red-500">*</span></label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="juan@email.com"
                  className={`w-full border ${errors.email ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]`} />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Contact Number <span className="text-red-500">*</span></label>
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="09XX XXX XXXX"
                  className={`w-full border ${errors.phone ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]`} />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Minimum 6 characters"
                    className={`w-full border ${errors.password ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-sm pr-12 focus:outline-none focus:ring-2 focus:ring-[#2563EB]`} />
                  <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                <input type="password" value={form.confirmPwd} onChange={e => set('confirmPwd', e.target.value)} placeholder="Repeat password"
                  className={`w-full border ${errors.confirmPwd ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]`} />
                {errors.confirmPwd && <p className="text-xs text-red-500 mt-1">{errors.confirmPwd}</p>}
              </div>
            </div>
          </div>

          {/* Vehicle (Optional) */}
          <div>
            <h3 className="font-semibold text-[#123B6D] flex items-center gap-2 mb-1">
              <Car size={16} />
              Vehicle
              <span className="text-slate-400 font-normal text-sm">(Optional)</span>
              <span className="relative group cursor-help">
                <Info size={14} className="text-blue-400" />
                <span className="absolute left-6 top-0 hidden group-hover:block bg-slate-800 text-white text-xs rounded-lg px-3 py-2 w-56 z-10 shadow-xl leading-relaxed">
                  Vehicle info is used to generate your temporary QR access pass.
                </span>
              </span>
            </h3>
            <p className="text-xs text-slate-400 mb-3">Provide vehicle details if you'll arrive by car or motorcycle.</p>

            <label className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer mb-3">
              <input type="checkbox" checked={hasVehicle} onChange={e => setHasVehicle(e.target.checked)} className="rounded" />
              I will arrive by vehicle
            </label>

            {hasVehicle && (
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Plate Number</label>
                <input value={form.plate} onChange={e => set('plate', e.target.value)} placeholder="e.g. ABC-1234"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
              </div>
            )}
          </div>

          {/* Agree */}
          <label className="flex items-start gap-3 text-sm text-slate-600 cursor-pointer">
            <input type="checkbox" checked={form.agree} onChange={e => set('agree', e.target.checked)} className="mt-1 rounded" />
            <span>I agree to the PASS <span className="text-[#2563EB]">Terms and Conditions</span> and <span className="text-[#2563EB]">Privacy Notice</span>. I understand this is a temporary guest account.</span>
          </label>

          <button type="submit" disabled={!form.agree}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#2563EB] text-white font-semibold rounded-xl hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronRight size={18} />
            Create Guest Account
          </button>
        </form>

        <div className="text-center mt-5 space-y-2">
          <p className="text-sm text-slate-500">
            Are you a student, faculty, or employee?{' '}
            <Link to="/register" className="text-[#2563EB] font-semibold hover:underline">Register with your institutional ID →</Link>
          </p>
          <p className="text-sm text-slate-400">
            Already have an account? <Link to="/login" className="text-[#2563EB] hover:underline">Sign In</Link>
          </p>
          <p className="text-xs text-slate-400">
            <Link to="/guest" className="hover:text-[#2563EB]">← Back to Guest Page</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
