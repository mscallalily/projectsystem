import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StatCard, Card } from '../../components/ui';
import {
  Users, Car, CreditCard, ParkingSquare, UserCheck, AlertTriangle,
  TrendingUp, Activity, Shield, Bell, Plus, ArrowRight, CheckCircle, Clock
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { OCCUPANCY_DATA, ZONE_CAPACITY, MOCK_RFID_EVENTS, MOCK_VIOLATIONS } from '../../data/mock';

const COLORS = ['#2563EB', '#38BDF8', '#10B981', '#F59E0B'];

function AdminDashboard() {
  return (
    <div className="animate-fadein space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#123B6D]">Administrative Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">System overview — {new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Total Users" value="248" icon={<Users size={20} />} color="blue" sub="↑ 12 this week" />
        <StatCard label="Vehicles" value="320" icon={<Car size={20} />} color="sky" sub="↑ 8 new" />
        <StatCard label="RFID Tags" value="250" icon={<CreditCard size={20} />} color="purple" sub="12 unassigned" />
        <StatCard label="Parking Slots" value="180" icon={<ParkingSquare size={20} />} color="navy" sub="77 available" />
        <StatCard label="Today's Entries" value="127" icon={<TrendingUp size={20} />} color="green" sub="↑ 15% vs yesterday" />
        <StatCard label="Open Violations" value="3" icon={<AlertTriangle size={20} />} color="red" sub="2 under review" />
      </div>

      {/* Row 2 */}
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard label="Occupied Slots" value="103" icon={<Activity size={20} />} color="amber" sub="of 180 total" />
        <StatCard label="Active Visitors" value="5" icon={<UserCheck size={20} />} color="sky" sub="2 pending approval" />
        <StatCard label="Pending Approvals" value="7" icon={<Clock size={20} />} color="amber" sub="Needs action" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-slate-700 mb-1">Entry & Exit Activity</h3>
          <p className="text-xs text-slate-400 mb-5">Today's hourly traffic</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={OCCUPANCY_DATA}>
              <XAxis dataKey="time" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="entries" name="Entries" fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="exits" name="Exits" fill="#38BDF8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-slate-700 mb-1">Parking Occupancy by Zone</h3>
          <p className="text-xs text-slate-400 mb-4">Current capacity utilization</p>
          <div className="space-y-4">
            {ZONE_CAPACITY.map((z, i) => {
              const pct = Math.round((z.occupied / z.capacity) * 100);
              return (
                <div key={z.zone}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-slate-600">{z.zone}</span>
                    <span className="font-semibold text-slate-700">{pct}% occupied</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: COLORS[i] }} />
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>{z.occupied} occupied</span>
                    <span>{z.capacity - z.occupied} free of {z.capacity}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent Events + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Recent Access Events</h3>
            <Link to="/app/rfid/monitor" className="text-xs text-[#2563EB] hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-3">
            {MOCK_RFID_EVENTS.slice(0, 5).map(e => (
              <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50/50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${e.result === 'granted' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {e.type === 'entry' ? '↓' : '↑'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{e.driver} — {e.plate}</p>
                  <p className="text-xs text-slate-400">{e.gate} · {e.timestamp.split(' ')[1]}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${e.result === 'granted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {e.result === 'granted' ? 'Granted' : 'Denied'}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-slate-700 mb-4">Quick Actions</h3>
          <div className="space-y-2.5">
            {[
              { label: 'Add User', to: '/app/users', icon: <Users size={16} /> },
              { label: 'Register Vehicle', to: '/app/vehicles/register', icon: <Car size={16} /> },
              { label: 'Assign RFID', to: '/app/rfid', icon: <CreditCard size={16} /> },
              { label: 'Add Parking Slot', to: '/app/parking/slots', icon: <ParkingSquare size={16} /> },
              { label: 'Generate QR Pass', to: '/app/qr-access', icon: <Shield size={16} /> },
              { label: 'View Reports', to: '/app/reports', icon: <Activity size={16} /> },
            ].map(a => (
              <Link key={a.label} to={a.to}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563EB] transition-colors text-sm font-medium">
                {a.icon} {a.label}
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="p-6">
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><Bell size={18} /> Active Alerts</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { type: 'warning', msg: 'Zone B at 95% capacity (38/40 slots occupied)' },
            { type: 'danger', msg: '3 open parking violations require review' },
            { type: 'info', msg: '7 user registration requests pending approval' },
          ].map((a, i) => (
            <div key={i} className={`flex gap-3 p-4 rounded-xl border ${
              a.type === 'warning' ? 'bg-amber-50 border-amber-200' :
              a.type === 'danger' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
            }`}>
              <AlertTriangle size={16} className={a.type === 'warning' ? 'text-amber-500' : a.type === 'danger' ? 'text-red-500' : 'text-blue-500'} />
              <p className="text-xs text-slate-600 leading-relaxed">{a.msg}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function UserDashboard() {
  const { user } = useAuth();
  return (
    <div className="animate-fadein space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#123B6D]">Hello, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-sm text-slate-500 mt-1">{new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="My Vehicles" value="1" icon={<Car size={20} />} color="blue" />
        <StatCard label="Available Near You" value="39" icon={<ParkingSquare size={20} />} color="green" sub="Zone C" />
        <StatCard label="Today's Entries" value="1" icon={<Activity size={20} />} color="sky" />
        <StatCard label="Notifications" value="3" icon={<Bell size={20} />} color="amber" sub="2 unread" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-to-br from-[#123B6D] to-[#2563EB] text-white">
          <p className="text-blue-200 text-sm">Vehicle: ABC-1234</p>
          <h2 className="text-xl font-bold mt-1">Toyota Vios 2021</h2>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <CheckCircle size={16} className="text-green-400" />
            <span className="text-blue-100">RFID Active — Card RFID-001</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <CheckCircle size={16} className="text-green-400" />
            <span className="text-blue-100">Authorization: Valid until Aug 2025</span>
          </div>
          <Link to="/app/vehicles" className="mt-5 inline-flex items-center gap-1.5 text-sm text-[#38BDF8] hover:underline">
            View vehicle details <ArrowRight size={14} />
          </Link>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-slate-700 mb-4">Parking Availability</h3>
          <div className="space-y-3">
            {ZONE_CAPACITY.map((z, i) => {
              const pct = Math.round((z.occupied / z.capacity) * 100);
              return (
                <div key={z.zone} className="flex items-center gap-3">
                  <span className="w-14 text-sm text-slate-500 font-medium">{z.zone}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: COLORS[i] }} />
                  </div>
                  <span className="text-xs font-bold text-slate-600 w-12 text-right">{z.capacity - z.occupied} free</span>
                </div>
              );
            })}
          </div>
          <Link to="/app/parking/availability" className="mt-4 text-xs text-[#2563EB] hover:underline flex items-center gap-1">
            View full map <ArrowRight size={12} />
          </Link>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-slate-700 mb-4">Recent Parking Activity</h3>
        <div className="space-y-3">
          {[
            { date: 'Sep 1, 2024', entry: '07:32 AM', exit: '05:45 PM', zone: 'Zone A', duration: '10h 13m' },
            { date: 'Aug 30, 2024', entry: '08:10 AM', exit: '06:00 PM', zone: 'Zone B', duration: '9h 50m' },
          ].map((h, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-700 text-sm">{h.date}</p>
                <p className="text-xs text-slate-400 mt-0.5">{h.zone} · Entry: {h.entry} · Exit: {h.exit}</p>
              </div>
              <span className="text-sm font-bold text-[#2563EB]">{h.duration}</span>
            </div>
          ))}
        </div>
        <Link to="/app/my-history" className="mt-4 text-xs text-[#2563EB] hover:underline flex items-center gap-1">
          View full history <ArrowRight size={12} />
        </Link>
      </Card>
    </div>
  );
}

function SecurityDashboard() {
  return (
    <div className="animate-fadein space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#123B6D]">Security Operations</h1>
        <p className="text-sm text-slate-500 mt-1">Gate status and access control overview</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Today's Entries" value="127" icon={<TrendingUp size={20} />} color="green" />
        <StatCard label="Today's Exits" value="89" icon={<Activity size={20} />} color="blue" />
        <StatCard label="Denied Access" value="3" icon={<AlertTriangle size={20} />} color="red" />
        <StatCard label="Active Visitors" value="5" icon={<UserCheck size={20} />} color="sky" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-slate-700 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'RFID Auth', to: '/app/rfid/auth', color: 'bg-blue-500' },
              { label: 'QR Verify', to: '/app/qr-verify', color: 'bg-green-500' },
              { label: 'Gate Ops', to: '/app/parking/gate', color: 'bg-amber-500' },
              { label: 'Entry Monitor', to: '/app/rfid/monitor', color: 'bg-purple-500' },
            ].map(a => (
              <Link key={a.label} to={a.to} className={`${a.color} text-white p-5 rounded-2xl text-center font-semibold hover:opacity-90 transition-opacity`}>
                {a.label}
              </Link>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold text-slate-700 mb-4">Recent Events</h3>
          <div className="space-y-2">
            {MOCK_RFID_EVENTS.slice(0, 4).map(e => (
              <div key={e.id} className="flex items-center gap-3 py-2 border-b border-slate-50">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${e.result === 'granted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {e.type.toUpperCase()}
                </span>
                <span className="text-sm text-slate-600 flex-1 truncate">{e.plate} — {e.driver.split(' ')[0]}</span>
                <span className="text-xs text-slate-400">{e.timestamp.split(' ')[1]}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ParkingAdminDashboard() {
  return (
    <div className="animate-fadein space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#123B6D]">Parking Administration</h1>
        <p className="text-sm text-slate-500 mt-1">Parking operations and capacity overview</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Slots" value="180" icon={<ParkingSquare size={20} />} color="navy" />
        <StatCard label="Occupied" value="103" icon={<Activity size={20} />} color="amber" sub="57% full" />
        <StatCard label="Available" value="77" icon={<CheckCircle size={20} />} color="green" />
        <StatCard label="Maintenance" value="3" icon={<AlertTriangle size={20} />} color="red" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-slate-700 mb-5">Occupancy Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={OCCUPANCY_DATA}>
              <XAxis dataKey="time" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
              <Line type="monotone" dataKey="entries" stroke="#2563EB" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold text-slate-700 mb-4">Quick Actions</h3>
          <div className="space-y-2.5">
            {[
              { label: 'Manage Slots', to: '/app/parking/slots' },
              { label: 'Edit Layout', to: '/app/parking/layout' },
              { label: 'View Transactions', to: '/app/parking/transactions' },
              { label: 'Capacity Settings', to: '/app/parking/capacity' },
              { label: 'View Reports', to: '/app/reports' },
            ].map(a => (
              <Link key={a.label} to={a.to} className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-sm font-medium transition-colors">
                {a.label} <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const role = user?.role;
  if (role === 'admin') return <AdminDashboard />;
  if (role === 'security') return <SecurityDashboard />;
  if (role === 'parking_admin') return <ParkingAdminDashboard />;
  return <UserDashboard />;
}
