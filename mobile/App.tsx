import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Pressable } from 'react-native';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import { MobileUser } from './src/data/accounts';

type Screen = 'welcome' | 'login' | 'register' | 'guest' | 'home';

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [user, setUser] = useState<MobileUser | null>(null);

  const signOut = () => {
    setUser(null);
    setScreen('welcome');
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style={screen === 'welcome' ? 'light' : 'dark'} />

      {screen === 'welcome' && (
        <WelcomeScreen
          onLogin={() => setScreen('login')}
          onRegister={() => setScreen('register')}
          onGuest={() => setScreen('guest')}
        />
      )}

      {screen === 'login' && (
        <LoginScreen
          onBack={() => setScreen('welcome')}
          onSuccess={(u) => {
            setUser(u);
            setScreen('home');
          }}
        />
      )}

      {screen === 'home' && user && (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}
        >
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#123B6D' }}>
            Welcome, {user.name}
          </Text>
          <Text style={{ color: '#64748B' }}>Role: {user.role}</Text>
          <Text style={{ color: '#64748B' }}>Home screen coming soon</Text>
          <Pressable onPress={signOut}>
            <Text style={{ color: '#2563EB', fontSize: 16 }}>Sign out</Text>
          </Pressable>
        </View>
      )}

      {(screen === 'register' || screen === 'guest') && (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}
        >
          <Text style={{ fontSize: 20 }}>"{screen}" screen coming soon</Text>
          <Pressable onPress={() => setScreen('welcome')}>
            <Text style={{ color: '#2563EB', fontSize: 16 }}>Back</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}