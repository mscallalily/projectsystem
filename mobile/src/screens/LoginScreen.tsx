import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOBILE_ACCOUNTS, MobileUser } from '../data/accounts';

type Props = {
  onBack: () => void;
  onSuccess: (user: MobileUser) => void;
};

const DEMOS = [
  { label: 'Student', email: 'student@pass.edu' },
  { label: 'Faculty', email: 'faculty@pass.edu' },
  { label: 'Security', email: 'security@pass.edu' },
  { label: 'Guest', email: 'guest@pass.edu' },
];

export default function LoginScreen({ onBack, onSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    const found = MOBILE_ACCOUNTS[email.trim().toLowerCase()];
    if (found) {
      onSuccess(found);
    } else {
      setError('Invalid credentials. Try a demo account below.');
    }
  };

  const disabled = loading || !email;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={onBack} style={styles.back}>
          <Ionicons name="arrow-back" size={18} color="#2563EB" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons name="shield-outline" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>PASS Mobile</Text>
        </View>

        {error !== '' && (
          <View style={styles.errorBox}>
            <Ionicons name="warning-outline" size={16} color="#B91C1C" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Text style={styles.label}>Email or ID</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="email@university.edu"
          placeholderTextColor="#94A3B8"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <View>
          <TextInput
            value={pwd}
            onChangeText={setPwd}
            placeholder="••••••••"
            placeholderTextColor="#94A3B8"
            secureTextEntry={!showPwd}
            autoCapitalize="none"
            style={[styles.input, { paddingRight: 48 }]}
          />
          <Pressable onPress={() => setShowPwd((v) => !v)} style={styles.eye}>
            <Ionicons
              name={showPwd ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#94A3B8"
            />
          </Pressable>
        </View>

        <Pressable
          onPress={submit}
          disabled={disabled}
          style={[styles.button, disabled && { opacity: 0.5 }]}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Text>
        </Pressable>

        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>Demo accounts</Text>
          <View style={styles.demoRow}>
            {DEMOS.map((d) => (
              <Pressable
                key={d.email}
                onPress={() => setEmail(d.email)}
                style={styles.chip}
              >
                <Text style={styles.chipText}>{d.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, paddingTop: 56, paddingBottom: 32 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 24 },
  backText: { color: '#2563EB', fontSize: 14, fontWeight: '500' },
  header: { alignItems: 'center', marginBottom: 32 },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#123B6D',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: '700', color: '#123B6D' },
  subtitle: { fontSize: 14, color: '#94A3B8', marginTop: 4 },
  errorBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  errorText: { color: '#B91C1C', fontSize: 14, flex: 1 },
  label: { fontSize: 14, fontWeight: '500', color: '#334155', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 16,
  },
  eye: { position: 'absolute', right: 16, top: 14 },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  demoBox: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  demoTitle: { fontSize: 12, color: '#94A3B8', textAlign: 'center', marginBottom: 12 },
  demoRow: { flexDirection: 'row', gap: 8 },
  chip: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  chipText: { color: '#2563EB', fontSize: 12, fontWeight: '500' },
});