import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MobileRole } from '../data/accounts';
import { Tab } from '../types';

type Item = {
  key: Tab;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

// Same tabs per role as the prototype's getNavItems()
function getNavItems(role: MobileRole): Item[] {
  if (role === 'security' || role === 'parking_admin') {
    return [
      { key: 'home', label: 'Dashboard', icon: 'home-outline' },
      { key: 'parking', label: 'Parking', icon: 'car-outline' },
      { key: 'notifications', label: 'Alerts', icon: 'notifications-outline' },
      { key: 'profile', label: 'Profile', icon: 'person-outline' },
    ];
  }
  if (role === 'guest') {
    return [
      { key: 'home', label: 'Home', icon: 'home-outline' },
      { key: 'qr', label: 'QR Pass', icon: 'qr-code-outline' },
      { key: 'parking', label: 'Parking', icon: 'car-outline' },
      { key: 'profile', label: 'Profile', icon: 'person-outline' },
    ];
  }
  return [
    { key: 'home', label: 'Home', icon: 'home-outline' },
    { key: 'parking', label: 'Parking', icon: 'car-outline' },
    { key: 'history', label: 'History', icon: 'time-outline' },
    { key: 'notifications', label: 'Notifs', icon: 'notifications-outline' },
    { key: 'profile', label: 'Profile', icon: 'person-outline' },
  ];
}

type Props = {
  role: MobileRole;
  active: Tab;
  onChange: (tab: Tab) => void;
};

export default function BottomNav({ role, active, onChange }: Props) {
  const items = getNavItems(role);

  return (
    <View style={styles.bar}>
      {items.map((item) => {
        const isActive = active === item.key;
        const color = isActive ? '#2563EB' : '#CBD5E1';
        return (
          <Pressable
            key={item.key}
            onPress={() => onChange(item.key)}
            style={styles.item}
          >
            <Ionicons name={item.icon} size={22} color={color} />
            <Text style={[styles.label, { color }]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 8,
  },
  item: { alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 12 },
  label: { fontSize: 10, fontWeight: '500' },
});