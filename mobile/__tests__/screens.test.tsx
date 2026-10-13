import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('expo-secure-store', () => {
  const store: Record<string, string> = {};
  return {
    getItemAsync: jest.fn(async (k: string) => store[k] ?? null),
    setItemAsync: jest.fn(async (k: string, v: string) => { store[k] = v; }),
    deleteItemAsync: jest.fn(async (k: string) => { delete store[k]; }),
  };
});
jest.mock('expo-image-picker', () => ({}));
jest.mock('expo-document-picker', () => ({}));
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    SafeAreaProvider: ({ children }: any) => children,
    useSafeAreaInsets: () => ({ top: 24, bottom: 0, left: 0, right: 0 }),
  };
});

import { AuthProvider, useAuth, MobileUser } from '../src/context/AuthContext';
import { LicenseProvider } from '../src/context/LicenseContext';
import { LoginScreen, RegisterScreen, WelcomeScreen } from '../src/screens/AuthScreens';
import { HistoryScreen, HomeScreen, NotificationScreen, ParkingScreen } from '../src/screens/MainScreens';
import { GuestRequestScreen, LicenseScreen, ProfileScreen, QRPassScreen } from '../src/screens/MoreScreens';

const wrap = async (ui: React.ReactElement) => render(<AuthProvider><LicenseProvider>{ui}</LicenseProvider></AuthProvider>);
const user = (role: MobileUser['role']): MobileUser => ({ id: '1', name: 'Maria Santos', email: 'maria@pass.edu', role });

beforeEach(() => { (global as any).fetch = jest.fn(); });

describe('auth screens', () => {
  it('renders the welcome screen', async () => {
    await wrap(<WelcomeScreen onLogin={() => {}} onRegister={() => {}} />);
    expect(await screen.findByText('Sign In')).toBeTruthy();
    expect(screen.getByText('Create Account')).toBeTruthy();
    expect(screen.getByText('Continue as Guest')).toBeTruthy();
  });

  it('posts credentials to /api/login and shows the server error on 401', async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({ ok: false, status: 401, json: async () => ({ message: 'Invalid email/ID number or password.' }) });
    await wrap(<LoginScreen onBack={() => {}} />);
    await fireEvent.changeText(screen.getByPlaceholderText('email@university.edu'), '2024-00001');
    await fireEvent.changeText(screen.getByPlaceholderText('••••••••'), 'wrong');
    await act(async () => { await fireEvent.press(screen.getAllByText('Sign In').slice(-1)[0]); });
    await waitFor(() => expect(screen.getByText('Invalid email/ID number or password.')).toBeTruthy());
    const [url, init] = (global as any).fetch.mock.calls.find((c: any[]) => String(c[0]).endsWith('/api/login'));
    expect(JSON.parse(init.body)).toEqual({ identifier: '2024-00001', password: 'wrong' });
  });

  it('stores the token and exposes the user after a successful login', async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true, status: 200,
      json: async () => ({ token: 'tok123', user: { id: '7', name: 'Liza Gonzales', email: 'l@pass.edu', role: 'security' } }),
    });
    let ctx: any;
    function Probe() { ctx = useAuth(); return null; }
    await render(<AuthProvider><Probe /></AuthProvider>);
    await act(async () => { await ctx.login('l@pass.edu', 'secret123'); });
    expect(ctx.user.role).toBe('parking_staff'); // security -> parking_staff, like the web app
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('pass_auth_token', 'tok123');
  });

  it('rejects admin accounts on mobile without storing a token', async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true, status: 200, json: async () => ({ token: 'adm', user: { id: '1', name: 'A', email: 'a@x', role: 'admin' } }),
    });
    let ctx: any;
    function Probe() { ctx = useAuth(); return null; }
    await render(<AuthProvider><Probe /></AuthProvider>);
    await expect(act(async () => { await ctx.login('a@x', 'pw'); })).rejects.toThrow(/web dashboard/);
    expect(ctx.user).toBeNull();
  });

  it('validates registration step 1 before continuing', async () => {
    await wrap(<RegisterScreen onBack={() => {}} onDone={() => {}} />);
    await screen.findByText('Account Information');
    await fireEvent.press(screen.getByText('Continue'));
    expect(await screen.findByText('Enter your complete name.')).toBeTruthy();
    expect(screen.getByText('Enter a valid email address.')).toBeTruthy();
    expect(screen.getByText('Password must be at least 8 characters.')).toBeTruthy();
  });

  it('advances through registration steps with valid input', async () => {
    await wrap(<RegisterScreen onBack={() => {}} onDone={() => {}} />);
    await screen.findByText('Account Information');
    await fireEvent.changeText(screen.getByPlaceholderText('Juan dela Cruz'), 'Maria Santos');
    await fireEvent.changeText(screen.getByPlaceholderText('2024-00001'), '2024-00099');
    await fireEvent.changeText(screen.getByPlaceholderText('juan@university.edu'), 'maria@university.edu');
    await fireEvent.changeText(screen.getByPlaceholderText('Minimum 8 characters'), 'password1');
    await fireEvent.changeText(screen.getByPlaceholderText('Repeat password'), 'password1');
    await fireEvent.press(screen.getByText('Continue'));
    expect(await screen.findByText('Identity Verification')).toBeTruthy();
    await fireEvent.press(screen.getByText('Continue')); // no school ID uploaded
    expect(await screen.findByText('Upload a photo or scan of your school ID.')).toBeTruthy();
  });
});

describe('signed-in screens render for every role', () => {
  const nav = jest.fn();
  it.each(['student', 'faculty', 'employee'] as const)('home (%s)', async role => {
    await wrap(<HomeScreen user={user(role)} onNavigate={nav} />);
    expect(await screen.findByText('Maria Santos')).toBeTruthy();
    expect(screen.getByText('Not Parked')).toBeTruthy();
    expect(screen.getByText("Driver's License")).toBeTruthy();
    expect(screen.getByText('77 slots')).toBeTruthy();
    await fireEvent.press(screen.getByText('History'));
    expect(nav).toHaveBeenCalledWith('history');
  });
  it('home (parking staff)', async () => {
    await wrap(<HomeScreen user={user('parking_staff')} onNavigate={nav} />);
    expect(await screen.findByText("Today's Stats")).toBeTruthy();
    expect(screen.getByText('Vehicle Verify')).toBeTruthy();
  });
  it('home (guest)', async () => {
    await wrap(<HomeScreen user={user('guest')} onNavigate={nav} />);
    expect(await screen.findByText('Visitor Parking Request')).toBeTruthy();
  });
  it('parking totals match the zone data', async () => {
    await wrap(<ParkingScreen />);
    expect(await screen.findByText('77')).toBeTruthy();
    expect(screen.getByText('of 180 total slots')).toBeTruthy();
    expect(screen.getByText('Zone B')).toBeTruthy();
  });
  it('history search filters sessions', async () => {
    await wrap(<HistoryScreen />);
    expect(await screen.findByText('Sep 1, 2024')).toBeTruthy();
    await fireEvent.changeText(screen.getByPlaceholderText('Search by date...'), 'Aug 26');
    expect(screen.queryByText('Sep 1, 2024')).toBeNull();
    expect(screen.getByText('Aug 26, 2024')).toBeTruthy();
  });
  it('notifications: mark all read persists', async () => {
    await wrap(<NotificationScreen />);
    expect(await screen.findByText('3 unread')).toBeTruthy();
    await fireEvent.press(screen.getByText('Mark all read'));
    await waitFor(() => expect(screen.queryByText('Mark all read')).toBeNull());
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });
  it('profile shows role-specific items', async () => {
    await wrap(<ProfileScreen user={user('student')} onLogout={() => {}} onNavigate={nav} />);
    expect(await screen.findByText('My Vehicles')).toBeTruthy();
    expect(screen.getByText('RFID Card')).toBeTruthy();
    expect(screen.getByText('Verification: Not submitted')).toBeTruthy();
  });
  it('qr pass for a regular user', async () => {
    await wrap(<QRPassScreen user={user('student')} guestStatus="not_submitted" />);
    expect(await screen.findByText('My QR Pass')).toBeTruthy();
    expect(screen.getByText('Refresh QR Pass')).toBeTruthy();
  });
  it('guest qr pass is locked until approval', async () => {
    await wrap(<QRPassScreen user={user('guest')} guestStatus="not_submitted" />);
    expect(await screen.findByText('No Approved Pass')).toBeTruthy();
  });
});

describe('guest request + license forms', () => {
  it('guest request requires all fields', async () => {
    const set = jest.fn();
    await wrap(<GuestRequestScreen status="not_submitted" details={null} setRequest={set} />);
    await fireEvent.press(await screen.findByText('Submit for Approval'));
    expect(await screen.findByText('Please complete all required fields.')).toBeTruthy();
    expect(set).not.toHaveBeenCalled();
  });
  it('guest request submits valid data as pending', async () => {
    const set = jest.fn();
    await wrap(<GuestRequestScreen status="not_submitted" details={null} setRequest={set} />);
    await screen.findByText('Submit for Approval');
    await fireEvent.changeText(screen.getByPlaceholderText('Purpose of your campus visit'), 'Meeting');
    await fireEvent.changeText(screen.getByPlaceholderText('Name or office'), 'Registrar');
    await fireEvent.changeText(screen.getByPlaceholderText('YYYY-MM-DD'), '2099-01-01');
    await fireEvent.changeText(screen.getByPlaceholderText('HH:MM'), '09:30');
    await fireEvent.changeText(screen.getByPlaceholderText('e.g. ABC-1234'), 'XYZ-123');
    await fireEvent.changeText(screen.getByPlaceholderText('e.g. Toyota Vios'), 'Honda Civic');
    await fireEvent.press(screen.getByText('Submit for Approval'));
    expect(set).toHaveBeenCalledWith('pending', expect.objectContaining({ plate: 'XYZ-123', visitDate: '2099-01-01' }));
  });
  it('license form validates before submitting', async () => {
    await wrap(<LicenseScreen user={user('student')} onBack={() => {}} />);
    await fireEvent.press(await screen.findByText('Submit for Verification'));
    expect(await screen.findByText("Driver's license number is required")).toBeTruthy();
    expect(screen.getByText('Expiry date is required')).toBeTruthy();
    expect(screen.getByText("Upload a photo or scan of your driver's license")).toBeTruthy();
  });
});
