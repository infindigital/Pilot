// Small date helpers (no external dependency).

export const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

// ISO week start (Monday).
export const startOfWeek = (d = new Date()) => {
  const x = startOfDay(d);
  const day = (x.getDay() + 6) % 7; // 0 = Monday
  x.setDate(x.getDate() - day);
  return x;
};

export const isThisWeek = (iso) => {
  if (!iso) return false;
  const date = new Date(iso);
  return date >= startOfWeek();
};

export const sameDay = (a, b) => startOfDay(a).getTime() === startOfDay(b).getTime();

export const monthKey = (iso) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export const monthLabel = (key) => {
  const [y, m] = key.split('-');
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString(undefined, {
    month: 'short',
    year: '2-digit',
  });
};

export const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const daysUntil = (iso) => {
  if (!iso) return null;
  const diff = startOfDay(iso).getTime() - startOfDay(new Date()).getTime();
  return Math.round(diff / 86400000);
};
