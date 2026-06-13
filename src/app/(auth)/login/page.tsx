"use client";

import { useActionState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { logIn, type AuthState } from "../actions";
import { AuthCard, FieldError } from "../AuthCard";

const initial: AuthState = {};

function Form() {
  const [state, formAction, pending] = useActionState(logIn, initial);
  const callbackUrl = useSearchParams().get("callbackUrl") ?? "/dashboard";
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <h1 style={{ fontFamily: "var(--font-pixel-alt)", fontSize: "var(--pixel-md)", color: "var(--text-primary)" }}>Log in</h1>
      <FieldError message={state.errors?.form} />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-medium" style={{ color: "var(--text-muted)", letterSpacing: "0.06em" }}>EMAIL</label>
          <input id="email" name="email" type="email" placeholder="you@example.com"
            defaultValue={state.values?.email}
            className="billd-input" />
          <FieldError message={state.errors?.email} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-xs font-medium" style={{ color: "var(--text-muted)", letterSpacing: "0.06em" }}>PASSWORD</label>
          <input id="password" name="password" type="password" placeholder="••••••••"
            defaultValue={undefined}
            className="billd-input" />
          <FieldError message={state.errors?.password} />
        </div>
      <button type="submit" disabled={pending} className="billd-btn billd-btn--primary mt-1">
        {pending ? "Working…" : "Log in"}
      </button>
      <Link href="/signup" className="text-sm" style={{ color: "var(--electric-sapphire)" }}>No account? Create one</Link>
    </form>
  );
}

export default function Page() {
  return (
    <AuthCard>
      <Suspense>
        <Form />
      </Suspense>
    </AuthCard>
  );
}
