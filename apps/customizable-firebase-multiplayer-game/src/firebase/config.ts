import { initializeApp, getApps, deleteApp, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { FirebaseConfig } from '../types/game';

const STORAGE_KEY = 'avalon_firebase_config';
const ADMIN_EMAIL = 'buenavistaaglinaodanny@gmail.com';

let firebaseApp: FirebaseApp | null = null;
let database: Database | null = null;

export function getAdminEmail(): string {
  return ADMIN_EMAIL;
}

export function saveFirebaseConfig(config: FirebaseConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function loadFirebaseConfig(): FirebaseConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as FirebaseConfig;
  } catch {
    return null;
  }
}

export function clearFirebaseConfig(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function isFirebaseConfigured(): boolean {
  return !!loadFirebaseConfig();
}

export async function initializeFirebase(config: FirebaseConfig): Promise<Database> {
  // Clean up existing app if any
  const existingApps = getApps();
  for (const app of existingApps) {
    await deleteApp(app);
  }
  firebaseApp = initializeApp(config);
  database = getDatabase(firebaseApp);
  return database;
}

export function getFirebaseDatabase(): Database | null {
  return database;
}

export async function initFromStorage(): Promise<Database | null> {
  const config = loadFirebaseConfig();
  if (!config) return null;
  try {
    const db = await initializeFirebase(config);
    return db;
  } catch (err) {
    console.error('Firebase init failed:', err);
    return null;
  }
}
