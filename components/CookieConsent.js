"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only runs in the browser, after mount — safe to touch localStorage here.
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (!existing) setVisible(true);
  }, []);

  function choose(value) {
    window.localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
    // If you later wire up Google's Consent Mode, this is the spot to call
    // gtag('consent', 'update', { ad_storage: value === 'accepted' ? 'granted' : 'denied', ... })
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-pitch-raised px-6 py-4">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-paper-dim">
          This site uses cookies for advertising and basic analytics. See the{" "}
          <Link
            href="/privacy"
            className="text-gold underline underline-offset-2"
          >
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={() => choose("declined")}
            className="rounded-full border border-line px-4 py-2 text-sm text-paper-dim transition hover:bg-pitch hover:text-paper"
          >
            Decline
          </button>
          <button
            onClick={() => choose("accepted")}
            className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-pitch transition hover:bg-gold-bright"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}