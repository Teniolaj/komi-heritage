"use client";

import { createClient } from "@/lib/supabase/client";

function getAppUrl() {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  }

  return process.env.NEXT_PUBLIC_APP_URL ?? "";
}

/**
 * Initiates a Google OAuth sign-in / sign-up flow.
 * Supabase will redirect the user back to /auth/callback after consent.
 */
export async function signInWithGoogle() {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // After Google consent, Supabase redirects here so we can exchange the code for a session.
      redirectTo: `${getAppUrl()}/auth/callback`,
    },
  });

  if (error) {
    console.error("Google sign-in error:", error.message);
    return false;
  }

  return true;
}

type EmailSignUpInput = {
  email: string;
  password: string;
  fullName: string;
  phone?: string | null;
};

export async function signUpWithEmail({
  email,
  password,
  fullName,
  phone,
}: EmailSignUpInput) {
  const supabase = createClient();
  const redirectBase = getAppUrl();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${redirectBase}/auth/confirm?next=/menu`,
      data: {
        full_name: fullName,
        phone: phone ?? null,
      },
    },
  });

  return { data, error };
}

type EmailSignInInput = {
  email: string;
  password: string;
};

export async function signInWithEmail({
  email,
  password,
}: EmailSignInInput) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}
