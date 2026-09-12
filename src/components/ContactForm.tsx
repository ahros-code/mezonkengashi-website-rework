"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { GirihStar } from "./Girih";
import { ArrowMark, PhoneMark, PlaneMark, WizardIcon } from "./Icons";
import { company } from "@/lib/site";
import { paths } from "@/lib/routes";
import { talimContact } from "@/content/talim";
import type { Dict } from "@/i18n";
import type { Locale } from "@/i18n/config";
import s from "./Contact.module.css";

/*
 * The consultation form, asked one question at a time. Each answer decides
 * what comes next: who is asking narrows the needs on offer, the need picks
 * the follow-up question, and a learner is routed towards Mezon Taʼlim.
 */

type W = Dict["wizard"];
type Audience = keyof W["who"]["options"];
type Need = keyof W["need"]["options"];
type DetailKey = keyof W["detail"]["questions"];
type When = keyof W["detail"]["when"]["options"];
type Channel = keyof W["contact"]["channels"];
type StepId = "who" | "need" | "detail" | "contact";

type Answers = {
  who: Audience | null;
  need: Need | null;
  detail: string | null;
  when: When | null;
};

type Fields = Record<"name" | "phone" | "telegram" | "email" | "org" | "message", string>;
type Errors = Partial<Record<"name" | "phone" | "telegram" | "email", string>>;

/** The needs each kind of visitor is offered, most likely first. */
const NEEDS: Record<Exclude<Audience, "learner">, Need[]> = {
  bank: ["council", "audit", "consulting", "dispute", "education", "other"],
  business: ["audit", "consulting", "advice", "zakat", "dispute", "other"],
  person: ["advice", "zakat", "dispute", "other"],
};

const CHANNELS: Channel[] = ["call", "telegram", "email"];
const EMPTY: Answers = { who: null, need: null, detail: null, when: null };
const DRAFT_KEY = "mezon:consult-draft";
/** Long enough to see the chosen tile light up before the next question slides in. */
const ADVANCE_MS = 280;

function detailKey(a: Answers): DetailKey | null {
  if (a.who === "learner") return "learn";
  if (!a.need || a.need === "other") return null;
  return a.need;
}

function stepsFor(a: Answers): StepId[] {
  return a.who === "learner" ? ["who", "detail", "contact"] : ["who", "need", "detail", "contact"];
}

/** Whether the Tashkent office is open right now, so the promised reply time is honest. */
function officeOpen(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tashkent",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  if (get("weekday") === "Sat" || get("weekday") === "Sun") return false;
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));
  const [oh, om] = company.hoursOpen.split(":").map(Number);
  const [ch, cm] = company.hoursClose.split(":").map(Number);
  return minutes >= oh * 60 + om && minutes < ch * 60 + cm;
}

const fill = (tpl: string, vars: Record<string, string | number>) =>
  tpl.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));

export default function ContactForm({ t, locale }: { t: Dict; locale: Locale }) {
  const w = t.wizard;
  const uid = useId();

  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [step, setStep] = useState<StepId>("who");
  const [dir, setDir] = useState<"fwd" | "back">("fwd");
  const [fields, setFields] = useState<Fields>({
    name: "",
    phone: "",
    telegram: "",
    email: "",
    org: "",
    message: "",
  });
  const [channel, setChannel] = useState<Channel>("call");
  const [noteOpen, setNoteOpen] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [sent, setSent] = useState<{ name: string; answers: Answers; channel: Channel } | null>(
    null,
  );
  const [open, setOpen] = useState<boolean | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const honeyRef = useRef<HTMLInputElement>(null);
  /** Only move focus after the visitor acts — never on load or draft restore. */
  const moved = useRef(false);
  const restored = useRef(false);
  const advanceTimer = useRef<number | undefined>(undefined);
  const focusTarget = useRef<string | null>(null);

  const steps = stepsFor(answers);
  const index = Math.max(0, steps.indexOf(step));
  const dk = detailKey(answers);
  const isLearner = answers.who === "learner";
  const hasOrg = answers.who === "bank" || answers.who === "business";

  /* ---------- lifecycle ---------- */

  useEffect(() => {
    setOpen(officeOpen());
    return () => window.clearTimeout(advanceTimer.current);
  }, []);

  /* Pick up where a returning visitor left off. Only the choices are kept —
     never the name or phone number. */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw) as { answers?: Answers; step?: StepId };
        const a = d.answers;
        const valid =
          a &&
          (!a.who || a.who in w.who.options) &&
          (!a.need || a.need in w.need.options) &&
          (!a.when || a.when in w.detail.when.options);
        if (valid && a.who && d.step && stepsFor(a).includes(d.step)) {
          setAnswers({ ...EMPTY, ...a });
          setStep(d.step);
        }
      }
    } catch {
      /* storage blocked or corrupt — start fresh */
    }
    restored.current = true;
  }, [w]);

  useEffect(() => {
    if (!restored.current) return;
    try {
      if (answers.who) localStorage.setItem(DRAFT_KEY, JSON.stringify({ answers, step }));
      else localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
  }, [answers, step]);

  useEffect(() => {
    if (!moved.current) return;
    headingRef.current?.focus();
  }, [step, sent]);

  /* aria-invalid is only on the DOM after React commits, so the field to focus
     is chosen during validation and moved to here rather than queried inline. */
  useEffect(() => {
    if (!focusTarget.current) return;
    document.getElementById(focusTarget.current)?.focus();
    focusTarget.current = null;
  }, [errors]);

  /* ---------- navigation ---------- */

  function go(to: StepId, direction: "fwd" | "back") {
    window.clearTimeout(advanceTimer.current);
    moved.current = true;
    setDir(direction);
    setStep(to);
  }

  function advanceFrom(from: StepId, next: Answers) {
    const list = stepsFor(next);
    const to = list[list.indexOf(from) + 1];
    if (!to) return;
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => go(to, "fwd"), ADVANCE_MS);
  }

  function back() {
    if (index > 0) go(steps[index - 1], "back");
  }

  function restart() {
    setAnswers(EMPTY);
    setErrors({});
    setFailed(false);
    go("who", "back");
  }

  /* ---------- answers ---------- */

  function pickWho(who: Audience) {
    const next: Answers = who === answers.who ? answers : { ...EMPTY, who };
    setAnswers(next);
    advanceFrom("who", next);
  }

  function pickNeed(need: Need) {
    const next: Answers = need === answers.need ? answers : { ...answers, need, detail: null };
    setAnswers(next);
    advanceFrom("need", next);
  }

  function pickDetail(patch: Partial<Pick<Answers, "detail" | "when">>) {
    const wasReady = detailReady(answers);
    const next = { ...answers, ...patch };
    setAnswers(next);
    /* Move on by itself only when this pick completed the step. A learner stays
       so the course card below the questions gets read. */
    if (!wasReady && detailReady(next) && next.who !== "learner") advanceFrom("detail", next);
  }

  function detailReady(a: Answers) {
    return Boolean(a.when) && (!detailKey(a) || Boolean(a.detail));
  }

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((f) => ({ ...f, [k]: e.target.value }));

  /* ---------- labels ---------- */

  const whoLabel = (a: Answers) => (a.who ? w.who.options[a.who].label : "");
  const needLabel = (a: Answers) =>
    a.who === "learner" ? w.who.options.learner.label : a.need ? w.need.options[a.need].label : "";
  const detailLabel = (a: Answers) => {
    const k = detailKey(a);
    if (!k || !a.detail) return "";
    return (w.detail.questions[k].options as Record<string, string>)[a.detail] ?? "";
  };

  /* ---------- submit ---------- */

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step !== "contact" || sending) return;

    const name = fields.name.trim();
    const phone = fields.phone.trim();
    const tg = fields.telegram.trim();
    const email = fields.email.trim();
    const tgDigits = tg.replace(/\D/g, "").length >= 9;
    const tgHandle = /^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(tg);

    const next: Errors = {};
    if (!name) next.name = t.form.errName;
    if (channel === "call" && phone.replace(/\D/g, "").length < 9) next.phone = t.form.errPhone;
    if (channel === "telegram" && !tgDigits && !tgHandle) next.telegram = w.contact.errTelegram;
    if (channel === "email") {
      if (!email) next.email = w.contact.errEmailRequired;
      else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = t.form.errEmail;
    }

    const firstInvalid = (["name", "phone", "telegram", "email"] as const).find((k) => next[k]);
    if (firstInvalid) focusTarget.current = `${uid}-${firstInvalid}`;
    setErrors(next);
    if (firstInvalid) return;

    setSending(true);
    setFailed(false);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: channel === "call" ? phone : channel === "telegram" && tgDigits ? tg : "",
          telegram: channel === "telegram" && !tgDigits ? tg : "",
          email: channel === "email" ? email : "",
          org: hasOrg ? fields.org.trim() : "",
          topic: isLearner ? "education" : answers.need,
          audience: answers.who,
          detail: answers.detail,
          when: answers.when,
          channel,
          message: fields.message.trim(),
          locale,
          website: honeyRef.current?.value ?? "",
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      moved.current = true;
      setSent({ name, answers, channel });
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  }

  /* ---------- pieces ---------- */

  const talimCard = (
    <aside className={s.talim} aria-label={w.talim.kicker}>
      <p className={s.talimKicker}>{w.talim.kicker}</p>
      <p className={s.talimTitle}>{w.talim.title}</p>
      <ul className={s.talimFacts}>
        {w.talim.facts.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <div className={s.talimLinks}>
        <Link href={paths.talim(locale)} className={s.talimLink}>
          {w.talim.more} <ArrowMark />
        </Link>
        <a
          href={talimContact.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className={s.talimLink}
        >
          {w.talim.telegram} <ArrowMark />
        </a>
      </div>
    </aside>
  );

  const reassure = (text: string) => (
    <p className={s.reassure}>
      <GirihStar size={14} strokeWidth={1.1} className={s.reassureMark} />
      {text}
    </p>
  );

  /* ---------- sent ---------- */

  if (sent) {
    const a = sent.answers;
    const learner = a.who === "learner";
    const need = needLabel(a);
    const tgHref = learner ? talimContact.telegram : company.telegram;
    const phoneHref = learner ? talimContact.phoneHref : company.phoneHref;
    const firstName = sent.name.split(/\s+/)[0];

    return (
      <div className={s.done} role="status">
        <GirihStar size={38} strokeWidth={1} className={s.doneMark} />
        <h3 ref={headingRef} tabIndex={-1} className={s.doneTitle}>
          {fill(w.done.title, { name: firstName })}
        </h3>
        <p className={s.doneBody}>
          {need && a.need !== "other" ? fill(w.done.body, { need }) : w.done.bodyGeneric}
        </p>

        <div className={s.nextBox}>
          <p className={s.nextTitle}>{w.done.nextTitle}</p>
          <ol className={s.nextList}>
            <li>
              <span className={s.nextName}>{w.done.via[sent.channel]}</span>
              <span className={s.nextTime}>{open === false ? w.done.nextDay : w.done.soon}</span>
            </li>
            {!learner &&
              t.process.steps.slice(0, 2).map((p) => (
                <li key={p.name}>
                  <span className={s.nextName}>{p.name}</span>
                  <span className={s.nextTime}>{p.time}</span>
                </li>
              ))}
          </ol>
        </div>

        {learner && talimCard}

        <div className={s.faster}>
          <span>{w.done.faster}</span>
          <a href={tgHref} target="_blank" rel="noopener noreferrer" className={s.fasterLink}>
            <PlaneMark /> {w.done.telegramCta}
          </a>
          <a href={`tel:${phoneHref}`} className={s.fasterLink}>
            <PhoneMark /> {w.done.callCta}
          </a>
        </div>

        <button
          type="button"
          className={s.again}
          onClick={() => {
            setSent(null);
            setErrors({});
            setAnswers(EMPTY);
            setFields((f) => ({ ...f, message: "" }));
            setNoteOpen(false);
            go("who", "back");
          }}
        >
          {t.form.again}
        </button>
      </div>
    );
  }

  /* ---------- the answered trail, each one a way back ---------- */

  const recap: { key: string; label: string; to: StepId }[] = [];
  if (index > 0 && answers.who) recap.push({ key: "who", label: whoLabel(answers), to: "who" });
  if (index > steps.indexOf("need") && steps.includes("need") && answers.need)
    recap.push({ key: "need", label: needLabel(answers), to: "need" });
  if (step === "contact") {
    const d = detailLabel(answers);
    if (d) recap.push({ key: "detail", label: d, to: "detail" });
    if (answers.when) recap.push({ key: "when", label: w.detail.when.options[answers.when], to: "detail" });
  }

  const qId = `${uid}-q`;
  const started = Boolean(answers.who) || index > 0;

  return (
    <form className={s.wizard} onSubmit={onSubmit} noValidate>
      <div className={s.wizHead}>
        <p className={s.wizMeta} aria-live="polite">
          {started ? fill(w.progress, { n: index + 1, total: steps.length }) : w.intro}
        </p>
        {started && (
          <button type="button" className={s.restart} onClick={restart}>
            {w.restart}
          </button>
        )}
      </div>

      <div className={s.bar} aria-hidden="true">
        {steps.map((id, i) => (
          <span key={id} data-state={i < index ? "done" : i === index ? "now" : "todo"} />
        ))}
      </div>

      {recap.length > 0 && (
        <ul className={s.recap} aria-label={w.editHint}>
          {recap.map((r) => (
            <li key={r.key}>
              <button
                type="button"
                className={s.recapPill}
                title={w.editHint}
                onClick={() => go(r.to, "back")}
              >
                {r.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div key={step} className={s.step} data-dir={dir}>
        {step === "who" && (
          <>
            <h3 ref={headingRef} tabIndex={-1} id={qId} className={s.q}>
              {w.who.q}
            </h3>
            <div role="group" aria-labelledby={qId} className={s.tiles}>
              {(Object.keys(w.who.options) as Audience[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  className={s.tile}
                  aria-pressed={answers.who === id}
                  onClick={() => pickWho(id)}
                >
                  <span className={s.tileIcon}>
                    <WizardIcon id={id} />
                  </span>
                  <span className={s.tileText}>
                    <span className={s.tileLabel}>{w.who.options[id].label}</span>
                    <span className={s.tileHint}>{w.who.options[id].hint}</span>
                  </span>
                  <span className={s.tileArrow} aria-hidden="true">
                    <ArrowMark />
                  </span>
                </button>
              ))}
            </div>
            {reassure(w.who.note)}
          </>
        )}

        {step === "need" && answers.who && answers.who !== "learner" && (
          <>
            <h3 ref={headingRef} tabIndex={-1} id={qId} className={s.q}>
              {w.need.q}
            </h3>
            <div role="group" aria-labelledby={qId} className={`${s.tiles} ${s.tilesCompact}`}>
              {NEEDS[answers.who].map((id) => (
                <button
                  key={id}
                  type="button"
                  className={s.tile}
                  aria-pressed={answers.need === id}
                  onClick={() => pickNeed(id)}
                >
                  <span className={s.tileIcon}>
                    <WizardIcon id={id} />
                  </span>
                  <span className={s.tileText}>
                    <span className={s.tileLabel}>{w.need.options[id].label}</span>
                    <span className={s.tileHint}>{w.need.options[id].hint}</span>
                  </span>
                </button>
              ))}
            </div>
            <div className={s.wizFoot}>
              <button type="button" className={s.backBtn} onClick={back}>
                <span className={s.backArrow} aria-hidden="true">
                  <ArrowMark />
                </span>
                {w.back}
              </button>
            </div>
            {reassure(w.need.note)}
          </>
        )}

        {step === "detail" && (
          <>
            <h3 ref={headingRef} tabIndex={-1} id={qId} className={s.q}>
              {dk ? w.detail.questions[dk].q : w.detail.when.q}
            </h3>

            {dk && (
              <div role="group" aria-labelledby={qId} className={s.chips}>
                {(Object.entries(w.detail.questions[dk].options) as [string, string][]).map(
                  ([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      className={s.chip}
                      aria-pressed={answers.detail === id}
                      onClick={() => pickDetail({ detail: id })}
                    >
                      {label}
                    </button>
                  ),
                )}
              </div>
            )}

            {dk && (
              <p id={`${uid}-when`} className={s.subQ}>
                {w.detail.when.q}
              </p>
            )}
            <div
              role="group"
              aria-labelledby={dk ? `${uid}-when` : qId}
              className={s.chips}
            >
              {(Object.keys(w.detail.when.options) as When[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  className={s.chip}
                  aria-pressed={answers.when === id}
                  onClick={() => pickDetail({ when: id })}
                >
                  {w.detail.when.options[id]}
                </button>
              ))}
            </div>

            {isLearner && talimCard}

            <div className={s.wizFoot}>
              <button type="button" className={s.backBtn} onClick={back}>
                <span className={s.backArrow} aria-hidden="true">
                  <ArrowMark />
                </span>
                {w.back}
              </button>
              <button
                type="button"
                className="btn"
                disabled={!detailReady(answers)}
                onClick={() => go("contact", "fwd")}
              >
                {w.next} <ArrowMark />
              </button>
            </div>
            {reassure(w.detail.note)}
          </>
        )}

        {step === "contact" && (
          <>
            <h3 ref={headingRef} tabIndex={-1} id={qId} className={s.q}>
              {w.contact.q}
            </h3>

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
                value={fields.name}
                onChange={set("name")}
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
              <p id={`${uid}-channel`} className={s.label}>
                {w.contact.channel}
              </p>
              <div role="group" aria-labelledby={`${uid}-channel`} className={s.chips}>
                {CHANNELS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={s.chip}
                    aria-pressed={channel === c}
                    onClick={() => {
                      setChannel(c);
                      setErrors({});
                    }}
                  >
                    {w.contact.channels[c]}
                  </button>
                ))}
              </div>
            </div>

            <div className={hasOrg ? s.pair : undefined}>
              {channel === "call" && (
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
                    value={fields.phone}
                    onChange={set("phone")}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? `${uid}-phone-err` : undefined}
                  />
                  {errors.phone && (
                    <p id={`${uid}-phone-err`} className={s.error}>
                      {errors.phone}
                    </p>
                  )}
                </div>
              )}

              {channel === "telegram" && (
                <div className={s.field}>
                  <label htmlFor={`${uid}-telegram`} className={s.label}>
                    {w.contact.telegram}
                  </label>
                  <input
                    id={`${uid}-telegram`}
                    name="telegram"
                    className={s.input}
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder={w.contact.telegramPh}
                    value={fields.telegram}
                    onChange={set("telegram")}
                    aria-invalid={Boolean(errors.telegram)}
                    aria-describedby={errors.telegram ? `${uid}-telegram-err` : undefined}
                  />
                  {errors.telegram && (
                    <p id={`${uid}-telegram-err`} className={s.error}>
                      {errors.telegram}
                    </p>
                  )}
                </div>
              )}

              {channel === "email" && (
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
                    value={fields.email}
                    onChange={set("email")}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? `${uid}-email-err` : undefined}
                  />
                  {errors.email && (
                    <p id={`${uid}-email-err`} className={s.error}>
                      {errors.email}
                    </p>
                  )}
                </div>
              )}

              {hasOrg && (
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
                    value={fields.org}
                    onChange={set("org")}
                  />
                </div>
              )}
            </div>

            {noteOpen ? (
              <div className={s.field}>
                <label htmlFor={`${uid}-message`} className={s.label}>
                  {w.contact.noteLabel}
                </label>
                <textarea
                  id={`${uid}-message`}
                  name="message"
                  className={s.textarea}
                  placeholder={t.form.messagePh}
                  value={fields.message}
                  onChange={set("message")}
                  autoFocus
                />
              </div>
            ) : (
              <button type="button" className={s.addNote} onClick={() => setNoteOpen(true)}>
                + {w.contact.addNote}
              </button>
            )}

            <input
              ref={honeyRef}
              type="text"
              name="website"
              className={s.honey}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            {failed && (
              <p className={s.failed} role="alert">
                {w.contact.failed}{" "}
                <a href={`tel:${company.phoneHref}`}>{company.phone}</a>
              </p>
            )}

            <div className={s.wizFoot}>
              <button type="button" className={s.backBtn} onClick={back}>
                <span className={s.backArrow} aria-hidden="true">
                  <ArrowMark />
                </span>
                {w.back}
              </button>
              <button type="submit" className="btn btn--gold" disabled={sending}>
                {sending ? t.form.sending : w.contact.submit}
              </button>
            </div>

            {reassure(open === false ? w.contact.noteClosed : w.contact.note)}
            <p className={s.privacy}>{t.form.privacy}</p>
          </>
        )}
      </div>
    </form>
  );
}
