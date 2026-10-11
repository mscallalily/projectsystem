import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MobileUser } from '../data/accounts';

type Props = { user: MobileUser };

const ACTIONS: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}[] = [
  { label: 'RFID Auth', icon: 'card-outline', color: '#3B82F6' },
  { label: 'QR Verify', icon: 'qr-code-outline', color: '#22C55E' },
  { label: 'Gate Ops', icon: 'car-outline', color: '#F59E0B' },
  { label: 'Entry Monitor', icon: 'pulse-outline', color: '#A855F7' },
];

const STATS = [
  { label: 'Entries', value: '127', color: '#16A34A' },
  { label: 'Exits', value: '89', color: '#2563EB' },
  { label: 'Denied', value: '3', color: '#DC2626' },
];

export default function SecurityHome({ user }: Props) {
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.sub}>Security Personnel</Text>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={[styles.sub, { marginTop: 4 }]}>Gate Security Operations</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.grid}>
          {ACTIONS.map((a) => (
            <Pressable
              key={a.label}
              style={({ pressed }) => [
                styles.tile,
                { backgroundColor: a.color },
                pressed && { opacity: 0.85 },
              ]}
            >
              <Ionicons name={a.icon} size={22} color="#FFFFFF" />
              <Text style={styles.tileText}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Stats</Text>
          <View style={styles.statsRow}>
            {STATS.map((s) => (
              <View key={s.label} style={{ flex: 1, alignItems: 'center' }}>
                <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>
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
    paddingBottom: 40,
  },
  sub: { color: '#93C5FD', fontSize: 14 },
  name: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  body: { paddingHorizontal: 20, marginTop: -16, gap: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: {
    width: '47.5%',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
    elevation: 3,
  },
  tileText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 16,
    padding: 16,
  },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 12 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statValue: { fontSize: 24, fontWeight: '700' },
  statLabel: { fontSize: 12, color: '#94A3B8' },
});