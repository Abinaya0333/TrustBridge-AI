import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseServiceKey &&
  supabaseServiceKey !== 'your-supabase-anon-key' &&
  supabaseServiceKey !== 'your-supabase-service-role-key'
);

let supabaseClient: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    console.log('✅ Supabase Client initialized with remote database:', supabaseUrl);
  } catch (err: any) {
    console.warn('⚠️ Failed to initialize Supabase client:', err?.message);
  }
} else {
  console.log('ℹ️ Supabase credentials not set in .env. Running with local persistent sandbox database.');
}

export const supabase = supabaseClient;
