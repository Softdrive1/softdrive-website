export default function Footer() {
  return (
    <footer
      className="py-10 px-6 text-center"
      style={{
        borderTop: "1px solid rgba(0,0,0,0.1)",
        background: "#c5c5c5",
      }}
    >
      <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm" style={{ color: "rgba(26,26,26,0.45)" }}>
          © 2026 Softdrive
        </p>
        <a
          href="mailto:softdrive@outlook.de"
          className="text-sm transition-opacity duration-200 hover:opacity-100"
          style={{ color: "rgba(26,26,26,0.45)", textDecoration: "none" }}
        >
          softdrive@outlook.de
        </a>
      </div>
    </footer>
  );
}
