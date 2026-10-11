import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MobileUser } from '../data/accounts';
import { ZONE_CAPACITY } from '../data/mock';
import { Tab } from '../types';

type Props = {
  user: MobileUser;
  onNavigate: (tab: Tab) => void;
};

const QUICK_ACTIONS: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  tab: Tab;
}[] = [
  { label: 'Availability', icon: 'car-outline', color: '#2563EB', tab: 'parking' },
  { label: 'History', icon: 'time-outline', color: '#16A34A', tab: 'history' },
  { label: 'Profile', icon: 'person-outline', color: '#9333EA', tab: 'profile' },
];

const RECENT = [
  { date: 'Sep 1', entry: '7:32 AM', exit: '5:45 PM', duration: '10h 13m' },
  { date: 'Aug 30', entry: '8:10 AM', exit: '6:00 PM', duration: '9h 50m' },
];

export default function HomeScreen({ user, onNavigate }: Props) {
  const totalFree = ZONE_CAPACITY.reduce(
    (sum, z) => sum + (z.capacity - z.occupied),
    0
  );

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.name}>{user.name}</Text>
          </View>
          <Pressable
            onPress={() => onNavigate('notifications')}
            style={styles.bell}
          >
            <Ionicons name="notifications-outline" size={18} color="#FFFFFF" />
            <View style={styles.redDot} />
          </Pressable>
        </View>

        <View style={styles.statusCard}>
          <View>
            <Text style={styles.statusLabel}>Current Status</Text>
            <Text style={styles.statusValue}>Not Parked</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.statusLabel}>Vehicle</Text>
            <Text style={[styles.statusValue, { fontFamily: 'monospace' }]}>
              ABC-1234
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        {/* QR pass button */}
        <Pressable onPress={() => onNavigate('qr')}>
          <LinearGradient
            colors={['#38BDF8', '#2563EB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.qrCard}
          >
            <View style={styles.qrLeft}>
              <Ionicons name="qr-code-outline" size={28} color="#FFFFFF" />
              <View>
                <Text style={styles.qrTitle}>My QR Pass</Text>
                <Text style={styles.qrSub}>Tap to view at gate</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          </LinearGradient>
        </Pressable>

        {/* Quick actions */}
        <View style={styles.actions}>
          {QUICK_ACTIONS.map((a) => (
            <Pressable
              key={a.label}
              onPress={() => onNavigate(a.tab)}
              style={styles.action}
            >
              <Ionicons name={a.icon} size={20} color={a.color} />
              <Text style={styles.actionText}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Parking availability preview */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Parking Available</Text>
            <Text style={styles.freeText}>● {totalFree} slots</Text>
          </View>
          {ZONE_CAPACITY.slice(0, 3).map((z) => {
            const free = z.capacity - z.occupied;
            const pct = (free / z.capacity) * 100;
            const barColor = free < 5 ? '#EF4444' : free < 15 ? '#F59E0B' : '#22C55E';
            return (
              <View key={z.zone} style={styles.zoneRow}>
                <Text style={styles.zoneName}>{z.zone}</Text>
                <View style={styles.track}>
                  <View
                    style={{
                      width: `${pct}%` as `${number}%`,
                      height: '100%',
                      backgroundColor: barColor,
                      borderRadius: 4,
                    }}
                  />
                </View>
                <Text style={styles.zoneFree}>{free}</Text>
              </View>
            );
          })}
        </View>

        {/* Recent activity */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { marginBottom: 12 }]}>
            Recent Activity
          </Text>
          {RECENT.map((h, i) => (
            <View key={i} style={styles.recentRow}>
              <View>
                <Text style={styles.recentDate}>{h.date}</Text>
                <Text style={styles.recentTime}>
                  {h.entry} → {h.exit}
                </Text>
              </View>
              <Text style={styles.duration}>{h.duration}</Text>
            </View>
          ))}
          <Pressable onPress={() => onNavigate('history')}>
            <Text style={styles.viewAll}>View all history →</Text>
          </Pressable>
        </View>

        <View style={{ height: 24 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F0F6FC' },
  header: {
    backgroundColor: '#123B6D',
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  greeting: { color: '#93C5FD', fontSize: 14 },
  name: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  bell: {
    height: 36,
    width: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  redDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F87171',
  },
  statusCard: {
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusLabel: { color: '#BFDBFE', fontSize: 12, fontWeight: '500' },
  statusValue: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  body: { paddingHorizontal: 16, marginTop: -20, gap: 12 },
  qrCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
  },
  qrLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qrTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  qrSub: { color: '#DBEAFE', fontSize: 12 },
  actions: { flexDirection: 'row', gap: 12 },
  action: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#334155' },
  freeText: { fontSize: 12, fontWeight: '600', color: '#16A34A' },
  zoneRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  zoneName: { width: 48, fontSize: 12, fontWeight: '600', color: '#94A3B8' },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  zoneFree: { width: 32, textAlign: 'right', fontSize: 12, fontWeight: '700', color: '#475569' },
  recentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  recentDate: { fontSize: 14, fontWeight: '500', color: '#334155' },
  recentTime: { fontSize: 12, color: '#94A3B8' },
  duration: { fontSize: 14, fontWeight: '700', color: '#2563EB' },
  viewAll: { fontSize: 12, fontWeight: '600', color: '#2563EB', marginTop: 8 },
});