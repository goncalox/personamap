import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnvStatus } from "@/lib/supabase/check-env";

export function hasSupabaseEnv() {
  return getSupabaseEnvStatus().configured;
}

export async function createSupabaseServerClient() {
  const envStatus = getSupabaseEnvStatus();
  if (!envStatus.configured) return null;

  const cookieStore = await cookies();
  type CookieToSet = {
    name: string;
    value: string;
    options: Parameters<typeof cookieStore.set>[2];
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components cannot set cookies. Route handlers/actions can.
          }
        },
      },
    },
  );
}
