import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { MobileUser } from '../data/accounts';

type Props = { user: MobileUser };

export default function QRPassScreen({ user }: Props) {
  const isGuest = user.role === 'guest';

  // Demo token. Later this comes from Laravel's qr_passes table.
  const makeStamp = () => Date.now();
  const [stamp, setStamp] = useState(makeStamp);
  const token = `PASS|${user.role}|${user.email}|${stamp}`;

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>My QR Pass</Text>
        <Text style={styles.subtitle}>Show at campus gate</Text>
      </View>

      <View style={styles.wrap}>
        <LinearGradient
          colors={['#123B6D', '#1E4F8A', '#2563EB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.pass}
        >
          <View style={styles.passTop}>
            <Ionicons name="shield-outline" size={18} color="#38BDF8" />
            <Text style={styles.passLabel}>
              PASS — {isGuest ? 'Visitor' : 'Campus'} QR Access Pass
            </Text>
          </View>

          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>
            {isGuest ? 'Guest Account' : `${user.role} — ${user.email}`}
          </Text>

          <View style={styles.qrBox}>
            <QRCode value={token} size={180} color="#123B6D" backgroundColor="#FFFFFF" />
          </View>

          <View style={styles.rows}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Valid Until</Text>
              <Text style={styles.rowValue}>Today, 11:59 PM</Text>
            </View>
            {!isGuest && (
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Vehicle</Text>
                <Text style={[styles.rowValue, { fontFamily: 'monospace' }]}>
                  ABC-1234
                </Text>
              </View>
            )}
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Access</Text>
              <Text style={styles.rowValue}>
                {isGuest ? 'Visitor Zone' : 'All Zones'}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Pass ID</Text>
              <Text style={[styles.rowValue, { fontFamily: 'monospace' }]}>
                {String(stamp).slice(-6)}
              </Text>
            </View>
          </View>

          <Text style={styles.footer}>
            Present this QR code at the campus entrance gate
          </Text>
        </LinearGradient>

        <Pressable
          onPress={() => setStamp(makeStamp())}
          style={({ pressed }) => [styles.refresh, pressed && { opacity: 0.7 }]}
        >
          <Ionicons name="qr-code-outline" size={18} color="#2563EB" />
          <Text style={styles.refreshText}>Refresh QR Pass</Text>
        </Pressable>
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
  wrap: { paddingHorizontal: 20 },
  pass: { borderRadius: 24, padding: 24, elevation: 8 },
  passTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  passLabel: { fontSize: 12, fontWeight: '500', color: '#BFDBFE' },
  name: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
  role: { fontSize: 12, color: '#93C5FD', marginTop: 2 },
  qrBox: {
    marginVertical: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rows: { gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowLabel: { fontSize: 14, color: '#93C5FD' },
  rowValue: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  footer: {
    fontSize: 10,
    color: '#60A5FA',
    textAlign: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  refresh: {
    marginTop: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  refreshText: { color: '#2563EB', fontWeight: '600', fontSize: 14 },
});