// Storage adapter. The rest of the app talks to this module instead of touching
// localStorage directly. To add cloud sync later, swap the implementation here
// (e.g. async get/set hitting an API) without changing any component.

import { STORAGE_KEY } from './constants.js';

export const storage = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.error('Failed to load vault data', err);
      return null;
    }
  },

  save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (err) {
      console.error('Failed to save vault data', err);
      return false;
    }
  },

  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear vault data', err);
    }
  },
};

// Small id generator that does not depend on crypto being available.
export const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
