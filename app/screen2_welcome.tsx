import React from "react";

const styles: Record<string, React.CSSProperties> = {
  screen: {
    width: "100%",
    height: "100vh",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",
    fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
  },
  bg: {
    position: "absolute",
    inset: 0,
    // Replace with your UW campus photo:
    // backgroundImage: "url('/images/uw_campus.jpg')",
    // backgroundSize: "cover",
    // backgroundPosition: "center",
    background: "linear-gradient(160deg, #c084d8 0%, #7c3aed 40%, #4f1d8a 100%)",
    zIndex: 0,
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.25) 100%)",
  },
  top: {
    position: "relative",
    zIndex: 1,
    padding: "clamp(40px, 8vh, 70px) clamp(20px, 5vw, 30px) 0",
  },
  heading: {
    fontSize: "clamp(44px, 12vw, 72px)",
    fontWeight: 700,
    color: "#d946ef",
    textShadow: "0 2px 20px rgba(0,0,0,0.15)",
    letterSpacing: "-1px",
  },
  bottom: {
    position: "relative",
    zIndex: 1,
    padding: "0 clamp(20px, 5vw, 30px) clamp(30px, 6vh, 50px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  btn: {
    width: "100%",
    maxWidth: "380px",
    background: "#A855D8",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    padding: "clamp(16px, 3.5vh, 22px) 0",
    fontSize: "clamp(16px, 4vw, 19px)",
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.2px",
  },
  dots: {
    display: "flex",
    gap: "8px",
  },
};

const dotStyle = (active: boolean): React.CSSProperties => ({
  width: "clamp(28px, 7vw, 36px)",
  height: "4px",
  borderRadius: "2px",
  background: active ? "#A855D8" : "rgba(255,255,255,0.5)",
});

export default function WelcomeScreen() {
  return (
    <div style={styles.screen}>
      <div style={styles.bg}>
        <div style={styles.overlay} />
      </div>
      <div style={styles.top}>
        <h1 style={styles.heading}>Welcome</h1>
      </div>
      <div style={styles.bottom}>
        <button style={styles.btn}>Lets get started</button>
        <div style={styles.dots}>
          <div style={dotStyle(true)} />
          <div style={dotStyle(false)} />
          <div style={dotStyle(false)} />
        </div>
      </div>
    </div>
  );
}
