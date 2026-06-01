import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://xlmzpgvriucmnisvswue.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsbXpwZ3ZyaXVjbW5pc3Zzd3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMTQ2ODcsImV4cCI6MjA5MDg5MDY4N30.tEXXjA4wYoFpAu2JmKEbqs2hR6VEsRmx-hHdDl0MOys";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
