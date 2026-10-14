import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, MapPin, QrCode, Clock, Bell, LogOut, ChevronRight, Smartphone, Info, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Modal, Button } from '../components/ui';

const ZONE_DATA = [
  { zone: 'Zone A', available: 18, total: 50 },
  { zone: 'Zone B', available: 2, total: 40 },
  { zone: 'Zone C', available: 39, total: 60 },
  { zone: 'Zone D', available: 18, total: 30 },
];

export default function GuestDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F0F6FC] font-['Inter']">
      {/* Header */}
      <header className="bg-[#123B6D] text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#38BDF8]/20 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-[#38BDF8]" />
            </div>
            <div>
              <p className="font-bold text-sm">PASS</p>
              <p className="text-blue-300 text-[10px]">Guest Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-xs bg-amber-400/20 border border-amber-400/30 text-amber-300 px-3 py-1.5 rounded-full">
              <Info size={12} />
              Guest Account
            </span>
            <button onClick={() => setLogoutModal(true)} className="flex items-center gap-1.5 text-xs text-red-300 hover:text-red-200 transition-colors">
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#123B6D]">Welcome, {user?.name}!</h1>
          <p className="text-slate-500 mt-1">You are logged in as a <strong className="text-amber-600">Guest</strong>. Your access is temporary and limited to this visit.</p>
        </div>

        {/* Guest Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4 mb-8">
          <Info size={22} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-800 mb-1">Guest Account Limitations</h3>
            <p className="text-sm text-amber-700 leading-relaxed">
              As a guest, you can receive a temporary QR parking pass and view current parking availability. For full access including RFID, vehicle registration, and persistent parking history, please register with your institutional credentials.
            </p>
            <Link to="/register" className="inline-flex items-center gap-1 text-sm font-semibold text-[#2563EB] mt-2 hover:underline">
              Upgrade to Regular Account <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* QR Pass Card */}
        <div className="bg-gradient-to-br from-[#123B6D] to-[#2563EB] rounded-2xl p-6 text-white mb-8 shadow-xl">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-blue-200 text-sm font-medium">Temporary QR Access Pass</p>
              <h2 className="text-2xl font-bold mt-1">{user?.name}</h2>
              <p className="text-blue-200 text-sm mt-1">Pass ID: GUEST-{Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <QrCode size={32} className="text-[#38BDF8]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-blue-300 text-xs">Valid Until</p>
              <p className="font-semibold">Today, 11:59 PM</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-blue-300 text-xs">Access Area</p>
              <p className="font-semibold">Visitor Zone</p>
            </div>
          </div>
          <button onClick={() => setShowQR(true)}
            className="w-full py-3 bg-[#38BDF8] text-[#123B6D] font-bold rounded-xl hover:bg-sky-300 transition-colors flex items-center justify-center gap-2">
            <QrCode size={18} />
            Show QR Pass
          </button>
        </div>

        {/* Parking Availability */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#123B6D] text-lg flex items-center gap-2">
              <MapPin size={20} />
              Parking Availability
            </h2>
            <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Live
            </span>
          </div>
          <div className="space-y-4">
            {ZONE_DATA.map(z => {
              const pct = (z.available / z.total) * 100;
              const color = pct < 10 ? 'bg-red-500' : pct < 40 ? 'bg-amber-500' : 'bg-green-500';
              return (
                <div key={z.zone} className="flex items-center gap-4">
                  <div className="w-16 text-sm font-semibold text-slate-700">{z.zone}</div>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="text-sm font-bold text-slate-700 w-20 text-right">{z.available}/{z.total} free</div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
            <Clock size={12} />
            Last updated: just now
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <button onClick={() => setShowQR(true)} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-blue-100 hover:border-[#2563EB] hover:shadow-md transition-all text-left">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-[#2563EB] shrink-0">
              <QrCode size={24} />
            </div>
            <div>
              <p className="font-semibold text-slate-700">My QR Pass</p>
              <p className="text-xs text-slate-400 mt-0.5">Show at campus gate</p>
            </div>
            <ChevronRight size={18} className="ml-auto text-slate-300" />
          </button>
          <Link to="/mobile" className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-blue-100 hover:border-[#2563EB] hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 shrink-0">
              <Smartphone size={24} />
            </div>
            <div>
              <p className="font-semibold text-slate-700">Mobile App</p>
              <p className="text-xs text-slate-400 mt-0.5">Open PASS Mobile</p>
            </div>
            <ChevronRight size={18} className="ml-auto text-slate-300" />
          </Link>
        </div>

        {/* Upgrade CTA */}
        <div className="bg-gradient-to-r from-[#2563EB]/10 to-[#38BDF8]/10 border border-[#2563EB]/20 rounded-2xl p-6 text-center">
          <CheckCircle size={32} className="text-[#2563EB] mx-auto mb-3" />
          <h3 className="font-bold text-[#123B6D] mb-1">Want full campus parking access?</h3>
          <p className="text-sm text-slate-500 mb-4">Register with your institutional credentials to get RFID access, vehicle registration, and reserved parking.</p>
          <Link to="/register" className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2563EB] text-white font-semibold rounded-xl hover:bg-[#1D4ED8] transition-colors text-sm">
            Create Regular Account →
          </Link>
        </div>
      </div>

      {/* QR Modal */}
      <Modal open={showQR} onClose={() => setShowQR(false)} title="Your QR Access Pass" size="sm">
        <div className="text-center">
          <div className="bg-gradient-to-br from-[#123B6D] to-[#2563EB] rounded-2xl p-6 mb-4 text-white">
            <p className="text-blue-200 text-xs mb-1">PASS — Visitor QR Pass</p>
            <p className="font-bold text-lg">{user?.name}</p>
            <p className="text-blue-200 text-xs mt-1">Valid Today Until 11:59 PM</p>
            <div className="mt-4 bg-white rounded-xl p-4 mx-auto w-40 h-40 flex items-center justify-center">
              <div className="grid grid-cols-5 gap-0.5">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className={`w-5 h-5 rounded-sm ${Math.random() > 0.5 ? 'bg-[#123B6D]' : 'bg-white'}`} />
                ))}
              </div>
            </div>
            <p className="text-[10px] text-blue-300 mt-3">Present this QR code at the campus entrance gate</p>
          </div>
          <p className="text-xs text-slate-400">This pass expires at the end of the day. For multiple visits, request a new pass each time.</p>
        </div>
      </Modal>

      {/* Logout Modal */}
      <Modal open={logoutModal} onClose={() => setLogoutModal(false)} title="Confirm Logout" size="sm">
        <p className="text-sm text-slate-600 mb-6">Are you sure you want to log out of PASS?</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setLogoutModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleLogout}>Yes, Logout</Button>
        </div>
      </Modal>
    </div>
  );
}
