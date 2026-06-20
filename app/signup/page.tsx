import { AuthForm } from "@/components/auth-form";
import { signUpAction } from "@/app/actions";

export default function SignupPage() {
  return (
    <main className="page-shell grid min-h-[calc(100svh-65px)] place-items-center py-12">
      <AuthForm mode="signup" action={signUpAction} />
    </main>
  );
}
