
import { useState, useEffect, useCallback } from 'react';
import { CustomItem, CustomItemCategory } from '../types';

const STORAGE_KEY = 'virtualRemodelAILibrary';

export const useCustomLibrary = () => {
  const [library, setLibrary] = useState<CustomItem[]>([]);

  useEffect(() => {
    try {
      const storedItems = window.localStorage.getItem(STORAGE_KEY);
      if (storedItems) {
        setLibrary(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error("Failed to read from localStorage", error);
    }
  }, []);

  const saveLibrary = (items: CustomItem[]) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to write to localStorage", error);
    }
  };

  const addItem = useCallback((name: string, category: CustomItemCategory, dataUrl: string, mimeType: string) => {
    const newItem: CustomItem = {
      id: `item-${Date.now()}`,
      name,
      category,
      dataUrl,
      mimeType,
    };
    setLibrary(prev => {
      const updatedLibrary = [...prev, newItem];
      saveLibrary(updatedLibrary);
      return updatedLibrary;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setLibrary(prev => {
      const updatedLibrary = prev.filter(item => item.id !== id);
      saveLibrary(updatedLibrary);
      return updatedLibrary;
    });
  }, []);

  return { library, addItem, removeItem };
};
