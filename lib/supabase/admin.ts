import { createClient } from "@supabase/supabase-js";

import { supabaseUrl } from "@/lib/supabase/config";
import type { Database } from "@/lib/types";

// Warning: this client bypasses RLS and must never be used in client components.
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!serviceRoleKey) throw new Error("Missing environment variable: SUPABASE_SERVICE_ROLE_KEY");

export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
