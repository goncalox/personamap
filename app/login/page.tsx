import { AuthForm } from "@/components/auth-form";
import { signInAction } from "@/app/actions";

export default function LoginPage() {
  return (
    <main className="page-shell grid min-h-[calc(100svh-65px)] place-items-center py-12">
      <AuthForm mode="login" action={signInAction} />
    </main>
  );
}
