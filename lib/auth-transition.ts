"use client";

export type AuthTransitionKind = "signing-in" | "signing-out";

const AUTH_TRANSITION_KEY = "komi-auth-transition";
const AUTH_TRANSITION_EVENT = "komi-auth-transition";

export function startAuthTransition(kind: AuthTransitionKind) {
  if (typeof window === "undefined") return;

  window.sessionStorage.setItem(AUTH_TRANSITION_KEY, kind);
  window.dispatchEvent(
    new CustomEvent(AUTH_TRANSITION_EVENT, {
      detail: { kind },
    }),
  );
}

export function getAuthTransition(): AuthTransitionKind | null {
  if (typeof window === "undefined") return null;

  const value = window.sessionStorage.getItem(AUTH_TRANSITION_KEY);
  return value === "signing-in" || value === "signing-out" ? value : null;
}

export function clearAuthTransition() {
  if (typeof window === "undefined") return;

  window.sessionStorage.removeItem(AUTH_TRANSITION_KEY);
  window.dispatchEvent(new CustomEvent(AUTH_TRANSITION_EVENT, { detail: { kind: null } }));
}

export { AUTH_TRANSITION_EVENT };
