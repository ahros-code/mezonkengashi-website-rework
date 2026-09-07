import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Lead = {
  name?: string;
  phone?: string;
  email?: string;
  org?: string;
  topic?: string;
  message?: string;
  locale?: string;
  /** Honeypot — real people leave it empty. */
  website?: string;
};

const MAX = { name: 120, phone: 32, email: 160, org: 160, message: 4000 };

function clean(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Lead;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  // Silently accept bot submissions so they get no signal to retry.
  if (clean(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const lead = {
    name: clean(body.name, MAX.name),
    phone: clean(body.phone, MAX.phone),
    email: clean(body.email, MAX.email),
    org: clean(body.org, MAX.org),
    topic: clean(body.topic, 40),
    message: clean(body.message, MAX.message),
    locale: clean(body.locale, 8) || "uz",
    receivedAt: new Date().toISOString(),
  };

  const digits = lead.phone.replace(/\D/g, "");
  if (!lead.name || (digits.length < 9 && !lead.email)) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  // TODO(launch): forward to the CRM / Telegram bot / SMTP here.
  // Everything below the validation is intentionally the only side effect for now.
  console.info("[lead]", lead);

  return NextResponse.json({ ok: true });
}
