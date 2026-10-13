import React, { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity, Bell, Car, ChevronRight, ClipboardList, Clock, IdCard, Info, MapPin, ParkingSquare, QrCode, User } from 'lucide-react-native';
import { Card, Frame, T, txt } from '../components/ui';
import { MobileUser, useAuth } from '../context/AuthContext';
import { LICENSE_STATUS_LABEL, useLicense } from '../context/LicenseContext';
import { HISTORY_SESSIONS, MOCK_NOTIFS, ZONE_CAPACITY } from '../data/mock';
import { C, withAlpha } from '../theme';
import { MobileScreen, NavyHeader, notAvailable } from './shared';

const freeColor = (free: number) => (free < 5 ? C.red500 : free < 15 ? C.amber500 : C.green500);
const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

function ZoneBar({ free, capacity, height }: { free: number; capacity: number; height: number }) {
  return (
    <View style={{ flex: 1, height, backgroundColor: C.slate100, borderRadius: 99, overflow: 'hidden' }}>
      <View style={{ height: '100%', width: `${(free / capacity) * 100}%`, backgroundColor: freeColor(free), borderRadius: 99 }} />
    </View>
  );
}

export function HomeScreen({ user, onNavigate }: { user: MobileUser; onNavigate: (s: MobileScreen) => void }) {
  const { status: licenseStatus } = useLicense();

  /* ---- Guest ---- */
  if (user.role === 'guest') {
    return (
      <Frame topInset={false} bottomPad={96}>
        <NavyHeader>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <View>
              <T s={14} c={C.blue300}>Welcome, Guest!</T>
              <T s={20} w="head" c={C.white}>{user.name}</T>
            </View>
            <View style={{ backgroundColor: withAlpha(C.amber400, 0.2), borderColor: withAlpha(C.amber400, 0.3), borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 99 }}>
              <T s={12} c={C.amber300}>Guest</T>
            </View>
          </View>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Info size={18} color={C.sky} />
            <T s={12} c={C.blue200} style={{ flex: 1, lineHeight: 19.5 }}>Submit a visitor parking request with your visit purpose and vehicle details. A QR pass is available only after approval.</T>
          </View>
        </NavyHeader>
        <View style={{ paddingHorizontal: 20, marginTop: -16, gap: 16 }}>
          <Pressable onPress={() => onNavigate('guest-request')} style={({ pressed }) => ({
            backgroundColor: C.navy, borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6, transform: [{ scale: pressed ? 0.97 : 1 }],
          })}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <ClipboardList size={28} color={C.white} />
              <View>
                <T s={16} w="bold" c={C.white}>Visitor Parking Request</T>
                <T s={12} c={C.blue200}>Submit details and check approval</T>
              </View>
            </View>
            <ChevronRight size={20} color={C.white} />
          </Pressable>
          <Pressable onPress={() => onNavigate('parking')} style={({ pressed }) => ({
            backgroundColor: C.white, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.blue100,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', transform: [{ scale: pressed ? 0.97 : 1 }],
          })}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 40, height: 40, backgroundColor: C.blue100, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={18} color={C.royal} />
              </View>
              <View>
                <T s={16} w="semibold" c={C.slate700}>Parking Availability</T>
                <T s={12} c={C.slate400}>View available slots</T>
              </View>
            </View>
            <ChevronRight size={18} color={C.slate300} />
          </Pressable>
        </View>
      </Frame>
    );
  }

  /* ---- Parking staff ---- */
  if (user.role === 'parking_staff') {
    const actions = [
      { label: 'Vehicle Verify', icon: <Car size={22} color={C.white} />, bg: '#2563EB', onPress: () => notAvailable('Vehicle Verify') },
      { label: 'Visitor QR', icon: <QrCode size={22} color={C.white} />, bg: '#16A34A', onPress: () => notAvailable('Visitor QR') },
      { label: 'Occupancy', icon: <ParkingSquare size={22} color={C.white} />, bg: '#D97706', onPress: () => onNavigate('parking') },
      { label: 'Access Records', icon: <Activity size={22} color={C.white} />, bg: '#475569', onPress: () => notAvailable('Access Records') },
    ];
    return (
      <Frame topInset={false} bottomPad={96}>
        <NavyHeader>
          <T s={14} c={C.blue300}>Parking Staff</T>
          <T s={20} w="head" c={C.white}>{user.name}</T>
          <T s={14} c={C.blue300} style={{ marginTop: 4 }}>Campus parking operations</T>
        </NavyHeader>
        <View style={{ paddingHorizontal: 20, marginTop: -16, flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {actions.map(a => (
            <Pressable key={a.label} onPress={a.onPress} style={({ pressed }) => ({
              width: '48%', flexGrow: 1, backgroundColor: a.bg, borderRadius: 16, padding: 20, alignItems: 'center', gap: 8,
              shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3, transform: [{ scale: pressed ? 0.97 : 1 }],
            })}>
              {a.icon}
              <T s={14} w="semibold" c={C.white}>{a.label}</T>
            </Pressable>
          ))}
        </View>
        <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
          <Card>
            <T s={14} w="semibold" c={C.slate700} style={{ marginBottom: 12 }}>Today's Stats</T>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {[{ n: '127', l: 'Entries', c: C.green600 }, { n: '89', l: 'Exits', c: '#2563EB' }, { n: '3', l: 'Denied', c: C.red600 }].map(s => (
                <View key={s.l} style={{ flex: 1, alignItems: 'center' }}>
                  <T s={24} w="bold" c={s.c}>{s.n}</T>
                  <T s={12} c={C.slate400}>{s.l}</T>
                </View>
              ))}
            </View>
          </Card>
        </View>
      </Frame>
    );
  }

  /* ---- Student / Faculty / Employee ---- */
  const quick = [
    { label: 'Availability', icon: <ParkingSquare size={20} color={C.royal} />, screen: 'parking' as MobileScreen },
    { label: 'History', icon: <Clock size={20} color={C.green600} />, screen: 'history' as MobileScreen },
    { label: 'Profile', icon: <User size={20} color={C.purple600} />, screen: 'profile' as MobileScreen },
  ];
  const licIcon =
    licenseStatus === 'verified' ? { bg: C.green100, fg: C.green600 }
    : licenseStatus === 'pending' ? { bg: C.amber100, fg: C.amber600 }
    : licenseStatus === 'rejected' ? { bg: C.red100, fg: C.red600 }
    : { bg: C.blue50, fg: C.royal };
  const totalFree = ZONE_CAPACITY.reduce((n, z) => n + z.capacity - z.occupied, 0);

  return (
    <Frame topInset={false} bottomPad={96}>
      <NavyHeader pb={48}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <View>
            <T s={14} c={C.blue300}>{greeting()}</T>
            <T s={20} w="head" c={C.white}>{user.name}</T>
          </View>
          <Pressable onPress={() => onNavigate('notifications')} style={{ padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 }}>
            <Bell size={18} color={C.white} />
            <View style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: 4, backgroundColor: C.red400 }} />
          </Pressable>
        </View>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderRadius: 16, padding: 16, marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <T s={12} w="medium" c={C.blue200}>Current Status</T>
            <T s={16} w="bold" c={C.white}>Not Parked</T>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <T s={12} w="medium" c={C.blue200}>Vehicle</T>
            <T s={16} w="semibold" c={C.white} style={{ fontFamily: 'Courier' }}>ABC-1234</T>
          </View>
        </View>
      </NavyHeader>

      <View style={{ paddingHorizontal: 16, marginTop: -20, gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {quick.map(a => (
            <Pressable key={a.label} onPress={() => onNavigate(a.screen)} style={({ pressed }) => ({
              flex: 1, backgroundColor: C.white, borderWidth: 1, borderColor: C.blue100, borderRadius: 16, padding: 16, alignItems: 'center', gap: 8, transform: [{ scale: pressed ? 0.97 : 1 }],
            })}>
              {a.icon}
              <T s={12} w="semibold" c={C.slate600}>{a.label}</T>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={() => onNavigate('license')} style={({ pressed }) => ({
          backgroundColor: C.white, borderRadius: 16, borderWidth: 1, borderColor: C.blue100, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, transform: [{ scale: pressed ? 0.97 : 1 }],
        })}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: licIcon.bg, alignItems: 'center', justifyContent: 'center' }}>
            <IdCard size={18} color={licIcon.fg} />
          </View>
          <View style={{ flex: 1 }}>
            <T s={14} w="semibold" c={C.slate700}>Driver's License</T>
            <T s={12} c={C.slate500}>
              {LICENSE_STATUS_LABEL[licenseStatus]}{licenseStatus === 'not_submitted' ? ' — tap to submit' : licenseStatus === 'rejected' ? ' — tap to resubmit' : ''}
            </T>
          </View>
          <ChevronRight size={16} color={C.slate300} />
        </Pressable>

        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <T s={14} w="semibold" c={C.slate700}>Parking Available</T>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.green500 }} />
              <T s={12} w="semibold" c={C.green600}>{totalFree} slots</T>
            </View>
          </View>
          <View style={{ gap: 10 }}>
            {ZONE_CAPACITY.slice(0, 3).map(z => {
              const free = z.capacity - z.occupied;
              return (
                <View key={z.zone} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <T s={12} w="semibold" c={C.slate400} style={{ width: 48 }}>{z.zone}</T>
                  <ZoneBar free={free} capacity={z.capacity} height={8} />
                  <T s={12} w="bold" c={C.slate600} style={{ width: 32, textAlign: 'right' }}>{free}</T>
                </View>
              );
            })}
          </View>
        </Card>

        <Card>
          <T s={14} w="semibold" c={C.slate700} style={{ marginBottom: 12 }}>Recent Activity</T>
          {HISTORY_SESSIONS.slice(0, 2).map((h, i) => (
            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.slate50 }}>
              <View>
                <T s={14} w="medium" c={C.slate700}>{h.date.replace(/, \d{4}$/, '')}</T>
                <T s={12} c={C.slate400}>{h.entry} → {h.exit}</T>
              </View>
              <T s={14} w="bold" c={C.royal}>{h.duration}</T>
            </View>
          ))}
          <Pressable onPress={() => onNavigate('history')} style={{ marginTop: 8 }}>
            <T s={12} w="semibold" c={C.royal}>View all history →</T>
          </Pressable>
        </Card>
      </View>
    </Frame>
  );
}

export function ParkingScreen() {
  const [type, setType] = useState('All');
  const totalFree = ZONE_CAPACITY.reduce((n, z) => n + z.capacity - z.occupied, 0);
  const total = ZONE_CAPACITY.reduce((n, z) => n + z.capacity, 0);
  return (
    <Frame bottomPad={96}>
      <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 }}>
        <T s={20} w="head" c={C.navy}>Parking Availability</T>
        <T s={14} c={C.slate400}>Live slot status</T>
      </View>

      <View style={{ marginHorizontal: 20, backgroundColor: C.navy, borderRadius: 16, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6 }}>
        <T s={12} w="medium" c={C.blue200}>Total Available Now</T>
        <T s={48} w="head" c={C.sky} style={{ lineHeight: 56 }}>{totalFree}</T>
        <T s={14} c={C.blue200}>of {total} total slots</T>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.green400 }} />
          <T s={12} c={C.blue300}>Last updated just now</T>
        </View>
      </View>

      <View style={{ paddingHorizontal: 20, gap: 12, marginBottom: 20 }}>
        {ZONE_CAPACITY.map(z => {
          const free = z.capacity - z.occupied;
          return (
            <Card key={z.zone}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <T s={16} w="bold" c={C.slate700}>{z.zone}</T>
                <T s={18} w="bold" c={freeColor(free)}>{free} free</T>
              </View>
              <ZoneBar free={free} capacity={z.capacity} height={12} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                <T s={12} c={C.slate400}>{z.occupied} occupied</T>
                <T s={12} c={C.slate400}>{z.reserved} reserved</T>
                <T s={12} c={C.slate400}>{z.capacity} total</T>
              </View>
            </Card>
          );
        })}
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <Card>
          <T s={14} w="semibold" c={C.slate700} style={{ marginBottom: 12 }}>Filter by Vehicle Type</T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {['All', 'Sedan', 'SUV', 'Motorcycle', 'Van'].map(t => {
              const on = t === type;
              return (
                <Pressable key={t} onPress={() => setType(t)} style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, borderWidth: 1, borderColor: on ? C.royal : C.slate200, backgroundColor: on ? C.royal : 'transparent' }}>
                  <Text style={txt(12, 'medium', on ? C.white : C.slate500)}>{t}</Text>
                </Pressable>
              );
            })}
          </View>
        </Card>
      </View>
    </Frame>
  );
}

export function HistoryScreen() {
  const [q, setQ] = useState('');
  const rows = HISTORY_SESSIONS.filter(s => s.date.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <Frame bottomPad={96}>
      <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 }}>
        <T s={20} w="head" c={C.navy}>Parking History</T>
        <T s={14} c={C.slate400}>ABC-1234 — Toyota Vios</T>
      </View>
      <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
        <TextInput
          value={q} onChangeText={setQ} placeholder="Search by date..." placeholderTextColor={C.slate400}
          style={{ backgroundColor: C.white, borderWidth: 1, borderColor: C.blue100, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, fontFamily: 'Inter_400Regular', color: C.slate700 }}
        />
      </View>
      <View style={{ paddingHorizontal: 20, gap: 12 }}>
        {rows.length === 0 && <T s={14} c={C.slate400} style={{ textAlign: 'center', paddingVertical: 24 }}>No sessions match “{q}”.</T>}
        {rows.map((s, i) => (
          <Card key={i}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <View>
                <T s={16} w="bold" c={C.slate700}>{s.date}</T>
                <T s={12} c={C.slate400} style={{ marginTop: 2 }}>{s.zone} · {s.method}</T>
              </View>
              <T s={14} w="bold" c={C.royal}>{s.duration}</T>
            </View>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
              <View style={{ flex: 1 }}><T s={12} c={C.slate300}>Entry</T><T s={12} w="semibold" c={C.slate600}>{s.entry}</T></View>
              <View style={{ flex: 1 }}><T s={12} c={C.slate300}>Exit</T><T s={12} w="semibold" c={C.slate600}>{s.exit}</T></View>
              <View style={{ flex: 1 }}><T s={12} c={C.slate300}>Plate</T><T s={12} w="semibold" c={C.navy} style={{ fontFamily: 'Courier' }}>{s.plate}</T></View>
            </View>
          </Card>
        ))}
      </View>
    </Frame>
  );
}

export function NotificationScreen() {
  const { user } = useAuth();
  const key = `pass_notifs_read_${user?.id ?? 'anon'}`;
  const [readIds, setReadIds] = useState<number[]>(MOCK_NOTIFS.filter(n => n.read).map(n => n.id));

  // Read-state persists on the device per user.
  useEffect(() => {
    AsyncStorage.getItem(key).then(raw => { if (raw) setReadIds(JSON.parse(raw)); }).catch(() => {});
  }, [key]);
  const save = (ids: number[]) => { setReadIds(ids); AsyncStorage.setItem(key, JSON.stringify(ids)).catch(() => {}); };

  const notifs = MOCK_NOTIFS.map(n => ({ ...n, read: readIds.includes(n.id) }));
  const unread = notifs.filter(n => !n.read).length;

  return (
    <Frame bottomPad={96}>
      <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <T s={20} w="head" c={C.navy}>Notifications</T>
          {unread > 0 && <T s={14} c={C.slate400}>{unread} unread</T>}
        </View>
        {unread > 0 && (
          <Pressable onPress={() => save(MOCK_NOTIFS.map(n => n.id))}>
            <T s={12} w="semibold" c={C.royal}>Mark all read</T>
          </Pressable>
        )}
      </View>
      <View style={{ paddingHorizontal: 20, gap: 12 }}>
        {notifs.map(n => (
          <Pressable key={n.id} onPress={() => !n.read && save([...readIds, n.id])} style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.98 : 1 }] })}>
            <Card border={n.read ? C.blue100 : C.blue300} bg={n.read ? C.white : 'rgba(239,246,255,0.3)'}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                <T s={14} w="semibold" c={n.read ? C.slate500 : C.slate800} style={{ flex: 1 }}>{n.title}</T>
                {!n.read && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.royal, marginTop: 6 }} />}
              </View>
              <T s={12} c={C.slate500} style={{ marginTop: 4, lineHeight: 19.5 }}>{n.body}</T>
              <T s={12} c={C.slate300} style={{ marginTop: 8 }}>{n.time}</T>
            </Card>
          </Pressable>
        ))}
      </View>
    </Frame>
  );
}
