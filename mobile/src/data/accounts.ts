export type MobileRole =
  | 'student'
  | 'faculty'
  | 'employee'
  | 'security'
  | 'parking_admin'
  | 'guest';

export interface MobileUser {
  name: string;
  role: MobileRole;
  email: string;
}

// Sample accounts (same as the prototype). We replace these with Laravel later.
export const MOBILE_ACCOUNTS: Record<string, MobileUser> = {
  'student@pass.edu': { name: 'Maria Santos', role: 'student', email: 'student@pass.edu' },
  'faculty@pass.edu': { name: 'Juan dela Cruz', role: 'faculty', email: 'faculty@pass.edu' },
  'security@pass.edu': { name: 'Liza Gonzales', role: 'security', email: 'security@pass.edu' },
  'parking@pass.edu': { name: 'Parking Admin', role: 'parking_admin', email: 'parking@pass.edu' },
  'guest@pass.edu': { name: 'John Smith', role: 'guest', email: 'guest@pass.edu' },
};