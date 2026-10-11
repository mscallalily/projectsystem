import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_NOTIFS } from '../data/mock';
import type { Notif } from '../data/mock';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  hasToken,
  errorMessages,
} from '../api';

function timeAgo(iso: string): string {
  const secs = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (secs < 60) return 'Just now';
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

export default function NotificationScreen() {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      if (!hasToken()) {
        // Offline demo account: no API token, use the sample list
        setNotifs(MOCK_NOTIFS);
      } else {
        const rows = await getNotifications();
        setNotifs(
          rows.map((r) => ({
            id: r.id,
            title: r.title,
            body: r.body,
            time: timeAgo(r.sent_at),
            read: r.read,
            type: r.type,
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

  const markRead = (id: number) => {
    const wasUnread = notifs.some((n) => n.id === id && !n.read);
    if (!wasUnread) return;
    setNotifs((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
    if (hasToken()) {
      markNotificationRead(id).catch(() => load());
    }
  };

  const markAllRead = () => {
    setNotifs((list) => list.map((n) => ({ ...n, read: true })));
    if (hasToken()) {
      markAllNotificationsRead().catch(() => load());
    }
  };

  const unread = notifs.filter((n) => !n.read).length;

  return (
    <ScrollView
      style={styles.screen}
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
        <View>
          <Text style={styles.title}>Notifications</Text>
          {unread > 0 && <Text style={styles.subtitle}>{unread} unread</Text>}
        </View>
        {unread > 0 && (
          <Pressable onPress={markAllRead}>
            <Text style={styles.markAll}>Mark all read</Text>
          </Pressable>
        )}
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
          {notifs.map((n) => (
            <Pressable
              key={n.id}
              onPress={() => markRead(n.id)}
              style={({ pressed }) => [
                styles.card,
                !n.read && styles.cardUnread,
                pressed && { opacity: 0.85 },
              ]}
            >
              <View style={styles.cardTop}>
                <Text
                  style={[styles.cardTitle, { color: n.read ? '#64748B' : '#1E293B' }]}
                >
                  {n.title}
                </Text>
                {!n.read && <View style={styles.dot} />}
              </View>
              <Text style={styles.body}>{n.body}</Text>
              <Text style={styles.time}>{n.time}</Text>
            </Pressable>
          ))}

          {notifs.length === 0 && (
            <Text style={styles.empty}>You have no notifications.</Text>
          )}
        </View>
      )}

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
  empty: { textAlign: 'center', color: '#94A3B8', fontSize: 14, marginTop: 24 },
});