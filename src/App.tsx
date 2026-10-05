import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';

import LandingPage from './pages/LandingPage';
import GuestLandingPage from './pages/GuestLandingPage';
import GuestDashboardPage from './pages/GuestDashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GuestRegisterPage from './pages/GuestRegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import MobileApp from './pages/MobileApp';

import Dashboard from './pages/app/Dashboard';
import UserManagement from './pages/app/UserManagement';
import VehicleManagement from './pages/app/VehicleManagement';
import RFIDManagement from './pages/app/RFIDManagement';
import ParkingOperations from './pages/app/ParkingOperations';
import VisitorQR from './pages/app/VisitorQR';
import Reports from './pages/app/Reports';
import AuditLogs from './pages/app/AuditLogs';
import Violations from './pages/app/Violations';
import SystemSettings from './pages/app/SystemSettings';
import Profile from './pages/app/Profile';
import Notifications from './pages/app/Notifications';
import ParkingHistory from './pages/app/ParkingHistory';

function ProtectedApp() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'guest') return <Navigate to="/guest-dashboard" replace />;
  return <Layout><Outlet /></Layout>;
}

function GuestRoute() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'guest') return <Navigate to="/app/dashboard" replace />;
  return <Outlet />;
}

function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-5 text-4xl">🔒</div>
      <h2 className="text-2xl font-bold text-[#123B6D] mb-2">Access Denied</h2>
      <p className="text-slate-500 max-w-sm">You don't have permission to view this page. Contact your administrator if you believe this is an error.</p>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/guest" element={<GuestLandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register/guest" element={<GuestRegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/mobile" element={<MobileApp />} />

      {/* Guest dashboard (separate from regular user) */}
      <Route element={<GuestRoute />}>
        <Route path="/guest-dashboard" element={<GuestDashboardPage />} />
      </Route>

      {/* Protected app routes */}
      <Route path="/app" element={<ProtectedApp />}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="my-history" element={<ParkingHistory />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="users/requests" element={<UserManagement />} />
        <Route path="roles" element={<UserManagement />} />
        <Route path="vehicles" element={<VehicleManagement />} />
        <Route path="vehicles/register" element={<VehicleManagement />} />
        <Route path="vehicles/authorization" element={<VehicleManagement />} />
        <Route path="drivers" element={<VehicleManagement />} />
        <Route path="rfid" element={<RFIDManagement />} />
        <Route path="rfid/auth" element={<RFIDManagement />} />
        <Route path="rfid/monitor" element={<RFIDManagement />} />
        <Route path="rfid/hardware" element={<RFIDManagement />} />
        <Route path="parking/gate" element={<ParkingOperations />} />
        <Route path="parking/transactions" element={<ParkingOperations />} />
        <Route path="parking/slots" element={<ParkingOperations />} />
        <Route path="parking/layout" element={<ParkingOperations />} />
        <Route path="parking/occupancy" element={<ParkingOperations />} />
        <Route path="parking/availability" element={<ParkingOperations />} />
        <Route path="parking/capacity" element={<ParkingOperations />} />
        <Route path="visitors" element={<VisitorQR />} />
        <Route path="qr-access" element={<VisitorQR />} />
        <Route path="qr-verify" element={<VisitorQR />} />
        <Route path="reports" element={<Reports />} />
        <Route path="audit" element={<AuditLogs />} />
        <Route path="violations" element={<Violations />} />
        <Route path="settings" element={<SystemSettings />} />
        <Route path="*" element={<AccessDenied />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
