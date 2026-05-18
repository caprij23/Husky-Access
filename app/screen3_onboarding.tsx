import React from "react";

const styles: Record<string, React.CSSProperties> = {
  screen: {
    width: "100%",
    height: "100vh",
    background: "#fdf0f4",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "clamp(30px, 7vh, 60px) clamp(24px, 6vw, 40px) clamp(30px, 6vh, 50px)",
    fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
  },
  imgWrap: {
    width: "100%",
    maxWidth: "420px",
    aspectRatio: "16/9",
    borderRadius: "16px",
    overflow: "hidden",
    // Replace with your UW building photo:
    // backgroundImage: "url('/images/uw_building.jpg')",
    // backgroundSize: "cover",
    // backgroundPosition: "center",
    background: "linear-gradient(135deg, #f9a8d4, #c084fc, #a78bfa)",
    flexShrink: 0,
  },
  middle: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "clamp(20px, 4vh, 40px) 0",
  },
  heading: {
    fontSize: "clamp(24px, 6vw, 34px)",
    fontWeight: 800,
    color: "#1a1a1a",
    textAlign: "center",
    lineHeight: 1.25,
    letterSpacing: "-0.5px",
  },
  bottom: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    width: "100%",
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
  background: active ? "#A855D8" : "rgba(0,0,0,0.15)",
});

export default function OnboardingScreen() {
  return (
    <div style={styles.screen}>
      <div style={styles.imgWrap} />
      <div style={styles.middle}>
        <h2 style={styles.heading}>Making UW accessible one step at a time.</h2>
      </div>
      <div style={styles.bottom}>
        <button style={styles.btn}>Create Account</button>
        <div style={styles.dots}>
          <div style={dotStyle(false)} />
          <div style={dotStyle(true)} />
          <div style={dotStyle(false)} />
        </div>
      </div>
    </div>
  );
}
