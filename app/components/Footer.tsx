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
      </p>
    </footer>
  );
}
