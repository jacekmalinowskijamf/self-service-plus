import React, { useState, useRef, useCallback } from "react";

// MARK: - Types

type NativeState =
  | { type: "idle" }
  | { type: "downloading"; progress: number }
  | { type: "paused"; progress: number }
  | { type: "installed" };

// MARK: - Ring constants

const R = 14;
const CIRC = 2 * Math.PI * R;

// MARK: - Icons

function PauseIcon() {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true">
      <rect x="0.5" y="0.5" width="3" height="11" rx="1" fill="currentColor" />
      <rect x="6.5" y="0.5" width="3" height="11" rx="1" fill="currentColor" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="1" x2="5" y2="9" />
      <polyline points="2,6.5 5,9.5 8,6.5" />
    </svg>
  );
}

// MARK: - Native controls

function PillButton({ label, onTap }: { label: string; onTap: () => void }) {
  return (
    <button
      onClick={onTap}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        height: 26, padding: "0 14px",
        background: "#F2F2F8",
        border: "none", borderRadius: 999,
        color: "#007AFF",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        fontWeight: 700, fontSize: 15,
        cursor: "pointer",
        WebkitFontSmoothing: "antialiased" as const,
        flexShrink: 0,
      }}
      onMouseDown={e => (e.currentTarget.style.transform = "scale(0.93)")}
      onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
    >
      {label}
    </button>
  );
}

function RingButton({ progress, paused, onTap }: { progress: number; paused: boolean; onTap: () => void }) {
  const offset = CIRC * (1 - progress);
  const color = paused ? "rgba(0,0,0,0.3)" : "#0a84ff";
  return (
    <button
      onClick={onTap}
      aria-label={paused ? "Resume" : "Pause"}
      style={{
        position: "relative", width: 36, height: 36, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "none", border: "none", padding: 0, cursor: "pointer",
      }}
    >
      <svg width="36" height="36" viewBox="0 0 36 36" style={{ position: "absolute", inset: 0 }}>
        <circle cx="18" cy="18" r={R} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="2.5" />
        <circle
          cx="18" cy="18" r={R}
          fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray={CIRC} strokeDashoffset={offset}
          transform="rotate(-90 18 18)"
          style={{ transition: "stroke-dashoffset 0.04s linear" }}
        />
      </svg>
      <span style={{ position: "relative", zIndex: 1, color, display: "flex" }}>
        {paused ? <ArrowDownIcon /> : <PauseIcon />}
      </span>
    </button>
  );
}

// MARK: - Native install controls (stateful per app)

export function NativeControls({ appName }: { appName: string }) {
  const [state, setState] = useState<NativeState>({ type: "idle" });
  const timerRef = useRef<number | null>(null);

  const startDownload = useCallback((from: number) => {
    setState({ type: "downloading", progress: from });
    if (timerRef.current) clearInterval(timerRef.current);
    let p = from;
    timerRef.current = window.setInterval(() => {
      p = Math.min(p + 0.005 + Math.random() * 0.007, 1);
      if (p >= 1) {
        clearInterval(timerRef.current!);
        setState({ type: "installed" });
      } else {
        setState({ type: "downloading", progress: p });
      }
    }, 40);
  }, []);

  const pause = useCallback((p: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState({ type: "paused", progress: p });
  }, [appName]);

  if (state.type === "idle") return <PillButton label="Install" onTap={() => startDownload(0)} />;
  if (state.type === "downloading") return <RingButton progress={state.progress} paused={false} onTap={() => pause(state.progress)} />;
  if (state.type === "paused") return <RingButton progress={state.progress} paused={true} onTap={() => startDownload(state.progress)} />;
  return <PillButton label="Open" onTap={() => {}} />;
}

// MARK: - App data (mirrors catalog)

const apps = [
  { name: "Atlassian",               category: "Productivity",    icon: "./assets/21403.png" },
  { name: "Boomerang",               category: "Productivity",    icon: "./assets/c89c3.png" },
  { name: "Microsoft Edge",          category: "Business Tools",  icon: "./assets/77107.png" },
  { name: "Microsoft Outlook",       category: "Business Tools",  icon: "./assets/6ae8e.png" },
  { name: "Microsoft Word",          category: "Business Tools",  icon: "./assets/95456.png" },
  { name: "Microsoft Authenticator", category: "Business Tools",  icon: "./assets/76b4b.png" },
  { name: "Remote Desktop",          category: "Productivity",    icon: "./assets/ea450.png" },
  { name: "Two Factor Auth",         category: "Production",      icon: "./assets/3be94.png" },
  { name: "Google Authenticator",    category: "Production",      icon: "./assets/22426.png" },
  { name: "Twilio Authy",            category: "Business Tools",  icon: "./assets/a0696.png" },
  { name: "Websocket Client",        category: "Production",      icon: "./assets/64c9f.png" },
  { name: "Okta",                    category: "Production",      icon: "./assets/e32fe.png" },
];

const categories = [
  ["All", 12], ["Featured", 12], ["Art and Design", 4], ["Business Tools", 16],
  ["Network + Security", 6], ["Help Tools", 24], ["Productivity", 9], ["Printers", 11],
  ["Resources", 5], ["Testing", 9], ["Utilities", 13],
] as const;

// MARK: - Row

function NativeAppRow({ name, category, icon }: { name: string; category: string; icon: string }) {
  return (
    <article className="app-row">
      <img className="app-icon" src={icon} alt="" />
      <div className="app-info">
        <div className="app-title">
          <div className="app-heading">
            <h3><span className="app-name">{name}</span></h3>
            <p>{category}</p>
          </div>
          <NativeControls appName={name} />
        </div>
        <div className="row-divider" />
      </div>
    </article>
  );
}

// MARK: - Page

export default function NativePage() {
  return (
    <section className="content">
      <header><h1>Catalog</h1><div className="divider" /></header>

      <section className="categories">
        <h2>Categories</h2>
        <div className="category-grid">
          {categories.map(([name, count]) => (
            <button key={name}><span>{name}</span><small>{count}</small></button>
          ))}
        </div>
      </section>

      <div className="divider" />

      <section className="featured">
        <h2>Featured</h2>
        <div className="apps-grid">
          {[0, 1].map((column) => (
            <div className="apps-column" key={column}>
              {apps
                .filter((_, i) => i % 2 === column)
                .map((app) => (
                  <NativeAppRow key={app.name} {...app} />
                ))}
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
