import { AuthForm } from "@/components/auth-form";
import { signUpAction } from "@/app/actions";

export default function SignupPage() {
  return (
    <main className="grid min-h-[calc(100vh-65px)] place-items-center px-4 py-12">
      <AuthForm mode="signup" action={signUpAction} />
    </main>
  );
}
