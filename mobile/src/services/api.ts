import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const baseURL = process.env.EXPO_PUBLIC_API_URL?.trim();
export const api = axios.create({ baseURL: baseURL || undefined, timeout: 12000, headers: { Accept: 'application/json' } });
api.interceptors.request.use(async config => {
  const token = await SecureStore.getItemAsync('pass_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export const hasRemoteApi = Boolean(baseURL);
