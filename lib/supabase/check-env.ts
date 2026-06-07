export type SupabaseEnvStatus = {
  configured: boolean;
  missing: string[];
  message: string;
};

const requiredEnvVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"] as const;

export function getSupabaseEnvStatus(env: NodeJS.ProcessEnv = process.env): SupabaseEnvStatus {
  const missing = requiredEnvVars.filter((key) => !env[key]);

  if (missing.length === 0) {
    return {
      configured: true,
      missing: [],
      message: "Supabase is configured.",
    };
  }

  return {
    configured: false,
    missing,
    message: `Supabase is not configured. Missing: ${missing.join(", ")}.`,
  };
}
