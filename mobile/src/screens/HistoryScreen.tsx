import { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { PARKING_SESSIONS } from '../data/mock';

export default function HistoryScreen() {
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const sessions = PARKING_SESSIONS.filter(
    (s) =>
      q === '' ||
      s.date.toLowerCase().includes(q) ||
      s.zone.toLowerCase().includes(q)
  );

  return (
    <ScrollView
      style={styles.screen}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Parking History</Text>
        <Text style={styles.subtitle}>ABC-1234 — Toyota Vios</Text>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by date or zone..."
          placeholderTextColor="#94A3B8"
          style={styles.search}
        />
      </View>

      <View style={styles.list}>
        {sessions.map((s, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.date}>{s.date}</Text>
                <Text style={styles.meta}>
                  {s.zone} · {s.method}
                </Text>
              </View>
              <Text style={styles.duration}>{s.duration}</Text>
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

        {sessions.length === 0 && (
          <Text style={styles.empty}>No parking records found.</Text>
        )}
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