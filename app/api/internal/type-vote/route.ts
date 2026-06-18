import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { saveSystemVote } from "@/lib/system-vote";
import { createSupabaseAdminClient, getSupabaseAdminEnvStatus } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function timingSafeTokenMatch(received: string, expected: string) {
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);

  if (receivedBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(receivedBuffer, expectedBuffer);
}

function getBearerToken(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  const [scheme, token] = header.split(" ");
  return scheme?.toLowerCase() === "bearer" ? token : null;
}

export async function POST(request: Request) {
  const expectedToken = process.env.PERSONAMAP_INTERNAL_API_TOKEN;
  const systemUserId = process.env.PERSONAMAP_SYSTEM_USER_ID;
  const adminEnvStatus = getSupabaseAdminEnvStatus();

  if (!expectedToken || !systemUserId || !adminEnvStatus.configured) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Initial typing API is not configured. Set PERSONAMAP_INTERNAL_API_TOKEN, PERSONAMAP_SYSTEM_USER_ID, and SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 503 },
    );
  }

  const bearerToken = getBearerToken(request);
  if (!bearerToken || !timingSafeTokenMatch(bearerToken, expectedToken)) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, message: "Supabase admin client is not configured." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Request body must be valid JSON." }, { status: 400 });
  }

  const result = await saveSystemVote(body, {
    systemUserId,
    async findProfile(input) {
      if (input.profileId) {
        const { data, error } = await supabase.from("profiles").select("id, slug").eq("id", input.profileId).maybeSingle();
        if (error) throw new Error(`Failed to find profile by id: ${error.message}`);
        return data;
      }

      if (!input.profileSlug) return null;

      const { data, error } = await supabase.from("profiles").select("id, slug").eq("slug", input.profileSlug).maybeSingle();
      if (error) throw new Error(`Failed to find profile by slug: ${error.message}`);

      return data;
    },
    async findTypingSystem(systemCode) {
      const { data, error } = await supabase.from("typing_systems").select("id, code").eq("code", systemCode).maybeSingle();
      if (error) throw new Error(`Failed to find typing system: ${error.message}`);
      return data;
    },
    async findTypeOption(input) {
      const { data, error } = await supabase
        .from("type_options")
        .select("id, code, typing_system_id")
        .eq("typing_system_id", input.typingSystemId)
        .ilike("code", input.typeCode)
        .maybeSingle();
      if (error) throw new Error(`Failed to find type option: ${error.message}`);
      return data;
    },
    async upsertVote(payload) {
      return supabase.from("votes").upsert(payload, { onConflict: "user_id,profile_id,typing_system_id" });
    },
  }).catch((error: unknown) => {
    console.error("Initial typing API failed", error);
    return { ok: false as const, message: "Initial typing could not be saved.", status: 500 };
  });

  if (!result.ok) {
    return NextResponse.json(result, { status: result.status });
  }

  revalidatePath("/profiles");
  revalidatePath(`/profiles/${result.profileSlug}`);

  return NextResponse.json(result);
}
