import React from "react";
import ReactDOM from "react-dom/client";

function App() {
  return (
    <>
      <style>{`
        :root {
          color-scheme: light;
          --bg: #f8f4ef;
          --bg2: #f2ede5;
          --ink: #1c1916;
          --ink2: #4a4540;
          --muted: #9a9088;
          --line: rgba(28, 25, 22, 0.08);
          --blush: #d4afa8;
          --gold: #c8a96e;
          --serif: Georgia, 'Times New Roman', serif;
          --sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        * { box-sizing: border-box; }
        html, body, #root { min-height: 100%; margin: 0; }
        body { background: var(--bg); color: var(--ink); font-family: var(--sans); overflow-x: hidden; }
        a { color: inherit; text-decoration: none; }
        .wrap { max-width: 1080px; margin: 0 auto; padding: 0 24px; }
        .hero { min-height: 100vh; display: grid; place-items: center; padding: 120px 0; position: relative; }
        .hero-grid { display: grid; gap: 24px; max-width: 760px; }
        .eyebrow { font-size: 12px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--muted); }
        h1 { margin: 0; font-family: var(--serif); font-size: clamp(60px, 9vw, 104px); font-weight: 300; line-height: 0.98; letter-spacing: -0.02em; }
        .subtitle { margin: 0; max-width: 28ch; font-family: var(--serif); font-size: clamp(20px, 2.4vw, 28px); font-style: italic; line-height: 1.6; color: var(--ink2); }
        .cta-row { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; }
        .btn { display: inline-flex; align-items: center; justify-content: center; padding: 14px 22px; border-radius: 999px; background: var(--ink); color: var(--bg); font-size: 14px; letter-spacing: 0.04em; }
        .panel { border-top: 1px solid var(--line); padding: 72px 0; }
        .card { border: 1px solid var(--line); border-radius: 18px; padding: 24px; background: rgba(255,255,255,0.45); }
        .small { color: var(--muted); font-size: 14px; line-height: 1.7; }
        .note { color: var(--ink2); font-family: var(--serif); font-style: italic; }
        .svg-wrap { overflow: hidden; border-radius: 20px; border: 1px solid var(--line); background: rgba(255,255,255,0.36); }
        .grid-2 { display: grid; gap: 20px; grid-template-columns: 1.2fr 0.8fr; align-items: start; }
        @media (max-width: 820px) { .grid-2 { grid-template-columns: 1fr; } .hero { padding: 84px 0; } }
      `}</style>

      <div className="hero">
        <div className="wrap hero-grid">
          <div className="eyebrow">Mirror</div>
          <h1>Mirror</h1>
          <p className="subtitle">
            We don't live in the world itself. We live in our interpretation of it.
          </p>
          <div className="cta-row">
            <a className="btn" href="/app">
              Enter Mirror
            </a>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="wrap grid-2">
          <div className="card">
            <div className="eyebrow" style={{ marginBottom: 12 }}>Interpretation Lens</div>
            <p className="small">
              A temporary static landing page while the runtime path is stabilized.
            </p>
            <p className="small note">
              The card doesn't change. The reader does.
            </p>
          </div>

          <div className="svg-wrap" aria-hidden="true">
            <svg viewBox="0 0 560 420" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">
              <rect width="560" height="420" fill="#f8f4ef" />
              <rect x="40" y="36" width="480" height="348" rx="20" fill="#f2ede5" stroke="rgba(28,25,22,0.08)" />
              <circle cx="150" cy="155" r="54" fill="rgba(212,175,168,0.18)" />
              <circle cx="400" cy="120" r="40" fill="rgba(194,188,216,0.18)" />
              <path d="M 112 290 C 170 250, 230 230, 280 240 C 330 250, 380 280, 442 258" stroke="rgba(28,25,22,0.18)" strokeWidth="2" fill="none" />
              <text x="80" y="82" fontFamily="Georgia, serif" fontSize="18" fontStyle="italic" fill="#4a4540">A quiet mirror for attention</text>
              <text x="80" y="118" fontFamily="system-ui, sans-serif" fontSize="12" fill="#9a9088">No broken SVG fragments. No malformed JSX.</text>
              <rect x="80" y="136" width="220" height="18" rx="9" fill="rgba(200,169,110,0.22)" />
              <rect x="80" y="170" width="300" height="12" rx="6" fill="rgba(28,25,22,0.06)" />
              <rect x="80" y="194" width="260" height="12" rx="6" fill="rgba(28,25,22,0.06)" />
              <rect x="80" y="218" width="180" height="12" rx="6" fill="rgba(28,25,22,0.06)" />
              <text x="80" y="286" fontFamily="Georgia, serif" fontSize="16" fontStyle="italic" fill="#1c1916">"You are not trapped in reality.</text>
              <text x="80" y="312" fontFamily="Georgia, serif" fontSize="16" fontStyle="italic" fill="#1c1916">You are trapped in interpretation."</text>
              <text x="80" y="352" fontFamily="system-ui, sans-serif" fontSize="11" letterSpacing="2" fill="#9a9088">MIRROR</text>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
