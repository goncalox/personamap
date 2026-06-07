import { AuthForm } from "@/components/auth-form";
import { signInAction } from "@/app/actions";

export default function LoginPage() {
  return (
    <main className="grid min-h-[calc(100vh-65px)] place-items-center px-4 py-10">
      <AuthForm mode="login" action={signInAction} />
    </main>
  );
}
