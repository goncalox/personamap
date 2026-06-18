"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authSchema, evidenceSchema, profileSchema } from "@/lib/validations";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { saveProtectedVote, type ActionState } from "@/lib/protected-voting";
import { getSiteUrl } from "@/lib/site-url";

function requireSupabase() {
  return createSupabaseServerClient();
}

export async function signInAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = authSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid login details." };
  }

  const supabase = await requireSupabase();
  if (!supabase) {
    return { ok: false, message: "Add Supabase env vars to enable authentication." };
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { ok: false, message: error.message };

  redirect("/profiles");
}

export async function signUpAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = authSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid signup details." };
  }

  const supabase = await requireSupabase();
  if (!supabase) {
    return { ok: false, message: "Add Supabase env vars to enable authentication." };
  }

  const { error } = await supabase.auth.signUp({
    ...parsed.data,
    options: {
      emailRedirectTo: `${getSiteUrl()}/login`,
    },
  });
  if (error) return { ok: false, message: error.message };

  redirect("/profiles");
}

export async function signOutAction() {
  const supabase = await requireSupabase();
  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/");
}

export async function createProfileAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid profile." };
  }

  const supabase = await requireSupabase();
  if (!supabase) {
    return { ok: false, message: "Add Supabase env vars to create profiles." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, message: "Log in to create a profile." };

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      ...parsed.data,
      created_by: user.id,
      source_title: parsed.data.source_title || null,
      description: parsed.data.description || null,
      image_url: parsed.data.image_url || null,
    })
    .select("slug")
    .single();

  if (error) return { ok: false, message: error.message };

  revalidatePath("/profiles");
  redirect(`/profiles/${data.slug}`);
}

export async function submitVoteAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const profileSlug = formData.get("profileSlug")?.toString() ?? "";
  const rawInput = Object.fromEntries(formData);

  const supabase = await requireSupabase();
  if (!supabase) {
    return { ok: false, message: "Add Supabase env vars to suggest a type." };
  }

  const result = await saveProtectedVote(rawInput, {
    async getCurrentUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user ? { id: user.id } : null;
    },
    async getTypeOption(typeOptionId) {
      const { data } = await supabase
        .from("type_options")
        .select("id, typing_system_id")
        .eq("id", typeOptionId)
        .single();
      return data;
    },
    async upsertVote(payload) {
      return supabase.from("votes").upsert(payload, { onConflict: "user_id,profile_id,typing_system_id" });
    },
  });

  if (result.ok) revalidatePath(`/profiles/${profileSlug}`);
  return result;
}

export async function submitEvidenceAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = evidenceSchema.safeParse(Object.fromEntries(formData));
  const profileSlug = formData.get("profileSlug")?.toString() ?? "";

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid evidence." };
  }

  const supabase = await requireSupabase();
  if (!supabase) {
    return { ok: false, message: "Add Supabase env vars to submit evidence." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, message: "Log in to add evidence." };

  const { data: typeOption } = await supabase
    .from("type_options")
    .select("id, typing_system_id")
    .eq("id", parsed.data.typeOptionId)
    .single();

  if (!typeOption || typeOption.typing_system_id !== parsed.data.typingSystemId) {
    return { ok: false, message: "Selected type does not belong to this typing system." };
  }

  const { error } = await supabase.from("evidence_cards").insert({
    profile_id: parsed.data.profileId,
    user_id: user.id,
    typing_system_id: parsed.data.typingSystemId,
    type_option_id: parsed.data.typeOptionId,
    title: parsed.data.title,
    body: parsed.data.body,
    stance: parsed.data.stance,
  });

  if (error) return { ok: false, message: error.message };

  revalidatePath(`/profiles/${profileSlug}`);
  return { ok: true, message: "Evidence posted." };
}
