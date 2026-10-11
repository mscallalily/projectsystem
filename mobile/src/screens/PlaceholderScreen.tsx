import { View, Text, Pressable } from 'react-native';
import { Tab } from '../types';

const INFO: Record<Tab, { title: string; module: string }> = {
  home: { title: 'Home', module: 'Module 24' },
  parking: { title: 'Parking Information', module: 'Module 25' },
  history: { title: 'Parking History', module: 'Module 26' },
  notifications: { title: 'Notifications', module: 'Module 27' },
  qr: { title: 'QR Pass', module: 'Module 28' },
  profile: { title: 'Profile', module: 'Module 24' },
};

type Props = { tab: Tab; onSignOut: () => void };

export default function PlaceholderScreen({ tab, onSignOut }: Props) {
  const info = INFO[tab];
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F0F6FC',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: '700', color: '#123B6D' }}>
        {info.title}
      </Text>
      <Text style={{ color: '#94A3B8' }}>{info.module} - coming soon</Text>
      {tab === 'profile' && (
        <Pressable onPress={onSignOut} style={{ marginTop: 24 }}>
          <Text style={{ color: '#DC2626', fontSize: 16, fontWeight: '600' }}>
            Sign out
          </Text>
        </Pressable>
      )}
    </View>
  );
}