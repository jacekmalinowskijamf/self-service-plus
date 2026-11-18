import { useEffect, useRef, useState } from "react";
import NativePage, { NativeControls } from "./NativePage";

type Page = "Welcome" | "Home" | "Catalog" | "Updates" | "Native" | "Hybrid" | "UserTesting";

type AppItem = {
  name: string;
  category: string;
  icon: string;
  version: string;
  releaseDate: string;
  // A "" entry renders as a blank line; **…** marks an emphasized block.
  description: string[];
  forcedUpdateDays?: number;
  source?: "appstore";
};

const categories = [
  ["All", 12], ["Featured", 12], ["Art and Design", 4], ["Business Tools", 16],
  ["Network + Security", 6], ["Help Tools", 24], ["Productivity", 9], ["Printers", 11],
  ["Resources", 5], ["Testing", 9], ["Utilities", 13],
] as const;

const authyDescription = [
  "The Authy app generates secure 2 step verification tokens on your device. It helps you protect your account from hackers and hijackers by adding an additional layer of security.",
  "",
  "**Why Authy is the best multi factor authentication app:**",
  "",
  "- Secure Cloud Backups:",
  "Did you lose your device and get locked out of all of your accounts? Authy provides secure cloud encrypted backups so you will never lose access to your tokens again. We use the same algorithm that banks and the NSA use to protect their information.",
  "",
  "- Multi Device Synchronization:",
  "Are you re-scanning all your QR codes just to add them to your tablet and smartphone? With Authy you can simply add devices to your account and all of your 2fa tokens will automatically synchronize.",
  "",
  "- Offline:",
  "Still waiting for an SMS to arrive? Do you travel constantly and lose access to your accounts? Authy generates secure tokens offline from the safety of your device, this way you can authenticate securely even when in airplane mode.",
  "",
  "- All of your accounts:",
  "We support most major multi-factor authentication accounts including Facebook, Dropbox, Amazon, Gmail, and thousands of other providers. We also support 8 digit tokens.",
];

const apps: AppItem[] = [
  { name: "Atlassian", category: "Productivity", icon: "./assets/21403.png", version: "5.2.0", releaseDate: "9/14/2025", description: ["Plan, track and collaborate on work across Jira and Confluence from a single desktop app."] },
  { name: "Boomerang", category: "Productivity", icon: "./assets/c89c3.png", version: "2.8.4", releaseDate: "7/22/2025", description: ["Schedule email, set follow-up reminders and pause your inbox so you can focus."], source: "appstore" },
  { name: "Microsoft Edge", category: "Business Tools", icon: "./assets/77107.png", version: "131.0.2903", releaseDate: "11/14/2025", description: ["Browse with built-in security, vertical tabs and profile sync for your work account."], forcedUpdateDays: 14 },
  { name: "Microsoft Outlook", category: "Business Tools", icon: "./assets/6ae8e.png", version: "16.91", releaseDate: "10/8/2025", description: ["Email, calendar and contacts in one place, with scheduling across your organization."], forcedUpdateDays: 3, source: "appstore" },
  { name: "Microsoft Word", category: "Business Tools", icon: "./assets/95456.png", version: "16.91", releaseDate: "10/8/2025", description: ["Create, review and co-author documents with real-time collaboration and version history."] },
  { name: "Microsoft Authenticator", category: "Business Tools", icon: "./assets/76b4b.png", version: "6.8.16", releaseDate: "9/30/2025", description: ["Approve sign-in requests with push notifications and passwordless authentication."], source: "appstore" },
  { name: "Remote Desktop", category: "Productivity", icon: "./assets/ea450.png", version: "11.1.2", releaseDate: "8/19/2025", description: ["Connect to managed Windows desktops and published apps from your Mac."] },
  { name: "Two Factor Authentication", category: "Production", icon: "./assets/3be94.png", version: "4.1.0", releaseDate: "6/11/2025", description: ["Generate time-based one-time passcodes for the accounts your team depends on."], source: "appstore" },
  { name: "Google Authenticator", category: "Production", icon: "./assets/22426.png", version: "7.0", releaseDate: "10/2/2025", description: ["Add an extra layer of security to your Google Account with verification codes on device."], forcedUpdateDays: 7 },
  { name: "Twilio Authy", category: "Business Tools", icon: "./assets/a0696.png", version: "15.65.1", releaseDate: "12/28/2025", description: authyDescription, source: "appstore" },
  { name: "Websocket Client", category: "Production", icon: "./assets/64c9f.png", version: "1.9.3", releaseDate: "5/27/2025", description: ["Inspect, send and debug WebSocket traffic while building real-time features."] },
  { name: "Okta", category: "Production", icon: "./assets/e32fe.png", version: "3.4.1", releaseDate: "9/5/2025", description: ["Single sign-on access to every app assigned to you, with adaptive multi-factor policies."], source: "appstore" },
];

const navItems = [
  { label: "Home", icon: "home" },
  { label: "Bookmarks", icon: "bookmark" },
  { label: "Catalog", icon: "grid" },
  { label: "Updates", icon: "download" },
  { label: "Notifications", icon: "bell" },
] as const;

type UpdateItem = {
  id: string;
  name: string;
  description: string;
  icon: "google" | "excel" | "outlook";
  details?: string;
  metadata?: string[];
};

const initialUpdates: UpdateItem[] = [
  {
    id: "google",
    name: "Google Authenticator",
    description: "A required update for Google Authenticator is now available.",
    icon: "google",
  },
  {
    id: "excel",
    name: "Microsoft Excel",
    description: "A required update for Microsoft Excel is now available.",
    icon: "excel",
  },
  {
    id: "outlook",
    name: "Microsoft Outlook",
    description: "A required update for Microsoft Outlook is now available.",
    details: "You must quit the following applications in order for the update to take place: Firefox, Zoom",
    metadata: ["5 days ago", "Catalog", "Update by 3/8/2025", "version 12.0.2"],
    icon: "outlook",
  },
];

function NavIcon({ name }: { name: (typeof navItems)[number]["icon"] }) {
  const paths = {
    home: <><path d="M3 10.2 10 4l7 6.2" /><path d="M5.3 9.2V17h9.4V9.2M8 17v-5h4v5" /></>,
    bookmark: <path d="M6 3.5h8v14l-4-2.7L6 17.5z" />,
    grid: <><rect x="3.5" y="3.5" width="5" height="5" rx=".7" /><rect x="11.5" y="3.5" width="5" height="5" rx=".7" /><rect x="3.5" y="11.5" width="5" height="5" rx=".7" /><rect x="11.5" y="11.5" width="5" height="5" rx=".7" /></>,
    download: <><path d="M10 2.5v9m-3-3 3 3 3-3" /><path d="M5 6H4v11h12V6h-1" /></>,
    bell: <><path d="M4 14h12c-1.3-1.4-2-2.9-2-5a4 4 0 0 0-8 0c0 2.1-.7 3.6-2 5Z" /><path d="M8.2 16.5h3.6" /></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 20 20">{paths[name]}</svg>;
}

function Sidebar({ page, onNavigate }: { page: Page; onNavigate: (page: Page) => void }) {
  return (
    <aside className="sidebar">
      <div className="window-bar">
        <div className="traffic"><i /><i /><i /></div>
        <button className="sidebar-toggle" aria-label="Toggle sidebar"><span /></button>
      </div>
      <div className="brand">
        <div className="brand-icon" aria-hidden="true">
          <svg width="20" height="19.61" viewBox="0 0 20 19.61" fill="none">
            <path
              d="M11 1H16V13.5C16 17 13.5 19.5 10 19.5C6.5 19.5 4 17 4 13.5V11.5H7.5V13.5C7.5 15.3 8.6 16.3 10 16.3C11.4 16.3 12.5 15.3 12.5 13.5V1H11Z"
              fill="#444444"
            />
          </svg>
        </div>
        <strong>Jamf</strong>
      </div>
      <label className="search">
        <svg viewBox="0 0 20 20"><circle cx="8" cy="8" r="4.5" /><path d="m11.5 11.5 4 4" /></svg>
        <input aria-label="Search" placeholder="Search" />
      </label>
      <nav>
        {navItems.map((item) => (
          <button
            className={item.label === page ? "active" : ""}
            key={item.label}
            onClick={() => {
              if (item.label === "Home" || item.label === "Catalog" || item.label === "Updates") {
                onNavigate(item.label);
              }
            }}
          >
            <NavIcon name={item.icon} />
            {item.label}
          </button>
        ))}
      </nav>
      <button className="profile"><span>JA</span>John Appleseed</button>
    </aside>
  );
}

type InstallStatus =
  | "not-installed"
  | "installing"
  | "updating"
  | "paused"
  | "installed"
  | "update-available"
  | "failed"
  | "uninstalling";

// An install or update runs in two phases: the download, then installing what
// was downloaded. Each phase drives the progress bar from 0 to 100.
type InstallPhase = "download" | "install";

// `flow` records whether a pause or retry should resume an install or an update.
type InstallState = {
  status: InstallStatus;
  progress: number;
  phase: InstallPhase;
  flow: "installing" | "updating";
};

type InstallAction = "install" | "update" | "pause" | "resume" | "retry" | "reinstall" | "uninstall" | "open" | "share";

const notInstalled: InstallState = { status: "not-installed", progress: 0, phase: "download", flow: "installing" };


function applyInstallAction(state: InstallState, action: InstallAction): InstallState {
  switch (action) {
    case "install":
    case "reinstall":
      return { status: "installing", progress: 0, phase: "download", flow: "installing" };
    case "update":
      return { status: "updating", progress: 0, phase: "download", flow: "updating" };
    case "retry":
      return { status: state.flow, progress: 0, phase: "download", flow: state.flow };
    case "pause":
      return { ...state, status: "paused" };
    case "resume":
      return { ...state, status: state.flow };
    case "uninstall":
      return { status: "uninstalling", progress: 0, phase: "download", flow: "installing" };
    case "open":
    case "share":
      return state;
  }
}

// Pause only applies while downloading — once the install phase starts there is
// nothing to pause, so the button just reports progress.
function primaryFor(state: InstallState): { label: string; action: InstallAction | null } {
  switch (state.status) {
    case "not-installed":
      return { label: "Install", action: "install" };
    case "installing":
      if (state.phase === "download") return { label: "Pause", action: "pause" };
      return { label: "Installing…", action: null };
    case "updating":
      if (state.phase === "download") return { label: "Pause", action: "pause" };
      return { label: "Updating…", action: null };
    case "paused":
      return { label: "Resume", action: "resume" };
    case "installed":
      return { label: "Open", action: "open" };
    case "update-available":
      return { label: "Update", action: "update" };
    case "failed":
      return { label: "Retry", action: "retry" };
    case "uninstalling":
      return { label: "Uninstalling…", action: null };
  }
}

const secondaryActions: Partial<Record<InstallStatus, { label: string; action: InstallAction }[]>> = {
  installed: [{ label: "Reinstall", action: "reinstall" }, { label: "Uninstall", action: "uninstall" }, { label: "Share", action: "share" }],
  "update-available": [{ label: "Open", action: "open" }, { label: "Share", action: "share" }],
};

const statePresets: { label: string; state: InstallState }[] = [
  { label: "Not installed", state: notInstalled },
  { label: "Downloading", state: { status: "installing", progress: 45, phase: "download", flow: "installing" } },
  { label: "Installing", state: { status: "installing", progress: 45, phase: "install", flow: "installing" } },
  { label: "Updating", state: { status: "updating", progress: 45, phase: "download", flow: "updating" } },
  { label: "Paused", state: { status: "paused", progress: 45, phase: "download", flow: "installing" } },
  { label: "Up to date", state: { status: "installed", progress: 100, phase: "install", flow: "installing" } },
  { label: "Update ready", state: { status: "update-available", progress: 0, phase: "download", flow: "updating" } },
  { label: "Failed", state: { status: "failed", progress: 0, phase: "download", flow: "installing" } },
];

// Download and install share a status, so the preview bar keys off the phase too.
function previewId(state: InstallState) {
  return state.status === "installing" || state.status === "updating"
    ? `${state.status}:${state.phase}`
    : state.status;
}

function InstallPrimary({
  state,
  onAction,
  className,
}: {
  state: InstallState;
  onAction: (action: InstallAction) => void;
  className: string;
}) {
  const { label, action } = primaryFor(state);
  return (
    <button className={className} disabled={!action} onClick={() => action && onAction(action)}>
      {label}
    </button>
  );
}

// Split button: the label runs the primary action directly and the chevron
// reveals the rest, so the primary action is never repeated in the menu.
function InstallPulldown({
  label,
  primaryAction,
  actions,
  onAction,
}: {
  label: string;
  primaryAction: InstallAction;
  actions: { label: string; action: InstallAction }[];
  onAction: (action: InstallAction) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="pulldown-wrap" ref={wrap}>
      <div className="pulldown">
        <span aria-hidden="true" className="pulldown-bg" />
        <button className="pulldown-label" onClick={() => onAction(primaryAction)}>{label}</button>
        <span aria-hidden="true" className="pulldown-divider" />
        <button
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label="More actions"
          className="pulldown-chevron"
          onClick={() => setOpen(!open)}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M8.4 10.3 12 13.9l3.6-3.6" /></svg>
        </button>
      </div>
      {open && (
        <div className="pulldown-menu" role="menu">
          {actions.map((item) => (
            <button
              key={item.label}
              className={item.action === "uninstall" ? "destructive" : undefined}
              onClick={() => {
                onAction(item.action);
                setOpen(false);
              }}
              role="menuitem"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// A compact row puts these in the split button's menu instead of listing them
// below, so the cell keeps its idle height. The details page shows them inline.
function rowSecondaryActions(state: InstallState, compact: boolean) {
  return compact ? [] : secondaryActions[state.status] ?? [];
}

function hasStatusContent(state: InstallState, compact: boolean) {
  const showProgress =
    ((state.status === "installing" || state.status === "updating") && state.phase === "download") ||
    state.status === "paused";
  return showProgress || state.status === "failed" || rowSecondaryActions(state, compact).length > 0;
}

function InstallStatusBlock({
  state,
  onAction,
  compact = false,
}: {
  state: InstallState;
  onAction: (action: InstallAction) => void;
  compact?: boolean;
}) {
  const showProgress =
    ((state.status === "installing" || state.status === "updating") && state.phase === "download") ||
    state.status === "paused";
  const secondary = rowSecondaryActions(state, compact);

  return (
    <div className="install-status" aria-live="polite">
      {showProgress && (
        <div className="progress-wrap">
          <div className="progress-track"><span style={{ width: `${state.progress}%` }} /></div>
          <p>
            {state.status === "paused" ? (
              <span>Paused at {state.progress}%</span>
            ) : state.status === "uninstalling" ? (
              <><span className="progress-pct">{state.progress}%</span><span>removed</span></>
            ) : (
              <><span className="progress-pct">{state.progress}%</span><span>downloaded</span></>
            )}
          </p>
        </div>
      )}
      {state.status === "failed" && (
        <p className="install-error">Couldn’t finish installing. Check your connection, then try again.</p>
      )}
      {!!secondary.length && (
        <div className="install-secondary">
          {secondary.map(({ label, action }) => (
            <button key={label} onClick={() => onAction(action)}>{label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function MacSpinner() {
  return (
    <span className="mac-spinner" aria-label="Loading">
      {Array.from({ length: 12 }, (_, i) => (
        <span key={i} style={{ transform: `rotate(${i * 30}deg)`, animationDelay: `${(i / 12) - 1}s` }} />
      ))}
    </span>
  );
}

function AppStoreControls({ state, onAction }: { state: InstallState; onAction: (a: InstallAction) => void }) {
  const busy = state.status === "installing" || state.status === "updating" || state.status === "uninstalling";
  const { label, action } = primaryFor(state);
  return (
    <div className="appstore-controls">
      <button className="appstore-share" aria-label="Share">
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2.5v9M7 5.5l3-3 3 3" />
          <path d="M5 8H4v9h12V8h-1" />
        </svg>
      </button>
      {busy ? (
        <MacSpinner />
      ) : (
        <button className="appstore-install" disabled={!action} onClick={() => action && onAction(action)}>
          {label}
        </button>
      )}
    </div>
  );
}

function AppRow({
  app,
  state,
  onOpen,
  onAction,
}: {
  app: AppItem;
  state: InstallState;
  onOpen: (app: AppItem) => void;
  onAction: (app: AppItem, action: InstallAction) => void;
}) {
  const runAction = (action: InstallAction) => onAction(app, action);
  // States with secondary actions get the split button; the rest get a plain one.
  const primary = primaryFor(state);
  const menu = secondaryActions[state.status];
  const open = hasStatusContent(state, true);
  // Hold the last state that had content so the cell can animate closed
  // instead of snapping shut once the content is gone.
  const lastShown = useRef(state);
  if (open) lastShown.current = state;

  return (
    <article className="app-row">
      <img className="app-icon app-icon--link" src={app.icon} alt="" onClick={() => onOpen(app)} />
      <div className="app-info">
        <div className="app-title">
          <div className="app-heading">
            <h3><button className="app-name" onClick={() => onOpen(app)}>{app.name}</button></h3>
            <p>{app.category}</p>
          </div>
          {app.source === "appstore" ? (
            <AppStoreControls state={state} onAction={runAction} />
          ) : menu && primary.action ? (
            <InstallPulldown
              actions={menu}
              label={primary.label}
              onAction={runAction}
              primaryAction={primary.action}
            />
          ) : (
            <InstallPrimary className="install-button" state={state} onAction={runAction} />
          )}
        </div>
        {app.source !== "appstore" && (
          <div className={open ? "install-reveal open" : "install-reveal"}>
            <div>
              <InstallStatusBlock compact state={open ? state : lastShown.current} onAction={runAction} />
            </div>
          </div>
        )}
        <div className="row-divider" />
      </div>
    </article>
  );
}

function CatalogPage({
  onOpen,
  installFor,
  onAction,
}: {
  onOpen: (app: AppItem) => void;
  installFor: (app: AppItem) => InstallState;
  onAction: (app: AppItem, action: InstallAction) => void;
}) {
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
                .filter((_, index) => index % 2 === column)
                .map((app) => (
                  <AppRow app={app} key={app.name} onAction={onAction} onOpen={onOpen} state={installFor(app)} />
                ))}
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

// MARK: — Grape design variant
// App Store-style pill button (GET/Pause/Resume) + Jamf-style progress reveal +
// split [OPEN | ▼] with dropdown when installed.

type GrapeState =
  | { type: "idle" }
  | { type: "busy"; progress: number; paused: boolean }
  | { type: "installing" }
  | { type: "installed" };

function ChevronDown() {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="1,1 5,5 9,1" />
    </svg>
  );
}

function GrapeAppRow({ app, onOpen }: { app: AppItem; onOpen: (app: AppItem) => void }) {
  const [state, setState] = useState<GrapeState>({ type: "idle" });
  const [menuOpen, setMenuOpen] = useState(false);
  const timer = useRef<number | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const h = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [menuOpen]);

  function startFrom(from: number) {
    if (timer.current) clearInterval(timer.current);
    let p = from;
    setState({ type: "busy", progress: Math.round(p), paused: false });
    timer.current = window.setInterval(() => {
      p = Math.min(p + 0.5 + Math.random() * 0.7, 100);
      if (p >= 100) {
        clearInterval(timer.current!);
        setState({ type: "installing" });
        timer.current = window.setTimeout(() => setState({ type: "installed" }), 2800) as unknown as number;
      } else {
        setState({ type: "busy", progress: Math.round(p), paused: false });
      }
    }, 40);
  }

  function pause(progress: number) {
    if (timer.current) clearInterval(timer.current);
    setState({ type: "busy", progress, paused: true });
  }

  const isRevealOpen = state.type === "busy" || state.type === "installing";
  const progress = state.type === "busy" ? state.progress : 0;
  const isPaused = state.type === "busy" && state.paused;

  return (
    <article className="app-row">
      <img className="app-icon app-icon--link" src={app.icon} alt="" onClick={() => onOpen(app)} />
      <div className="app-info">
        <div className="app-title">
          <div className="app-heading">
            <h3><button className="app-name" onClick={() => onOpen(app)}>{app.name}</button></h3>
            <p>{app.category}</p>
          </div>
          {state.type === "idle" && (
            <button className="grape-pill" onClick={() => startFrom(0)}>Install</button>
          )}
          {state.type === "busy" && !isPaused && (
            <button className="grape-pill" onClick={() => pause(progress)}>Pause</button>
          )}
          {state.type === "busy" && isPaused && (
            <button className="grape-pill" onClick={() => startFrom(progress)}>Resume</button>
          )}
          {state.type === "installed" && (
            <div className="grape-split" ref={dropRef}>
              <button className="grape-split__main" onClick={() => {}}>Open</button>
              <span className="grape-split__sep" aria-hidden="true" />
              <button
                className="grape-split__arrow"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="More options"
                aria-expanded={menuOpen}
              >
                <ChevronDown />
              </button>
              {menuOpen && (
                <div className="grape-dropdown">
                  <button onClick={() => { startFrom(0); setMenuOpen(false); }}>Reinstall</button>
                  <button onClick={() => setMenuOpen(false)}>Share</button>
                  <button className="danger" onClick={() => { setState({ type: "idle" }); setMenuOpen(false); }}>Uninstall</button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className={isRevealOpen ? "install-reveal open" : "install-reveal"}>
          <div>
            <div className="install-status" aria-live="polite">
              <div className="progress-wrap">
                <div className={state.type === "installing" ? "progress-track progress-track--installing" : "progress-track"}>
                  <span style={state.type === "installing" ? undefined : { width: `${progress}%` }} />
                </div>
                <p>
                  {state.type === "installing"
                    ? <span>Installing</span>
                    : isPaused
                      ? <span>Paused at {progress}%</span>
                      : <><span className="progress-pct">{progress}%</span><span>downloaded</span></>
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="row-divider" />
      </div>
    </article>
  );
}

function NativeAppRow({ app, onOpen }: { app: AppItem; onOpen: (app: AppItem) => void }) {
  return (
    <article className="app-row">
      <img className="app-icon app-icon--link" src={app.icon} alt="" onClick={() => onOpen(app)} />
      <div className="app-info">
        <div className="app-title">
          <div className="app-heading">
            <h3><button className="app-name" onClick={() => onOpen(app)}>{app.name}</button></h3>
            <p>{app.category}</p>
          </div>
          <NativeControls appName={app.name} />
        </div>
        <div className="row-divider" />
      </div>
    </article>
  );
}

const userTestingApps: AppItem[] = apps.map((app, i) => {
  // Predetermined mix: alternating source per column so both columns show a variety
  const isAppStore = [2, 5, 6, 9, 11, 1].includes(i);
  return isAppStore ? { ...app, source: "appstore" } : { ...app, source: undefined };
});

function HybridCatalogPage({ onOpen, appList = apps }: { onOpen: (app: AppItem) => void; appList?: AppItem[] }) {
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
          {[0, 1].map((col) => (
            <div className="apps-column" key={col}>
              {appList.filter((_, i) => i % 2 === col).map((app) =>
                app.source === "appstore"
                  ? <NativeAppRow key={app.name} app={app} onOpen={onOpen} />
                  : <GrapeAppRow key={app.name} app={app} onOpen={onOpen} />
              )}
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

function FactIcon({ name, color }: { name: "layers" | "calendar" | "deadline"; color?: string }) {
  if (name === "deadline") {
    const c = color ?? "#E07B39";
    return (
      <svg aria-hidden="true" viewBox="0 0 22 22" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8.5" />
        <path d="M11 6.5V11l3 2" />
        <line x1="11" y1="14.5" x2="11" y2="15.3" strokeWidth="1.8" />
      </svg>
    );
  }
  if (name === "layers") {
    return (
      <svg aria-hidden="true" viewBox="0 0 22 22" stroke="#6155F5">
        <path d="M11 2.8 20 7.2 11 11.6 2 7.2z" />
        <path d="m2.9 11.4 8.1 4 8.1-4" />
        <path d="m2.9 15.4 8.1 4 8.1-4" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 22 22" stroke="#CB30E0">
      <rect x="2.3" y="3.6" width="17.4" height="15.8" rx="3.4" />
      <path d="M2.3 8.5h17.4" />
      <g fill="#CB30E0" stroke="none">
        <circle cx="6.8" cy="11.7" r=".85" /><circle cx="11" cy="11.7" r=".85" /><circle cx="15.2" cy="11.7" r=".85" />
        <circle cx="6.8" cy="15.4" r=".85" /><circle cx="11" cy="15.4" r=".85" /><circle cx="15.2" cy="15.4" r=".85" />
      </g>
    </svg>
  );
}

function InfoBlock({ text }: { text: string }) {
  const emphasized = text.startsWith("**") && text.endsWith("**");
  return <p>{emphasized ? <strong>{text.slice(2, -2)}</strong> : text}</p>;
}

function PreviewBar({
  targetLabel,
  activeId,
  onForceState,
}: {
  targetLabel: string | null;
  activeId: string | null;
  onForceState: (state: InstallState) => void;
}) {
  return (
    <div className="preview-bar">
      <span className="preview-label">Preview state</span>
      {statePresets.map((preset) => (
        <button
          className={activeId === previewId(preset.state) ? "active" : ""}
          disabled={!targetLabel}
          key={preset.label}
          onClick={() => onForceState(preset.state)}
        >
          {preset.label}
        </button>
      ))}
      <span className="preview-target">{targetLabel ?? "Open the Catalog or an app"}</span>
    </div>
  );
}

// Self-contained Grape install control for the detail page (Hybrid ALME variant).
function GrapeDetailControls() {
  const [state, setState] = useState<GrapeState>({ type: "idle" });
  const [menuOpen, setMenuOpen] = useState(false);
  const timer = useRef<number | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const h = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [menuOpen]);

  function startFrom(from: number) {
    if (timer.current) clearInterval(timer.current);
    let p = from;
    setState({ type: "busy", progress: Math.round(p), paused: false });
    timer.current = window.setInterval(() => {
      p = Math.min(p + 0.5 + Math.random() * 0.7, 100);
      if (p >= 100) {
        clearInterval(timer.current!);
        setState({ type: "installing" });
        timer.current = window.setTimeout(() => setState({ type: "installed" }), 2800) as unknown as number;
      } else {
        setState({ type: "busy", progress: Math.round(p), paused: false });
      }
    }, 40);
  }
  function pause(progress: number) {
    if (timer.current) clearInterval(timer.current);
    setState({ type: "busy", progress, paused: true });
  }

  const isProgressOpen = state.type === "busy" || state.type === "installing";
  const progress = state.type === "busy" ? state.progress : 0;
  const isPaused = state.type === "busy" && state.paused;

  return (
    <div className="grape-detail-controls">
      {state.type === "idle" && (
        <button className="grape-pill" onClick={() => startFrom(0)}>Install</button>
      )}
      {state.type === "busy" && !isPaused && (
        <button className="grape-pill" onClick={() => pause(progress)}>Pause</button>
      )}
      {state.type === "busy" && isPaused && (
        <button className="grape-pill" onClick={() => startFrom(progress)}>Resume</button>
      )}
      {state.type === "installed" && (
        <div className="grape-split" ref={dropRef}>
          <button className="grape-split__main" onClick={() => {}}>Open</button>
          <span className="grape-split__sep" aria-hidden="true" />
          <button className="grape-split__arrow" onClick={() => setMenuOpen((o) => !o)} aria-label="More options" aria-expanded={menuOpen}>
            <ChevronDown />
          </button>
          {menuOpen && (
            <div className="grape-dropdown">
              <button onClick={() => { startFrom(0); setMenuOpen(false); }}>Reinstall</button>
              <button onClick={() => setMenuOpen(false)}>Share</button>
              <button className="danger" onClick={() => { setState({ type: "idle" }); setMenuOpen(false); }}>Uninstall</button>
            </div>
          )}
        </div>
      )}
      <div className={isProgressOpen ? "grape-detail-progress open" : "grape-detail-progress"}>
        <div className="progress-wrap">
          <div className={state.type === "installing" ? "progress-track progress-track--installing" : "progress-track"}>
            <span style={state.type === "installing" ? undefined : { width: `${progress}%` }} />
          </div>
          <p>
            {state.type === "installing"
              ? <span>Installing</span>
              : isPaused
                ? <span>Paused at {progress}%</span>
                : <><span className="progress-pct">{progress}%</span><span>downloaded</span></>}
          </p>
        </div>
      </div>
    </div>
  );
}

function AppDetailsPage({
  app,
  state,
  onAction,
  onBack,
  sourceView,
}: {
  app: AppItem;
  state: InstallState;
  onAction: (action: InstallAction) => void;
  onBack: () => void;
  sourceView?: "hybrid";
}) {
  const primary = primaryFor(state);
  const menu = secondaryActions[state.status];
  const usesPulldown = menu != null && primary.action != null && app.source !== "appstore";

  return (
    <section className="content detail-content">
      <div className="detail-topbar">
        <button aria-label="Back to catalog" className="glass-button" onClick={onBack} title="Back">
          <span aria-hidden="true" className="glass-inner" />
          <span className="glass-symbol">
            <svg aria-hidden="true" viewBox="0 0 13 22"><path d="M8.6 5.6 3.9 11l4.7 5.4" /></svg>
          </span>
        </button>
      </div>
      <div className="detail-head">
        <div className="detail-identity">
          <img className="detail-icon" src={app.icon} alt="" />
          {sourceView === "hybrid" ? (
            <div className="detail-name">
              <h1>{app.name}</h1>
              <p className="detail-version">Version {app.version}</p>
              <div className="detail-install-row">
                {app.source === "appstore"
                  ? <NativeControls appName={app.name} />
                  : <GrapeDetailControls />}
                <span className="detail-category-tag">{app.category}</span>
              </div>
            </div>
          ) : (
            <>
              <div className="detail-name">
                <h1>{app.name}</h1>
                <p>{app.category}</p>
              </div>
              <div className="detail-install-area">
                {usesPulldown ? (
                  <InstallPulldown
                    actions={menu!}
                    label={primary.label}
                    onAction={onAction}
                    primaryAction={primary.action!}
                  />
                ) : (
                  <InstallPrimary className="detail-install" state={state} onAction={onAction} />
                )}
                {!usesPulldown && hasStatusContent(state, false) && (
                  <InstallStatusBlock state={state} onAction={onAction} />
                )}
              </div>
            </>
          )}
        </div>
        <div className="detail-facts">
          <div className="fact-card">
            <FactIcon name="layers" />
            <div><span>App version</span><strong>{app.version}</strong></div>
          </div>
          <div className="fact-card">
            <FactIcon name="calendar" />
            <div><span>Release date</span><strong>{app.releaseDate}</strong></div>
          </div>
          {app.forcedUpdateDays != null && state.status === "update-available" && (() => {
            const days = app.forcedUpdateDays!;
            const urgency = days <= 3 ? "urgent" : days <= 7 ? "warning" : "notice";
            const iconColor = days <= 3 ? "#D92D20" : days <= 7 ? "#C4520A" : "#E07B39";
            return (
              <div className={`fact-card fact-card--deadline fact-card--${urgency}`}>
                <FactIcon name="deadline" color={iconColor} />
                <div>
                  <span>Forced update</span>
                  <strong>{days <= 1 ? "today" : `in ${days} days`}</strong>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
      <section className="detail-info">
        <h2>Information</h2>
        <div className="detail-body">
          {app.description.map((text, index) => <InfoBlock key={index} text={text} />)}
        </div>
      </section>
    </section>
  );
}

function UpdateIcon({ type }: { type: UpdateItem["icon"] }) {
  if (type === "google") {
    return <img className="notification-icon" src="./assets/dd13a.png" alt="" />;
  }
  return (
    <span className="notification-icon composed-icon">
      <img src="./assets/c7b88.svg" alt="" />
      <img className="app-mark" src={type === "excel" ? "./assets/c9c92.png" : "./assets/6ae8e.png"} alt="" />
    </span>
  );
}

function UpdateRow({
  item,
  onClear,
  onUpdate,
  status,
}: {
  item: UpdateItem;
  onClear: () => void;
  onUpdate: () => void;
  status?: "updating" | "updated";
}) {
  const metadata = item.metadata ?? ["5 days ago", "Catalog"];
  return (
    <article className="update-row">
      <UpdateIcon type={item.icon} />
      <div className="update-copy">
        <strong>{item.name}</strong>
        <p>{item.description}</p>
        {item.details && <p>{item.details}</p>}
        <div className="update-meta">
          {metadata.map((value, index) => (
            <span key={value}>{index > 0 && <i>/</i>}{value}</span>
          ))}
        </div>
      </div>
      <div className="update-actions">
        {!item.details && <button onClick={onClear}>Clear</button>}
        <button className="secondary" disabled={status === "updating" || status === "updated"} onClick={onUpdate}>
          {status === "updating" ? "Updating…" : status === "updated" ? "Updated" : "Update"}
        </button>
      </div>
    </article>
  );
}

function UpdatesPage({
  updates,
  statuses,
  onClear,
  onClearAll,
  onUpdate,
  onUpdateAll,
}: {
  updates: UpdateItem[];
  statuses: Record<string, "updating" | "updated">;
  onClear: (id: string) => void;
  onClearAll: () => void;
  onUpdate: (id: string) => void;
  onUpdateAll: () => void;
}) {
  return (
      <section className="content updates-content">
        <header className="updates-header">
          <div className="header-line">
            <h1>Updates</h1>
            <div className="header-actions">
              <button onClick={onClearAll}>Clear all notifications</button>
              <button className="primary" disabled={!updates.length} onClick={onUpdateAll}>Update all</button>
            </div>
          </div>
          <div className="divider" />
        </header>
        <section className="updates-list" aria-live="polite">
          {updates.map((item, index) => (
            <div key={item.id}>
              <UpdateRow
                item={item}
                status={statuses[item.id]}
                onClear={() => onClear(item.id)}
                onUpdate={() => onUpdate(item.id)}
              />
              {index < updates.length - 1 && <div className="update-divider" />}
            </div>
          ))}
          {!updates.length && <p className="empty-updates">You’re all caught up.</p>}
        </section>
      </section>
  );
}

function MenuBar() {
  return (
    <div className="menubar">
      <div className="menubar-leading">
        <div className="menubar-apple">
          <span className="menubar-apple-logo">{''}</span>
        </div>
        <div className="menubar-app">
          <span className="menubar-label">Self Service+</span>
        </div>
        <div className="menubar-item">
          <span className="menubar-label">Edit</span>
        </div>
        <div className="menubar-item">
          <span className="menubar-label">View</span>
        </div>
        <div className="menubar-item">
          <span className="menubar-label">Window</span>
        </div>
        <div className="menubar-item">
          <span className="menubar-label">Help</span>
        </div>
      </div>
      <div className="menubar-trailing">
        {/* WiFi — 40px item, 18px label */}
        <div className="menubar-item">
          <span className="menubar-label">
            <svg aria-hidden="true" viewBox="0 0 15 11" width="15" height="11">
              <path fill="currentColor" d="M7.4707 10.8164C7.38607 10.8164 7.30143 10.7931 7.2168 10.7466C7.13639 10.7 7.03271 10.6133 6.90576 10.4863L5.33789 8.98193C5.27865 8.92269 5.24056 8.85921 5.22363 8.7915C5.21094 8.71956 5.22363 8.65186 5.26172 8.58838C5.49447 8.27946 5.8055 8.02132 6.19482 7.81396C6.58838 7.60238 7.01367 7.49658 7.4707 7.49658C7.91504 7.49658 8.32975 7.59603 8.71484 7.79492C9.09993 7.99382 9.40885 8.23926 9.6416 8.53125C9.70085 8.60319 9.72412 8.68148 9.71143 8.76611C9.70296 8.85075 9.66699 8.92269 9.60352 8.98193L8.03564 10.4863C7.90869 10.6133 7.8029 10.7 7.71826 10.7466C7.63786 10.7931 7.55534 10.8164 7.4707 10.8164ZM3.66846 7.26172L2.65918 6.27783C2.5957 6.21436 2.56185 6.14453 2.55762 6.06836C2.55339 5.98796 2.57878 5.9139 2.63379 5.84619C2.97233 5.44417 3.39128 5.0887 3.89062 4.77979C4.38997 4.46663 4.94434 4.22119 5.55371 4.04346C6.16732 3.86572 6.80632 3.77686 7.4707 3.77686C8.13509 3.77686 8.77197 3.86572 9.38135 4.04346C9.99072 4.22119 10.5451 4.46663 11.0444 4.77979C11.548 5.0887 11.967 5.44417 12.3013 5.84619C12.3605 5.9139 12.3859 5.98796 12.3774 6.06836C12.3732 6.14876 12.3394 6.21859 12.2759 6.27783L11.2666 7.26172C11.1862 7.33789 11.0994 7.37598 11.0063 7.37598C10.9175 7.37598 10.8371 7.33789 10.7651 7.26172C10.3631 6.83431 9.87012 6.48519 9.28613 6.21436C8.70638 5.94352 8.10124 5.81022 7.4707 5.81445C6.84863 5.81022 6.24561 5.94141 5.66162 6.20801C5.08187 6.47038 4.59521 6.81315 4.20166 7.23633C4.12549 7.32096 4.03662 7.36751 3.93506 7.37598C3.83773 7.38021 3.74886 7.34212 3.66846 7.26172ZM1.00244 4.62744L0.107422 3.71338C0.0439453 3.64567 0.0100912 3.57161 0.00585938 3.49121C0.00162756 3.40658 0.0270182 3.33252 0.0820312 3.26904C0.594075 2.63005 1.23942 2.0651 2.01807 1.57422C2.79671 1.0791 3.65153 0.69401 4.58252 0.418945C5.51774 0.139648 6.48047 0 7.4707 0C8.45671 0 9.41732 0.139648 10.3525 0.418945C11.2878 0.698242 12.1426 1.08333 12.917 1.57422C13.6956 2.0651 14.341 2.63005 14.853 3.26904C14.9123 3.33252 14.9398 3.40658 14.9355 3.49121C14.9355 3.57161 14.9017 3.64567 14.834 3.71338L13.9326 4.61475C13.8607 4.68669 13.776 4.72477 13.6787 4.729C13.5814 4.73324 13.4967 4.69938 13.4248 4.62744C12.6462 3.78955 11.749 3.15479 10.7334 2.72314C9.722 2.28727 8.63444 2.06934 7.4707 2.06934C6.31543 2.06934 5.2321 2.28727 4.2207 2.72314C3.20931 3.15479 2.31006 3.78744 1.52295 4.62109C1.45101 4.69727 1.36426 4.73747 1.2627 4.7417C1.16536 4.7417 1.07861 4.70361 1.00244 4.62744Z" />
            </svg>
          </span>
        </div>
        {/* Spotlight — 38px item, 16px label */}
        <div className="menubar-item">
          <span className="menubar-label">
            <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="6.5" cy="6.5" r="4" />
              <path d="M10 10 L14.5 14.5" />
            </svg>
          </span>
        </div>
        {/* Account — 38px item, 16px label */}
        <div className="menubar-item">
          <span className="menubar-label">
            <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="8" cy="8" r="6.5" />
              <circle cx="8" cy="6.5" r="2" />
              <path d="M3.5 13 Q4 10 8 10 Q12 10 12.5 13" />
            </svg>
          </span>
        </div>
        {/* Control Center — 38px item, 16px label */}
        <div className="menubar-item">
          <span className="menubar-label">
            <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" strokeLinecap="round">
              <line x1="2" y1="5.5" x2="14" y2="5.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <circle cx="5.5" cy="5.5" r="2" fill="currentColor" />
              <line x1="2" y1="10.5" x2="14" y2="10.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <circle cx="10.5" cy="10.5" r="2" fill="currentColor" />
            </svg>
          </span>
        </div>
        {/* Clock — 155px item, 133px label */}
        <div className="menubar-item menubar-item--clock">
          <span className="menubar-label">Mon Jun 10  9:41 AM</span>
        </div>
      </div>
    </div>
  );
}

function UninstallAlert({ app, onCancel, onConfirm }: { app: AppItem; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="alert-overlay" onClick={onCancel}>
      <div className="alert" onClick={(e) => e.stopPropagation()}>
        <div className="alert-content">
          <p className="alert-title">Uninstall {app.name}?</p>
          <p className="alert-desc">{app.name} will be removed from your Mac. You can reinstall it any time from the Catalog.</p>
        </div>
        <div className="alert-buttons">
          <button className="alert-cancel" onClick={onCancel}>Cancel</button>
          <button className="alert-confirm" onClick={onConfirm}><span>Uninstall</span></button>
        </div>
      </div>
    </div>
  );
}

type Toast = { id: number; appName: string; icon: string; message: string; exiting?: boolean };

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast${t.exiting ? " exiting" : ""}`}>
          <button className="toast-close" onClick={() => onDismiss(t.id)} aria-label="Dismiss">×</button>
          <img className="toast-icon" src={t.icon} alt="" />
          <div className="toast-body">
            <strong>{t.appName}</strong>
            <span>{t.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function WelcomePage({ onSelect }: { onSelect: (page: Page) => void }) {
  const options: { key: Page; title: string; subtitle: string; tag: string; hash: string }[] = [
    {
      key: "Hybrid",
      title: "Hybrid",
      subtitle: "App Store-sourced apps use the native ring control. ALME apps use the Grape pill.",
      tag: "Concept",
      hash: "#hybrid",
    },
    {
      key: "Native",
      title: "Native",
      subtitle: "Fully native App Store install UI — ring progress, pill buttons, no Jamf chrome.",
      tag: "Concept",
      hash: "#native",
    },
    {
      key: "UserTesting",
      title: "User testing",
      subtitle: "Controlled prototype build for research sessions. Hybrid variant with task focus.",
      tag: "Research",
      hash: "#user-testing",
    },
  ];

  return (
    <div className="welcome-page">
      <div className="welcome-inner">
        <div className="welcome-header">
          <p className="welcome-eyebrow">Self Service ALME</p>
          <h1 className="welcome-title">Choose a design</h1>
          <p className="welcome-desc">Select a variant to explore the prototype</p>
        </div>
        <div className="welcome-cards">
          {options.map(({ key, title, subtitle, tag, hash }) => (
            <button key={key} className="welcome-card" onClick={() => onSelect(key)}>
              <span className="welcome-card-tag">{tag}</span>
              <span className="welcome-card-title">{title}</span>
              <span className="welcome-card-sub">{subtitle}</span>
              <span className="welcome-card-hash">{hash}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>(() => {
    const h = window.location.hash;
    if (h === "#native") return "Native";
    if (h === "#hybrid") return "Hybrid";
    if (h === "#jamf") return "Catalog";
    if (h === "#user-testing") return "UserTesting";
    return "Welcome";
  });
  const [selected, setSelected] = useState<AppItem | null>(null);
  const [installs, setInstalls] = useState<Record<string, InstallState>>({});
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [updateStatuses, setUpdateStatuses] = useState<Record<string, "updating" | "updated">>({});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [uninstallTarget, setUninstallTarget] = useState<AppItem | null>(null);

  // Sync page ↔ URL hash
  useEffect(() => {
    if (page === "Native") window.location.hash = "native";
    else if (page === "Hybrid") window.location.hash = "hybrid";
    else if (page === "Catalog" || page === "Updates") window.location.hash = "jamf";
    else if (page === "UserTesting") window.location.hash = "user-testing";
    else window.location.hash = "";
  }, [page]);
  useEffect(() => {
    const onHashChange = () => {
      const h = window.location.hash;
      if (h === "#native") setPage("Native");
      else if (h === "#hybrid") setPage("Hybrid");
      else if (h === "#jamf") setPage("Catalog");
      else if (h === "#user-testing") setPage("UserTesting");
      else setPage("Welcome");
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  const prevInstalls = useRef<Record<string, InstallState>>({});
  const toastCounter = useRef(0);

  const updateOne = (id: string) => {
    setUpdateStatuses((s) => ({ ...s, [id]: "updating" }));
    window.setTimeout(() => setUpdateStatuses((s) => ({ ...s, [id]: "updated" })), 900);
  };

  const active = Object.values(installs).some(
    (state) => state.status === "installing" || state.status === "updating" || state.status === "uninstalling",
  );

  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => {
      setInstalls((current) => {
        const next: Record<string, InstallState> = {};
        for (const [name, state] of Object.entries(current)) {
          if (state.status === "uninstalling") {
            const progress = Math.min(state.progress + Math.round(3 + Math.random() * 9), 100);
            if (progress < 100) {
              next[name] = { ...state, progress };
            }
            continue;
          }
          if (state.status !== "installing" && state.status !== "updating") {
            next[name] = state;
            continue;
          }
          const increment = state.phase === "download"
            ? (Math.random() < 0.5 ? 4 : 5)
            : Math.round(1 + Math.random() * 3);
          const progress = Math.min(state.progress + increment, 100);
          if (progress < 100) {
            next[name] = { ...state, progress };
          } else if (state.phase === "download") {
            next[name] = { ...state, phase: "install", progress: 0 };
          } else {
            next[name] = { ...state, status: "installed", progress: 100 };
          }
        }
        return next;
      });
    }, 80);
    return () => window.clearInterval(timer);
  }, [active]);

  useEffect(() => {
    for (const app of apps) {
      const prev = prevInstalls.current[app.name] ?? notInstalled;
      const curr = installs[app.name] ?? notInstalled;
      if (prev.status !== "installed" && curr.status === "installed") {
        const message = curr.flow === "updating" ? "Update complete." : "Installed.";
        const id = ++toastCounter.current;
        setToasts((t) => [...t, { id, appName: app.name, icon: app.icon, message }]);
        setTimeout(() => {
          setToasts((t) => t.map((x) => x.id === id ? { ...x, exiting: true } : x));
          setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 350);
        }, 5000);
      }
    }
    prevInstalls.current = installs;
  }, [installs]);

  const dismissToast = (id: number) => {
    setToasts((t) => t.map((x) => x.id === id ? { ...x, exiting: true } : x));
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 350);
  };

  const installFor = (app: AppItem) => installs[app.name] ?? notInstalled;

  const runAction = (app: AppItem, action: InstallAction) => {
    if (action === "uninstall") { setUninstallTarget(app); return; }
    setInstalls((current) => ({
      ...current,
      [app.name]: applyInstallAction(current[app.name] ?? notInstalled, action),
    }));
  };

  const navigate = (next: Page) => {
    setSelected(null);
    setPage(next);
  };

  // The bar drives the open app on the details page, or every Featured row on the catalog.
  const catalogVisible = page !== "Updates" && !selected;

  const forceState = (next: InstallState) => {
    if (selected) {
      setInstalls((current) => ({ ...current, [selected.name]: next }));
    } else if (catalogVisible) {
      setInstalls(Object.fromEntries(apps.map((app) => [app.name, { ...next }])));
    }
  };

  let targetLabel: string | null = null;
  let activeId: string | null = null;
  if (selected) {
    targetLabel = selected.name;
    activeId = previewId(installFor(selected));
  } else if (catalogVisible) {
    targetLabel = "All apps in Featured";
    const ids = new Set(apps.map((app) => previewId(installFor(app))));
    activeId = ids.size === 1 ? [...ids][0] : null;
  }

  let view: JSX.Element;
  if (selected) {
    view = (
      <AppDetailsPage
        app={selected}
        onAction={(action) => runAction(selected, action)}
        onBack={() => setSelected(null)}
        state={installFor(selected)}
        sourceView={page === "Hybrid" || page === "UserTesting" ? "hybrid" : undefined}
      />
    );
  } else if (page === "Native") {
    view = <NativePage />;
  } else if (page === "Hybrid") {
    view = <HybridCatalogPage onOpen={setSelected} />;
  } else if (page === "UserTesting") {
    view = <HybridCatalogPage onOpen={setSelected} appList={userTestingApps} />;
  } else if (page === "Updates") {
    view = (
      <UpdatesPage
        updates={updates}
        statuses={updateStatuses}
        onClear={(id) => setUpdates((u) => u.filter((x) => x.id !== id))}
        onClearAll={() => setUpdates([])}
        onUpdate={updateOne}
        onUpdateAll={() => updates.forEach((item) => updateOne(item.id))}
      />
    );
  } else {
    view = <CatalogPage installFor={installFor} onAction={runAction} onOpen={setSelected} />;
  }

  if (page === "Welcome") {
    return <WelcomePage onSelect={(p) => { setPage(p); setSelected(null); }} />;
  }

  return (
    <>
      <PreviewBar activeId={activeId} onForceState={forceState} targetLabel={targetLabel} />
      <div className="desktop">
        <MenuBar />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        {uninstallTarget && (
          <UninstallAlert
            app={uninstallTarget}
            onCancel={() => setUninstallTarget(null)}
            onConfirm={() => {
              setInstalls((current) => ({
                ...current,
                [uninstallTarget.name]: applyInstallAction(current[uninstallTarget.name] ?? notInstalled, "uninstall"),
              }));
              setUninstallTarget(null);
            }}
          />
        )}
        <main className="catalog-shell">
          <Sidebar page={page} onNavigate={navigate} />
          {view}
        </main>
      </div>
    </>
  );
}
