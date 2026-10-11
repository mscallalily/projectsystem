export const ZONE_CAPACITY = [
  { zone: 'Zone A', capacity: 50, occupied: 32, reserved: 5 },
  { zone: 'Zone B', capacity: 40, occupied: 38, reserved: 0 },
  { zone: 'Zone C', capacity: 60, occupied: 21, reserved: 8 },
  { zone: 'Zone D', capacity: 30, occupied: 12, reserved: 10 },
];

export const PARKING_SESSIONS = [
  { date: 'Sep 1, 2024', entry: '7:32 AM', exit: '5:45 PM', zone: 'Zone A', plate: 'ABC-1234', duration: '10h 13m', method: 'RFID' },
  { date: 'Aug 30, 2024', entry: '8:10 AM', exit: '6:00 PM', zone: 'Zone B', plate: 'ABC-1234', duration: '9h 50m', method: 'RFID' },
  { date: 'Aug 28, 2024', entry: '7:55 AM', exit: '4:30 PM', zone: 'Zone A', plate: 'ABC-1234', duration: '8h 35m', method: 'RFID' },
  { date: 'Aug 26, 2024', entry: '9:00 AM', exit: '3:00 PM', zone: 'Zone C', plate: 'ABC-1234', duration: '6h 00m', method: 'RFID' },
];

export const MOCK_NOTIFS = [
  { id: 1, title: 'Parking Access Approved', body: 'Your vehicle ABC-1234 has been approved for campus parking.', time: '2 hours ago', read: false, type: 'success' },
  { id: 2, title: 'RFID Card Assigned', body: 'RFID Card RFID-001 has been assigned to your account.', time: '1 day ago', read: false, type: 'info' },
  { id: 3, title: 'Parking Area Nearing Capacity', body: 'Zone B is 90% full. Consider parking in Zone C.', time: '3 hours ago', read: true, type: 'warning' },
  { id: 4, title: 'System Maintenance', body: 'PASS will undergo maintenance on Sept 5 from 11 PM to 1 AM.', time: '2 days ago', read: true, type: 'info' },
  { id: 5, title: 'Parking Violation Alert', body: 'A violation has been recorded for vehicle GHI-3456 at Zone B.', time: '4 hours ago', read: false, type: 'danger' },
];

export type Notif = (typeof MOCK_NOTIFS)[number];



