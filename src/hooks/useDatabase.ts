import { useState, useEffect } from 'react';
import {
  getAllApps,
  addApp,
  updateApp,
  deleteApp,
  getAllApiKeys,
  addApiKey,
  updateApiKey,
  deleteApiKey,
  getAllBookmarks,
  addBookmark,
  updateBookmark,
  deleteBookmark,
  App,
  ApiKey,
  Bookmark
} from '@/lib/database';

export function useDatabase() {
  const [apps, setApps] = useState<App[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedApps, loadedApiKeys, loadedBookmarks] = await Promise.all([
          getAllApps(),
          getAllApiKeys(),
          getAllBookmarks()
        ]);
        
        setApps(loadedApps);
        setApiKeys(loadedApiKeys);
        setBookmarks(loadedBookmarks);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addAppAsync = async (app: Omit<App, 'id' | 'createdAt'>) => {
    const newApp = await addApp(app);
    setApps(prev => [...prev, newApp]);
    return newApp;
  };

  const updateAppAsync = async (id: string, updates: Partial<App>) => {
    await updateApp(id, updates);
    setApps(prev => prev.map(app => app.id === id ? { ...app, ...updates } : app));
  };

  const deleteAppAsync = async (id: string) => {
    await deleteApp(id);
    setApps(prev => prev.filter(app => app.id !== id));
  };

  const addApiKeyAsync = async (key: Omit<ApiKey, 'id' | 'createdAt'>) => {
    const newKey = await addApiKey(key);
    setApiKeys(prev => [...prev, newKey]);
    return newKey;
  };

  const updateApiKeyAsync = async (id: string, updates: Partial<ApiKey>) => {
    await updateApiKey(id, updates);
    setApiKeys(prev => prev.map(key => key.id === id ? { ...key, ...updates } : key));
  };

  const deleteApiKeyAsync = async (id: string) => {
    await deleteApiKey(id);
    setApiKeys(prev => prev.filter(key => key.id !== id));
  };

  const addBookmarkAsync = async (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
    const newBookmark = await addBookmark(bookmark);
    setBookmarks(prev => [...prev, newBookmark]);
    return newBookmark;
  };

  const updateBookmarkAsync = async (id: string, updates: Partial<Bookmark>) => {
    await updateBookmark(id, updates);
    setBookmarks(prev => prev.map(bookmark => bookmark.id === id ? { ...bookmark, ...updates } : bookmark));
  };

  const deleteBookmarkAsync = async (id: string) => {
    await deleteBookmark(id);
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
  };

  return {
    apps,
    apiKeys,
    bookmarks,
    loading,
    addApp: addAppAsync,
    updateApp: updateAppAsync,
    deleteApp: deleteAppAsync,
    addApiKey: addApiKeyAsync,
    updateApiKey: updateApiKeyAsync,
    deleteApiKey: deleteApiKeyAsync,
    addBookmark: addBookmarkAsync,
    updateBookmark: updateBookmarkAsync,
    deleteBookmark: deleteBookmarkAsync
  };
}