"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnvStatus } from "@/lib/supabase/check-env";

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const envStatus = getSupabaseEnvStatus();
  if (!envStatus.configured) {
    throw new Error(`${envStatus.message} Copy .env.example to .env.local and restart the dev server.`);
  }

  return createBrowserClient(url!, anonKey!);
}
