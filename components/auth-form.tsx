"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { signInAction, signUpAction } from "@/app/actions";

type AuthAction = typeof signInAction | typeof signUpAction;

export function AuthForm({
  mode,
  action,
}: {
  mode: "login" | "signup";
  action: AuthAction;
}) {
  const [state, formAction, pending] = useActionState(action, { ok: false, message: "" });
  const isLogin = mode === "login";

  return (
    <form action={formAction} className="mx-auto w-full max-w-md rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-glow">
      <h1 className="text-3xl font-semibold text-ink">{isLogin ? "Log in" : "Create account"}</h1>
      <p className="mt-2 text-sm leading-6 text-ink/60">
        {isLogin ? "Vote and submit evidence with your PersonaMap account." : "Join the debate with email and password auth."}
      </p>
      <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            className="min-h-11 rounded-md border border-white/10 bg-coal px-3 text-ink outline-none focus:border-brass"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink">
          Password
          <input
            type="password"
            name="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            required
            minLength={6}
            className="min-h-11 rounded-md border border-white/10 bg-coal px-3 text-ink outline-none focus:border-brass"
          />
        </label>
      </div>
      {state.message ? (
        <p className={state.ok ? "mt-4 text-sm text-emerald-300" : "mt-4 text-sm text-wine"}>{state.message}</p>
      ) : null}
      <button
        disabled={pending}
        className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-ink px-5 text-sm font-semibold text-coal transition hover:bg-brass disabled:opacity-60"
      >
        {pending ? "Working..." : isLogin ? "Log in" : "Sign up"}
      </button>
      <p className="mt-5 text-center text-sm text-ink/55">
        {isLogin ? "Need an account?" : "Already have an account?"}{" "}
        <Link href={isLogin ? "/signup" : "/login"} className="font-semibold text-brass hover:text-ink">
          {isLogin ? "Sign up" : "Log in"}
        </Link>
      </p>
    </form>
  );
}
