import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { storage } from '../lib/storage.js';
import { repo } from '../lib/repo.js';
import { createItem, normalizeItem } from '../lib/model.js';
import { getSampleItems } from '../lib/sampleData.js';
import { COMPLETED_ON_STATUS } from '../lib/workflow.js';
import { useAuth } from './AuthContext.jsx';

const VaultContext = createContext(null);

// ----- reducer -----

function withCompletion(item) {
  // Auto-stamp completedAt the first time an item reaches a completed status,
  // and clear it if it moves back out.
  const isComplete = COMPLETED_ON_STATUS.has(item.status);
  if (isComplete && !item.completedAt) {
    return { ...item, completedAt: new Date().toISOString() };
  }
  if (!isComplete && item.completedAt) {
    return { ...item, completedAt: null };
  }
  return item;
}

const touch = (item) =>
  withCompletion({ ...item, updatedAt: new Date().toISOString() });

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { items: action.items };

    case 'ADD':
      return { items: [withCompletion(action.item), ...state.items] };

    case 'UPDATE':
      return {
        items: state.items.map((i) =>
          i.id === action.id ? touch({ ...i, ...action.patch }) : i,
        ),
      };

    case 'TOGGLE_PROGRESS': {
      return {
        items: state.items.map((i) => {
          if (i.id !== action.id) return i;
          return touch({
            ...i,
            progress: { ...i.progress, [action.step]: !i.progress[action.step] },
          });
        }),
      };
    }

    case 'DELETE':
      return { items: state.items.filter((i) => i.id !== action.id) };

    case 'BULK_DELETE': {
      const ids = new Set(action.ids);
      return { items: state.items.filter((i) => !ids.has(i.id)) };
    }

    case 'BULK_STATUS': {
      const ids = new Set(action.ids);
      return {
        items: state.items.map((i) =>
          ids.has(i.id) ? touch({ ...i, status: action.status }) : i,
        ),
      };
    }

    case 'IMPORT':
      // Merge by id; imported records replace existing ones with the same id.
      return { items: mergeItems(state.items, action.items, action.mode) };

    case 'RESET':
      return { items: action.items };

    default:
      return state;
  }
}

function mergeItems(existing, incoming, mode = 'merge') {
  if (mode === 'replace') return incoming;
  const map = new Map(existing.map((i) => [i.id, i]));
  for (const item of incoming) map.set(item.id, item);
  return [...map.values()];
}

// ----- provider -----

export function VaultProvider({ children }) {
  const { authEnabled, user } = useAuth();
  const [state, dispatch] = useReducer(reducer, { items: [] });
  const [loading, setLoading] = useState(true);

  // When auth is enabled and a user is signed in, the cloud (Supabase) is the
  // source of truth. Otherwise we use LocalStorage (demo / no-config mode).
  const useCloud = authEnabled && Boolean(user);
  const userId = user?.id ?? null;

  // Snapshot of the last-synced items (by reference) so we can diff cheaply.
  const prevItems = useRef(new Map());
  // Skip the first sync pass right after hydration (nothing changed yet).
  const skipNextSync = useRef(true);

  // ---- Load when the data source changes (login / logout / mode) ----
  useEffect(() => {
    let active = true;
    setLoading(true);
    skipNextSync.current = true;

    (async () => {
      let items = [];
      try {
        if (useCloud) {
          items = await repo.list();
        } else if (authEnabled) {
          // Auth enabled but signed out — show nothing.
          items = [];
        } else {
          const saved = storage.load();
          items = saved && Array.isArray(saved.items)
            ? saved.items.map(normalizeItem)
            : getSampleItems();
        }
      } catch (err) {
        console.error('Failed to load vault', err);
      }
      if (!active) return;
      dispatch({ type: 'HYDRATE', items });
      prevItems.current = new Map(items.map((i) => [i.id, i]));
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [useCloud, userId, authEnabled]);

  // ---- Persist on change ----
  // The reducer keeps unchanged items at the same reference, so a reference diff
  // tells us exactly which rows to upsert / delete in the cloud.
  useEffect(() => {
    if (loading) return;
    if (skipNextSync.current) {
      skipNextSync.current = false;
      prevItems.current = new Map(state.items.map((i) => [i.id, i]));
      return;
    }

    const curMap = new Map(state.items.map((i) => [i.id, i]));

    if (useCloud) {
      const prev = prevItems.current;
      const toUpsert = state.items.filter((i) => prev.get(i.id) !== i);
      const removed = [...prev.keys()].filter((id) => !curMap.has(id));
      if (toUpsert.length) repo.upsertMany(toUpsert, userId).catch((e) => console.error('upsert failed', e));
      if (removed.length) repo.removeMany(removed).catch((e) => console.error('delete failed', e));
    } else if (!authEnabled) {
      storage.save({ items: state.items, version: 1 });
    }

    prevItems.current = curMap;
  }, [state.items, loading, useCloud, authEnabled, userId]);

  const actions = useMemo(
    () => ({
      addItem: (partial) => dispatch({ type: 'ADD', item: createItem(partial) }),
      updateItem: (id, patch) => dispatch({ type: 'UPDATE', id, patch }),
      toggleProgress: (id, step) => dispatch({ type: 'TOGGLE_PROGRESS', id, step }),
      toggleFavorite: (id, current) =>
        dispatch({ type: 'UPDATE', id, patch: { favorite: !current } }),
      setStatus: (id, status) => dispatch({ type: 'UPDATE', id, patch: { status } }),
      deleteItem: (id) => dispatch({ type: 'DELETE', id }),
      bulkDelete: (ids) => dispatch({ type: 'BULK_DELETE', ids }),
      bulkStatus: (ids, status) => dispatch({ type: 'BULK_STATUS', ids, status }),
      importItems: (items, mode) =>
        dispatch({ type: 'IMPORT', items: items.map(normalizeItem), mode }),
      loadSample: () => dispatch({ type: 'RESET', items: getSampleItems() }),
      clearAll: () => dispatch({ type: 'RESET', items: [] }),
    }),
    [],
  );

  const value = useMemo(
    () => ({ items: state.items, loading, isCloud: useCloud, ...actions }),
    [state.items, loading, useCloud, actions],
  );

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
}

export const useVault = () => {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error('useVault must be used within VaultProvider');
  return ctx;
};
