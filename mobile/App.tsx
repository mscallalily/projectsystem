import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ParkingScreen from './src/screens/ParkingScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import QRPassScreen from './src/screens/QRPassScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import BottomNav from './src/components/BottomNav';
import { MobileUser } from './src/data/accounts';
import { MOCK_NOTIFS } from './src/data/mock';
import type { Notif } from './src/data/mock';
import { Tab } from './src/types';

type AuthScreen = 'welcome' | 'login' | 'register';

export default function App() {
  const [authScreen, setAuthScreen] = useState<AuthScreen>('welcome');
  const [user, setUser] = useState<MobileUser | null>(null);
  const [tab, setTab] = useState<Tab>('home');
  const [notifs, setNotifs] = useState<Notif[]>(MOCK_NOTIFS);

  const signIn = (u: MobileUser) => {
    setUser(u);
    setTab('home');
  };

  const signOut = () => {
    setUser(null);
    setAuthScreen('welcome');
  };

  const guest = () =>
    signIn({ name: 'Guest User', role: 'guest', email: 'guest@pass.edu' });

  const markRead = (id: number) =>
    setNotifs((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const markAllRead = () =>
    setNotifs((list) => list.map((n) => ({ ...n, read: true })));

  // Light (white) status bar icons on screens with a dark-blue header
  const lightStatusBar = user
    ? tab === 'home' || tab === 'profile'
    : authScreen === 'welcome';

  const renderTab = (u: MobileUser) => {
    switch (tab) {
      case 'home':
        return <HomeScreen user={u} onNavigate={setTab} />;
      case 'parking':
        return <ParkingScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'notifications':
        return (
          <NotificationScreen
            notifs={notifs}
            onMarkRead={markRead}
            onMarkAllRead={markAllRead}
          />
        );
      case 'qr':
        return <QRPassScreen user={u} />;
      case 'profile':
        return <ProfileScreen user={u} onNavigate={setTab} onSignOut={signOut} />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style={lightStatusBar ? 'light' : 'dark'} />

      {!user && authScreen === 'welcome' && (
        <WelcomeScreen
          onLogin={() => setAuthScreen('login')}
          onRegister={() => setAuthScreen('register')}
          onGuest={guest}
        />
      )}
      {!user && authScreen === 'login' && (
        <LoginScreen onBack={() => setAuthScreen('welcome')} onSuccess={signIn} />
      )}
      {!user && authScreen === 'register' && (
        <RegisterScreen
          onBack={() => setAuthScreen('welcome')}
          onDone={() => setAuthScreen('login')}
        />
      )}

      {user && (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>{renderTab(user)}</View>
          <BottomNav role={user.role} active={tab} onChange={setTab} />
        </View>
      )}
    </View>
  );
}