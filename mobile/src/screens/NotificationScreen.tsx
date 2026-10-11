import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Notif } from '../data/mock';

type Props = {
  notifs: Notif[];
  onMarkRead: (id: number) => void;
  onMarkAllRead: () => void;
};

export default function NotificationScreen({
  notifs,
  onMarkRead,
  onMarkAllRead,
}: Props) {
  const unread = notifs.filter((n) => !n.read).length;

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Notifications</Text>
          {unread > 0 && <Text style={styles.subtitle}>{unread} unread</Text>}
        </View>
        {unread > 0 && (
          <Pressable onPress={onMarkAllRead}>
            <Text style={styles.markAll}>Mark all read</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.list}>
        {notifs.map((n) => (
          <Pressable
            key={n.id}
            onPress={() => onMarkRead(n.id)}
            style={({ pressed }) => [
              styles.card,
              !n.read && styles.cardUnread,
              pressed && { opacity: 0.85 },
            ]}
          >
            <View style={styles.cardTop}>
              <Text
                style={[
                  styles.cardTitle,
                  { color: n.read ? '#64748B' : '#1E293B' },
                ]}
              >
                {n.title}
              </Text>
              {!n.read && <View style={styles.dot} />}
            </View>
            <Text style={styles.body}>{n.body}</Text>
            <Text style={styles.time}>{n.time}</Text>
          </Pressable>
        ))}
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F0F6FC' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: '700', color: '#123B6D' },
  subtitle: { fontSize: 14, color: '#94A3B8' },
  markAll: { fontSize: 12, fontWeight: '600', color: '#2563EB' },
  list: { paddingHorizontal: 20, gap: 12 },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 16,
    padding: 16,
  },
  cardUnread: { borderColor: '#93C5FD', backgroundColor: '#F5F9FF' },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  cardTitle: { flex: 1, fontSize: 14, fontWeight: '600' },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginTop: 5,
  },
  body: { fontSize: 12, color: '#64748B', marginTop: 4, lineHeight: 18 },
  time: { fontSize: 12, color: '#CBD5E1', marginTop: 8 },
});