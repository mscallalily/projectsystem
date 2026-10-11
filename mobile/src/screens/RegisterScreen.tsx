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

type Props = {
  onBack: () => void;
  onDone: () => void;
};

const TYPES = ['student', 'faculty', 'employee', 'guest'];
const DEPARTMENTS = [
  'College of Engineering',
  'College of Science',
  'College of Business',
  'HR Department',
];

export default function RegisterScreen({ onBack, onDone }: Props) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    type: 'student',
    department: '',
    phone: '',
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  if (submitted) {
    return (
      <View style={styles.doneWrap}>
        <View style={styles.doneIcon}>
          <Ionicons name="checkmark-circle" size={44} color="#16A34A" />
        </View>
        <Text style={styles.doneTitle}>Account Created!</Text>
        <Text style={styles.doneText}>
          Your registration is pending admin approval. Sign in once approved.
        </Text>
        <Pressable onPress={onDone} style={[styles.button, { alignSelf: 'stretch' }]}>
          <Text style={styles.buttonText}>Go to Sign In</Text>
        </Pressable>
      </View>
    );
  }

  const step0Ready = form.name && form.email && form.password;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          onPress={step === 0 ? onBack : () => setStep(0)}
          style={styles.back}
        >
          <Ionicons name="arrow-back" size={18} color="#2563EB" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Step {step + 1} of 2</Text>

        <View style={styles.progress}>
          {[0, 1].map((i) => (
            <View
              key={i}
              style={[styles.bar, { backgroundColor: i <= step ? '#2563EB' : '#F1F5F9' }]}
            />
          ))}
        </View>

        {step === 0 && (
          <View>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              value={form.name}
              onChangeText={(v) => update('name', v)}
              placeholder="Juan dela Cruz"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              value={form.email}
              onChangeText={(v) => update('email', v)}
              placeholder="juan@university.edu"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />

            <Text style={styles.label}>Password</Text>
            <View>
              <TextInput
                value={form.password}
                onChangeText={(v) => update('password', v)}
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
              onPress={() => setStep(1)}
              disabled={!step0Ready}
              style={[styles.button, !step0Ready && { opacity: 0.5 }]}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </Pressable>
          </View>
        )}

        {step === 1 && (
          <View>
            <Text style={styles.label}>Account Type</Text>
            <View style={styles.typeGrid}>
              {TYPES.map((t) => {
                const active = form.type === t;
                return (
                  <Pressable
                    key={t}
                    onPress={() => update('type', t)}
                    style={[
                      styles.typeBtn,
                      active && { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeText,
                        { color: active ? '#2563EB' : '#64748B' },
                      ]}
                    >
                      {t}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.label, { marginTop: 8 }]}>Department</Text>
            {DEPARTMENTS.map((d) => {
              const active = form.department === d;
              return (
                <Pressable
                  key={d}
                  onPress={() => update('department', d)}
                  style={[
                    styles.deptRow,
                    active && { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
                  ]}
                >
                  <Text style={{ color: active ? '#2563EB' : '#475569', fontSize: 14 }}>
                    {d}
                  </Text>
                  {active && (
                    <Ionicons name="checkmark" size={18} color="#2563EB" />
                  )}
                </Pressable>
              );
            })}

            <Text style={[styles.label, { marginTop: 8 }]}>Contact Number</Text>
            <TextInput
              value={form.phone}
              onChangeText={(v) => update('phone', v)}
              placeholder="09XX XXX XXXX"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              style={styles.input}
            />

            <Pressable
              onPress={() => setSubmitted(true)}
              style={[styles.button, { backgroundColor: '#16A34A' }]}
            >
              <Text style={styles.buttonText}>Submit Registration</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, paddingTop: 56, paddingBottom: 32 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 24 },
  backText: { color: '#2563EB', fontSize: 14, fontWeight: '500' },
  title: { fontSize: 24, fontWeight: '700', color: '#123B6D', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#94A3B8', marginBottom: 24 },
  progress: { flexDirection: 'row', gap: 8, marginBottom: 32 },
  bar: { flex: 1, height: 6, borderRadius: 3 },
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
    marginTop: 8,
  },
  buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  typeBtn: {
    width: '47%',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  typeText: { fontSize: 14, fontWeight: '500', textTransform: 'capitalize' },
  deptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
  },
  doneWrap: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  doneIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  doneTitle: { fontSize: 20, fontWeight: '700', color: '#123B6D', marginBottom: 8 },
  doneText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
  },
});