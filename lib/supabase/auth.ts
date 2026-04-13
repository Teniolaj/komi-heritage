"use client";

import { createClient } from "@/lib/supabase/client";

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
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error("Google sign-in error:", error.message);
  }
}
