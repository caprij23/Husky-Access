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
    gap: "clamp(6px, 2vh, 14px)",
  },
  heading: {
    fontSize: "clamp(26px, 6.5vw, 36px)",
    fontWeight: 800,
    color: "#1a1a1a",
    lineHeight: 1.2,
    letterSpacing: "-0.5px",
    marginBottom: "clamp(4px, 1.5vh, 10px)",
  },
  subtitle: {
    fontSize: "clamp(13px, 3.3vw, 16px)",
    color: "#555",
    lineHeight: 1.5,
    marginBottom: "clamp(16px, 4vh, 28px)",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "clamp(16px, 4vh, 26px)",
  },
  label: {
    display: "block",
    fontSize: "clamp(13px, 3.2vw, 15px)",
    color: "#333",
    marginBottom: "8px",
    fontWeight: 500,
  },
  input: {
    width: "100%",
    background: "#fff",
    border: "1.5px solid transparent",
    borderRadius: "12px",
    padding: "clamp(14px, 3vh, 18px) 16px",
    fontSize: "clamp(15px, 3.8vw, 17px)",
    color: "#1a1a1a",
    outline: "none",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  spacer: { flex: 1 },
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

export default function NameScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [focused, setFocused]     = useState<string | null>(null);

  const inputStyle = (field: string): React.CSSProperties => ({
    ...styles.input,
    borderColor: focused === field ? "#A855D8" : "transparent",
  });

  return (
    <div style={styles.screen}>
      <div style={styles.content}>
        <h2 style={styles.heading}>Lastly, tell us more about yourself</h2>
        <p style={styles.subtitle}>
          Please enter your legal name. This information will be used to verify your account.
        </p>
        <div style={styles.fieldGroup}>
          <div>
            <label style={styles.label}>First name</label>
            <input
              type="text"
              style={inputStyle("first")}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onFocus={() => setFocused("first")}
              onBlur={() => setFocused(null)}
              autoComplete="given-name"
            />
          </div>
          <div>
            <label style={styles.label}>Last name</label>
            <input
              type="text"
              style={inputStyle("last")}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onFocus={() => setFocused("last")}
              onBlur={() => setFocused(null)}
              autoComplete="family-name"
            />
          </div>
        </div>
      </div>
      <div style={styles.spacer} />
      <button style={styles.btn}>Continue</button>
    </div>
  );
}
