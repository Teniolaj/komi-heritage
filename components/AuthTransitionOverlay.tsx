"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  AUTH_TRANSITION_EVENT,
  clearAuthTransition,
  getAuthTransition,
  type AuthTransitionKind,
} from "@/lib/auth-transition";

const MIN_VISIBLE_MS = 900;
const FALLBACK_CLEAR_MS = 6000;

export function AuthTransitionOverlay() {
  const [transition, setTransition] = useState<AuthTransitionKind | null>(null);
  const pathname = usePathname();
  const visibleUntilRef = useRef(0);
  const clearTimerRef = useRef<number | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);

  function resetTimers() {
    if (clearTimerRef.current) {
      window.clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }

    if (fallbackTimerRef.current) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  }

  function beginTransition(kind: AuthTransitionKind) {
    resetTimers();
    visibleUntilRef.current = Date.now() + MIN_VISIBLE_MS;
    setTransition(kind);

    fallbackTimerRef.current = window.setTimeout(() => {
      setTransition(null);
      clearAuthTransition();
    }, FALLBACK_CLEAR_MS);
  }

  function finishTransition() {
    const delay = Math.max(0, visibleUntilRef.current - Date.now());

    if (clearTimerRef.current) {
      window.clearTimeout(clearTimerRef.current);
    }

    clearTimerRef.current = window.setTimeout(() => {
      setTransition(null);
      clearAuthTransition();
    }, delay);
  }

  useEffect(() => {
    const supabase = createClient();
    const pending = getAuthTransition();

    if (pending) {
      beginTransition(pending);

      supabase.auth.getUser().then(({ data }) => {
        if (pending === "signing-in" && data.user) {
          finishTransition();
          return;
        }

        if (pending === "signing-out" && !data.user) {
          finishTransition();
        }
      });
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      const current = getAuthTransition();
      if (!current) return;

      if (event === "SIGNED_IN" && current === "signing-in") {
        finishTransition();
      }

      if (event === "SIGNED_OUT" && current === "signing-out") {
        finishTransition();
      }
    });

    const handleTransitionEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ kind: AuthTransitionKind | null }>).detail;
      if (detail?.kind) {
        beginTransition(detail.kind);
        return;
      }

      setTransition(null);
      resetTimers();
    };

    window.addEventListener(AUTH_TRANSITION_EVENT, handleTransitionEvent);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener(AUTH_TRANSITION_EVENT, handleTransitionEvent);
      resetTimers();
    };
  }, []);

  useEffect(() => {
    const current = getAuthTransition();
    if (!current) return;

    if ((pathname === "/login" || pathname === "/signup") && current === "signing-in") {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (!data.user) {
          setTransition(null);
          clearAuthTransition();
        }
      });
    }
  }, [pathname]);

  const copy =
    transition === "signing-out"
      ? {
          title: "Logging You Out",
          subtitle: "Closing your session and refreshing your space.",
        }
      : {
          title: "Signing You In",
          subtitle: "Preparing your account and bringing you into Komi Heritage.",
        };

  return (
    <AnimatePresence>
      {transition && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-6 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#111111]/90 p-8 text-white shadow-2xl"
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-primary/15">
                <Loader2 size={24} className="animate-spin text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-dm-sans text-[11px] font-black uppercase tracking-[0.26em] text-white/55">
                  Komi Heritage
                </p>
                <h2 className="mt-1 font-headline text-3xl font-bold leading-none">
                  {copy.title}
                </h2>
              </div>
            </div>

            <p className="font-dm-sans text-sm leading-6 text-white/72">{copy.subtitle}</p>

            <div className="mt-8 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.1, ease: "easeInOut", repeat: Infinity }}
                className="h-1.5 w-full bg-gradient-to-r from-primary via-[#f2c38b] to-primary"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
