import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import PlaceholderScreen from './src/screens/PlaceholderScreen';
import BottomNav from './src/components/BottomNav';
import { MobileUser } from './src/data/accounts';
import { Tab } from './src/types';

type AuthScreen = 'welcome' | 'login' | 'register';

export default function App() {
  const [authScreen, setAuthScreen] = useState<AuthScreen>('welcome');
  const [user, setUser] = useState<MobileUser | null>(null);
  const [tab, setTab] = useState<Tab>('home');

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

  const lightStatusBar = user ? tab === 'home' : authScreen === 'welcome';

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
          <View style={{ flex: 1 }}>
            {tab === 'home' ? (
              <HomeScreen user={user} onNavigate={setTab} />
            ) : (
              <PlaceholderScreen tab={tab} onSignOut={signOut} />
            )}
          </View>
          <BottomNav role={user.role} active={tab} onChange={setTab} />
        </View>
      )}
    </View>
  );
}