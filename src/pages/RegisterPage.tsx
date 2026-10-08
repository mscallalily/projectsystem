import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Check, ChevronRight, ChevronLeft, Eye, EyeOff, AlertCircle, Car, User, Briefcase } from 'lucide-react';
import { api, ApiError } from '../lib/api';

const STEPS = ['Account Info', 'User Details', 'Vehicle Info', 'Confirmation'];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({
    fullName: '', idNum: '', email: '', password: '', confirmPwd: '',
    userType: 'student', dept: '', contact: '',
    vehicleType: 'Sedan', plate: '', make: '', model: '', color: '',
    agree: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, val: string | boolean) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!form.fullName.trim().includes(' ')) e.fullName = 'Enter your first and last name';
      if (!form.idNum) e.idNum = 'ID number is required';
      if (!form.email || !form.email.includes('@')) e.email = 'Valid email required';
      if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 characters';
      if (form.password !== form.confirmPwd) e.confirmPwd = 'Passwords do not match';
    }
    if (step === 1) {
      if (!form.dept) e.dept = 'Department is required';
      if (!form.contact) e.contact = 'Contact number is required';
    }
    if (step === 2) {
      if (!form.plate) e.plate = 'Plate number is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(s => Math.min(s + 1, 3)); };
  const prev = () => setStep(s => Math.max(s - 1, 0));
  const submit = async () => {
    if (!form.agree || submitting) return;
    setSubmitError('');
    setSubmitting(true);
    try {
      await api('/register', {
        method: 'POST',
        body: {
          full_name: form.fullName.trim(),
          user_code: form.idNum.trim(),
          email: form.email.trim(),
          password: form.password,
          password_confirmation: form.confirmPwd,
          user_type: form.userType,
          department: form.dept,
          contact_number: form.contact.trim(),
          vehicle_type: form.vehicleType,
          plate_number: form.plate.trim(),
          make: form.make.trim(),
          model: form.model.trim(),
          color: form.color.trim(),
        },
      });
      setSubmitted(true);
    } catch (err) {
      if (err instanceof ApiError) {
        const details = Object.values(err.errors).flat().join(' ');
        setSubmitError(details || err.message);
      } else {
        setSubmitError('Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F0F6FC] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#123B6D] mb-3">Registration Submitted!</h2>
          <p className="text-slate-500 mb-2">Your account is pending review by the PASS administrator.</p>
          <p className="text-sm text-slate-400 mb-8">You will receive an email notification at <strong>{form.email}</strong> once your account is approved.</p>
          <div className="flex flex-col gap-3">
            <Link to="/login" className="w-full py-3 bg-[#2563EB] text-white font-semibold rounded-xl hover:bg-[#1D4ED8] transition-colors">Go to Login</Link>
            <Link to="/" className="text-sm text-slate-400 hover:text-[#2563EB]">Back to Home</Link>
          </div>
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
          <h1 className="text-2xl font-bold text-[#123B6D]">Create Your Account</h1>
          <p className="text-sm text-slate-500 mt-1">Join PASS — Parking Access and Security System</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center mb-8 px-4">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                  i < step ? 'bg-green-500 border-green-500 text-white' :
                  i === step ? 'bg-[#2563EB] border-[#2563EB] text-white' :
                  'bg-white border-slate-200 text-slate-400'
                }`}>
                  {i < step ? <Check size={16} /> : i + 1}
                </div>
                <span className={`text-[10px] mt-1 font-medium whitespace-nowrap hidden sm:block ${i === step ? 'text-[#2563EB]' : 'text-slate-400'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-green-500' : 'bg-slate-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
          {/* Step 0 */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="font-semibold text-[#123B6D] text-lg flex items-center gap-2"><User size={18} /> Account Information</h2>
              {[
                { label: 'Full Name', key: 'fullName', placeholder: 'Juan dela Cruz', type: 'text' },
                { label: 'Institutional ID Number', key: 'idNum', placeholder: '2024-00001', type: 'text' },
                { label: 'Email Address', key: 'email', placeholder: 'juan@university.edu', type: 'email' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">{f.label}</label>
                  <input type={f.type} value={(form as any)[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder}
                    className={`w-full border ${errors[f.key] ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]`} />
                  {errors[f.key] && <p className="text-xs text-red-500 mt-1">{errors[f.key]}</p>}
                </div>
              ))}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Minimum 8 characters"
                    className={`w-full border ${errors.password ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-sm pr-12 focus:outline-none focus:ring-2 focus:ring-[#2563EB]`} />
                  <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{showPwd ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Confirm Password</label>
                <input type="password" value={form.confirmPwd} onChange={e => set('confirmPwd', e.target.value)} placeholder="Repeat password"
                  className={`w-full border ${errors.confirmPwd ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]`} />
                {errors.confirmPwd && <p className="text-xs text-red-500 mt-1">{errors.confirmPwd}</p>}
              </div>
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-semibold text-[#123B6D] text-lg flex items-center gap-2"><Briefcase size={18} /> User Details</h2>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">User Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {['student', 'faculty', 'employee', 'other'].map(t => (
                    <button key={t} type="button" onClick={() => set('userType', t)}
                      className={`py-3 px-4 rounded-xl border-2 text-sm font-medium capitalize transition-all ${form.userType === t ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]' : 'border-slate-200 text-slate-500 hover:border-blue-200'}`}>
                      {t === 'other' ? 'Other Authorized' : t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Department / College</label>
                <select value={form.dept} onChange={e => set('dept', e.target.value)}
                  className={`w-full border ${errors.dept ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white`}>
                  <option value="">Select department</option>
                  {['College of Engineering', 'College of Science', 'College of Business', 'College of Arts', 'College of Nursing', 'Registrar Office', 'HR Department', 'IT Department'].map(d => <option key={d}>{d}</option>)}
                </select>
                {errors.dept && <p className="text-xs text-red-500 mt-1">{errors.dept}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Contact Number</label>
                <input type="tel" value={form.contact} onChange={e => set('contact', e.target.value)} placeholder="09XX XXX XXXX"
                  className={`w-full border ${errors.contact ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]`} />
                {errors.contact && <p className="text-xs text-red-500 mt-1">{errors.contact}</p>}
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-semibold text-[#123B6D] text-lg flex items-center gap-2"><Car size={18} /> Vehicle Information</h2>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Vehicle Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Sedan', 'SUV', 'Hatchback', 'Pickup', 'Van', 'Motorcycle'].map(t => (
                    <button key={t} type="button" onClick={() => set('vehicleType', t)}
                      className={`py-2.5 rounded-xl border text-xs font-medium transition-all ${form.vehicleType === t ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]' : 'border-slate-200 text-slate-500 hover:border-blue-200'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              {[
                { label: 'Plate Number', key: 'plate', placeholder: 'ABC-1234' },
                { label: 'Make (Brand)', key: 'make', placeholder: 'Toyota, Honda, Mitsubishi...' },
                { label: 'Model', key: 'model', placeholder: 'Vios, Civic, Mirage...' },
                { label: 'Color', key: 'color', placeholder: 'White, Silver, Black...' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">{f.label}</label>
                  <input value={(form as any)[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder}
                    className={`w-full border ${errors[f.key] ? 'border-red-400' : 'border-slate-200'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]`} />
                  {errors[f.key] && <p className="text-xs text-red-500 mt-1">{errors[f.key]}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-semibold text-[#123B6D] text-lg flex items-center gap-2"><Check size={18} /> Review & Confirm</h2>
              <div className="space-y-3">
                {[
                  { label: 'Full Name', value: form.fullName },
                  { label: 'ID Number', value: form.idNum },
                  { label: 'Email', value: form.email },
                  { label: 'User Type', value: form.userType },
                  { label: 'Department', value: form.dept },
                  { label: 'Contact', value: form.contact },
                  { label: 'Vehicle', value: `${form.vehicleType} — ${form.make} ${form.model}` },
                  { label: 'Plate Number', value: form.plate },
                ].map(r => (
                  <div key={r.label} className="flex justify-between py-2 border-b border-slate-50 text-sm">
                    <span className="text-slate-400 font-medium">{r.label}</span>
                    <span className="text-slate-700 font-semibold text-right">{r.value || '—'}</span>
                  </div>
                ))}
              </div>
              <label className="flex items-start gap-3 text-sm text-slate-600 cursor-pointer mt-4">
                <input type="checkbox" checked={form.agree} onChange={e => set('agree', e.target.checked)} className="mt-1 rounded" />
                <span>I agree to the PASS <span className="text-[#2563EB]">Terms and Conditions</span> and <span className="text-[#2563EB]">Privacy Notice</span>. I certify that all information provided is accurate.</span>
              </label>
              {submitError && (
                <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" /> {submitError}
                </div>
              )}
              {!form.agree && (
                <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-3 rounded-xl">
                  <AlertCircle size={14} /> Please agree to the terms to submit your registration.
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button onClick={prev} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm">
                <ChevronLeft size={16} /> Back
              </button>
            )}
            <div className="flex-1" />
            {step < 3 ? (
              <button onClick={next} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] text-white font-semibold hover:bg-[#1D4ED8] transition-colors text-sm">
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={submit} disabled={!form.agree || submitting} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 text-sm">
                <Check size={16} /> Submit Registration
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          Already have an account? <Link to="/login" className="text-[#2563EB] font-semibold hover:underline">Sign In</Link>
        </p>
        <p className="text-center text-xs text-slate-400 mt-2">
          <Link to="/" className="hover:text-[#2563EB]">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
