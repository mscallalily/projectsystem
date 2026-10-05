import React, { useState } from 'react';
import { PageHeader, Card, Badge, Button, Input, Toast } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { User, Car, CreditCard, Activity, Edit, Eye, EyeOff } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [toast, setToast] = useState('');

  const save = () => { setEditing(false); setToast('Profile updated successfully'); setTimeout(() => setToast(''), 3000); };

  return (
    <div className="animate-fadein max-w-3xl">
      {toast && <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">✓ {toast}</div>}
      <PageHeader title="My Profile" subtitle="Manage your account information"
        action={<Button onClick={() => setEditing(e => !e)}><Edit size={16} /> {editing ? 'Cancel' : 'Edit Profile'}</Button>}
      />

      <div className="space-y-6">
        {/* Profile Card */}
        <Card className="p-6">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-[#2563EB] text-white text-3xl font-bold flex items-center justify-center shrink-0">
              {user?.name?.[0] ?? 'U'}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
              <p className="text-slate-500">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="success">Active</Badge>
                <span className="text-xs text-slate-400 capitalize bg-blue-50 px-2 py-0.5 rounded-full">{user?.role?.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Account Info */}
        <Card className="p-6">
          <h3 className="font-semibold text-[#123B6D] flex items-center gap-2 mb-5"><User size={18} /> Account Information</h3>
          <div className="space-y-4">
            {editing ? (
              <>
                <Input label="Full Name" defaultValue={user?.name} />
                <Input label="Email Address" type="email" defaultValue={user?.email} />
                <Input label="Institutional ID" defaultValue={user?.idNum || '2021-00123'} />
                <Input label="Contact Number" placeholder="09XX XXX XXXX" defaultValue="09171234567" />
                <Input label="Department" defaultValue={user?.dept || 'College of Engineering'} />
                <div className="flex gap-3 pt-2">
                  <Button onClick={save}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                {[['Full Name', user?.name], ['Email', user?.email], ['Institutional ID', user?.idNum || '2021-00123'], ['Contact Number', '09171234567'], ['Department', user?.dept || 'College of Engineering'], ['User Type', user?.role?.replace('_', ' ')]].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-slate-50 text-sm">
                    <span className="text-slate-400">{k}</span>
                    <span className="font-medium text-slate-700 capitalize">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Change Password */}
        <Card className="p-6">
          <h3 className="font-semibold text-[#123B6D] mb-5">Change Password</h3>
          <div className="space-y-4 max-w-sm">
            <Input label="Current Password" type="password" placeholder="••••••••" />
            <div className="relative">
              <Input label="New Password" type={showPwd ? 'text' : 'password'} placeholder="••••••••" />
              <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-8 text-slate-400">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Input label="Confirm New Password" type="password" placeholder="••••••••" />
            <Button onClick={() => { setToast('Password changed'); }}>Update Password</Button>
          </div>
        </Card>

        {/* Vehicle Summary */}
        <Card className="p-6">
          <h3 className="font-semibold text-[#123B6D] flex items-center gap-2 mb-4"><Car size={18} /> Registered Vehicles</h3>
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
            <div className="w-12 h-12 bg-[#2563EB]/10 rounded-xl flex items-center justify-center">
              <Car size={22} className="text-[#2563EB]" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-700">ABC-1234 — Toyota Vios 2021</p>
              <p className="text-sm text-slate-400">White · Sedan</p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
        </Card>

        {/* RFID Summary */}
        <Card className="p-6">
          <h3 className="font-semibold text-[#123B6D] flex items-center gap-2 mb-4"><CreditCard size={18} /> RFID Card</h3>
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
            <div className="w-12 h-12 bg-[#2563EB]/10 rounded-xl flex items-center justify-center">
              <CreditCard size={22} className="text-[#2563EB]" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-700">RFID-001</p>
              <p className="text-sm text-slate-400">Assigned: Aug 15, 2024 · Expires: Aug 15, 2025</p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
        </Card>

        {/* Activity */}
        <Card className="p-6">
          <h3 className="font-semibold text-[#123B6D] flex items-center gap-2 mb-4"><Activity size={18} /> Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'Parking entry recorded', time: 'Sep 1, 2024 at 7:32 AM', type: 'entry' },
              { action: 'Profile information updated', time: 'Aug 28, 2024 at 3:15 PM', type: 'profile' },
              { action: 'RFID card assigned', time: 'Aug 15, 2024 at 10:00 AM', type: 'rfid' },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-50">
                <div className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-slate-700">{a.action}</p>
                  <p className="text-xs text-slate-400">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
