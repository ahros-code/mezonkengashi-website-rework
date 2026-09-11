"use client";

import { useState } from "react";
import s from "./Certificate.module.css";

/** Print (which is also "save as PDF" in every browser) and copy-link. */
export default function CertActions({
  labels,
  file,
}: {
  labels: { print: string; copy: string; copied: string; original: string };
  file?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard blocked (insecure origin, permissions) — the address bar still works */
    }
  };

  return (
    <div className={s.actions}>
      <button type="button" className="btn btn--gold btn--wide" onClick={() => window.print()}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 6V2h8v4M4 12H2.5V7.5A1.5 1.5 0 0 1 4 6h8a1.5 1.5 0 0 1 1.5 1.5V12H12M4 10h8v4H4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
        {labels.print}
      </button>
      <button type="button" className={s.ghostBtn} onClick={copy} aria-live="polite">
        {copied ? labels.copied : labels.copy}
      </button>
      {file && (
        <a href={file} className={s.ghostBtn} target="_blank" rel="noopener noreferrer">
          {labels.original} ↗
        </a>
      )}
    </div>
  );
}
