import { ProfileForm } from "@/components/profile-form";
import { getCurrentUser } from "@/lib/queries";

export default async function NewProfilePage() {
  const user = await getCurrentUser();

  return (
    <main className="page-shell max-w-3xl py-10 sm:py-12">
      <div className="mb-8">
        <p className="eyebrow">Create profile</p>
        <h1 className="section-title mt-2 sm:text-4xl">Add a character or public figure</h1>
        <p className="body-copy mt-4 max-w-2xl">
          {user
            ? "Start with the core profile details. Typing and evidence can build up after the profile exists."
            : "You can preview the form, but Supabase auth is required to save a new profile."}
        </p>
      </div>
      <div>
        <ProfileForm />
      </div>
    </main>
  );
}
