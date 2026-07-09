import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://mgujrwuiftjmgnwnlels.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ndWpyd3VpZnRqbWdud25sZWxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0OTk5MzMsImV4cCI6MjA5MTA3NTkzM30.eVsYdGw9udZ3CfQoZZ_w9JTNUpsrVS5DP6tIVaSToyw";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
