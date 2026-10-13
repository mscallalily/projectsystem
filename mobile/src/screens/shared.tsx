import React from 'react';
import { Alert, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme';

export type MobileScreen =
  | 'home' | 'parking' | 'history' | 'notifications' | 'profile' | 'qr' | 'guest-request' | 'license';

/** Navy header block that extends under the status bar (the original's px-5 pt-8 pb-10/12 header). */
export function NavyHeader({ children, pb = 40 }: { children: React.ReactNode; pb?: number }) {
  const insets = useSafeAreaInsets();
  return <View style={{ backgroundColor: C.navy, paddingHorizontal: 20, paddingTop: insets.top + 32, paddingBottom: pb }}>{children}</View>;
}

export const notAvailable = (what: string) =>
  Alert.alert(what, 'This feature is not available in the mobile app yet. It needs a PASS API endpoint that has not been built.');

/** 7×7 block pattern used by the original (decorative, not a scannable code). */
export function QRGrid({ cell, gap, cells, radius = 2, outline = false }: { cell: number; gap: number; cells: number[]; radius?: number; outline?: boolean }) {
  const rows = Array.from({ length: 7 }, (_, r) => r);
  return (
    <View style={{ gap }}>
      {rows.map(r => (
        <View key={r} style={{ flexDirection: 'row', gap }}>
          {Array.from({ length: 7 }, (_, c) => {
            const i = r * 7 + c;
            const on = cells.includes(i);
            return (
              <View key={c} style={{
                width: cell, height: cell, borderRadius: radius, backgroundColor: on ? C.navy : C.white,
                borderWidth: !on && outline ? 1 : 0, borderColor: C.slate100,
              }} />
            );
          })}
        </View>
      ))}
    </View>
  );
}

export const USER_QR = [0,1,2,3,4,5,6,7,14,21,28,35,42,43,44,45,46,47,48,16,17,18,19,24,25];
export const GUEST_QR = [0,1,2,3,4,5,6,7,13,14,15,20,21,22,27,28,29,35,36,37,38,39,40,41,42,43,44,45,46,47,48,10,16,24,30,32];
