import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { AlertCircle, Briefcase, Car, Check, ChevronLeft, ChevronRight, Eye, EyeOff, IdCard, User } from 'lucide-react-native';
import { api } from '../api/client';
import { C } from '../theme';
import { Btn, ErrorBox, Field, FileUpload, PickedFile, T, txt } from './ui';
import { Select } from './Select';

export const REGISTRATION_STEPS = ['Account Info', 'ID Verification', 'User Details', 'Vehicle', 'Review'] as const;

const USER_TYPES = [
  { value: 'student', label: 'Student' },
  { value: 'faculty', label: 'Faculty' },
  { value: 'employee', label: 'Employee' },
  { value: 'other', label: 'Other Authorized' },
];
const DEPARTMENTS = [
  'College of Engineering', 'College of Science', 'College of Business', 'College of Arts',
  'College of Nursing', 'Registrar Office', 'HR Department', 'IT Department',
];
const VEHICLE_TYPES = ['Sedan', 'SUV', 'Hatchback', 'Pickup', 'Van', 'Motorcycle'];
const LICENSE_TYPES = [
  { value: 'student_permit', label: 'Student Permit' },
  { value: 'non_professional', label: 'Non-Professional' },
  { value: 'professional', label: 'Professional' },
  { value: 'international', label: 'International' },
];

interface FormState {
  fullName: string; idNum: string; email: string; password: string; confirmPwd: string; idFile: PickedFile | null;
  userType: string; dept: string; contact: string;
  hasVehicle: boolean | null; vehicleType: string; plate: string; make: string; model: string; color: string;
  licenseNo: string; licenseType: string; licenseExpiry: string; licenseFile: PickedFile | null;
  agree: boolean;
}

const INITIAL: FormState = {
  fullName: '', idNum: '', email: '', password: '', confirmPwd: '', idFile: null,
  userType: 'student', dept: '', contact: '',
  hasVehicle: null, vehicleType: 'Sedan', plate: '', make: '', model: '', color: '',
  licenseNo: '', licenseType: 'non_professional', licenseExpiry: '', licenseFile: null,
  agree: false,
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function validateStep(step: number, f: FormState): Record<string, string> {
  const e: Record<string, string> = {};
  if (step === 0) {
    if (!f.fullName.trim() || f.fullName.trim().split(/\s+/).length < 2) e.fullName = 'Enter your complete name.';
    if (!f.idNum.trim()) e.idNum = 'Institutional ID number is required.';
    if (!f.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid email address.';
    if (f.password.length < 8) e.password = 'Password must be at least 8 characters.';
    if (f.password !== f.confirmPwd) e.confirmPwd = 'Passwords do not match.';
  }
  if (step === 1 && !f.idFile) e.idFile = 'Upload a photo or scan of your school ID.';
  if (step === 2) {
    if (!f.userType) e.userType = 'Select a user type.';
    if (!f.dept) e.dept = 'Department is required.';
    if (!f.contact.trim()) e.contact = 'Contact number is required.';
  }
  if (step === 3) {
    if (f.hasVehicle === null) e.hasVehicle = 'Please choose Yes or No.';
    if (f.hasVehicle === true) {
      if (!f.plate.trim()) e.plate = 'Plate number is required.';
      if (!f.make.trim()) e.make = 'Vehicle make is required.';
      if (!f.model.trim()) e.model = 'Vehicle model is required.';
      if (!f.color.trim()) e.color = 'Vehicle color is required.';
      if (!f.licenseNo.trim()) e.licenseNo = "Driver's license number is required.";
      if (!f.licenseType) e.licenseType = 'License type is required.';
      if (!f.licenseExpiry) e.licenseExpiry = 'License expiry date is required.';
      else if (!DATE_RE.test(f.licenseExpiry) || isNaN(Date.parse(`${f.licenseExpiry}T00:00:00`))) e.licenseExpiry = 'Use the format YYYY-MM-DD.';
      else {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        if (new Date(`${f.licenseExpiry}T00:00:00`) < today) e.licenseExpiry = 'This license is already expired.';
      }
      if (!f.licenseFile) e.licenseFile = "Upload a photo or scan of your driver's license.";
    }
  }
  return e;
}

function chunk<A>(arr: A[], n: number): A[][] {
  const out: A[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

export default function RegistrationForm({ onBackToLogin, onExit }: { onBackToLogin: () => void; onExit?: () => void }) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const last = REGISTRATION_STEPS.length - 1;

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key as string]) setErrors(e => { const n = { ...e }; delete n[key as string]; return n; });
    if (submitError) setSubmitError('');
  };

  const next = () => {
    const e = validateStep(step, form);
    setErrors(e);
    if (Object.keys(e).length === 0) { setStep(s => Math.min(s + 1, last)); setSubmitError(''); }
  };
  const prev = () => {
    setErrors({});
    if (step === 0) onExit?.(); else setStep(s => s - 1);
  };

  const text = (label: string, key: keyof FormState, placeholder: string, extra: object = {}) => (
    <Field key={key as string} label={label} value={form[key] as string} placeholder={placeholder}
      onChangeText={v => set(key, v as never)} error={errors[key as string]} {...extra} />
  );

  const submitRegistration = async () => {
    if (!form.agree || isSubmitting) return;
    const all = { ...validateStep(0, form), ...validateStep(1, form), ...validateStep(2, form), ...validateStep(3, form) };
    if (Object.keys(all).length > 0) {
      setErrors(all);
      const bad = [0, 1, 2, 3].find(s => Object.keys(validateStep(s, form)).length > 0);
      if (bad !== undefined) setStep(bad);
      setSubmitError('Please correct the highlighted information before submitting.');
      return;
    }

    setIsSubmitting(true); setSubmitError(''); setErrors({});
    try {
      const data = new FormData();
      data.append('full_name', form.fullName.trim());
      data.append('user_code', form.idNum.trim());
      data.append('email', form.email.trim());
      data.append('password', form.password);
      data.append('password_confirmation', form.confirmPwd);
      data.append('user_type', form.userType);
      data.append('department', form.dept);
      data.append('contact_number', form.contact.trim());
      data.append('has_vehicle', form.hasVehicle ? '1' : '0');
      const file = (f: PickedFile) => ({ uri: f.uri, name: f.name, type: f.type } as any);
      if (form.idFile) data.append('school_id_file', file(form.idFile));
      if (form.hasVehicle) {
        data.append('vehicle_type', form.vehicleType);
        data.append('plate_number', form.plate.trim().toUpperCase());
        data.append('make', form.make.trim());
        data.append('model', form.model.trim());
        data.append('color', form.color.trim());
        data.append('license_number', form.licenseNo.trim());
        data.append('license_type', form.licenseType);
        data.append('license_expiry', form.licenseExpiry);
        if (form.licenseFile) data.append('license_file', file(form.licenseFile));
      }
      await api('/register', { form: data });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Unable to submit registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- Success ---------- */
  if (submitted) {
    return (
      <View style={{ alignItems: 'center', paddingVertical: 48 }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: C.green100, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <Check size={36} color={C.green600} />
        </View>
        <T s={24} w="head" c={C.navy} style={{ marginBottom: 12, textAlign: 'center' }}>Registration Submitted!</T>
        <T s={16} c={C.slate500} style={{ marginBottom: 8, textAlign: 'center' }}>Your account is pending review by the PASS administrator.</T>
        <T s={14} c={C.slate400} style={{ marginBottom: 24, textAlign: 'center' }}>
          {form.hasVehicle
            ? "Your vehicle and driver's license will be reviewed separately. No RFID is issued until the vehicle is authorized."
            : 'You can add a vehicle later from My Vehicle once your account is approved.'}
        </T>
        <Btn label="Go to Sign In" onPress={onBackToLogin} style={{ alignSelf: 'stretch' }} py={12} />
      </View>
    );
  }

  const heading = (icon: React.ReactNode, title: string) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      {icon}
      <T s={18} w="head" c={C.navy} style={{ fontFamily: 'Poppins_600SemiBold' }}>{title}</T>
    </View>
  );

  const choice = (on: boolean, label: string, onPress: () => void, key?: string) => (
    <Pressable key={key ?? label} onPress={onPress} style={{
      flex: 1, paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12, borderWidth: 2, alignItems: 'center',
      borderColor: on ? C.royal : C.slate200, backgroundColor: on ? C.blue50 : C.white,
    }}>
      <Text style={txt(14, 'medium', on ? C.royal : C.slate500)}>{label}</Text>
    </Pressable>
  );

  const reviewRows: { label: string; value: string }[] = [
    { label: 'Full Name', value: form.fullName },
    { label: 'ID Number', value: form.idNum },
    { label: 'Email', value: form.email },
    { label: 'School ID Upload', value: form.idFile?.name ?? '' },
    { label: 'User Type', value: USER_TYPES.find(t => t.value === form.userType)?.label ?? form.userType },
    { label: 'Department', value: form.dept },
    { label: 'Contact', value: form.contact },
    ...(form.hasVehicle
      ? [
          { label: 'Vehicle', value: `${form.vehicleType} — ${form.make} ${form.model}, ${form.color}` },
          { label: 'Plate Number', value: form.plate.toUpperCase() },
          { label: "Driver's License No.", value: form.licenseNo },
          { label: 'License Type', value: LICENSE_TYPES.find(t => t.value === form.licenseType)?.label ?? form.licenseType },
          { label: 'License Expiry', value: form.licenseExpiry },
          { label: 'License Upload', value: form.licenseFile?.name ?? '' },
        ]
      : [{ label: 'Vehicle', value: 'None to register now' }]),
  ];

  const eye = (
    <Pressable onPress={() => setShowPwd(v => !v)} accessibilityLabel={showPwd ? 'Hide password' : 'Show password'} hitSlop={10}>
      {showPwd ? <EyeOff size={18} color={C.slate400} /> : <Eye size={18} color={C.slate400} />}
    </Pressable>
  );

  return (
    <View>
      {/* Progress */}
      <View style={{ marginBottom: 24 }}>
        <Text style={[txt(14, 'regular', C.slate400), { marginBottom: 8 }]}>
          Step {step + 1} of {REGISTRATION_STEPS.length} · <Text style={txt(14, 'medium', C.navy)}>{REGISTRATION_STEPS[step]}</Text>
        </Text>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {REGISTRATION_STEPS.map((s, i) => (
            <View key={s} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: i <= step ? C.royal : C.slate100 }} />
          ))}
        </View>
      </View>

      <View style={{ gap: 20 }}>
        {step === 0 && (
          <>
            {heading(<User size={18} color={C.navy} />, 'Account Information')}
            {text('Full Name', 'fullName', 'Juan dela Cruz', { autoCapitalize: 'words' })}
            {text('Institutional ID Number', 'idNum', '2024-00001', { autoCapitalize: 'none' })}
            {text('Email Address', 'email', 'juan@university.edu', { keyboardType: 'email-address', autoCapitalize: 'none', autoCorrect: false })}
            <Field label="Password" value={form.password} placeholder="Minimum 8 characters" secureTextEntry={!showPwd}
              autoCapitalize="none" onChangeText={v => set('password', v)} error={errors.password} right={eye} />
            <Field label="Confirm Password" value={form.confirmPwd} placeholder="Repeat password" secureTextEntry={!showPwd}
              autoCapitalize="none" onChangeText={v => set('confirmPwd', v)} error={errors.confirmPwd} />
          </>
        )}

        {step === 1 && (
          <>
            {heading(<IdCard size={18} color={C.navy} />, 'Identity Verification')}
            <T s={14} c={C.slate500}>Upload a clear photo or scan of your school ID. The administrator uses it to confirm your affiliation with DYCI.</T>
            <FileUpload label="School ID (front)" file={form.idFile} error={errors.idFile}
              onChange={f => set('idFile', f)} onError={m => setErrors(e => ({ ...e, idFile: m }))} />
          </>
        )}

        {step === 2 && (
          <>
            {heading(<Briefcase size={18} color={C.navy} />, 'User Details')}
            <View>
              <Text style={[txt(14, 'medium', C.slate700), { marginBottom: 6 }]}>User Type</Text>
              <View style={{ gap: 12 }}>
                {chunk(USER_TYPES, 2).map((row, i) => (
                  <View key={i} style={{ flexDirection: 'row', gap: 12 }}>
                    {row.map(t => choice(form.userType === t.value, t.label, () => set('userType', t.value)))}
                  </View>
                ))}
              </View>
              {errors.userType ? <Text style={[txt(12, 'regular', C.red500), { marginTop: 4 }]}>{errors.userType}</Text> : null}
            </View>
            <Select label="Department / College" value={form.dept} placeholder="Select department"
              options={DEPARTMENTS.map(d => ({ value: d, label: d }))} onChange={v => set('dept', v)} error={errors.dept} />
            {text('Contact Number', 'contact', '09XX XXX XXXX', { keyboardType: 'phone-pad' })}
          </>
        )}

        {step === 3 && (
          <>
            {heading(<Car size={18} color={C.navy} />, 'Vehicle (optional)')}
            <View>
              <Text style={[txt(14, 'medium', C.slate700), { marginBottom: 6 }]}>Do you have a vehicle to register?</Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {choice(form.hasVehicle === true, 'Yes', () => set('hasVehicle', true))}
                {choice(form.hasVehicle === false, 'No, not now', () => set('hasVehicle', false))}
              </View>
              {errors.hasVehicle ? <Text style={[txt(12, 'regular', C.red500), { marginTop: 4 }]}>{errors.hasVehicle}</Text> : null}
              {form.hasVehicle === false && (
                <View style={{ marginTop: 12, backgroundColor: C.slate50, borderWidth: 1, borderColor: C.slate200, borderRadius: 12, padding: 12 }}>
                  <T s={12} c={C.slate500}>No problem. You can still submit your account registration. Once your account is approved, you can register a vehicle later under My Vehicle.</T>
                </View>
              )}
            </View>

            {form.hasVehicle === true && (
              <>
                <View>
                  <Text style={[txt(14, 'medium', C.slate700), { marginBottom: 6 }]}>Vehicle Type</Text>
                  <View style={{ gap: 8 }}>
                    {chunk(VEHICLE_TYPES, 3).map((row, i) => (
                      <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
                        {row.map(t => {
                          const on = form.vehicleType === t;
                          return (
                            <Pressable key={t} onPress={() => set('vehicleType', t)} style={{
                              flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 1, alignItems: 'center',
                              borderColor: on ? C.royal : C.slate200, backgroundColor: on ? C.blue50 : C.white,
                            }}>
                              <Text style={txt(12, 'medium', on ? C.royal : C.slate500)}>{t}</Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    ))}
                  </View>
                </View>
                {text('Plate Number', 'plate', 'ABC-1234', { autoCapitalize: 'characters' })}
                {text('Make (Brand)', 'make', 'Toyota, Honda, Mitsubishi...')}
                {text('Model', 'model', 'Vios, Civic, Mirage...')}
                {text('Color', 'color', 'White, Silver, Black...')}

                <View style={{ borderTopWidth: 1, borderTopColor: C.slate100, paddingTop: 8 }}>
                  <T s={14} w="semibold" c={C.navy} style={{ marginTop: 16, marginBottom: 12 }}>Driver's License</T>
                  <View style={{ gap: 20 }}>
                    {text('License Number', 'licenseNo', 'N01-23-456789')}
                    <Select label="License Type" value={form.licenseType} options={LICENSE_TYPES} onChange={v => set('licenseType', v)} error={errors.licenseType} />
                    {text('Expiry Date', 'licenseExpiry', 'YYYY-MM-DD', { keyboardType: 'numbers-and-punctuation', maxLength: 10 })}
                    <FileUpload label="Driver's License (front)" file={form.licenseFile} error={errors.licenseFile}
                      onChange={f => set('licenseFile', f)} onError={m => setErrors(e => ({ ...e, licenseFile: m }))} />
                  </View>
                </View>
              </>
            )}
          </>
        )}

        {step === 4 && (
          <>
            {heading(<Check size={18} color={C.navy} />, 'Review & Confirm')}
            <View style={{ gap: 4 }}>
              {reviewRows.map(r => (
                <View key={r.label} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.slate50 }}>
                  <T s={14} w="medium" c={C.slate400}>{r.label}</T>
                  <T s={14} w="semibold" c={C.slate700} style={{ flex: 1, textAlign: 'right' }}>{r.value || '—'}</T>
                </View>
              ))}
            </View>
            <Pressable onPress={() => set('agree', !form.agree)} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
              <View style={{ width: 20, height: 20, marginTop: 2, borderRadius: 4, borderWidth: 1, borderColor: form.agree ? C.royal : C.slate300, backgroundColor: form.agree ? C.royal : C.white, alignItems: 'center', justifyContent: 'center' }}>
                {form.agree ? <Check size={14} color={C.white} /> : null}
              </View>
              <Text style={[txt(14, 'regular', C.slate600), { flex: 1 }]}>
                I agree to the PASS <Text style={{ color: C.royal }}>Terms and Conditions</Text> and <Text style={{ color: C.royal }}>Privacy Notice</Text>. I certify that all information and documents provided are accurate.
              </Text>
            </Pressable>
            {!form.agree && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.amber50, padding: 12, borderRadius: 12 }}>
                <AlertCircle size={14} color={C.amber600} />
                <Text style={[txt(12, 'regular', C.amber600), { flex: 1 }]}>Please agree to the terms to submit your registration.</Text>
              </View>
            )}
          </>
        )}

        {submitError ? (
          <View accessibilityRole="alert" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: C.red50, borderWidth: 1, borderColor: C.red200, padding: 12, borderRadius: 12 }}>
            <AlertCircle size={18} color={C.red700} style={{ marginTop: 2 }} />
            <Text style={[txt(14, 'regular', C.red700), { flex: 1 }]}>{submitError}</Text>
          </View>
        ) : null}
      </View>

      {/* Footer buttons */}
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 32, alignItems: 'center' }}>
        {(step > 0 || onExit) && (
          <Pressable onPress={prev} disabled={isSubmitting} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: C.slate200, opacity: isSubmitting ? 0.5 : 1 }}>
            <ChevronLeft size={16} color={C.slate600} />
            <Text style={txt(14, 'medium', C.slate600)}>Back</Text>
          </Pressable>
        )}
        <View style={{ flex: 1 }} />
        {step < last ? (
          <Pressable onPress={next} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, backgroundColor: C.royal }}>
            <Text style={txt(14, 'semibold', C.white)}>Continue</Text>
            <ChevronRight size={16} color={C.white} />
          </Pressable>
        ) : (
          <Pressable onPress={submitRegistration} disabled={!form.agree || isSubmitting} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, backgroundColor: C.green600, opacity: !form.agree || isSubmitting ? 0.5 : 1 }}>
            <Check size={16} color={C.white} />
            <Text style={txt(14, 'semibold', C.white)}>{isSubmitting ? 'Submitting...' : 'Submit Registration'}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
