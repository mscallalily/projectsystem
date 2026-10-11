import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MobileUser } from '../data/accounts';

type Props = { user: MobileUser };

const STATS = [
  { label: 'Total Slots', value: '180', color: '#123B6D' },
  { label: 'Occupied', value: '103', color: '#EF4444' },
  { label: 'Available', value: '77', color: '#22C55E' },
  { label: 'Maintenance', value: '3', color: '#F59E0B' },
];

const ACTIONS: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}[] = [
  { label: 'Slot Management', icon: 'car-outline', color: '#2563EB' },
  { label: 'Occupancy', icon: 'pulse-outline', color: '#22C55E' },
];

export default function AdminHome({ user }: Props) {
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.sub}>Parking Administrator</Text>
        <Text style={styles.name}>{user.name}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.statsCard}>
          {STATS.map((s) => (
            <View key={s.label} style={styles.stat}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
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
  body: { paddingHorizontal: 20, marginTop: -16, gap: 12 },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 16,
  },
  stat: { width: '50%', alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '700' },
  statLabel: { fontSize: 12, color: '#94A3B8' },
  actions: { flexDirection: 'row', gap: 12 },
  tile: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
    elevation: 3,
  },
  tileText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
});