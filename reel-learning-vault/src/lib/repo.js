// Cloud data repository (Supabase). Each learning item is stored as a row in the
// `items` table: a primary key, the owning user_id (enforced by Row Level
// Security), and the full item object in a `data` jsonb column. Storing the item
// as jsonb keeps the schema future-proof — new fields need no migration.

import { supabase } from './supabaseClient.js';
import { normalizeItem } from './model.js';

export const repo = {
  // Fetch every item belonging to the signed-in user (RLS scopes this to them).
  async list() {
    const { data, error } = await supabase
      .from('items')
      .select('data')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map((row) => normalizeItem(row.data));
  },

  // Insert or update a batch of items.
  async upsertMany(items, userId) {
    if (!items.length) return;
    const rows = items.map((item) => ({
      id: item.id,
      user_id: userId,
      data: item,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from('items').upsert(rows);
    if (error) throw error;
  },

  // Delete a batch of items by id.
  async removeMany(ids) {
    if (!ids.length) return;
    const { error } = await supabase.from('items').delete().in('id', ids);
    if (error) throw error;
  },
};
