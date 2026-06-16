// CSV import/export. Progress checkpoints are flattened into individual columns
// so the export is human-readable in a spreadsheet and round-trips cleanly.

import { PROGRESS_STEPS } from './constants.js';
import { normalizeItem } from './model.js';

const BASE_FIELDS = [
  'id',
  'title',
  'creator',
  'platform',
  'url',
  'category',
  'priority',
  'status',
  'favorite',
  'notes',
  'summary',
  'takeaways',
  'actionSteps',
  'reminderAt',
  'createdAt',
  'updatedAt',
  'completedAt',
];

const PROGRESS_FIELDS = PROGRESS_STEPS.map((s) => `progress_${s.id}`);
const HEADERS = [...BASE_FIELDS, ...PROGRESS_FIELDS];

const escapeCell = (value) => {
  const str = value == null ? '' : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export function itemsToCSV(items) {
  const rows = [HEADERS.join(',')];
  for (const item of items) {
    const base = BASE_FIELDS.map((f) => escapeCell(item[f]));
    const prog = PROGRESS_STEPS.map((s) => escapeCell(item.progress?.[s.id] ? 'yes' : 'no'));
    rows.push([...base, ...prog].join(','));
  }
  return rows.join('\n');
}

// Minimal RFC-4180-ish parser that handles quoted fields and escaped quotes.
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c !== ''));
}

export function csvToItems(text) {
  const rows = parseCSV(text);
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((cells) => {
    const record = {};
    headers.forEach((h, idx) => {
      record[h] = cells[idx] ?? '';
    });
    const progress = {};
    PROGRESS_STEPS.forEach((s) => {
      const v = record[`progress_${s.id}`];
      progress[s.id] = v === 'yes' || v === 'true' || v === '1';
    });
    return normalizeItem({
      ...record,
      favorite: record.favorite === 'true' || record.favorite === 'yes',
      // Drop the empty id so a fresh one is generated, avoiding collisions.
      id: record.id || undefined,
      reminderAt: record.reminderAt || null,
      completedAt: record.completedAt || null,
      progress,
    });
  });
}

export function downloadCSV(items, filename = 'reel-learning-vault.csv') {
  const blob = new Blob([itemsToCSV(items)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
