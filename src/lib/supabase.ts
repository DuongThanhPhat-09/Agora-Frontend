import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Thiếu biến môi trường Supabase! Hãy kiểm tra file .env");
}

// Debug: Log để kiểm tra service role key có được load không
console.log('🔍 Supabase Environment Check:', {
  hasUrl: !!supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  hasServiceRoleKey: !!supabaseServiceRoleKey,
  serviceRoleKeyPrefix: supabaseServiceRoleKey ? supabaseServiceRoleKey.substring(0, 20) + '...' : 'MISSING'
});

if (!supabaseServiceRoleKey) {
  console.error('❌ VITE_SUPABASE_SERVICE_ROLE_KEY not found! Please check .env file and restart dev server.');
}

// Regular client for public operations (auth, public queries)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for operations that need to bypass RLS (e.g., file uploads)
// ⚠️ Use with caution - this bypasses all Row Level Security policies
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      storageKey: 'supabase-admin-auth-token'
    }
  }
);
