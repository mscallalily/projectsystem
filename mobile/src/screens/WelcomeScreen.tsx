import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  onLogin: () => void;
  onRegister: () => void;
  onGuest: () => void;
};

export default function WelcomeScreen({ onLogin, onRegister, onGuest }: Props) {
  return (
    <LinearGradient colors={['#123B6D', '#2563EB']} style={styles.container}>
      <View style={styles.logoBox}>
        <Ionicons name="shield-outline" size={40} color="#38BDF8" />
      </View>

      <Text style={styles.title}>PASS</Text>
      <Text style={styles.subtitle}>Parking Access & Security System</Text>
      <Text style={styles.tag}>Mobile App</Text>

      <View style={styles.buttons}>
        <Pressable
          onPress={onLogin}
          style={({ pressed }) => [styles.signIn, pressed && styles.pressed]}
        >
          <Ionicons name="log-in-outline" size={22} color="#123B6D" />
          <Text style={styles.signInText}>Sign In</Text>
        </Pressable>

        <Pressable
          onPress={onRegister}
          style={({ pressed }) => [styles.create, pressed && styles.pressed]}
        >
          <Ionicons name="person-add-outline" size={20} color="#FFFFFF" />
          <Text style={styles.createText}>Create Account</Text>
        </Pressable>

        <Pressable onPress={onGuest} style={styles.guest}>
          <Text style={styles.guestText}>Continue as Guest</Text>
        </Pressable>
      </View>

      <Text style={styles.footer}>
        Sign in to access your parking dashboard, view slot availability, and
        manage your QR pass.
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: { fontSize: 30, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#BFDBFE', marginBottom: 8 },
  tag: { fontSize: 12, color: '#93C5FD', marginBottom: 48 },
  buttons: { width: '100%', gap: 12 },
  signIn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  signInText: { color: '#123B6D', fontWeight: '700', fontSize: 16 },
  create: {
    backgroundColor: 'rgba(56,189,248,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.3)',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  createText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  guest: { paddingVertical: 12, alignItems: 'center' },
  guestText: { color: '#93C5FD', fontSize: 14, fontWeight: '500' },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  footer: {
    color: '#60A5FA',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 40,
    maxWidth: 280,
  },
});