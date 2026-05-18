import React from "react";

const styles: Record<string, React.CSSProperties> = {
  screen: {
    width: "100%",
    height: "100vh",
    backgroundColor: "#A855D8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontSize: "clamp(28px, 7vw, 42px)",
    fontWeight: 300,
    letterSpacing: "-0.5px",
    fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
  },
  husky: {
    color: "rgba(255,255,255,0.6)",
  },
  access: {
    color: "#fff",
  },
};

export default function SplashScreen() {
  return (
    <div style={styles.screen}>
      <div style={styles.logo}>
        <span style={styles.husky}>Husky</span>
        <span style={styles.access}>Access</span>
      </div>
    </div>
  );
}
