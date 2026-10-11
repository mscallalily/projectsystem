import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MobileUser } from '../data/accounts';
import { Tab } from '../types';

type Props = {
  user: MobileUser;
  onNavigate: (tab: Tab) => void;
  onSignOut: () => void;
};

type MenuItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  tab?: Tab; // rows with a tab open that screen; the rest are display-only for now
};

const MENU: MenuItem[] = [
  { label: 'Edit Profile', icon: 'person-outline' },
  { label: 'My Vehicles', icon: 'car-outline' },
  { label: 'RFID Card', icon: 'card-outline' },
  { label: 'Notifications', icon: 'notifications-outline', tab: 'notifications' },
  { label: 'Settings', icon: 'settings-outline' },
];

export default function ProfileScreen({ user, onNavigate, onSignOut }: Props) {
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.name[0]}</Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <View style={styles.roleChip}>
          <Text style={styles.roleText}>{user.role.replace('_', ' ')}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.menu}>
          {MENU.map((item, i) => (
            <Pressable
              key={item.label}
              onPress={() => item.tab && onNavigate(item.tab)}
              style={({ pressed }) => [
                styles.row,
                i > 0 && styles.rowBorder,
                pressed && { backgroundColor: '#EFF6FF' },
              ]}
            >
              <Ionicons name={item.icon} size={18} color="#2563EB" />
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={onSignOut}
          style={({ pressed }) => [styles.signOut, pressed && { opacity: 0.8 }]}
        >
          <Ionicons name="log-out-outline" size={18} color="#DC2626" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>

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
    paddingBottom: 48,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: 'rgba(56,189,248,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(56,189,248,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 30, fontWeight: '700', color: '#FFFFFF' },
  name: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  email: { fontSize: 14, color: '#93C5FD' },
  roleChip: {
    marginTop: 8,
    backgroundColor: 'rgba(56,189,248,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  roleText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  body: { paddingHorizontal: 20, marginTop: -16, gap: 12 },
  menu: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  rowBorder: { borderTopWidth: 1, borderTopColor: '#F8FAFC' },
  rowLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: '#334155' },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 16,
  },
  signOutText: { color: '#DC2626', fontWeight: '600', fontSize: 16 },
});