import "server-only";

import { createClient } from "@supabase/supabase-js";

const adminEnvVars = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"] as const;

export function getSupabaseAdminEnvStatus(env: NodeJS.ProcessEnv = process.env) {
  const missing = adminEnvVars.filter((key) => !env[key]);

  return {
    configured: missing.length === 0,
    missing,
  };
}

export function createSupabaseAdminClient() {
  const envStatus = getSupabaseAdminEnvStatus();
  if (!envStatus.configured) return null;

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
