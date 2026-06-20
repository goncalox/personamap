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
    <form action={formAction} className="glass-panel mx-auto w-full max-w-md p-6">
      <p className="eyebrow">{isLogin ? "Welcome back" : "Join PersonaMap"}</p>
      <h1 className="mt-2 text-3xl font-semibold text-ink">{isLogin ? "Log in" : "Create account"}</h1>
      <p className="mt-3 text-sm leading-6 text-ink/60">
        {isLogin
          ? "Log in to suggest typings, add evidence, and create profiles."
          : "Create an account to suggest typings and contribute to profiles."}
      </p>
      {!isLogin ? (
        <p className="mt-3 text-sm leading-6 text-ink/50">
          If your Supabase project requires email confirmation, you may need to check your inbox before the account
          becomes active.
        </p>
      ) : null}
      <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-ink">
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className="field-control"
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
            placeholder="At least 6 characters"
            className="field-control"
          />
        </label>
      </div>
      {state.message ? (
        <p
          role="status"
          className={
            state.ok
              ? "mt-4 rounded-md border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-sm text-emerald-200"
              : "mt-4 rounded-md border border-wine/35 bg-wine/10 px-3 py-2 text-sm text-red-200"
          }
        >
          {state.message}
        </p>
      ) : null}
      <button
        disabled={pending}
        className="primary-action mt-6 w-full"
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
