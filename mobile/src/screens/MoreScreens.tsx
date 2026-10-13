import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AlertTriangle, ArrowLeft, Bell, Car, CheckCircle, ChevronRight, ClipboardList, Clock, CreditCard, IdCard,
  LogOut, QrCode, Send, Settings, User,
} from 'lucide-react-native';
import { DyciLogo } from '../components/Brand';
import { Select } from '../components/Select';
import { Btn, Card, Field, FileUpload, Frame, PickedFile, T, txt } from '../components/ui';
import { MobileUser } from '../context/AuthContext';
import { LICENSE_STATUS_LABEL, LicenseStatus, useLicense } from '../context/LicenseContext';
import { C, withAlpha } from '../theme';
import { GUEST_QR, MobileScreen, NavyHeader, notAvailable, QRGrid, USER_QR } from './shared';

/* ------------------------------------------------------------------ Guest request */
export type GuestRequestStatus = 'not_submitted' | 'pending' | 'approved';
export type GuestRequestData = { reason: string; contactPerson: string; visitDate: string; arrivalTime: string; vehicleType: string; plate: string; makeModel: string };
const EMPTY_GUEST: GuestRequestData = { reason: '', contactPerson: '', visitDate: '', arrivalTime: '', vehicleType: 'Motorcycle', plate: '', makeModel: '' };
const GUEST_KEY = 'pass_guest_request';

/** Guest request state, saved on the device (the API has no visitor-request endpoint yet). */
export function useGuestRequest() {
  const [status, setStatusState] = useState<GuestRequestStatus>('not_submitted');
  const [details, setDetailsState] = useState<GuestRequestData | null>(null);
  useEffect(() => {
    AsyncStorage.getItem(GUEST_KEY).then(raw => {
      if (!raw) return;
      const v = JSON.parse(raw);
      setStatusState(v.status); setDetailsState(v.details);
    }).catch(() => {});
  }, []);
  const set = (s: GuestRequestStatus, d: GuestRequestData | null) => {
    setStatusState(s); setDetailsState(d);
    AsyncStorage.setItem(GUEST_KEY, JSON.stringify({ status: s, details: d })).catch(() => {});
  };
  return { status, details, set };
}

function Label({ children }: { children: React.ReactNode }) {
  return <T s={12} w="semibold" c={C.slate600} style={{ marginBottom: 4 }}>{children}</T>;
}

export function GuestRequestScreen({ status, details, setRequest }: {
  status: GuestRequestStatus; details: GuestRequestData | null; setRequest: (s: GuestRequestStatus, d: GuestRequestData | null) => void;
}) {
  const [form, setForm] = useState<GuestRequestData>(EMPTY_GUEST);
  const [error, setError] = useState('');
  const update = (k: keyof GuestRequestData, v: string) => setForm(p => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.reason.trim() || !form.contactPerson.trim() || !form.visitDate || !form.arrivalTime || !form.plate.trim() || !form.makeModel.trim()) {
      setError('Please complete all required fields.'); return;
    }
    const today = new Date().toISOString().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.visitDate) || isNaN(Date.parse(form.visitDate))) { setError('Visit date must use the format YYYY-MM-DD.'); return; }
    if (form.visitDate < today) { setError('Visit date cannot be in the past.'); return; }
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(form.arrivalTime)) { setError('Arrival time must use 24-hour HH:MM.'); return; }
    setRequest('pending', form); setError('');
  };

  const row = (label: string, value: string) => (
    <View><T s={12} c={C.slate400}>{label}</T><T s={14} w="medium" c={C.slate700}>{value}</T></View>
  );

  return (
    <Frame bottomPad={96}>
      <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12 }}>
        <T s={20} w="head" c={C.navy}>Visitor Parking Request</T>
        <T s={12} c={C.slate500} style={{ marginTop: 4 }}>Vehicle details are required for every visitor parking request.</T>
      </View>

      {status === 'not_submitted' ? (
        <View style={{ paddingHorizontal: 20, paddingBottom: 32, gap: 12 }}>
          <View><Label>Reason for visiting *</Label><Field multiline value={form.reason} onChangeText={v => update('reason', v)} placeholder="Purpose of your campus visit" /></View>
          <View><Label>Person / office to visit *</Label><Field value={form.contactPerson} onChangeText={v => update('contactPerson', v)} placeholder="Name or office" /></View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}><Label>Visit date *</Label><Field value={form.visitDate} onChangeText={v => update('visitDate', v)} placeholder="YYYY-MM-DD" keyboardType="numbers-and-punctuation" maxLength={10} /></View>
            <View style={{ flex: 1 }}><Label>Arrival time *</Label><Field value={form.arrivalTime} onChangeText={v => update('arrivalTime', v)} placeholder="HH:MM" keyboardType="numbers-and-punctuation" maxLength={5} /></View>
          </View>
          <View style={{ borderTopWidth: 1, borderTopColor: C.slate200, paddingTop: 12, gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 0 }}>
              <Car size={18} color={C.navy} /><T s={14} w="head" c={C.navy}>Vehicle Details</T>
            </View>
            <Select label="Vehicle type *" value={form.vehicleType} options={['Motorcycle', 'Car', 'Other'].map(v => ({ value: v, label: v }))} onChange={v => update('vehicleType', v)} />
            <View><Label>Plate number *</Label><Field value={form.plate} onChangeText={v => update('plate', v)} placeholder="e.g. ABC-1234" autoCapitalize="characters" /></View>
            <View><Label>Vehicle make and model *</Label><Field value={form.makeModel} onChangeText={v => update('makeModel', v)} placeholder="e.g. Toyota Vios" /></View>
          </View>
          {error ? <T s={12} c={C.red600} accessibilityRole="alert">{error}</T> : null}
          <View style={{ backgroundColor: C.white, borderWidth: 1, borderColor: C.slate200, borderRadius: 12, padding: 12 }}>
            <T s={12} c={C.slate500}>Your request must be approved before a temporary visitor QR pass can be issued. This is a UI prototype; submissions are not sent to a real administrator.</T>
          </View>
          <Btn label="Submit for Approval" onPress={submit} bg={C.navy} py={14} />
        </View>
      ) : (
        <View style={{ paddingHorizontal: 20, paddingBottom: 32, gap: 12 }}>
          <View style={{ borderRadius: 16, padding: 16, borderWidth: 1, backgroundColor: status === 'approved' ? C.green50 : C.amber50, borderColor: status === 'approved' ? C.green200 : C.amber200 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {status === 'approved' ? <CheckCircle size={20} color={C.green800} /> : <Clock size={20} color={C.amber800} />}
              <T s={16} w="bold" c={status === 'approved' ? C.green800 : C.amber800}>{status === 'approved' ? 'Request Approved' : 'Pending Approval'}</T>
            </View>
            <T s={12} c={C.slate600} style={{ marginTop: 8 }}>
              {status === 'approved' ? 'Approved-state preview is shown below. The sample QR is not valid for entry.' : 'Your request is waiting for review. No visitor QR pass is available yet.'}
            </T>
          </View>
          {details && (
            <Card border={C.slate200} style={{ gap: 12 }}>
              {row('Reason for visit', details.reason)}
              {row('Person / office', details.contactPerson)}
              {row('Visit schedule', `${details.visitDate} · ${details.arrivalTime}`)}
              {row('Registered vehicle', `${details.vehicleType} · ${details.makeModel} · ${details.plate}`)}
            </Card>
          )}
          {status === 'pending' && (
            <Btn label="Preview approved state (demo only)" onPress={() => setRequest('approved', details)} bg={C.white} color={C.green700} border={C.green600} py={12} />
          )}
          {status === 'approved' && (
            <Card border={C.green200} style={{ alignItems: 'center' }}>
              <View style={{ padding: 12, borderWidth: 1, borderColor: C.slate100, borderRadius: 12 }}>
                <QRGrid cell={16} gap={4} cells={GUEST_QR} outline />
              </View>
              <T s={12} w="bold" c={C.navy} style={{ marginTop: 12 }}>APPROVED STATE — DEMO QR PREVIEW</T>
              <T s={11} c={C.slate500} style={{ marginTop: 4 }}>Not scannable; backend-issued authorization required.</T>
            </Card>
          )}
          <Pressable onPress={() => setRequest('not_submitted', null)} style={{ paddingVertical: 12, alignItems: 'center' }}>
            <T s={14} c={C.slate500}>Reset demo request</T>
          </Pressable>
        </View>
      )}
    </Frame>
  );
}

/* ------------------------------------------------------------------ QR pass */
export function QRPassScreen({ user, guestStatus }: { user: MobileUser; guestStatus: GuestRequestStatus }) {
  if (user.role === 'guest') {
    const ok = guestStatus === 'approved';
    return (
      <Frame bottomPad={96}>
        <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 20 }}>
          <T s={20} w="head" c={C.navy}>Visitor QR Pass</T>
          <View style={{ marginTop: 16, borderRadius: 16, borderWidth: 1, padding: 20, backgroundColor: ok ? C.green50 : C.white, borderColor: ok ? C.green200 : C.amber200 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {ok ? <CheckCircle size={20} color={C.green800} /> : <Clock size={20} color={C.amber700} />}
              <T s={16} w="bold" c={ok ? C.green800 : C.amber700}>
                {ok ? 'Approved-state Preview' : guestStatus === 'pending' ? 'Request Pending' : 'No Approved Pass'}
              </T>
            </View>
            <T s={14} c={C.slate600} style={{ marginTop: 8 }}>
              {ok ? 'This is a non-scannable sample preview only. An actual pass must be issued by the connected approval system.'
                : guestStatus === 'pending' ? 'Your request is awaiting approval. No QR pass is available yet.'
                : 'Submit your visitor parking request first. A QR pass cannot be used before approval.'}
            </T>
            {ok && (
              <View style={{ marginTop: 16, backgroundColor: C.white, borderRadius: 12, padding: 16, alignItems: 'center' }}>
                <View style={{ padding: 8 }}><QRGrid cell={16} gap={4} cells={GUEST_QR} outline /></View>
                <T s={10} w="bold" c={C.navy} style={{ marginTop: 8 }}>DEMO ONLY — NOT VALID FOR ENTRY</T>
              </View>
            )}
          </View>
        </View>
      </Frame>
    );
  }
  return (
    <Frame bottomPad={96}>
      <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 }}>
        <T s={20} w="head" c={C.navy}>My QR Pass</T>
        <T s={14} c={C.slate400}>Show at campus gate</T>
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ backgroundColor: C.navy, borderRadius: 24, padding: 24, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <DyciLogo onDark height={24} />
            <T s={12} w="medium" c={C.blue200}>PASS — Campus QR Access Pass</T>
          </View>
          <T s={24} w="head" c={C.white}>{user.name}</T>
          <T s={12} c={C.blue300} style={{ marginTop: 2 }}>{`${user.role} — ${user.email}`}</T>
          <View style={{ marginVertical: 24, backgroundColor: C.white, borderRadius: 16, padding: 16, alignItems: 'center' }}>
            <QRGrid cell={20} gap={4} cells={USER_QR} radius={2} />
          </View>
          <View style={{ gap: 8 }}>
            {[['Valid Until', 'Today, 11:59 PM', false], ['Vehicle', 'ABC-1234', true], ['Access', 'All Zones', false]].map(([l, v, mono]) => (
              <View key={l as string} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <T s={14} c={C.blue300}>{l as string}</T>
                <T s={14} w="semibold" c={C.white} style={mono ? { fontFamily: 'Courier' } : undefined}>{v as string}</T>
              </View>
            ))}
          </View>
          <T s={10} c={C.blue400} style={{ textAlign: 'center', marginTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 16 }}>
            Present this QR code at the campus entrance gate
          </T>
        </View>
        <Btn label="Refresh QR Pass" onPress={() => notAvailable('Refresh QR Pass')} bg="transparent" color={C.royal} border={C.royal} radius={16} py={14}
          icon={<QrCode size={18} color={C.royal} />} style={{ marginTop: 16 }} />
      </View>
    </Frame>
  );
}

/* ------------------------------------------------------------------ Profile */
export function ProfileScreen({ user, onLogout, onNavigate }: { user: MobileUser; onLogout: () => void; onNavigate: (s: MobileScreen) => void }) {
  const { status: licenseStatus } = useLicense();
  const roleLabel = user.role === 'parking_staff' ? 'Parking Staff' : user.role === 'guest' ? 'Guest / Visitor'
    : (user.role ?? 'user').charAt(0).toUpperCase() + (user.role ?? 'user').slice(1);

  type Item = { label: string; description: string; icon: React.ReactNode; onPress: () => void };
  const ic = (I: any) => <I size={18} color={C.royal} />;
  const na = (l: string) => () => notAvailable(l);
  const items: Item[] = user.role === 'parking_staff'
    ? [
        { label: 'Edit Profile', description: 'Update your staff contact details', icon: ic(User), onPress: na('Edit Profile') },
        { label: 'Notifications', description: 'View parking alerts and updates', icon: ic(Bell), onPress: () => onNavigate('notifications') },
        { label: 'Settings', description: 'Manage app preferences', icon: ic(Settings), onPress: na('Settings') },
      ]
    : user.role === 'guest'
      ? [
          { label: 'Edit Profile', description: 'Update your visitor details', icon: ic(User), onPress: na('Edit Profile') },
          { label: 'Visitor Parking Request', description: 'Review your visit request and vehicle details', icon: ic(ClipboardList), onPress: () => onNavigate('guest-request') },
          { label: 'Visitor Pass', description: 'Available only after request approval', icon: ic(QrCode), onPress: () => onNavigate('qr') },
          { label: 'Notifications', description: 'View request status and updates', icon: ic(Bell), onPress: () => onNavigate('notifications') },
          { label: 'Settings', description: 'Manage app preferences', icon: ic(Settings), onPress: na('Settings') },
        ]
      : [
          { label: 'Edit Profile', description: 'Update your account details', icon: ic(User), onPress: na('Edit Profile') },
          { label: "Driver's License", description: `Verification: ${LICENSE_STATUS_LABEL[licenseStatus]}`, icon: ic(IdCard), onPress: () => onNavigate('license') },
          { label: 'My Vehicles', description: 'View and manage your registered vehicles', icon: ic(Car), onPress: na('My Vehicles') },
          { label: 'RFID Card', description: 'View your regular parking access card', icon: ic(CreditCard), onPress: na('RFID Card') },
          { label: 'Notifications', description: 'View parking updates and alerts', icon: ic(Bell), onPress: () => onNavigate('notifications') },
          { label: 'Settings', description: 'Manage app preferences', icon: ic(Settings), onPress: na('Settings') },
        ];

  return (
    <Frame topInset={false} bottomPad={96}>
      <NavyHeader pb={48}>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: 80, height: 80, borderRadius: 16, backgroundColor: withAlpha(C.sky, 0.2), borderWidth: 2, borderColor: withAlpha(C.sky, 0.3), alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <T s={30} w="bold" c={C.white}>{user.name[0]}</T>
          </View>
          <T s={20} w="head" c={C.white}>{user.name}</T>
          <T s={14} c={C.blue300}>{user.email}</T>
          <View style={{ marginTop: 8, backgroundColor: withAlpha(C.sky, 0.2), paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99 }}>
            <T s={12} w="medium" c={C.sky}>{roleLabel}</T>
          </View>
          <T s={12} c="rgba(219,234,254,0.8)" style={{ marginTop: 8 }}>
            {user.role === 'parking_staff' ? 'Parking operations account' : user.role === 'guest' ? 'Temporary visitor account' : 'Regular PASS account'}
          </T>
        </View>
      </NavyHeader>
      <View style={{ paddingHorizontal: 20, marginTop: -16, gap: 12, paddingBottom: 20 }}>
        <View style={{ backgroundColor: C.white, borderRadius: 16, borderWidth: 1, borderColor: C.blue100, overflow: 'hidden' }}>
          {items.map((item, i) => (
            <Pressable key={item.label} onPress={item.onPress} style={({ pressed }) => ({
              flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 16,
              borderTopWidth: i > 0 ? 1 : 0, borderTopColor: C.slate100, backgroundColor: pressed ? C.blue50 : C.white,
            })}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: C.blue50, alignItems: 'center', justifyContent: 'center' }}>{item.icon}</View>
              <View style={{ flex: 1 }}>
                <T s={14} w="semibold" c={C.slate700}>{item.label}</T>
                <T s={12} c={C.slate500} style={{ marginTop: 2 }}>{item.description}</T>
              </View>
              <ChevronRight size={16} color={C.slate300} />
            </Pressable>
          ))}
        </View>
        <Btn label="Sign Out" onPress={onLogout} bg={C.red50} color={C.red600} border={C.red200} radius={16}
          icon={<LogOut size={18} color={C.red600} />} />
      </View>
    </Frame>
  );
}

/* ------------------------------------------------------------------ Driver's license */
const maskNo = (n: string) => (n.length > 4 ? `•••• ${n.slice(-4)}` : n);

export function LicenseScreen({ user, onBack }: { user: MobileUser; onBack: () => void }) {
  const { status, submission, rejectReason, submit } = useLicense();
  const [editing, setEditing] = useState(false);
  const [licenseNo, setLicenseNo] = useState('');
  const [expiry, setExpiry] = useState('');
  const [file, setFile] = useState<PickedFile | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const showForm = status === 'not_submitted' || status === 'rejected' || editing;

  const handleSubmit = () => {
    const e: Record<string, string> = {};
    if (!licenseNo.trim()) e.licenseNo = "Driver's license number is required";
    if (!expiry) e.expiry = 'Expiry date is required';
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(expiry) || isNaN(Date.parse(`${expiry}T00:00:00`))) e.expiry = 'Use the format YYYY-MM-DD';
    else { const t = new Date(); t.setHours(0, 0, 0, 0); if (new Date(`${expiry}T00:00:00`) < t) e.expiry = 'This license is already expired'; }
    if (!file) e.file = "Upload a photo or scan of your driver's license";
    setErrors(e);
    if (Object.keys(e).length) return;
    submit({ owner: user.name, licenseNo: licenseNo.trim(), expiry, fileName: file!.name, submittedAt: new Date().toLocaleString() });
    setEditing(false); setLicenseNo(''); setExpiry(''); setFile(null);
  };

  const tones: Record<LicenseStatus, { bg: string; border: string; text: string; icon: React.ReactNode; msg: string }> = {
    not_submitted: { bg: C.slate50, border: C.slate200, text: C.slate700, icon: <IdCard size={22} color={C.slate500} />, msg: "No driver's license on file. Submit it to register a vehicle." },
    pending: { bg: C.amber50, border: C.amber200, text: C.amber800, icon: <Clock size={22} color={C.amber600} />, msg: 'Your license is waiting for review by PASS staff.' },
    verified: { bg: C.green50, border: C.green200, text: C.green800, icon: <CheckCircle size={22} color={C.green600} />, msg: 'Your driver’s license has been verified.' },
    rejected: { bg: C.red50, border: C.red200, text: '#991B1B', icon: <AlertTriangle size={22} color={C.red600} />, msg: rejectReason || 'Your submission needs correction. Please resubmit a clearer copy.' },
  };
  const tone = tones[status];

  return (
    <Frame bottomPad={96}>
      <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
        <Pressable onPress={onBack} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <ArrowLeft size={18} color={C.royal} /><T s={14} w="medium" c={C.royal}>Back</T>
        </Pressable>
        <T s={20} w="head" c={C.navy} style={{ marginBottom: 4 }}>Driver's License</T>
        <T s={12} c={C.slate500} style={{ marginBottom: 16 }}>Required before you can register a vehicle. You can submit it even if you skipped the vehicle step at sign-up.</T>

        <View style={{ gap: 16 }}>
          <View style={{ borderRadius: 16, borderWidth: 1, padding: 16, backgroundColor: tone.bg, borderColor: tone.border }}>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
              <View style={{ marginTop: 2 }}>{tone.icon}</View>
              <View style={{ flex: 1 }}>
                <T s={16} w="bold" c={tone.text}>{LICENSE_STATUS_LABEL[status]}</T>
                <T s={14} c={tone.text} style={{ marginTop: 2 }}>{tone.msg}</T>
                {submission && status !== 'not_submitted' && (
                  <View style={{ marginTop: 12, gap: 2 }}>
                    <T s={12} c={C.slate600}>License no.: <Text style={txt(12, 'semibold', C.slate600)}>{maskNo(submission.licenseNo)}</Text></T>
                    <T s={12} c={C.slate600}>Expiry: <Text style={txt(12, 'semibold', C.slate600)}>{submission.expiry}</Text></T>
                    <T s={12} c={C.slate600}>File: <Text style={txt(12, 'semibold', C.slate600)}>{submission.fileName}</Text></T>
                    <T s={12} c={C.slate600}>Submitted: {submission.submittedAt}</T>
                  </View>
                )}
              </View>
            </View>
            {!showForm && (
              <Pressable onPress={() => setEditing(true)} style={{ marginTop: 12 }}>
                <T s={14} w="semibold" c={C.royal}>Submit a different license</T>
              </Pressable>
            )}
          </View>

          {showForm && (
            <View style={{ gap: 16 }}>
              <T s={16} w="semibold" c={C.navy}>{status === 'rejected' ? 'Resubmit driver’s license' : 'Submit driver’s license'}</T>
              <Field label="License Number" value={licenseNo} onChangeText={setLicenseNo} placeholder="N01-23-456789" error={errors.licenseNo} />
              <Field label="Expiry Date" value={expiry} onChangeText={setExpiry} placeholder="YYYY-MM-DD" keyboardType="numbers-and-punctuation" maxLength={10} error={errors.expiry} />
              <FileUpload label="Driver's License (front)" file={file} error={errors.file}
                onChange={f => { setFile(f); setErrors(e => ({ ...e, file: '' })); }} onError={m => setErrors(e => ({ ...e, file: m }))} />
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Btn label="Submit for Verification" onPress={handleSubmit} py={12} style={{ paddingHorizontal: 24 }} icon={<Send size={16} color={C.white} />} />
                {editing && status !== 'rejected' && (
                  <Btn label="Cancel" onPress={() => setEditing(false)} bg={C.white} color={C.slate600} border={C.slate200} py={12} style={{ paddingHorizontal: 20 }} />
                )}
              </View>
            </View>
          )}

          <T s={12} c={C.slate400}>Prototype: submissions are kept on this device only and are not sent to a server. Verification must be done by authorized PASS staff once the backend is connected.</T>
        </View>
      </View>
    </Frame>
  );
}
