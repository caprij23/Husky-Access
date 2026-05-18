import React, { useState } from "react";

const styles: Record<string, React.CSSProperties> = {
  screen: {
    width: "100%",
    height: "100vh",
    background: "#fdf0f4",
    display: "flex",
    flexDirection: "column",
    padding: "clamp(48px, 10vh, 80px) clamp(24px, 6vw, 36px) clamp(30px, 6vh, 50px)",
    fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  heading: {
    fontSize: "clamp(26px, 6.5vw, 36px)",
    fontWeight: 800,
    color: "#1a1a1a",
    lineHeight: 1.2,
    letterSpacing: "-0.5px",
    marginBottom: "clamp(6px, 1.5vh, 12px)",
  },
  subtitle: {
    fontSize: "clamp(13px, 3.3vw, 16px)",
    color: "#555",
    lineHeight: 1.5,
    marginBottom: "clamp(20px, 5vh, 36px)",
  },
  label: {
    display: "block",
    fontSize: "clamp(13px, 3.2vw, 15px)",
    color: "#333",
    fontWeight: 500,
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    background: "#fff",
    border: "1.5px solid transparent",
    borderRadius: "12px",
    padding: "clamp(14px, 3vh, 18px) 16px",
    fontSize: "clamp(15px, 3.8vw, 17px)",
    color: "#aaa",
    outline: "none",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  spacer: { flex: 1 },
  checkboxRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "clamp(16px, 3vh, 24px)",
  },
  checkboxBox: {
    width: "clamp(22px, 5.5vw, 28px)",
    height: "clamp(22px, 5.5vw, 28px)",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  },
  checkboxLabel: {
    fontSize: "clamp(12px, 3vw, 14px)",
    color: "#555",
    lineHeight: 1.4,
    paddingTop: "2px",
  },
  btn: {
    width: "100%",
    background: "#d8a8e8",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    padding: "clamp(16px, 3.5vh, 22px) 0",
    fontSize: "clamp(16px, 4vw, 19px)",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default function DOBScreen() {
  const [dob, setDob]           = useState("");
  const [checked, setChecked]   = useState(true);
  const [focused, setFocused]   = useState(false);

  const inputStyle: React.CSSProperties = {
    ...styles.input,
    borderColor: focused ? "#A855D8" : "transparent",
    color: dob ? "#1a1a1a" : "#aaa",
  };

  return (
    <div style={styles.screen}>
      <div style={styles.content}>
        <h2 style={styles.heading}>What is your date of birth?</h2>
        <p style={styles.subtitle}>We need your DOB to verify your account</p>
        <div>
          <label style={styles.label}>Date of birth</label>
          <input
            type="text"
            placeholder="MM/DD/YYYY"
            style={inputStyle}
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        </div>
      </div>
      <div style={styles.spacer} />
      <div style={styles.checkboxRow}>
        <div
          style={{ ...styles.checkboxBox, background: checked ? "#A855D8" : "#e5e7eb" }}
          onClick={() => setChecked(!checked)}
        >
          {checked && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7L5.5 10.5L12 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <span style={styles.checkboxLabel}>
          Check box to be informed about marketing information or any special offer
        </span>
      </div>
      <button style={styles.btn}>Continue</button>
    </div>
  );
}
