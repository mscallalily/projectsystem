import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { register, errorMessages } from '../api';

type Props = {
  onBack: () => void;
  onDone: () => void;
};

// These lists match the seeded database exactly.
const TYPES = ['student', 'faculty', 'employee', 'other'];
const DEPARTMENTS = [
  'College of Engineering',
  'College of Science',
  'College of Business',
  'College of Arts',
  'College of Nursing',
  'Registrar Office',
  'HR Department',
  'IT Department',
  'Security Office',
];
const VEHICLE_TYPES = ['Sedan', 'SUV', 'Hatchback', 'Pickup', 'Van', 'Motorcycle'];

function Field({
  label,
  value,
  onChangeText,
  ...rest
}: { label: string; value: string; onChangeText: (v: string) => void } & TextInputProps) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#94A3B8"
        style={styles.input}
        {...rest}
      />
    </View>
  );
}

export default function RegisterScreen({ onBack, onDone }: Props) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    userCode: '',
    email: '',
    password: '',
    confirm: '',
    type: 'student',
    department: '',
    phone: '',
    vehicleType: '',
    plate: '',
    make: '',
    model: '',
    color: '',
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const nameOk = /\S+\s+\S+/.test(form.fullName.trim());
  const pwdOk = form.password.length >= 8;
  const matchOk = form.password === form.confirm;

  const ready = [
    nameOk && form.userCode && form.email && pwdOk && matchOk && form.confirm !== '',
    form.department !== '' && form.phone !== '',
    form.vehicleType !== '' && form.plate !== '',
  ];

  const submit = async () => {
    setErrors([]);
    setLoading(true);
    try {
      await register({
        full_name: form.fullName.trim(),
        user_code: form.userCode.trim(),
        email: form.email.trim(),
        password: form.password,
        password_confirmation: form.confirm,
        user_type: form.type,
        department: form.department,
        contact_number: form.phone.trim(),
        vehicle_type: form.vehicleType,
        plate_number: form.plate.trim().toUpperCase(),
        make: form.make.trim() || undefined,
        model: form.model.trim() || undefined,
        color: form.color.trim() || undefined,
      });
      setDone(true);
    } catch (e) {
      setErrors(errorMessages(e));
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <View style={styles.doneWrap}>
        <View style={styles.doneIcon}>
          <Ionicons name="checkmark-circle" size={44} color="#16A34A" />
        </View>
        <Text style={styles.doneTitle}>Account Created!</Text>
        <Text style={styles.doneText}>
          Your registration is pending approval by the PASS administrator. You can
          sign in once it is approved.
        </Text>
        <Pressable onPress={onDone} style={[styles.button, { alignSelf: 'stretch' }]}>
          <Text style={styles.buttonText}>Go to Sign In</Text>
        </Pressable>
      </View>
    );
  }

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
          onPress={step === 0 ? onBack : () => setStep(step - 1)}
          style={styles.back}
        >
          <Ionicons name="arrow-back" size={18} color="#2563EB" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Step {step + 1} of 3</Text>

        <View style={styles.progress}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[styles.bar, { backgroundColor: i <= step ? '#2563EB' : '#F1F5F9' }]}
            />
          ))}
        </View>

        {errors.length > 0 && (
          <View style={styles.errorBox}>
            <Ionicons name="warning-outline" size={16} color="#B91C1C" />
            <View style={{ flex: 1, gap: 4 }}>
              {errors.map((m, i) => (
                <Text key={i} style={styles.errorText}>
                  {m}
                </Text>
              ))}
            </View>
          </View>
        )}

        {step === 0 && (
          <View>
            <Field
              label="Full Name"
              value={form.fullName}
              onChangeText={(v) => update('fullName', v)}
              placeholder="Juan Dela Cruz"
            />
            {form.fullName !== '' && !nameOk && (
              <Text style={styles.hint}>Enter your first and last name.</Text>
            )}

            <Field
              label="ID Number"
              value={form.userCode}
              onChangeText={(v) => update('userCode', v)}
              placeholder="2024-0001"
              autoCapitalize="characters"
              autoCorrect={false}
            />
            <Field
              label="Email"
              value={form.email}
              onChangeText={(v) => update('email', v)}
              placeholder="juan@university.edu"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />

            <Text style={styles.label}>Password</Text>
            <View>
              <TextInput
                value={form.password}
                onChangeText={(v) => update('password', v)}
                placeholder="At least 8 characters"
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
            {form.password !== '' && !pwdOk && (
              <Text style={styles.hint}>Password must be at least 8 characters.</Text>
            )}

            <Field
              label="Confirm Password"
              value={form.confirm}
              onChangeText={(v) => update('confirm', v)}
              placeholder="Type the password again"
              secureTextEntry={!showPwd}
              autoCapitalize="none"
            />
            {form.confirm !== '' && !matchOk && (
              <Text style={styles.hint}>Passwords do not match.</Text>
            )}
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
                      style={[styles.typeText, { color: active ? '#2563EB' : '#64748B' }]}
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
                  {active && <Ionicons name="checkmark" size={18} color="#2563EB" />}
                </Pressable>
              );
            })}

            <View style={{ height: 8 }} />
            <Field
              label="Contact Number"
              value={form.phone}
              onChangeText={(v) => update('phone', v)}
              placeholder="09XX XXX XXXX"
              keyboardType="phone-pad"
            />
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.label}>Vehicle Type</Text>
            <View style={styles.chips}>
              {VEHICLE_TYPES.map((v) => {
                const active = form.vehicleType === v;
                return (
                  <Pressable
                    key={v}
                    onPress={() => update('vehicleType', v)}
                    style={[
                      styles.chip,
                      active && { backgroundColor: '#2563EB', borderColor: '#2563EB' },
                    ]}
                  >
                    <Text
                      style={[styles.chipText, { color: active ? '#FFFFFF' : '#64748B' }]}
                    >
                      {v}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={{ height: 16 }} />
            <Field
              label="Plate Number"
              value={form.plate}
              onChangeText={(v) => update('plate', v)}
              placeholder="ABC-1234"
              autoCapitalize="characters"
              autoCorrect={false}
            />
            <Field
              label="Make (optional)"
              value={form.make}
              onChangeText={(v) => update('make', v)}
              placeholder="Toyota"
            />
            <Field
              label="Model (optional)"
              value={form.model}
              onChangeText={(v) => update('model', v)}
              placeholder="Vios"
            />
            <Field
              label="Color (optional)"
              value={form.color}
              onChangeText={(v) => update('color', v)}
              placeholder="White"
            />
          </View>
        )}

        {step < 2 ? (
          <Pressable
            onPress={() => {
              setErrors([]);
              setStep(step + 1);
            }}
            disabled={!ready[step]}
            style={[styles.button, !ready[step] && { opacity: 0.5 }]}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={submit}
            disabled={!ready[2] || loading}
            style={[
              styles.button,
              { backgroundColor: '#16A34A' },
              (!ready[2] || loading) && { opacity: 0.5 },
            ]}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Submitting...' : 'Submit Registration'}
            </Text>
          </Pressable>
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
  progress: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  bar: { flex: 1, height: 6, borderRadius: 3 },
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
  errorText: { color: '#B91C1C', fontSize: 13 },
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
  hint: { color: '#DC2626', fontSize: 12, marginTop: -10, marginBottom: 14 },
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
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipText: { fontSize: 13, fontWeight: '500' },
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
  doneText: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 32 },
});