import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, MapPin, Clock, QrCode, Info, ArrowRight, LogIn, UserPlus, Car } from 'lucide-react';

export default function GuestLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F6FC] to-white font-['Inter']">
      {/* Header */}
      <header className="bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#123B6D] rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-[#123B6D] text-sm">PASS</p>
              <p className="text-[10px] text-slate-400">Parking Access & Security System</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1.5">
              <LogIn size={15} /> Sign In
            </Link>
            <Link to="/register" className="px-4 py-2 text-sm font-medium bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors">
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
          <Info size={15} />
          You are browsing as a Guest
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-[#123B6D] mb-5 leading-tight">
          Welcome to <span className="text-[#2563EB]">PASS</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
          The campus Parking Access and Security System. As a guest, you can explore what PASS offers — but you'll need to register to access parking services.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Link
            to="/register/guest"
            className="flex items-center justify-center gap-2.5 px-8 py-4 bg-[#2563EB] text-white font-bold rounded-2xl hover:bg-[#1D4ED8] transition-colors text-lg shadow-lg shadow-blue-200"
          >
            <UserPlus size={20} />
            Register as Guest
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-[#123B6D] font-bold rounded-2xl hover:bg-blue-50 transition-colors text-lg border border-blue-200 shadow-sm"
          >
            <LogIn size={20} />
            Already have an account? Sign In
          </Link>
        </div>

        <p className="text-xs text-slate-400">
          Are you a student, faculty, or employee? <Link to="/register" className="text-[#2563EB] hover:underline font-medium">Register with your institutional ID →</Link>
        </p>
      </section>

      {/* Guest Notice */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4">
          <Info size={24} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-800 mb-1">Guest Account Notice</h3>
            <p className="text-sm text-amber-700 leading-relaxed">
              Guests must register and create a PASS Guest account before accessing any parking services. Guest accounts provide limited access — you can view parking availability and receive a temporary QR access pass when visiting the campus. Full parking privileges require a regular account with valid institutional credentials.
            </p>
          </div>
        </div>
      </section>

      {/* What Guests Can Do */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-2xl font-bold text-[#123B6D] text-center mb-8">What Guest Access Includes</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: <QrCode size={22} />, title: 'Temporary QR Pass', desc: 'Receive a time-limited QR code for single-visit campus parking access.', ok: true },
            { icon: <MapPin size={22} />, title: 'Parking Availability', desc: 'View real-time parking slot availability across all campus zones.', ok: true },
            { icon: <Clock size={22} />, title: 'Visit History', desc: 'Access your own visit and parking transaction history.', ok: true },
            { icon: <Car size={22} />, title: 'Vehicle Registration', desc: 'Permanent vehicle registration and RFID card assignment.', ok: false },
            { icon: <Shield size={22} />, title: 'Full RFID Access', desc: 'Persistent RFID access and full campus vehicle privileges.', ok: false },
            { icon: <ArrowRight size={22} />, title: 'Reserved Parking', desc: 'Access to reserved or designated parking zones.', ok: false },
          ].map(item => (
            <div key={item.title} className={`p-5 rounded-2xl border ${item.ok ? 'bg-white border-blue-100' : 'bg-slate-50 border-slate-200 opacity-70'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${item.ok ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'}`}>
                {item.icon}
              </div>
              <div className="flex items-start gap-2">
                <span className={`text-lg mt-0.5 ${item.ok ? 'text-green-500' : 'text-slate-300'}`}>{item.ok ? '✓' : '✗'}</span>
                <div>
                  <h3 className="font-semibold text-slate-700 text-sm">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#123B6D] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-10">How Guest Access Works</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Register as Guest', desc: 'Create a guest account with your name and contact info. No institutional ID required.' },
              { step: '02', title: 'Log In to PASS', desc: 'Sign in to your guest account and get redirected to your dedicated guest dashboard.' },
              { step: '03', title: 'Get Your QR Pass', desc: 'Receive a temporary QR access pass. Present it at the campus gate for parking entry.' },
            ].map(s => (
              <div key={s.step} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-[#38BDF8]/20 border border-[#38BDF8]/30 text-[#38BDF8] font-bold text-xl flex items-center justify-center mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-blue-200 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link to="/register/guest" className="inline-flex items-center gap-2 px-8 py-4 bg-[#38BDF8] text-[#123B6D] font-bold rounded-2xl hover:bg-sky-300 transition-colors">
              <UserPlus size={20} />
              Get Started — Register as Guest
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A2647] text-blue-200 py-8 text-center text-sm">
        <p>© 2024 PASS — Parking Access and Security System</p>
        <p className="text-xs mt-1 text-blue-300">
          <Link to="/" className="hover:text-white transition-colors">← Back to Main Page</Link>
        </p>
      </footer>
    </div>
  );
}
