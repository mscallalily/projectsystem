import React, { useState, ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Car, CreditCard, ParkingSquare, UserCheck, FileBarChart,
  ScrollText, AlertTriangle, Settings, Bell, LogOut, ChevronDown, ChevronRight,
  Menu, X, Shield, MapPin, BarChart3, QrCode, Activity, UserCog
} from 'lucide-react';
import { Modal, Button } from './ui';

interface NavItem {
  label: string;
  icon: ReactNode;
  to?: string;
  children?: { label: string; to: string }[];
  roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={18} />, to: '/app/dashboard', roles: ['admin', 'parking_admin', 'security', 'student', 'faculty', 'employee'] },
  { label: 'User Management', icon: <Users size={18} />, roles: ['admin'], children: [
    { label: 'All Users', to: '/app/users' },
    { label: 'Roles & Permissions', to: '/app/roles' },
    { label: 'Registration Requests', to: '/app/users/requests' },
  ]},
  { label: 'Vehicle Management', icon: <Car size={18} />, roles: ['admin', 'parking_admin', 'student', 'faculty', 'employee'], children: [
    { label: 'All Vehicles', to: '/app/vehicles' },
    { label: 'Register Vehicle', to: '/app/vehicles/register' },
    { label: 'Driver Profiles', to: '/app/drivers' },
    { label: 'Authorization', to: '/app/vehicles/authorization' },
  ]},
  { label: 'RFID & Access Control', icon: <CreditCard size={18} />, roles: ['admin', 'security'], children: [
    { label: 'RFID Management', to: '/app/rfid' },
    { label: 'RFID Authentication', to: '/app/rfid/auth' },
    { label: 'Entry/Exit Monitor', to: '/app/rfid/monitor' },
    { label: 'Hardware Status', to: '/app/rfid/hardware' },
  ]},
  { label: 'Parking Operations', icon: <ParkingSquare size={18} />, roles: ['admin', 'parking_admin', 'security'], children: [
    { label: 'Gate Operations', to: '/app/parking/gate' },
    { label: 'Transactions', to: '/app/parking/transactions' },
    { label: 'Slot Management', to: '/app/parking/slots' },
    { label: 'Parking Layout', to: '/app/parking/layout' },
    { label: 'Occupancy Monitor', to: '/app/parking/occupancy' },
    { label: 'Availability', to: '/app/parking/availability' },
    { label: 'Capacity Settings', to: '/app/parking/capacity' },
  ]},
  { label: 'Visitor & QR Access', icon: <QrCode size={18} />, roles: ['admin', 'security', 'parking_admin'], children: [
    { label: 'Visitor Management', to: '/app/visitors' },
    { label: 'QR Access Passes', to: '/app/qr-access' },
    { label: 'QR Verification', to: '/app/qr-verify' },
  ]},
  { label: 'Reports & Analytics', icon: <FileBarChart size={18} />, roles: ['admin', 'parking_admin'], to: '/app/reports' },
  { label: 'Audit Logs', icon: <ScrollText size={18} />, roles: ['admin'], to: '/app/audit' },
  { label: 'Violations', icon: <AlertTriangle size={18} />, roles: ['admin', 'security', 'parking_admin'], to: '/app/violations' },
  { label: 'System Settings', icon: <Settings size={18} />, roles: ['admin'], to: '/app/settings' },
  { label: 'Parking Info', icon: <MapPin size={18} />, roles: ['student', 'faculty', 'employee'], to: '/app/parking/availability' },
  { label: 'Parking History', icon: <Activity size={18} />, roles: ['student', 'faculty', 'employee'], to: '/app/my-history' },
  { label: 'My Profile', icon: <UserCog size={18} />, to: '/app/profile' },
  { label: 'Notifications', icon: <Bell size={18} />, to: '/app/notifications' },
];

function SidebarItem({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const [open, setOpen] = useState(false);
  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen(o => !o)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors hover:bg-white/10 text-blue-100 ${open ? 'bg-white/10' : ''}`}
        >
          <span className="shrink-0">{item.icon}</span>
          {!collapsed && <><span className="flex-1 text-sm font-medium">{item.label}</span>{open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</>}
        </button>
        {open && !collapsed && (
          <div className="ml-9 mt-1 space-y-0.5">
            {item.children.map(c => (
              <NavLink key={c.to} to={c.to}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-xs font-medium transition-colors ${isActive ? 'bg-[#2563EB] text-white' : 'text-blue-200 hover:bg-white/10 hover:text-white'}`
                }
              >{c.label}</NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }
  return (
    <NavLink to={item.to!}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-[#2563EB] text-white' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`
      }
    >
      <span className="shrink-0">{item.icon}</span>
      {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
    </NavLink>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

  const role = user?.role ?? 'student';
  const visibleNav = NAV_ITEMS.filter(item => !item.roles || item.roles.includes(role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#38BDF8] rounded-lg flex items-center justify-center shrink-0">
            <Shield size={20} className="text-white" />
          </div>
          {!collapsed && (
            <div>
              <p className="font-bold text-white text-sm leading-none">PASS</p>
              <p className="text-blue-300 text-[10px] leading-tight">Parking Access & Security</p>
            </div>
          )}
        </div>
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-white/10">
          <p className="text-xs text-blue-300">Signed in as</p>
          <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
          <span className="inline-block mt-1 px-2 py-0.5 bg-[#38BDF8]/20 text-[#38BDF8] text-[10px] rounded-full font-medium uppercase tracking-wide">
            {role.replace('_', ' ')}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto sidebar-scrollbar px-2 py-3 space-y-0.5">
        {visibleNav.map((item, i) => (
          <SidebarItem key={i} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Logout */}
      <div className="px-2 py-3 border-t border-white/10">
        <button
          onClick={() => setLogoutModal(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-300 hover:bg-red-500/20 transition-colors"
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#F0F6FC]">
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col bg-[#123B6D] transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'} shrink-0 relative`}>
        {sidebarContent}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="absolute -right-3 top-20 bg-[#2563EB] text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white z-10"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} style={{ transform: 'rotate(90deg)' }} />}
        </button>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#123B6D] z-50">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-blue-100 px-4 py-3 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(o => !o)} className="lg:hidden p-1.5 rounded-lg hover:bg-blue-50">
              <Menu size={20} className="text-[#123B6D]" />
            </button>
            <div className="lg:hidden flex items-center gap-2">
              <Shield size={18} className="text-[#2563EB]" />
              <span className="font-bold text-[#123B6D] text-sm">PASS</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NavLink to="/app/notifications" className="relative p-2 rounded-lg hover:bg-blue-50 text-slate-500 hover:text-[#2563EB] transition-colors">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </NavLink>
            <NavLink to="/app/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
              <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white text-xs flex items-center justify-center font-semibold">
                {user?.name?.[0] ?? 'U'}
              </div>
              <span className="hidden sm:block text-sm font-medium text-slate-700">{user?.name}</span>
            </NavLink>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>

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
