import { ProfileForm } from "@/components/profile-form";
import { getCurrentUser } from "@/lib/queries";

export default async function NewProfilePage() {
  const user = await getCurrentUser();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brass">Create profile</p>
      <h1 className="mt-2 text-4xl font-semibold text-ink">Add a character or public figure</h1>
      <p className="mt-4 max-w-2xl leading-7 text-ink/65">
        {user
          ? "Profiles start with only the core facts. Typing and evidence can build up after the profile exists."
          : "You can preview the form, but Supabase auth is required to save a new profile."}
      </p>
      <div className="mt-8">
        <ProfileForm />
      </div>
    </main>
  );
}
