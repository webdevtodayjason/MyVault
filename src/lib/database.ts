import { openDB } from 'idb';

// Define types for our database entities
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  tags: string[];
  createdAt: string;
}

export interface App {
  id: string;
  name: string;
  description: string;
  url?: string;
  apiKeyId?: string;
  createdAt: string;
}

// Database name and version
const DB_NAME = 'ai-manager-db';
const DB_VERSION = 1;

// Initialize the database
export async function initDB() {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create apps store
      if (!db.objectStoreNames.contains('apps')) {
        const appsStore = db.createObjectStore('apps', { keyPath: 'id' });
        appsStore.createIndex('name', 'name', { unique: false });
        appsStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // Create apiKeys store
      if (!db.objectStoreNames.contains('apiKeys')) {
        const apiKeysStore = db.createObjectStore('apiKeys', { keyPath: 'id' });
        apiKeysStore.createIndex('name', 'name', { unique: false });
        apiKeysStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // Create bookmarks store
      if (!db.objectStoreNames.contains('bookmarks')) {
        const bookmarksStore = db.createObjectStore('bookmarks', { keyPath: 'id' });
        bookmarksStore.createIndex('title', 'title', { unique: false });
        bookmarksStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
    },
  });

  return db;
}

// Get all apps
export async function getAllApps(): Promise<App[]> {
  const db = await initDB();
  return await db.getAll('apps');
}

// Add a new app
export async function addApp(app: Omit<App, 'id' | 'createdAt'>): Promise<App> {
  const db = await initDB();
  const newApp: App = {
    ...app,
    id: `app-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  await db.put('apps', newApp);
  return newApp;
}

// Update an app
export async function updateApp(id: string, updates: Partial<App>): Promise<void> {
  const db = await initDB();
  const app = await db.get('apps', id);
  
  if (app) {
    const updatedApp = { ...app, ...updates };
    await db.put('apps', updatedApp);
  }
}

// Delete an app
export async function deleteApp(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('apps', id);
}

// Get all API keys
export async function getAllApiKeys(): Promise<ApiKey[]> {
  const db = await initDB();
  return await db.getAll('apiKeys');
}

// Add a new API key
export async function addApiKey(key: Omit<ApiKey, 'id' | 'createdAt'>): Promise<ApiKey> {
  const db = await initDB();
  const newKey: ApiKey = {
    ...key,
    id: `key-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  await db.put('apiKeys', newKey);
  return newKey;
}

// Update an API key
export async function updateApiKey(id: string, updates: Partial<ApiKey>): Promise<void> {
  const db = await initDB();
  const key = await db.get('apiKeys', id);
  
  if (key) {
    const updatedKey = { ...key, ...updates };
    await db.put('apiKeys', updatedKey);
  }
}

// Delete an API key
export async function deleteApiKey(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('apiKeys', id);
}

// Get all bookmarks
export async function getAllBookmarks(): Promise<Bookmark[]> {
  const db = await initDB();
  return await db.getAll('bookmarks');
}

// Add a new bookmark
export async function addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Promise<Bookmark> {
  const db = await initDB();
  const newBookmark: Bookmark = {
    ...bookmark,
    id: `b-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  await db.put('bookmarks', newBookmark);
  return newBookmark;
}

// Update a bookmark
export async function updateBookmark(id: string, updates: Partial<Bookmark>): Promise<void> {
  const db = await initDB();
  const bookmark = await db.get('bookmarks', id);
  
  if (bookmark) {
    const updatedBookmark = { ...bookmark, ...updates };
    await db.put('bookmarks', updatedBookmark);
  }
}

// Delete a bookmark
export async function deleteBookmark(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('bookmarks', id);
}