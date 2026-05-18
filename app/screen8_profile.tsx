import React, { useState } from "react";

type Option = {
  id: string;
  emoji: string;
  label: string;
};

const OPTIONS: Option[] = [
  { id: "wheelchair",  emoji: "♿", label: "Wheelchair access"   },
  { id: "vision",      emoji: "👁️", label: "Vision Impairment"   },
  { id: "cognitive",   emoji: "🧠", label: "Cognitive Impairment" },
  { id: "navigation",  emoji: "🗺️", label: "Campus Navigation"   },
];

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
  heading: {
    fontSize: "clamp(24px, 6vw, 34px)",
    fontWeight: 800,
    color: "#1a1a1a",
    lineHeight: 1.2,
    letterSpacing: "-0.5px",
    marginBottom: "clamp(20px, 5vh, 36px)",
  },
  options: {
    display: "flex",
    flexDirection: "column",
    gap: "clamp(10px, 2.5vh, 16px)",
    flex: 1,
  },
  option: {
    display: "flex",
    alignItems: "center",
    gap: "clamp(14px, 3.5vw, 20px)",
    cursor: "pointer",
  },
  iconBox: {
    width: "clamp(52px, 13vw, 68px)",
    height: "clamp(52px, 13vw, 68px)",
    background: "#fff",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    fontSize: "clamp(24px, 6vw, 32px)",
  },
  optionLabel: {
    fontSize: "clamp(16px, 4.2vw, 21px)",
    fontWeight: 600,
    color: "#1a1a1a",
  },
  otherBtn: {
    alignSelf: "center",
    background: "#fff",
    border: "1.5px solid #ddd",
    borderRadius: "50px",
    padding: "clamp(10px, 2.5vh, 14px) clamp(32px, 8vw, 48px)",
    fontSize: "clamp(15px, 3.8vw, 18px)",
    fontWeight: 500,
    color: "#1a1a1a",
    cursor: "pointer",
    marginTop: "clamp(4px, 1vh, 10px)",
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
    marginTop: "clamp(16px, 3vh, 24px)",
  },
};

export default function PreferencesScreen() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div style={styles.screen}>
      <h2 style={styles.heading}>What would improve your campus experience?</h2>
      <div style={styles.options}>
        {OPTIONS.map((opt) => (
          <div key={opt.id} style={styles.option} onClick={() => toggle(opt.id)}>
            <div
              style={{
                ...styles.iconBox,
                border: selected.has(opt.id) ? "2px solid #A855D8" : "2px solid transparent",
              }}
            >
              {opt.emoji}
            </div>
            <span style={styles.optionLabel}>{opt.label}</span>
          </div>
        ))}
        <button style={styles.otherBtn}>Other</button>
      </div>
      <button style={styles.btn}>Create account</button>
    </div>
  );
}
