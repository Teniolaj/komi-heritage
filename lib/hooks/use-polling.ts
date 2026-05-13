import { useEffect, useRef, useCallback } from "react";

/**
 * Polls a URL at the given interval and calls `onData` with the parsed JSON.
 * Automatically pauses when the browser tab is hidden, resumes when visible.
 * Fetches immediately on mount, then every `intervalMs` after that.
 */
export function usePolling<T>(
  url: string,
  onData: (data: T) => void,
  intervalMs = 10_000,
) {
  const onDataRef = useRef(onData);

  useEffect(() => {
    onDataRef.current = onData;
  }, [onData]);

  const poll = useCallback(async () => {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      onDataRef.current(json as T);
    } catch {
      // Silently swallow network errors — next poll will retry
    }
  }, [url]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    function start() {
      // Fetch immediately, then on interval
      void poll();
      timer = setInterval(() => void poll(), intervalMs);
    }

    function stop() {
      clearInterval(timer);
    }

    function handleVisibility() {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    }

    start();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [poll, intervalMs]);
}
