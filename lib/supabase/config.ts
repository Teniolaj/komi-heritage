export function getRequiredEnv(name: keyof NodeJS.ProcessEnv): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

// These two must use LITERAL property access so Next.js can statically
// inline them into both server AND client bundles at build time.
// Dynamic access (process.env[variable]) only works server-side.
export const supabaseUrl = (() => {
  const v = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!v) throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
  return v;
})();

export const supabaseAnonKey = (() => {
  const v = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!v) throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return v;
})();

