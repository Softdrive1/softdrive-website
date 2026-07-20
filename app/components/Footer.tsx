import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="px-6"
      style={{
        borderTop: "1px solid var(--border)",
        paddingTop: "40px",
        paddingBottom: "44px",
      }}
    >
      <p
        className="font-label text-center"
        style={{ fontSize: "13px", color: "var(--text-dim)", letterSpacing: "0.02em" }}
      >
        © 2026 Softdrive
        {" · "}
        <Link
          href="/datenschutz"
          style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: "2px" }}
        >
          Datenschutz
        </Link>
      </p>
      <p
        className="font-label text-center"
        style={{
          marginTop: "10px",
          fontSize: "11px",
          color: "var(--text-dim)",
          letterSpacing: "0.02em",
        }}
      >
        “Chunky Synth” by{" "}
        <a
          href="https://skfb.ly/6UGXN"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "inherit",
            textDecoration: "underline",
            textUnderlineOffset: "2px",
          }}
        >
          MrEliptik
        </a>
        , CC BY 4.0
      </p>
    </footer>
  );
}
