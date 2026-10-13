import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins/600SemiBold';
import { Poppins_700Bold } from '@expo-google-fonts/poppins/700Bold';
import { Bell, Clock, Home, ParkingSquare, QrCode, User } from 'lucide-react-native';
import { AuthProvider, MobileRole, useAuth } from './src/context/AuthContext';
import { LicenseProvider } from './src/context/LicenseContext';
import { LoginScreen, RegisterScreen, WelcomeScreen } from './src/screens/AuthScreens';
import { HistoryScreen, HomeScreen, NotificationScreen, ParkingScreen } from './src/screens/MainScreens';
import { GuestRequestScreen, LicenseScreen, ProfileScreen, QRPassScreen, useGuestRequest } from './src/screens/MoreScreens';
import { MobileScreen } from './src/screens/shared';
import { C } from './src/theme';

function navItems(role: MobileRole): { key: MobileScreen; label: string; Icon: any }[] {
  if (role === 'parking_staff') {
    return [
      { key: 'home', label: 'Dashboard', Icon: Home },
      { key: 'parking', label: 'Parking', Icon: ParkingSquare },
      { key: 'notifications', label: 'Alerts', Icon: Bell },
      { key: 'profile', label: 'Profile', Icon: User },
    ];
  }
  if (role === 'guest') {
    return [
      { key: 'home', label: 'Home', Icon: Home },
      { key: 'qr', label: 'Visitor Pass', Icon: QrCode },
      { key: 'parking', label: 'Parking', Icon: ParkingSquare },
      { key: 'profile', label: 'Profile', Icon: User },
    ];
  }
  return [
    { key: 'home', label: 'Home', Icon: Home },
    { key: 'parking', label: 'Parking', Icon: ParkingSquare },
    { key: 'history', label: 'History', Icon: Clock },
    { key: 'notifications', label: 'Notifs', Icon: Bell },
    { key: 'profile', label: 'Profile', Icon: User },
  ];
}

function BottomNav({ role, active, onChange }: { role: MobileRole; active: MobileScreen; onChange: (s: MobileScreen) => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ backgroundColor: C.white, borderTopWidth: 1, borderTopColor: C.slate100, flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 4, height: 64 + insets.bottom, paddingBottom: insets.bottom }}>
      {navItems(role).map(({ key, label, Icon }) => {
        const on = active === key;
        return (
          <Pressable key={key} onPress={() => onChange(key)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 8, paddingHorizontal: 4 }}>
            <Icon size={22} color={on ? C.royal : C.slate400} />
            <Text numberOfLines={1} style={{ fontFamily: 'Inter_500Medium', fontSize: 10, color: on ? C.royal : C.slate400 }}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Root() {
  const { user, logout, restoring } = useAuth();
  const [authScreen, setAuthScreen] = useState<'welcome' | 'login' | 'register'>('welcome');
  const [tab, setTab] = useState<MobileScreen>('home');
  const guest = useGuestRequest();

  if (restoring) {
    return <View style={{ flex: 1, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={C.royal} /></View>;
  }

  if (!user) {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar style={authScreen === 'welcome' ? 'light' : 'dark'} />
        {authScreen === 'welcome' && <WelcomeScreen onLogin={() => setAuthScreen('login')} onRegister={() => setAuthScreen('register')} />}
        {authScreen === 'login' && <LoginScreen onBack={() => setAuthScreen('welcome')} />}
        {authScreen === 'register' && <RegisterScreen onBack={() => setAuthScreen('welcome')} onDone={() => setAuthScreen('login')} />}
      </View>
    );
  }

  const handleLogout = async () => {
    await logout();
    setAuthScreen('welcome');
    setTab('home');
  };

  // Screens with a navy header run edge-to-edge, so the status bar icons must be light there.
  const navyHeader = tab === 'profile' || (tab === 'home');

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar style={navyHeader ? 'light' : 'dark'} />
      <View style={{ flex: 1 }}>
        {tab === 'home' && <HomeScreen user={user} onNavigate={setTab} />}
        {tab === 'guest-request' && user.role === 'guest' && <GuestRequestScreen status={guest.status} details={guest.details} setRequest={guest.set} />}
        {tab === 'parking' && <ParkingScreen />}
        {tab === 'history' && <HistoryScreen />}
        {tab === 'notifications' && <NotificationScreen />}
        {tab === 'qr' && <QRPassScreen user={user} guestStatus={guest.status} />}
        {tab === 'license' && user.role !== 'guest' && user.role !== 'parking_staff' && <LicenseScreen user={user} onBack={() => setTab('profile')} />}
        {tab === 'profile' && <ProfileScreen user={user} onLogout={handleLogout} onNavigate={setTab} />}
      </View>
      <BottomNav role={user.role} active={tab} onChange={setTab} />
    </View>
  );
}

export default function App() {
  const [loaded] = useFonts({
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Poppins_600SemiBold, Poppins_700Bold,
  });
  if (!loaded) {
    return <View style={{ flex: 1, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={C.royal} /></View>;
  }
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <LicenseProvider>
          <Root />
        </LicenseProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
