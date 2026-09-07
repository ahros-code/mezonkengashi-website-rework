"use client";

import { useId, useState } from "react";
import { GirihStar } from "./Girih";
import type { Dict } from "@/i18n";
import type { Locale } from "@/i18n/config";
import s from "./QuickForm.module.css";

type State = "idle" | "sending" | "done";

export default function QuickForm({ t, locale }: { t: Dict; locale: Locale }) {
  const uid = useId();
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();

    if (!name) return setError(t.form.errName);
    if (phone.replace(/\D/g, "").length < 9) return setError(t.form.errPhone);

    setError(null);
    setState("sending");
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          topic: "consult",
          locale,
          website: data.get("website"),
        }),
      });
    } finally {
      setState("done");
    }
  }

  if (state === "done") {
    return (
      <div className={s.done} role="status">
        <GirihStar size={30} stroke="var(--zar-2)" strokeWidth={1} />
        <p className={s.doneTitle}>{t.form.sentTitle}</p>
        <p className={s.doneBody}>{t.form.sentBody}</p>
      </div>
    );
  }

  return (
    <form className={s.form} onSubmit={onSubmit} noValidate>
      <p className={s.title}>{t.hero.formTitle}</p>

      <div className={s.fields}>
        <div className={s.field}>
          <label htmlFor={`${uid}-name`} className={s.label}>
            {t.form.name}
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            className={s.input}
            autoComplete="name"
            placeholder={t.form.namePh}
            required
          />
        </div>

        <div className={s.field}>
          <label htmlFor={`${uid}-phone`} className={s.label}>
            {t.form.phone}
          </label>
          <input
            id={`${uid}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            className={s.input}
            autoComplete="tel"
            placeholder={t.form.phonePh}
            required
          />
        </div>
      </div>

      <input
        type="text"
        name="website"
        className={s.honey}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {error && (
        <p className={s.error} role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn--gold btn--wide" disabled={state === "sending"}>
        {state === "sending" ? t.form.sending : t.form.submitShort}
      </button>

      <p className={s.note}>{t.hero.formNote}</p>
    </form>
  );
}
