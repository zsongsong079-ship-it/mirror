import React from "react";
import ReactDOM from "react-dom/client";

function App() {
  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "100vh", padding: 24, background: "#f8f4ef", color: "#1c1916", fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <div style={{ maxWidth: 720, width: "100%" }}>
        <h1 style={{ margin: "0 0 16px", fontSize: "clamp(56px, 10vw, 96px)", fontWeight: 300, lineHeight: 1 }}>Mirror</h1>
        <p style={{ margin: 0, maxWidth: "26ch", fontSize: "clamp(18px, 2.4vw, 26px)", lineHeight: 1.6 }}>
          We don't live in the world itself. We live in our interpretation of it.
        </p>
        <a
          href="/app"
          style={{ display: "inline-block", marginTop: 28, padding: "14px 22px", borderRadius: 999, background: "#1c1916", color: "#f8f4ef", textDecoration: "none", fontSize: 14, letterSpacing: "0.04em" }}
        >
          Enter Mirror
        </a>
      </div>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
