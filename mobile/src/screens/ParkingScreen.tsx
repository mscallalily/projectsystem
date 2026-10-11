import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ZONE_CAPACITY } from '../data/mock';

const VEHICLE_TYPES = ['All', 'Sedan', 'SUV', 'Motorcycle', 'Van'];

// Green = plenty free, amber = filling up, red = almost full
function statusColor(free: number) {
  if (free < 5) return '#EF4444';
  if (free < 15) return '#F59E0B';
  return '#22C55E';
}

export default function ParkingScreen() {
  const [vehicleType, setVehicleType] = useState('All');

  const totalSlots = ZONE_CAPACITY.reduce((sum, z) => sum + z.capacity, 0);
  const totalFree = ZONE_CAPACITY.reduce(
    (sum, z) => sum + (z.capacity - z.occupied),
    0
  );

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Parking Availability</Text>
        <Text style={styles.subtitle}>Live slot status</Text>
      </View>

      {/* Total available banner */}
      <LinearGradient
        colors={['#123B6D', '#2563EB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.banner}
      >
        <Text style={styles.bannerLabel}>Total Available Now</Text>
        <Text style={styles.bannerNumber}>{totalFree}</Text>
        <Text style={styles.bannerSub}>of {totalSlots} total slots</Text>
        <Text style={styles.bannerUpdated}>
          <Text style={{ color: '#4ADE80' }}>● </Text>
          Last updated just now
        </Text>
      </LinearGradient>

      {/* Zone cards */}
      <View style={styles.zones}>
        {ZONE_CAPACITY.map((z) => {
          const free = z.capacity - z.occupied;
          const pct = (free / z.capacity) * 100;
          const color = statusColor(free);
          return (
            <View key={z.zone} style={styles.card}>
              <View style={styles.zoneHeader}>
                <Text style={styles.zoneName}>{z.zone}</Text>
                <Text style={[styles.zoneFree, { color }]}>{free} free</Text>
              </View>
              <View style={styles.track}>
                <View
                  style={{
                    width: `${pct}%` as `${number}%`,
                    height: '100%',
                    backgroundColor: color,
                    borderRadius: 6,
                  }}
                />
              </View>
              <View style={styles.zoneStats}>
                <Text style={styles.stat}>{z.occupied} occupied</Text>
                <Text style={styles.stat}>{z.reserved} reserved</Text>
                <Text style={styles.stat}>{z.capacity} total</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Vehicle type filter (display only for now) */}
      <View style={styles.filterWrap}>
        <View style={styles.card}>
          <Text style={styles.filterTitle}>Filter by Vehicle Type</Text>
          <View style={styles.chips}>
            {VEHICLE_TYPES.map((t) => {
              const active = vehicleType === t;
              return (
                <Pressable
                  key={t}
                  onPress={() => setVehicleType(t)}
                  style={[
                    styles.chip,
                    active && { backgroundColor: '#2563EB', borderColor: '#2563EB' },
                  ]}
                >
                  <Text
                    style={[styles.chipText, { color: active ? '#FFFFFF' : '#64748B' }]}
                  >
                    {t}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F0F6FC' },
  header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#123B6D' },
  subtitle: { fontSize: 14, color: '#94A3B8' },
  banner: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
  },
  bannerLabel: { color: '#BFDBFE', fontSize: 12, fontWeight: '500' },
  bannerNumber: { color: '#38BDF8', fontSize: 48, fontWeight: '700' },
  bannerSub: { color: '#BFDBFE', fontSize: 14 },
  bannerUpdated: { color: '#93C5FD', fontSize: 12, marginTop: 8 },
  zones: { paddingHorizontal: 20, gap: 12, marginBottom: 20 },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 16,
    padding: 16,
  },
  zoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  zoneName: { fontSize: 16, fontWeight: '700', color: '#334155' },
  zoneFree: { fontSize: 18, fontWeight: '700' },
  track: {
    height: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    overflow: 'hidden',
  },
  zoneStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  stat: { fontSize: 12, color: '#94A3B8' },
  filterWrap: { paddingHorizontal: 20 },
  filterTitle: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipText: { fontSize: 12, fontWeight: '500' },
});