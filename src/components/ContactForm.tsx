"use client";

import { useEffect, useId, useRef, useState } from "react";
import { GirihStar } from "./Girih";
import type { Dict } from "@/i18n";
import type { Locale } from "@/i18n/config";
import s from "./Contact.module.css";

type Errors = Partial<Record<"name" | "phone" | "email" | "message", string>>;

export default function ContactForm({ t, locale }: { t: Dict; locale: Locale }) {
  const uid = useId();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const focusTarget = useRef<string | null>(null);

  /* aria-invalid is only on the DOM after React commits, so the field to focus
     is chosen during validation and moved to here rather than queried inline. */
  useEffect(() => {
    if (!focusTarget.current) return;
    document.getElementById(focusTarget.current)?.focus();
    focusTarget.current = null;
  }, [errors]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const next: Errors = {};
    if (!name) next.name = t.form.errName;
    if (phone.replace(/\D/g, "").length < 9) next.phone = t.form.errPhone;
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = t.form.errEmail;
    if (message.length < 5) next.message = t.form.errMessage;

    const firstInvalid = (["name", "phone", "email", "message"] as const).find(
      (k) => next[k],
    );
    if (firstInvalid) focusTarget.current = `${uid}-${firstInvalid}`;
    setErrors(next);
    if (firstInvalid) return;

    setSending(true);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          org: data.get("org"),
          topic: data.get("topic"),
          message,
          locale,
          website: data.get("website"),
        }),
      });
    } finally {
      setSending(false);
      setSent(true);
    }
  }

  if (sent) {
    return (
      <div className={s.done} role="status">
        <GirihStar size={38} strokeWidth={1} className={s.doneMark} />
        <p className={s.doneTitle}>{t.form.sentTitle}</p>
        <p className={s.doneBody}>{t.form.sentBody}</p>
        <button
          type="button"
          className={s.again}
          onClick={() => {
            setSent(false);
            setErrors({});
          }}
        >
          {t.form.again}
        </button>
      </div>
    );
  }

  return (
    <form className={s.form} onSubmit={onSubmit} noValidate>
      <fieldset className={s.topics}>
        <legend className={s.topicsLegend}>{t.form.topic}</legend>
        {t.form.topics.map((topic, i) => (
          <span key={topic.id} className={s.topic}>
            <input
              type="radio"
              name="topic"
              id={`${uid}-${topic.id}`}
              value={topic.id}
              defaultChecked={i === 0}
              className={s.topicInput}
            />
            <label htmlFor={`${uid}-${topic.id}`} className={s.topicLabel}>
              {topic.label}
            </label>
          </span>
        ))}
      </fieldset>

      <div className={s.pair}>
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
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${uid}-name-err` : undefined}
          />
          {errors.name && (
            <p id={`${uid}-name-err`} className={s.error}>
              {errors.name}
            </p>
          )}
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
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? `${uid}-phone-err` : undefined}
          />
          {errors.phone && (
            <p id={`${uid}-phone-err`} className={s.error}>
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      <div className={s.pair}>
        <div className={s.field}>
          <label htmlFor={`${uid}-email`} className={s.label}>
            {t.form.email}
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            className={s.input}
            autoComplete="email"
            placeholder={t.form.emailPh}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${uid}-email-err` : undefined}
          />
          {errors.email && (
            <p id={`${uid}-email-err`} className={s.error}>
              {errors.email}
            </p>
          )}
        </div>

        <div className={s.field}>
          <label htmlFor={`${uid}-org`} className={s.label}>
            {t.form.org}
          </label>
          <input
            id={`${uid}-org`}
            name="org"
            className={s.input}
            autoComplete="organization"
            placeholder={t.form.orgPh}
          />
        </div>
      </div>

      <div className={s.field}>
        <label htmlFor={`${uid}-message`} className={s.label}>
          {t.form.message}
        </label>
        <textarea
          id={`${uid}-message`}
          name="message"
          className={s.textarea}
          placeholder={t.form.messagePh}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${uid}-message-err` : undefined}
        />
        {errors.message && (
          <p id={`${uid}-message-err`} className={s.error}>
            {errors.message}
          </p>
        )}
      </div>

      <input
        type="text"
        name="website"
        className={s.honey}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className={s.foot}>
        <button type="submit" className="btn" disabled={sending}>
          {sending ? t.form.sending : t.form.submit}
        </button>
        <p className={s.privacy}>{t.form.privacy}</p>
      </div>
    </form>
  );
}
