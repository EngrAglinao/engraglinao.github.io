import { initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getAuth, Auth } from 'firebase/auth';

let app: FirebaseApp | null = null;
let db: Database | null = null;
let auth: Auth | null = null;

export const ADMIN_EMAIL = 'buenavistaaglinaodanny@gmail.com';
export const FIREBASE_CONFIG_KEY = 'avalon_firebase_config';
export const FIREBASE_SETUP_DONE_KEY = 'avalon_firebase_setup_done';
export const GAME_NAME_KEY = 'avalon_game_name';
export const GAME_ICON_KEY = 'avalon_game_icon';

export function getStoredConfig(): any | null {
  try {
    const raw = localStorage.getItem(FIREBASE_CONFIG_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isFirebaseSetupDone(): boolean {
  return localStorage.getItem(FIREBASE_SETUP_DONE_KEY) === 'true';
}

export function initFirebase(config: any): { app: FirebaseApp; db: Database; auth: Auth } {
  if (app) {
    return { app, db: db!, auth: auth! };
  }
  app = initializeApp(config);
  db = getDatabase(app);
  auth = getAuth(app);
  localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
  localStorage.setItem(FIREBASE_SETUP_DONE_KEY, 'true');
  return { app, db, auth };
}

export function initFirebaseFromStorage(): { app: FirebaseApp; db: Database; auth: Auth } | null {
  if (app && db && auth) return { app, db, auth };
  const config = getStoredConfig();
  if (!config) return null;
  try {
    app = initializeApp(config);
    db = getDatabase(app);
    auth = getAuth(app);
    return { app, db, auth };
  } catch {
    return null;
  }
}

export function getDb(): Database | null {
  return db;
}

export function getFirebaseApp(): FirebaseApp | null {
  return app;
}

export function getFirebaseAuth(): Auth | null {
  return auth;
}

export function clearFirebaseConfig(): void {
  localStorage.removeItem(FIREBASE_CONFIG_KEY);
  localStorage.removeItem(FIREBASE_SETUP_DONE_KEY);
  app = null;
  db = null;
  auth = null;
}

export function getGameName(): string {
  return localStorage.getItem(GAME_NAME_KEY) || 'AVALON';
}

export function setGameName(name: string): void {
  localStorage.setItem(GAME_NAME_KEY, name);
}

export function getGameIcon(): string | null {
  return localStorage.getItem(GAME_ICON_KEY);
}

export function setGameIcon(icon: string): void {
  localStorage.setItem(GAME_ICON_KEY, icon);
}
