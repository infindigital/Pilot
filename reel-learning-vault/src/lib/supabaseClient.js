import { createClient } from '@supabase/supabase-js';

// Configuration comes from Vite env vars (set in .env locally and in the Vercel
// dashboard for production). If they are absent the app gracefully falls back to
// LocalStorage-only mode so it still runs for quick demos / local dev.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
