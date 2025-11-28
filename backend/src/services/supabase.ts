import { createClient } from '@supabase/supabase-js';

// Support both server-side env names and frontend NEXT_PUBLIC fallbacks
const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';

const supabaseKey =
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_KEY ||
  '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_KEY (or NEXT_PUBLIC_SUPABASE_*) in .env',
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
// For admin operations prefer explicit service key, otherwise fall back to the anon/service key
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY || supabaseKey,
);
