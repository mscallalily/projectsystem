import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, hasRemoteApi } from './api';
import type { AppUser, UserRole } from '../types';

export async function restoreSession(): Promise<AppUser | null> {
 const raw = await AsyncStorage.getItem('pass_user');
 return raw ? JSON.parse(raw) as AppUser : null;
}
export async function signIn(email:string,password:string):Promise<AppUser> {
 if (hasRemoteApi) {
   const response = await api.post('/login',{identifier:email,password});
   const data=response.data?.data ?? response.data;
   const token=data.token ?? data.access_token;
   const u=data.user ?? data;
   if (token) await SecureStore.setItemAsync('pass_token',token);
   const user:AppUser={id:String(u.id),name:u.name ?? u.profile?.first_name ?? email.split('@')[0],email:u.email ?? email,role:(u.role?.name ?? u.role ?? 'student') as UserRole,token};
   await AsyncStorage.setItem('pass_user',JSON.stringify(user)); return user;
 }
 // Offline preview mode; clearly labelled in the UI. Local data remains on this device.
 const role = email.toLowerCase().startsWith('admin') ? 'admin' : email.toLowerCase().startsWith('staff') ? 'parking_staff' : 'student';
 const user:AppUser={id:'local-'+email.toLowerCase(),name:email.split('@')[0].replace(/[._-]/g,' '),email,role};
 await AsyncStorage.setItem('pass_user',JSON.stringify(user)); return user;
}
export async function signOut() {
 try { if(hasRemoteApi) await api.post('/logout'); } catch {}
 await SecureStore.deleteItemAsync('pass_token'); await AsyncStorage.removeItem('pass_user');
}
