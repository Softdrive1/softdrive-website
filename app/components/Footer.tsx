"use client";

export default function Footer() {
  return (
    <footer
      className="px-6"
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--bg)",
        paddingTop: "40px",
        paddingBottom: "44px",
      }}
    >
      <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p
          className="font-label"
          style={{ fontSize: "13px", color: "var(--text-dim)", letterSpacing: "0.02em" }}
        >
          © 2026 Softdrive
        </p>
        <a
          href="mailto:softdrive@outlook.de"
          className="font-label"
          style={{
            fontSize: "13px",
            color: "var(--text-muted)",
            textDecoration: "none",
            letterSpacing: "0.02em",
            transition: "color 0.16s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "var(--text)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
          }}
        >
          softdrive@outlook.de
        </a>
      </div>
    </footer>
  );
}
