import { initializeApp, FirebaseApp, getApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getAuth, Auth } from 'firebase/auth';

let app: FirebaseApp | undefined = undefined;
let db: Database | undefined = undefined;
let auth: Auth | undefined = undefined;

export const ADMIN_EMAIL = 'buenavistaaglinaodanny@gmail.com';
export const CONFIG_KEY = 'avalon_firebase_config';
export const GAME_NAME_KEY = 'avalon_game_name';
export const GAME_ICON_KEY = 'avalon_game_icon';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export function saveConfig(config: FirebaseConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function loadConfig(): FirebaseConfig | null {
  const raw = localStorage.getItem(CONFIG_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as FirebaseConfig;
  } catch {
    return null;
  }
}

export function initFirebase(config: FirebaseConfig): { app: FirebaseApp; db: Database; auth: Auth } {
  try {
    app = initializeApp(config, 'avalon-app');
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === 'app/duplicate-app') {
      app = getApp('avalon-app');
    } else {
      throw e;
    }
  }
  db = getDatabase(app);
  auth = getAuth(app);
  return { app, db, auth };
}

export function getDb(): Database | undefined {
  return db;
}

export function getFirebaseAuth(): Auth | undefined {
  return auth;
}

export function isFirebaseReady(): boolean {
  return db !== undefined;
}
