import React, { useRef, useState } from "react";

type Tab = "report" | "track";

type Problem = {
  id: string;
  label: string;
};

const PROBLEMS: Problem[] = [
  { id: "elevator",   label: "Broken Elevator"   },
  { id: "path",       label: "Obstructed Path"    },
  { id: "entrances",  label: "Blocked Entrances"  },
  { id: "ramps",      label: "Misuse of Ramps"    },
];

const PURPLE = "#A855D8";
const LIGHT_PURPLE = "#f3e8ff";
const BG = "#f9fafb";

const styles: Record<string, React.CSSProperties> = {
  screen: {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: BG,
    fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
    overflow: "hidden",
  },

  // ── Header ──
  header: {
    background: PURPLE,
    padding: "clamp(16px, 4vh, 24px) clamp(20px, 5vw, 28px) clamp(14px, 3vh, 20px)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexShrink: 0,
  },
  headerIcon: { fontSize: "clamp(22px, 5vw, 28px)" },
  headerText: { display: "flex", flexDirection: "column" },
  headerTitle: {
    fontSize: "clamp(20px, 5vw, 26px)",
    fontWeight: 800,
    color: "#fff",
    lineHeight: 1.1,
  },
  headerSub: {
    fontSize: "clamp(12px, 2.8vw, 14px)",
    color: "rgba(255,255,255,0.85)",
    marginTop: "2px",
  },

  // ── Scrollable body ──
  body: {
    flex: 1,
    overflowY: "auto",
    padding: "clamp(16px, 4vw, 24px)",
    display: "flex",
    flexDirection: "column",
    gap: "clamp(14px, 3vh, 20px)",
  },

  // ── Tabs ──
  tabs: {
    display: "flex",
    gap: "8px",
    background: "#fff",
    borderRadius: "50px",
    padding: "4px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    alignSelf: "flex-start",
  },

  // ── Section heading ──
  sectionTitle: {
    fontSize: "clamp(20px, 5vw, 26px)",
    fontWeight: 800,
    color: "#1a1a1a",
    lineHeight: 1.2,
  },
  subHeadingRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "clamp(15px, 3.8vw, 18px)",
    fontWeight: 600,
    color: "#1a1a1a",
  },
  subHeadingIcon: { fontSize: "clamp(16px, 4vw, 20px)" },
  description: {
    fontSize: "clamp(12px, 3vw, 14px)",
    color: "#666",
    lineHeight: 1.5,
    marginTop: "-8px",
  },

  // ── Card ──
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "clamp(16px, 4vw, 22px)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: "clamp(12px, 3vh, 18px)",
  },

  // ── Photo upload zone ──
  photoZone: {
    border: "2px dashed #ddd",
    borderRadius: "12px",
    padding: "clamp(20px, 5vh, 32px) 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    transition: "border-color 0.2s, background 0.2s",
  },
  photoIcon: { fontSize: "clamp(28px, 7vw, 36px)", color: "#aaa" },
  photoLabel: {
    fontSize: "clamp(14px, 3.5vw, 16px)",
    color: "#555",
    fontWeight: 500,
  },
  photoButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "100%",
    maxWidth: "220px",
  },
  cameraBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    background: PURPLE,
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    padding: "clamp(10px, 2.5vh, 14px) 20px",
    fontSize: "clamp(13px, 3.3vw, 15px)",
    fontWeight: 600,
    cursor: "pointer",
  },
  galleryBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    background: "#fff",
    color: PURPLE,
    border: `1.5px solid ${PURPLE}`,
    borderRadius: "50px",
    padding: "clamp(10px, 2.5vh, 14px) 20px",
    fontSize: "clamp(13px, 3.3vw, 15px)",
    fontWeight: 600,
    cursor: "pointer",
  },

  // ── Problem list ──
  problemBox: {
    border: "1.5px solid #e5e7eb",
    borderRadius: "12px",
    padding: "clamp(14px, 3vh, 18px)",
    display: "flex",
    flexDirection: "column",
    gap: "clamp(10px, 2.5vh, 14px)",
  },
  problemInstruction: {
    fontSize: "clamp(13px, 3.2vw, 15px)",
    fontWeight: 700,
    color: "#1a1a1a",
    lineHeight: 1.4,
  },
  checkRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },
  checkBox: {
    width: "clamp(18px, 4.5vw, 22px)",
    height: "clamp(18px, 4.5vw, 22px)",
    borderRadius: "4px",
    border: "1.5px solid #ccc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "background 0.15s, border-color 0.15s",
  },
  checkLabel: {
    fontSize: "clamp(13px, 3.3vw, 15px)",
    color: "#333",
  },
  otherRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  otherInput: {
    flex: 1,
    border: "1.5px solid #ddd",
    borderRadius: "8px",
    padding: "6px 10px",
    fontSize: "clamp(13px, 3.3vw, 15px)",
    outline: "none",
    color: "#333",
    background: "#fafafa",
  },

  // ── Capture label ──
  captureLabel: {
    fontSize: "clamp(14px, 3.5vw, 16px)",
    fontWeight: 700,
    color: "#1a1a1a",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  // ── Submit ──
  submitBtn: {
    width: "100%",
    background: LIGHT_PURPLE,
    color: PURPLE,
    border: "none",
    borderRadius: "50px",
    padding: "clamp(15px, 3.5vh, 20px) 0",
    fontSize: "clamp(15px, 3.8vw, 17px)",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "background 0.2s",
  },

  // ── Bottom nav ──
  bottomNav: {
    display: "flex",
    borderTop: "1px solid #e5e7eb",
    background: "#fff",
    flexShrink: 0,
  },
  navItem: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "clamp(10px, 2.5vh, 14px) 0",
    gap: "4px",
    cursor: "pointer",
    fontSize: "clamp(18px, 4.5vw, 22px)",
  },
  navLabel: {
    fontSize: "clamp(10px, 2.5vw, 12px)",
    fontWeight: 500,
  },
};

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? "#fff" : "transparent",
        color: active ? "#1a1a1a" : "#888",
        border: active ? "1px solid #e5e7eb" : "none",
        borderRadius: "50px",
        padding: "clamp(8px, 2vh, 11px) clamp(14px, 3.5vw, 20px)",
        fontSize: "clamp(12px, 3vw, 14px)",
        fontWeight: active ? 600 : 500,
        cursor: "pointer",
        boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

export default function ReportScreen() {
  const [activeTab, setActiveTab]       = useState<Tab>("report");
  const [selected, setSelected]         = useState<Set<string>>(new Set());
  const [otherChecked, setOtherChecked] = useState(false);
  const [otherText, setOtherText]       = useState("");
  const [photo, setPhoto]               = useState<string | null>(null);
  const fileRef                         = useRef<HTMLInputElement>(null);

  const toggleProblem = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  return (
    <div style={styles.screen}>
      {/* ── Header ── */}
      <div style={styles.header}>
        <span style={styles.headerIcon}>📷</span>
        <div style={styles.headerText}>
          <span style={styles.headerTitle}>Report</span>
          <span style={styles.headerSub}>Snap, Report, Improve campus access</span>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={styles.body}>
        {/* Tabs */}
        <div style={styles.tabs}>
          <TabButton active={activeTab === "report"} onClick={() => setActiveTab("report")}>
            + Report Problem
          </TabButton>
          <TabButton active={activeTab === "track"} onClick={() => setActiveTab("track")}>
            ☰ Track Reports
          </TabButton>
        </div>

        {activeTab === "report" ? (
          <>
            <h2 style={styles.sectionTitle}>Report a Problem</h2>

            <div style={styles.subHeadingRow}>
              <span style={styles.subHeadingIcon}>📷</span>
              Report a Problem
            </div>

            <p style={styles.description}>
              Snap a photo and we'll take care of the rest. Your location and timestamp will be automatically recorded.
            </p>

            {/* Card */}
            <div style={styles.card}>
              {/* Photo capture label */}
              <div style={styles.captureLabel}>
                <span>📷</span> Capture Problem Photo *
              </div>

              {/* Photo zone */}
              <div
                style={{
                  ...styles.photoZone,
                  borderColor: photo ? PURPLE : "#ddd",
                  background: photo ? "#fdf4ff" : "#fafafa",
                }}
              >
                {photo ? (
                  <img
                    src={photo}
                    alt="Problem"
                    style={{ width: "100%", borderRadius: "8px", maxHeight: "180px", objectFit: "cover" }}
                  />
                ) : (
                  <>
                    <span style={styles.photoIcon}>📷</span>
                    <span style={styles.photoLabel}>Take a Photo of the Problem</span>
                  </>
                )}
                <div style={styles.photoButtons}>
                  <button style={styles.cameraBtn}>
                    <span>📷</span> Open Camera
                  </button>
                  <button style={styles.galleryBtn} onClick={() => fileRef.current?.click()}>
                    <span>🖼️</span> Choose from Gallery
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleGallery}
                  />
                </div>
              </div>

              {/* Problem checklist */}
              <div style={styles.problemBox}>
                <p style={styles.problemInstruction}>
                  Please Select from one of the problems below or select other if not listed.
                </p>

                {PROBLEMS.map((p) => (
                  <div key={p.id} style={styles.checkRow} onClick={() => toggleProblem(p.id)}>
                    <div
                      style={{
                        ...styles.checkBox,
                        background: selected.has(p.id) ? PURPLE : "#fff",
                        borderColor: selected.has(p.id) ? PURPLE : "#ccc",
                      }}
                    >
                      {selected.has(p.id) && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6L4.5 8.5L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span style={styles.checkLabel}>{p.label}</span>
                  </div>
                ))}

                {/* Other */}
                <div style={styles.otherRow}>
                  <div
                    style={{
                      ...styles.checkBox,
                      background: otherChecked ? PURPLE : "#fff",
                      borderColor: otherChecked ? PURPLE : "#ccc",
                      cursor: "pointer",
                    }}
                    onClick={() => setOtherChecked(!otherChecked)}
                  >
                    {otherChecked && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L4.5 8.5L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span style={styles.checkLabel}>Other:</span>
                  <input
                    type="text"
                    style={styles.otherInput}
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value)}
                    placeholder=""
                    disabled={!otherChecked}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                style={{
                  ...styles.submitBtn,
                  background: selected.size > 0 || otherChecked ? PURPLE : LIGHT_PURPLE,
                  color: selected.size > 0 || otherChecked ? "#fff" : PURPLE,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Submit Report
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", color: "#888", marginTop: "40px", fontSize: "clamp(14px, 3.5vw, 16px)" }}>
            Track Reports coming soon
          </div>
        )}
      </div>

      {/* ── Bottom Nav ── */}
      <div style={styles.bottomNav}>
        {[
          { icon: "🏠", label: "Home",      id: "home"      },
          { icon: "❗", label: "Report",    id: "report"    },
          { icon: "💬", label: "Community", id: "community" },
          { icon: "👤", label: "Profile",   id: "profile"   },
        ].map((item) => (
          <div key={item.id} style={styles.navItem}>
            <span style={{ fontSize: "clamp(18px, 4.5vw, 22px)" }}>{item.icon}</span>
            <span
              style={{
                ...styles.navLabel,
                color: item.id === "report" ? PURPLE : "#888",
                fontWeight: item.id === "report" ? 700 : 500,
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
