import * as SQLite from 'expo-sqlite';
import type { Vehicle, ParkingSlot, Visit } from '../types';

const dbPromise = SQLite.openDatabaseAsync('pass-mobile.db');
export async function initDatabase() {
  const db = await dbPromise;
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT, plate TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL, make TEXT NOT NULL DEFAULT '', color TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'Pending', created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS parking_slots (
      id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT NOT NULL UNIQUE,
      zone TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'Available'
    );
    CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT, plate TEXT NOT NULL,
      action TEXT NOT NULL, time TEXT NOT NULL, location TEXT NOT NULL
    );
  `);
  const count = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM parking_slots');
  if (!count?.n) {
    const slots = [['A-01','North'],['A-02','North'],['A-03','North'],['B-01','South'],['B-02','South'],['B-03','South']];
    for (const [label, zone] of slots) await db.runAsync('INSERT OR IGNORE INTO parking_slots(label,zone,status) VALUES(?,?,?)',label,zone, label === 'A-02' || label === 'B-01' ? 'Occupied':'Available');
  }
}
export async function getVehicles(): Promise<Vehicle[]> {
 const db=await dbPromise; return db.getAllAsync<Vehicle>('SELECT * FROM vehicles ORDER BY id DESC');
}
export async function saveVehicle(v: {plate:string;type:string;make:string;color:string}) {
 const db=await dbPromise;
 await db.runAsync('INSERT INTO vehicles(plate,type,make,color,status,created_at) VALUES(?,?,?,?,?,?)',
 v.plate.trim().toUpperCase(),v.type,v.make.trim(),v.color.trim(),'Pending',new Date().toISOString());
}
export async function deleteVehicle(id:number) { const db=await dbPromise; await db.runAsync('DELETE FROM vehicles WHERE id=?',id); }
export async function getSlots(): Promise<ParkingSlot[]> {
 const db=await dbPromise; return db.getAllAsync<ParkingSlot>('SELECT * FROM parking_slots ORDER BY zone,label');
}
export async function getVisits(): Promise<Visit[]> {
 const db=await dbPromise; return db.getAllAsync<Visit>('SELECT * FROM visits ORDER BY id DESC LIMIT 100');
}
export async function logVisit(plate:string, action:string, location='Main Gate') {
 const db=await dbPromise; await db.runAsync('INSERT INTO visits(plate,action,time,location) VALUES(?,?,?,?)',plate.trim().toUpperCase(),action,new Date().toISOString(),location);
}
