"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowMark } from "@/components/Icons";
import OrgMark from "@/components/OrgMark";
import type { CertificateStatus, Organization } from "@/content/types";
import s from "./Registry.module.css";

export type RegistryRow = {
  number: string;
  href: string;
  org: Organization;
  sectorLabel: string;
  subject: string;
  kindLabel: string;
  standards: string[];
  issued: string;
  until: string;
  status: CertificateStatus;
};

type Copy = {
  searchLabel: string;
  searchPh: string;
  all: string;
  allSectors: string;
  status: Record<CertificateStatus, string>;
  colNumber: string;
  colHolder: string;
  colIssued: string;
  colUntil: string;
  colStatus: string;
  found: string;
  noResults: string;
  reset: string;
};

const STATUSES: CertificateStatus[] = ["valid", "expired", "revoked"];

/* Uzbek is typed with several apostrophes (ʻ ʼ ' ‘); fold them so "Fargʻona"
   matches "Farg'ona", and ignore case and dashes so "mk20260148" finds a number. */
function fold(v: string) {
  return v.toLowerCase().replace(/[ʻʼ'‘’`]/g, "'").replace(/[-\s]+/g, " ");
}

/** Reads ?q= and ?org= — the home page's verify form and roster tiles land here. */
export function RegistryFromUrl(props: { rows: RegistryRow[]; sectors: { id: string; label: string }[]; copy: Copy }) {
  const params = useSearchParams();
  return <RegistryTable {...props} initialQuery={params.get("q") ?? ""} initialOrg={params.get("org")} />;
}

export default function RegistryTable({
  rows,
  sectors,
  copy,
  initialQuery = "",
  initialOrg = null,
}: {
  rows: RegistryRow[];
  sectors: { id: string; label: string }[];
  copy: Copy;
  initialQuery?: string;
  initialOrg?: string | null;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState<CertificateStatus | null>(null);
  const [sector, setSector] = useState("");
  const [org, setOrg] = useState<string | null>(initialOrg);

  /* Keep the address shareable: whatever is filtered is what a copied link opens. */
  useEffect(() => {
    const url = new URL(window.location.href);
    const set = (k: string, v: string | null) => (v ? url.searchParams.set(k, v) : url.searchParams.delete(k));
    set("q", query.trim() || null);
    set("org", org);
    window.history.replaceState(null, "", url);
  }, [query, org]);

  const orgName = org ? rows.find((r) => r.org.slug === org)?.org.name : null;

  /* Everything but the status filter, so the status cards can show live counts. */
  const base = useMemo(() => {
    const words = fold(query).split(" ").filter(Boolean);
    return rows.filter((r) => {
      if (org && r.org.slug !== org) return false;
      if (sector && r.org.sector !== sector) return false;
      if (!words.length) return true;
      const hay = fold(`${r.number} ${r.number.replace(/-/g, "")} ${r.org.name} ${r.subject} ${r.standards.join(" ")} ${r.kindLabel}`);
      return words.every((w) => hay.includes(w));
    });
  }, [rows, query, org, sector]);

  const shown = status ? base.filter((r) => r.status === status) : base;
  const filtered = Boolean(query.trim() || status || sector || org);

  const reset = () => {
    setQuery("");
    setStatus(null);
    setSector("");
    setOrg(null);
  };

  return (
    <div className={s.registry}>
      {/* ---- status cards double as the status filter ---- */}
      <div className={s.statuses} role="group" aria-label={copy.colStatus}>
        {STATUSES.map((st) => (
          <button
            key={st}
            type="button"
            className={s.statusCard}
            data-status={st}
            aria-pressed={status === st}
            onClick={() => setStatus(status === st ? null : st)}
          >
            <span className={s.statusCount}>{base.filter((r) => r.status === st).length}</span>
            <span className={s.statusName}>
              <span className={s.dot} data-status={st} aria-hidden="true" />
              {copy.status[st]}
            </span>
          </button>
        ))}
      </div>

      {/* ---- search + sector ---- */}
      <div className={s.toolbar}>
        <div className={s.search} role="search">
          <svg className={s.searchIcon} width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="5.6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12.3 12.3 16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            className={s.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.searchPh}
            aria-label={copy.searchLabel}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <select
          className={s.select}
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          aria-label={copy.allSectors}
        >
          <option value="">{copy.allSectors}</option>
          {sectors.map((sec) => (
            <option key={sec.id} value={sec.id}>
              {sec.label}
            </option>
          ))}
        </select>
      </div>

      <div className={s.summary} aria-live="polite">
        <span>
          {copy.found}: <strong>{shown.length}</strong>
        </span>
        {orgName && (
          <button type="button" className={s.orgChip} onClick={() => setOrg(null)}>
            {orgName}
            <span aria-hidden="true">×</span>
          </button>
        )}
        {filtered && (
          <button type="button" className={s.reset} onClick={reset}>
            {copy.reset}
          </button>
        )}
      </div>

      {/* ---- the register ---- */}
      <div className={s.table}>
        {/* a visual header; each row is a link that reads as one sentence on its own */}
        <div className={s.thead} aria-hidden="true">
          <span>{copy.colNumber}</span>
          <span>{copy.colHolder}</span>
          <span>{copy.colIssued}</span>
          <span>{copy.colUntil}</span>
          <span>{copy.colStatus}</span>
        </div>

        {!shown.length && (
          <p className={s.empty}>
            {copy.noResults}{" "}
            <button type="button" className={s.reset} onClick={reset}>
              {copy.reset}
            </button>
          </p>
        )}

        {shown.map((r, i) => (
          <a
            key={r.number}
            href={r.href}
            className={s.row}
            data-status={r.status}
            style={{ animationDelay: `${Math.min(i, 10) * 0.035}s` }}
          >
            <span className={s.number}>
              {r.number}
            </span>
            <span className={s.holder}>
              <OrgMark org={r.org} className={s.mark} />
              <span className={s.holderText}>
                <span className={s.orgName}>{r.org.name}</span>
                <span className={s.subject}>{r.subject}</span>
                <span className={s.kind}>
                  {r.kindLabel} · {r.sectorLabel}
                </span>
              </span>
            </span>
            <span className={s.date}>
              <span className={s.cellLabel}>{copy.colIssued}</span>
              {r.issued}
            </span>
            <span className={s.date}>
              <span className={s.cellLabel}>{copy.colUntil}</span>
              {r.until}
            </span>
            <span className={s.statusCell}>
              <span className={s.pill} data-status={r.status}>
                <span className={s.dot} data-status={r.status} aria-hidden="true" />
                {copy.status[r.status]}
              </span>
              <ArrowMark />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
