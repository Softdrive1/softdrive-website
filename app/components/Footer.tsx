export default function Footer() {
  return (
    <footer
      className="py-10 px-6 text-center"
      style={{
        borderTop: "1px solid rgba(126,200,227,0.08)",
        background: "#06060b",
      }}
    >
      <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm" style={{ color: "rgba(136,136,136,0.6)" }}>
          © 2026 Softdrive
        </p>
        <a
          href="mailto:softdrive@outlook.de"
          className="text-sm transition-colors duration-200 hover:text-[#7EC8E3]"
          style={{ color: "rgba(136,136,136,0.6)" }}
        >
          softdrive@outlook.de
        </a>
      </div>
    </footer>
  );
}
