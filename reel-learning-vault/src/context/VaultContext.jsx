import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useCallback,
} from 'react';
import { storage } from '../lib/storage.js';
import { createItem, normalizeItem } from '../lib/model.js';
import { getSampleItems } from '../lib/sampleData.js';
import { COMPLETED_ON_STATUS } from '../lib/workflow.js';

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
  const [state, dispatch] = useReducer(reducer, { items: [] });
  const hydrated = useRef(false);

  // Load once on mount; seed with sample data on first ever run.
  useEffect(() => {
    const saved = storage.load();
    if (saved && Array.isArray(saved.items)) {
      dispatch({ type: 'HYDRATE', items: saved.items.map(normalizeItem) });
    } else {
      dispatch({ type: 'HYDRATE', items: getSampleItems() });
    }
    hydrated.current = true;
  }, []);

  // Persist on every change after the initial hydration.
  useEffect(() => {
    if (hydrated.current) storage.save({ items: state.items, version: 1 });
  }, [state.items]);

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

  const value = useMemo(() => ({ items: state.items, ...actions }), [state.items, actions]);

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
}

export const useVault = () => {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error('useVault must be used within VaultProvider');
  return ctx;
};

// Convenience selector hook for a single item.
export const useItem = (id) => {
  const { items } = useVault();
  return useCallback(() => items.find((i) => i.id === id), [items, id])();
};
