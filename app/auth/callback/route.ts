import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase/config";
import type { Database } from "@/lib/types";

/**
 * /auth/callback
 *
 * Supabase redirects here after Google OAuth consent with a `code` query param.
 * We exchange that code for a session (sets the auth cookies), then send
 * the user to a sensible destination.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/menu";

  // Supabase sends ?error=... when something fails on its side BEFORE returning
  // a code (e.g. a DB trigger blows up while saving the new user).
  const supabaseError = searchParams.get("error");
  if (supabaseError) {
    const description = searchParams.get("error_description") ?? supabaseError;
    console.error("Supabase OAuth error:", description);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(description)}`
    );
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const response = NextResponse.redirect(`${origin}${next}`);

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Auth callback error:", error.message);
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  return response;
}
