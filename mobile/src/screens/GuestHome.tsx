import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MobileUser } from '../data/accounts';
import { Tab } from '../types';

type Props = { user: MobileUser; onNavigate: (tab: Tab) => void };

export default function GuestHome({ user, onNavigate }: Props) {
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.welcome}>Welcome, Guest!</Text>
            <Text style={styles.name}>{user.name}</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>Guest</Text>
          </View>
        </View>
        <View style={styles.info}>
          <Ionicons name="information-circle-outline" size={18} color="#38BDF8" />
          <Text style={styles.infoText}>
            Guest accounts have limited access. Show your QR pass at the campus
            gate.
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <Pressable onPress={() => onNavigate('qr')}>
          <LinearGradient
            colors={['#2563EB', '#123B6D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.qrCard}
          >
            <View style={styles.row}>
              <Ionicons name="qr-code-outline" size={28} color="#FFFFFF" />
              <View>
                <Text style={styles.qrTitle}>My QR Pass</Text>
                <Text style={styles.qrSub}>Valid Today</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          </LinearGradient>
        </Pressable>

        <Pressable onPress={() => onNavigate('parking')} style={styles.linkCard}>
          <View style={styles.row}>
            <View style={styles.iconBox}>
              <Ionicons name="location-outline" size={18} color="#2563EB" />
            </View>
            <View>
              <Text style={styles.linkTitle}>Parking Availability</Text>
              <Text style={styles.linkSub}>View available slots</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
        </Pressable>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  welcome: { color: '#93C5FD', fontSize: 14 },
  name: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  chip: {
    backgroundColor: 'rgba(251,191,36,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  chipText: { color: '#FCD34D', fontSize: 12 },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
  },
  infoText: { flex: 1, color: '#BFDBFE', fontSize: 12, lineHeight: 18 },
  body: { paddingHorizontal: 20, marginTop: -16, gap: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qrCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
  },
  qrTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  qrSub: { color: '#BFDBFE', fontSize: 12 },
  linkCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkTitle: { fontSize: 14, fontWeight: '600', color: '#334155' },
  linkSub: { fontSize: 12, color: '#94A3B8' },
});