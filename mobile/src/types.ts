export type UserRole = 'admin' | 'parking_staff' | 'student' | 'faculty' | 'employee' | 'guest';
export type AppUser = { id: string; name: string; email: string; role: UserRole; token?: string };
export type Vehicle = { id: number; plate: string; type: string; make: string; color: string; status: string; created_at: string };
export type ParkingSlot = { id: number; label: string; zone: string; status: 'Available' | 'Occupied' };
export type Visit = { id: number; plate: string; action: string; time: string; location: string };
