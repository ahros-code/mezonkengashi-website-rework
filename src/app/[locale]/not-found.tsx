import { GirihStar } from "@/components/Girih";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "grid",
        placeContent: "center",
        justifyItems: "center",
        textAlign: "center",
        gap: "0.75rem",
        background: "var(--nil)",
        color: "var(--on-dark)",
        padding: "2rem",
      }}
    >
      <GirihStar size={40} stroke="var(--zar-2)" strokeWidth={1} />
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem" }}>404</h1>
      <p style={{ color: "var(--on-dark-2)", maxWidth: "38ch" }}>
        Sahifa topilmadi. · Страница не найдена.
      </p>
      <a href="/uz" className="btn btn--gold" style={{ marginTop: "0.75rem" }}>
        Bosh sahifa
      </a>
    </main>
  );
}
