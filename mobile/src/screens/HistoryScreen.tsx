import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PARKING_SESSIONS } from '../data/mock';
import { getParkingHistory, hasToken, errorMessages } from '../api';

type Item = {
  key: string;
  date: string;
  zone: string;
  method: string;
  plate: string;
  entry: string;
  exit: string;
  duration: string;
  active: boolean;
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function fmtDuration(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`;
}

const DEMO_ITEMS: Item[] = PARKING_SESSIONS.map((s, i) => ({
  key: `demo-${i}`,
  date: s.date,
  zone: s.zone,
  method: s.method,
  plate: s.plate,
  entry: s.entry,
  exit: s.exit,
  duration: s.duration,
  active: false,
}));

export default function HistoryScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      if (!hasToken()) {
        // Offline demo account: no API token, use the sample list
        setItems(DEMO_ITEMS);
      } else {
        const rows = await getParkingHistory();
        setItems(
          rows.map((r) => ({
            key: String(r.id),
            date: fmtDate(r.entry),
            zone: r.zone,
            method: r.method,
            plate: r.plate,
            entry: fmtTime(r.entry),
            exit: r.exit ? fmtTime(r.exit) : 'Still parked',
            duration: r.exit ? fmtDuration(r.minutes) : 'Active',
            active: r.exit === null,
          }))
        );
      }
    } catch (e) {
      setError(errorMessages(e)[0]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const q = query.trim().toLowerCase();
  const visible = items.filter(
    (s) =>
      q === '' ||
      s.date.toLowerCase().includes(q) ||
      s.zone.toLowerCase().includes(q) ||
      s.plate.toLowerCase().includes(q)
  );

  const plates = Array.from(new Set(items.map((i) => i.plate))).join(', ');

  return (
    <ScrollView
      style={styles.screen}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            load();
          }}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Parking History</Text>
        <Text style={styles.subtitle}>{plates || 'Your parking visits'}</Text>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by date, zone or plate..."
          placeholderTextColor="#94A3B8"
          style={styles.search}
        />
      </View>

      {loading && (
        <View style={{ paddingVertical: 48 }}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      )}

      {error !== '' && (
        <View style={styles.errorBox}>
          <Ionicons name="warning-outline" size={16} color="#B91C1C" />
          <View style={{ flex: 1 }}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable
              onPress={() => {
                setLoading(true);
                load();
              }}
            >
              <Text style={styles.retry}>Retry</Text>
            </Pressable>
          </View>
        </View>
      )}

      {!loading && error === '' && (
        <View style={styles.list}>
          {visible.map((s) => (
            <View key={s.key} style={styles.card}>
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.date}>{s.date}</Text>
                  <Text style={styles.meta}>
                    {s.zone} · {s.method}
                  </Text>
                </View>
                <Text style={[styles.duration, s.active && { color: '#16A34A' }]}>
                  {s.duration}
                </Text>
              </View>

              <View style={styles.grid}>
                <View style={styles.cell}>
                  <Text style={styles.cellLabel}>Entry</Text>
                  <Text style={styles.cellValue}>{s.entry}</Text>
                </View>
                <View style={styles.cell}>
                  <Text style={styles.cellLabel}>Exit</Text>
                  <Text style={styles.cellValue}>{s.exit}</Text>
                </View>
                <View style={styles.cell}>
                  <Text style={styles.cellLabel}>Plate</Text>
                  <Text style={[styles.cellValue, styles.plate]}>{s.plate}</Text>
                </View>
              </View>
            </View>
          ))}

          {visible.length === 0 && (
            <Text style={styles.empty}>No parking records found.</Text>
          )}
        </View>
      )}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F0F6FC' },
  header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#123B6D' },
  subtitle: { fontSize: 14, color: '#94A3B8' },
  searchWrap: { paddingHorizontal: 20, marginBottom: 16 },
  search: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
  },
  errorBox: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 20,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 12,
  },
  errorText: { color: '#B91C1C', fontSize: 13 },
  retry: { color: '#2563EB', fontWeight: '600', fontSize: 13, marginTop: 8 },
  list: { paddingHorizontal: 20, gap: 12 },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 16,
    padding: 16,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  date: { fontSize: 16, fontWeight: '700', color: '#334155' },
  meta: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  duration: { fontSize: 14, fontWeight: '700', color: '#2563EB' },
  grid: { flexDirection: 'row', gap: 12, marginTop: 12 },
  cell: { flex: 1 },
  cellLabel: { fontSize: 12, color: '#CBD5E1' },
  cellValue: { fontSize: 12, fontWeight: '600', color: '#475569' },
  plate: { fontFamily: 'monospace', color: '#123B6D' },
  empty: { textAlign: 'center', color: '#94A3B8', fontSize: 14, marginTop: 24 },
});