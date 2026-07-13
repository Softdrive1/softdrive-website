"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import SectionHeading from "./SectionHeading";

interface FormFields {
  artistName: string;
  email: string;
  trackTitle: string;
  trackLink: string;
  message: string;
  botcheck: string;
}

interface FormErrors {
  artistName?: string;
  email?: string;
  trackTitle?: string;
  trackLink?: string;
}

const EMPTY: FormFields = {
  artistName: "",
  email: "",
  trackTitle: "",
  trackLink: "",
  message: "",
  botcheck: "",
};

function validate(f: FormFields): FormErrors {
  const e: FormErrors = {};
  if (!f.artistName.trim()) e.artistName = "Artist name is required.";
  if (!f.email.trim()) {
    e.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) {
    e.email = "Enter a valid email address.";
  }
  if (!f.trackTitle.trim()) e.trackTitle = "Track title is required.";
  if (!f.trackLink.trim()) {
    e.trackLink = "A link to your track is required.";
  } else if (!/^https?:\/\/.+/.test(f.trackLink.trim())) {
    e.trackLink = "Link must start with http:// or https://";
  }
  return e;
}

export default function DemoDropSection() {
  const [fields, setFields] = useState<FormFields>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (name in errors) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors = validate(fields);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "62c72117-f219-4509-9245-62e698437419",
          subject: `Demo Drop: ${fields.trackTitle} — ${fields.artistName}`,
          from_name: fields.artistName,
          name: fields.artistName,
          email: fields.email,
          track_title: fields.trackTitle,
          track_link: fields.trackLink,
          message: fields.message.trim() || "(no message)",
          botcheck: fields.botcheck,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
    } catch {
      setSubmitError("Connection error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="demos"
      className="relative"
      style={{ background: "var(--bg)", paddingTop: "6rem", paddingBottom: "9rem" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, var(--border), transparent)",
        }}
        aria-hidden="true"
      />

      <div
        className="px-6 md:px-8"
        style={{ maxWidth: "1000px", marginLeft: "auto", marginRight: "auto" }}
      >
        {/* Heading */}
        <SectionHeading sub="Send us your tracks. We listen to everything.">
          Demo Drop
        </SectionHeading>

        {/* Form card */}
        <motion.div
          style={{ maxWidth: "640px", marginLeft: "auto", marginRight: "auto" }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="release-card-outer">
            <div className="release-card-inner" style={{ padding: "32px" }}>
              {submitted ? (
                /* ── Success state ── */
                <div
                  className="text-center"
                  style={{ paddingTop: "16px", paddingBottom: "16px" }}
                >
                  <p
                    className="font-display chrome-text"
                    style={{
                      fontSize: "clamp(1.25rem, 4vw, 1.75rem)",
                      lineHeight: 1.2,
                      marginBottom: "12px",
                    }}
                  >
                    Thanks — we got your track.
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                    We&apos;ll be in touch.
                  </p>
                </div>
              ) : (
                /* ── Form ── */
                <form onSubmit={handleSubmit} noValidate>
                  {/* Honeypot — hidden from real users */}
                  <input
                    type="checkbox"
                    name="botcheck"
                    value={fields.botcheck}
                    onChange={handleChange}
                    style={{ display: "none" }}
                    tabIndex={-1}
                    aria-hidden="true"
                  />

                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* Artist Name */}
                    <div>
                      <label htmlFor="artistName" className="demo-label">
                        Artist Name <span style={{ color: "var(--text-dim)" }}>*</span>
                      </label>
                      <input
                        id="artistName"
                        name="artistName"
                        type="text"
                        autoComplete="name"
                        className={`demo-input${errors.artistName ? " has-error" : ""}`}
                        placeholder="Your artist or project name"
                        value={fields.artistName}
                        onChange={handleChange}
                      />
                      {errors.artistName && (
                        <p className="demo-error-msg">{errors.artistName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="demo-label">
                        Email <span style={{ color: "var(--text-dim)" }}>*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className={`demo-input${errors.email ? " has-error" : ""}`}
                        placeholder="your@email.com"
                        value={fields.email}
                        onChange={handleChange}
                      />
                      {errors.email && (
                        <p className="demo-error-msg">{errors.email}</p>
                      )}
                    </div>

                    {/* Track Title */}
                    <div>
                      <label htmlFor="trackTitle" className="demo-label">
                        Track Title <span style={{ color: "var(--text-dim)" }}>*</span>
                      </label>
                      <input
                        id="trackTitle"
                        name="trackTitle"
                        type="text"
                        className={`demo-input${errors.trackTitle ? " has-error" : ""}`}
                        placeholder="Name of the track"
                        value={fields.trackTitle}
                        onChange={handleChange}
                      />
                      {errors.trackTitle && (
                        <p className="demo-error-msg">{errors.trackTitle}</p>
                      )}
                    </div>

                    {/* Track Link */}
                    <div>
                      <label htmlFor="trackLink" className="demo-label">
                        Link to Track <span style={{ color: "var(--text-dim)" }}>*</span>
                      </label>
                      <input
                        id="trackLink"
                        name="trackLink"
                        type="url"
                        inputMode="url"
                        autoComplete="off"
                        className={`demo-input${errors.trackLink ? " has-error" : ""}`}
                        placeholder="SoundCloud / WeTransfer / Dropbox link"
                        value={fields.trackLink}
                        onChange={handleChange}
                      />
                      {errors.trackLink && (
                        <p className="demo-error-msg">{errors.trackLink}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="demo-label">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        className="demo-input"
                        placeholder="Anything you want to tell us..."
                        value={fields.message}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Submit row */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "12px",
                        paddingTop: "4px",
                      }}
                    >
                      <button
                        type="submit"
                        disabled={submitting}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "10px 22px",
                          borderRadius: "999px",
                          fontSize: "13px",
                          fontWeight: 600,
                          letterSpacing: "0.01em",
                          background: submitting
                            ? "rgba(255,255,255,0.45)"
                            : "linear-gradient(180deg, #ffffff, #d7dde5)",
                          color: "#08080b",
                          border: "none",
                          cursor: submitting ? "not-allowed" : "pointer",
                          boxShadow: submitting
                            ? "none"
                            : "0 2px 16px rgba(158,203,232,0.28)",
                          transition:
                            "opacity 0.25s, transform 0.25s cubic-bezier(0.25,0.46,0.45,0.94), background 0.2s",
                          fontFamily: "var(--font-inter), system-ui, sans-serif",
                        }}
                        onMouseEnter={(e) => {
                          if (!submitting) {
                            (e.currentTarget as HTMLElement).style.opacity = "0.82";
                            (e.currentTarget as HTMLElement).style.transform = "scale(0.98)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.opacity = "1";
                          (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                        }}
                      >
                        {submitting ? "Sending..." : "Send Demo"}
                        {!submitting && (
                          <span
                            style={{
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              background: "rgba(0,0,0,0.12)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "11px",
                              lineHeight: 1,
                            }}
                          >
                            ↗
                          </span>
                        )}
                      </button>

                      {submitError && (
                        <p className="demo-error-msg">{submitError}</p>
                      )}

                      {/* GDPR notice */}
                      <p
                        style={{
                          fontSize: "11px",
                          color: "var(--text-dim)",
                          lineHeight: 1.5,
                          fontFamily: "var(--font-inter), system-ui, sans-serif",
                        }}
                      >
                        By submitting, you agree that your data will be processed
                        to handle your demo submission.
                      </p>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
