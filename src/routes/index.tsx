import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { charSet: "UTF-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: "Mirror — A Self-Narrative OS" },
      {
        name: "description",
        content: "Mirror is a Self-Narrative OS for observing how you interpret reality.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.07, rootMargin: "0px 0px -48px 0px" },
    );

    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{`        :root {
    --cream:         #f8f4ef;
    --cream-mid:     #f2ede5;
    --ink:           #1c1916;
    --ink-soft:      #4a4540;
    --ink-muted:     #9a9088;
    --blush:         #d4afa8;
    --blush-pale:    #f5ecea;
    --lavender:      #c2bcd8;
    --lavender-pale: #edeaf5;
    --gold:          #c8a96e;
    --line:          rgba(28,25,22,0.08);
    --line-soft:     rgba(28,25,22,0.05);
    --glass-bg:      rgba(255,255,255,0.55);
    --glass-border:  rgba(255,255,255,0.75);
    --serif: 'Cormorant Garamond', Georgia, serif;
    --sans:  'DM Sans', system-ui, sans-serif;
    --mono:  'DM Mono', monospace;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: var(--cream); color: var(--ink); font-family: var(--sans); font-size: 16px; line-height: 1.75; overflow-x: hidden; }
  a { color: inherit; text-decoration: none; }
  body::before {
    content: ''; position: fixed; top: 0; left: 72px;
    width: 1px; height: 100vh;
    background: linear-gradient(to bottom, transparent, var(--line) 15%, var(--line) 85%, transparent);
    pointer-events: none; z-index: 10;
  }
  .container      { max-width: 860px;  margin: 0 auto; padding: 0 56px 0 128px; }
  .container--wide{ max-width: 1080px; margin: 0 auto; padding: 0 56px 0 128px; }
  section { padding: 140px 0; }
  section + section { border-top: 1px solid var(--line-soft); }
  .eyebrow { font-family: var(--mono); font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--ink-muted); margin-bottom: 40px; display: flex; align-items: center; gap: 16px; }
  .eyebrow::before { content: ''; width: 20px; height: 1px; background: var(--blush); flex-shrink: 0; }
  h1 { font-family: var(--serif); font-size: clamp(60px, 8vw, 104px); font-weight: 300; line-height: 1.0; letter-spacing: -0.01em; color: var(--ink); margin-bottom: 28px; }
  h2 { font-family: var(--serif); font-size: clamp(34px, 4.5vw, 54px); font-weight: 300; line-height: 1.1; letter-spacing: -0.01em; margin-bottom: 36px; }
  h2 em { font-style: italic; color: var(--ink-soft); }
  p { font-size: 16px; color: var(--ink-soft); line-height: 1.85; margin-bottom: 22px; }
  p:last-child { margin-bottom: 0; }
  p strong { color: var(--ink); font-weight: 500; }
  .hero-subtitle { font-family: var(--serif); font-size: clamp(19px, 2.4vw, 26px); font-weight: 300; font-style: italic; color: var(--ink-soft); margin-bottom: 24px; line-height: 1.6; }
  .hero-supporting { font-size: 16px; color: var(--ink-muted); margin-bottom: 56px; }
  .pull-quote { font-family: var(--serif); font-size: clamp(20px, 2.6vw, 28px); font-weight: 300; font-style: italic; line-height: 1.55; color: var(--ink); border-left: 2px solid var(--blush); padding-left: 28px; margin: 0; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
  .btn-primary { display: inline-flex; flex-direction: column; align-items: flex-start; gap: 6px; background: var(--ink); color: var(--cream); padding: 20px 40px; border-radius: 3px; font-family: var(--sans); font-size: 14px; font-weight: 500; letter-spacing: 0.04em; transition: background .2s, transform .2s; cursor: pointer; border: none; }
  .btn-primary:hover { background: var(--ink-soft); transform: translateY(-2px); }
  .btn-ghost { display: inline-flex; flex-direction: column; align-items: flex-start; gap: 6px; background: transparent; color: var(--ink); padding: 20px 40px; border-radius: 3px; border: 1px solid var(--line); font-family: var(--sans); font-size: 14px; font-weight: 400; letter-spacing: 0.04em; transition: border-color .2s, background .2s, transform .2s; cursor: pointer; }
  .btn-ghost:hover { border-color: rgba(28,25,22,0.25); background: rgba(28,25,22,0.03); transform: translateY(-2px); }
  .btn-sub { font-family: var(--mono); font-size: 11px; font-weight: 300; letter-spacing: 0.07em; }
  .btn-primary .btn-sub { color: rgba(247,243,238,0.45); }
  .btn-ghost   .btn-sub { color: var(--ink-muted); }
  .hero-btns { display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; }
  #hero { padding-top: 160px; padding-bottom: 160px; border-top: none; position: relative; overflow: hidden; background: var(--cream); }
  .orb { position: absolute; border-radius: 50%; pointer-events: none; }
  .orb-lav  { top: -100px; right: -180px; width: 720px; height: 720px; background: radial-gradient(circle, rgba(194,188,216,0.18) 0%, transparent 62%); }
  .orb-blush{ bottom: -40px; left: -120px; width: 440px; height: 440px; background: radial-gradient(circle, rgba(212,175,168,0.12) 0%, transparent 65%); }
  #preview { background: linear-gradient(180deg, var(--cream) 0%, rgba(237,234,245,0.4) 50%, var(--cream) 100%); padding: 120px 0; }
  .preview-intro { text-align: center; margin-bottom: 80px; }
  .preview-intro .eyebrow { justify-content: center; }
  .preview-intro .eyebrow::before { display: none; }
  .preview-intro h2 { max-width: 480px; margin: 0 auto 16px; }
  .preview-intro p { max-width: 400px; margin: 0 auto; font-size: 15px; }
  .phones-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; align-items: end; max-width: 900px; margin: 0 auto; padding: 0 56px 0 128px; }
  .phone-wrap { display: flex; flex-direction: column; align-items: center; gap: 20px; }
  .phone-wrap:nth-child(2) { transform: translateY(-40px); }
  .phone-label { font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-muted); }
  .phone-shell { width: 100%; border-radius: 44px; background: #1a1714; padding: 14px; box-shadow: 0 40px 80px rgba(28,25,22,0.16), 0 8px 24px rgba(28,25,22,0.10), inset 0 1px 0 rgba(255,255,255,0.08); }
  .phone-screen { border-radius: 32px; overflow: hidden; width: 100%; }
  .phone-screen svg { display: block; width: 100%; }
  #what { background: var(--cream); }
  #how { background: linear-gradient(180deg, var(--cream) 0%, rgba(245,236,234,0.35) 100%); }
  .flow { display: flex; flex-direction: column; }
  .flow-step { display: flex; gap: 32px; align-items: flex-start; padding: 32px 0; border-bottom: 1px solid var(--line-soft); }
  .flow-step:last-child { border-bottom: none; }
  .flow-num { font-family: var(--mono); font-size: 10px; color: var(--blush); letter-spacing: 0.08em; flex-shrink: 0; padding-top: 4px; width: 24px; }
  .flow-label { font-family: var(--serif); font-size: 21px; font-weight: 400; color: var(--ink); line-height: 1.3; }
  .flow-desc { font-size: 14px; color: var(--ink-muted); margin-top: 5px; line-height: 1.65; }
  .medium-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
  .chip { font-family: var(--mono); font-size: 10px; letter-spacing: 0.08em; color: var(--ink-soft); border: 1px solid var(--line); padding: 8px 16px; border-radius: 2px; background: var(--glass-bg); }
  #lens { background: linear-gradient(180deg, var(--cream) 0%, rgba(237,234,245,0.5) 40%, rgba(245,236,234,0.45) 75%, var(--cream) 100%); position: relative; overflow: hidden; }
  #lens::before { content: ''; position: absolute; top: -200px; left: 50%; transform: translateX(-50%); width: 900px; height: 600px; border-radius: 50%; background: radial-gradient(ellipse, rgba(194,188,216,0.12) 0%, transparent 65%); pointer-events: none; }
  .lens-intro { text-align: center; margin-bottom: 80px; }
  .lens-intro .eyebrow { justify-content: center; }
  .lens-intro .eyebrow::before { display: none; }
  .lens-intro h2 { max-width: 520px; margin: 0 auto 20px; }
  .lens-intro p { max-width: 440px; margin: 0 auto; font-size: 16px; }
  .lens-card-wrap { max-width: 560px; margin: 0 auto; filter: drop-shadow(0 24px 60px rgba(28,25,22,0.08)) drop-shadow(0 4px 16px rgba(28,25,22,0.05)); }
  .lens-card-wrap svg { display: block; width: 100%; border-radius: 20px; }
  #founder { background: var(--cream); }
  #founding { background: var(--cream-mid); }
  .benefits { list-style: none; margin: 44px 0 52px; }
  .benefits li { display: flex; align-items: flex-start; gap: 18px; padding: 18px 0; border-bottom: 1px solid var(--line-soft); font-size: 15px; color: var(--ink-soft); }
  .benefits li:first-child { border-top: 1px solid var(--line-soft); }
  .benefits li::before { content: '✓'; font-family: var(--mono); font-size: 11px; color: var(--blush); flex-shrink: 0; padding-top: 3px; }
  .founding-price { font-family: var(--serif); font-size: 36px; font-weight: 300; color: var(--ink); margin-bottom: 6px; }
  .founding-price-note { font-family: var(--mono); font-size: 11px; color: var(--ink-muted); letter-spacing: 0.08em; margin-bottom: 32px; }
  footer { background: var(--ink); border-top: 1px solid rgba(247,243,238,0.07); padding: 44px 0; }
  .footer-inner { max-width: 860px; margin: 0 auto; padding: 0 56px 0 128px; display: flex; align-items: center; justify-content: space-between; }
  .footer-logo { font-family: var(--serif); font-size: 18px; color: rgba(247,243,238,0.50); }
  .footer-note { font-family: var(--mono); font-size: 10px; color: rgba(247,243,238,0.25); letter-spacing: 0.06em; }
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity .8s ease, transform .8s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  @media (max-width: 860px) { body::before { left: 24px; } .container, .container--wide { padding: 0 28px 0 60px; } .footer-inner { padding: 0 28px 0 60px; } .two-col { grid-template-columns: 1fr; } .phones-row { grid-template-columns: 1fr; padding: 0 28px; gap: 40px; } .phone-wrap:nth-child(2) { transform: none; } section { padding: 96px 0; } .hero-btns { flex-direction: column; } }
  @media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; transition: none; } }
      `}</style>

      <section id="hero">
        <div className="orb orb-lav" />
        <div className="orb orb-blush" />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <h1>Mirror</h1>
          <p className="hero-subtitle">
            <span>We don't live in the world itself.<br />We live in our interpretation of it.</span>
          </p>
          <p className="hero-supporting">
            <span>Observe the stories shaping your life.</span>
          </p>
          <div className="hero-btns">
            <Link to="/app" className="btn-ghost">
              <span>Enter Mirror</span>
            </Link>
            <a href="#founding" className="btn-primary">
              <span>Become a Founding Member</span>
              <span className="btn-sub">
                <span>$2 Early Access · Lifetime included</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      <section id="preview">
        <div className="container--wide">
          <div className="preview-intro reveal">
            <p className="eyebrow"><span>Inside Mirror</span></p>
            <h2><span>A glimpse inside<br /><em>Mirror</em></span></h2>
            <p><span>Not a Tarot app. A space to observe how you interpret reality.</span></p>
          </div>
          <div className="phones-row reveal">
            <div className="phone-wrap"><div className="phone-shell"><div className="phone-screen"><svg viewBox="0 0 300 580" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="p1bg" cx="50%" cy="0%" r="80%"><stop offset="0%" stopColor="#f5ecea" /><stop offset="100%" stopColor="#ede7e0" /></radialGradient></defs><rect width="300" height="580" fill="url(#p1bg)" /><text x="24" y="32" fontFamily="DM Sans,sans-serif" fontSize="11" fill="#9a9088">9:41</text><text x="150" y="72" fontFamily="Cormorant Garamond,serif" fontSize="18" fill="#1c1916" textAnchor="middle" letterSpacing="1">Mirror</text><line x1="24" y1="84" x2="276" y2="84" stroke="rgba(28,25,22,0.07)" strokeWidth="1" /><rect x="24" y="104" width="228" height="66" rx="14" fill="rgba(255,255,255,0.72)" stroke="rgba(255,255,255,0.9)" strokeWidth="1" /><text x="36" y="124" fontFamily="DM Mono,monospace" fontSize="9" fill="#9a9088" letterSpacing="1">YOUR QUESTION</text><text x="36" y="146" fontFamily="DM Sans,sans-serif" fontSize="13" fill="#1c1916">Should I leave law school?</text><text x="36" y="162" fontFamily="DM Sans,sans-serif" fontSize="12" fill="#6a6058">I feel trapped.</text><rect x="24" y="186" width="228" height="54" rx="14" fill="rgba(194,188,216,0.18)" stroke="rgba(194,188,216,0.35)" strokeWidth="1" /><text x="36" y="206" fontFamily="DM Mono,monospace" fontSize="9" fill="rgba(194,188,216,0.9)" letterSpacing="1">MIRROR</text><text x="36" y="224" fontFamily="Cormorant Garamond,serif" fontSize="14" fill="#1c1916" fontStyle="italic">What are you afraid of losing if you stay?</text><rect x="24" y="256" width="180" height="78" rx="14" fill="rgba(255,255,255,0.65)" stroke="rgba(255,255,255,0.85)" strokeWidth="1" /><text x="36" y="278" fontFamily="DM Sans,sans-serif" fontSize="13" fill="#2a2520">Freedom.</text><text x="36" y="298" fontFamily="DM Sans,sans-serif" fontSize="13" fill="#4a4540">Time.</text><text x="36" y="318" fontFamily="DM Sans,sans-serif" fontSize="13" fill="#6a6058">Possibility.</text><rect x="24" y="350" width="252" height="78" rx="14" fill="rgba(237,234,245,0.75)" stroke="rgba(194,188,216,0.4)" strokeWidth="1" /><text x="36" y="370" fontFamily="DM Mono,monospace" fontSize="9" fill="rgba(194,188,216,0.9)" letterSpacing="1">MIRROR NOTICES</text><text fontFamily="Cormorant Garamond,serif" fontSize="13" fill="#1c1916" fontStyle="italic"><tspan x="36" y="390">Your question is about school,</tspan><tspan x="36" dy="17">but your answers are about freedom.</tspan></text><rect x="24" y="452" width="228" height="40" rx="20" fill="rgba(255,255,255,0.6)" stroke="rgba(28,25,22,0.08)" strokeWidth="1" /><text x="44" y="476" fontFamily="DM Sans,sans-serif" fontSize="12" fill="#c2b8b0">Write something…</text><rect x="116" y="558" width="68" height="4" rx="2" fill="rgba(28,25,22,0.15)" /></svg></div></div><span className="phone-label">Question</span></div>
            <div className="phone-wrap"><div className="phone-shell"><div className="phone-screen"><svg viewBox="0 0 300 580" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="p2bg" cx="50%" cy="20%" r="80%"><stop offset="0%" stopColor="#edeaf5" /><stop offset="100%" stopColor="#e8e2d8" /></radialGradient><radialGradient id="p2orb" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="rgba(212,175,168,0.3)"/><stop offset="100%" stopColor="rgba(212,175,168,0)"/></radialGradient><filter id="p2blur"><feGaussianBlur stdDeviation="16"/></filter></defs><rect width="300" height="580" fill="url(#p2bg)" /><ellipse cx="80" cy="380" rx="140" ry="130" fill="url(#p2orb)" filter="url(#p2blur)" opacity="0.7" /><text x="24" y="32" fontFamily="DM Sans,sans-serif" fontSize="11" fill="#9a9088">9:41</text><text x="150" y="72" fontFamily="Cormorant Garamond,serif" fontSize="18" fill="#1c1916" textAnchor="middle" letterSpacing="1">Mirror</text><line x1="24" y1="84" x2="276" y2="84" stroke="rgba(28,25,22,0.07)" strokeWidth="1" /><rect x="90" y="108" width="120" height="184" rx="12" fill="white" stroke="rgba(212,175,168,0.5)" strokeWidth="1.5" /><rect x="99" y="117" width="102" height="166" rx="8" fill="#faf5f0" /><path d="M 135 160 Q 124 188 135 216 Q 167 205 167 188 Q 167 171 135 160 Z" fill="none" stroke="rgba(194,188,216,0.8)" strokeWidth="1.5" /><circle cx="150" cy="188" r="5" fill="rgba(194,188,216,0.55)" /><line x1="150" y1="142" x2="150" y2="232" stroke="rgba(212,175,168,0.4)" strokeWidth="0.75" /><text x="150" y="263" fontFamily="Cormorant Garamond,serif" fontSize="11" fill="#4a4540" textAnchor="middle" letterSpacing="2">THE MOON</text><text x="150" y="320" fontFamily="DM Mono,monospace" fontSize="9" fill="#9a9088" textAnchor="middle" letterSpacing="1.5">WHAT DO YOU NOTICE FIRST?</text><rect x="24" y="336" width="252" height="88" rx="14" fill="rgba(255,255,255,0.62)" stroke="rgba(255,255,255,0.82)" strokeWidth="1" /><text x="36" y="360" fontFamily="DM Sans,sans-serif" fontSize="13" fill="#2a2520">Fog.</text><text x="36" y="382" fontFamily="DM Sans,sans-serif" fontSize="13" fill="#4a4540">Distance.</text><text x="36" y="404" fontFamily="DM Sans,sans-serif" fontSize="13" fill="#6a6058">Uncertainty.</text><rect x="24" y="440" width="252" height="58" rx="12" fill="rgba(237,234,245,0.72)" stroke="rgba(194,188,216,0.38)" strokeWidth="1" /><text x="36" y="462" fontFamily="DM Mono,monospace" fontSize="9" fill="rgba(194,188,216,0.85)" letterSpacing="1">MIRROR</text><text x="36" y="480" fontFamily="Cormorant Garamond,serif" fontSize="13" fill="#1c1916" fontStyle="italic">You often read uncertainty as danger.</text><rect x="116" y="558" width="68" height="4" rx="2" fill="rgba(28,25,22,0.12)" /></svg></div></div><span className="phone-label">Draw</span></div>
            <div className="phone-wrap"><div className="phone-shell"><div className="phone-screen"><svg viewBox="0 0 300 580" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="p3bg" cx="70%" cy="15%" r="75%"><stop offset="0%" stopColor="#f5ecea" /><stop offset="100%" stopColor="#ece6de" /></radialGradient></defs><rect width="300" height="580" fill="url(#p3bg)" /><text x="24" y="32" fontFamily="DM Sans,sans-serif" fontSize="11" fill="#9a9088">9:41</text><text x="150" y="72" fontFamily="Cormorant Garamond,serif" fontSize="18" fill="#1c1916" textAnchor="middle" letterSpacing="1">Mirror</text><line x1="24" y1="84" x2="276" y2="84" stroke="rgba(28,25,22,0.07)" strokeWidth="1" /><text x="24" y="114" fontFamily="DM Mono,monospace" fontSize="9" fill="#c2bcd8" letterSpacing="2">INTERPRETATION LENS</text><rect x="24" y="126" width="252" height="68" rx="12" fill="rgba(255,255,255,0.58)" stroke="rgba(255,255,255,0.78)" strokeWidth="1" /><text x="36" y="146" fontFamily="DM Mono,monospace" fontSize="8.5" fill="#9a9088" letterSpacing="1.5">RECURRING NARRATIVE</text><ellipse cx="150" cy="174" rx="88" ry="20" fill="rgba(212,175,168,0.22)" stroke="rgba(212,175,168,0.5)" strokeWidth="1" /><text x="150" y="178" fontFamily="DM Sans,sans-serif" fontSize="12" fill="#2a2520" textAnchor="middle" fontWeight="500">Waiting for permission</text><rect x="24" y="210" width="252" height="100" rx="12" fill="rgba(255,255,255,0.45)" stroke="rgba(255,255,255,0.65)" strokeWidth="1" /><text x="36" y="230" fontFamily="DM Mono,monospace" fontSize="8.5" fill="#9a9088" letterSpacing="1.5">PATTERNS</text><rect x="36" y="240" width="2.5" height="24" rx="1.25" fill="#d4afa8" /><text x="48" y="253" fontFamily="DM Sans,sans-serif" fontSize="12" fill="#1c1916">Uncertainty read as danger</text><rect x="36" y="272" width="2.5" height="22" rx="1.25" fill="rgba(194,188,216,0.7)" /><text x="48" y="287" fontFamily="DM Sans,sans-serif" fontSize="12" fill="#4a4540">Waits for certainty before acting</text><rect x="24" y="326" width="252" height="58" rx="12" fill="rgba(255,255,255,0.38)" stroke="rgba(255,255,255,0.55)" strokeWidth="1" /><text x="36" y="346" fontFamily="DM Mono,monospace" fontSize="8.5" fill="#9a9088" letterSpacing="1.5">RECURRING SYMBOLS</text><text x="36" y="368" fontFamily="Cormorant Garamond,serif" fontSize="17" fill="rgba(28,25,22,0.72)" fontStyle="italic">Moon</text><text x="96" y="365" fontFamily="Cormorant Garamond,serif" fontSize="14" fill="rgba(28,25,22,0.50)" fontStyle="italic">Water</text><text x="154" y="368" fontFamily="Cormorant Garamond,serif" fontSize="12" fill="rgba(28,25,22,0.35)" fontStyle="italic">Doors</text><text x="206" y="366" fontFamily="Cormorant Garamond,serif" fontSize="10" fill="rgba(28,25,22,0.24)" fontStyle="italic">Birds</text><rect x="24" y="398" width="252" height="88" rx="12" fill="rgba(237,234,245,0.70)" stroke="rgba(194,188,216,0.36)" strokeWidth="1" /><text x="36" y="420" fontFamily="DM Mono,monospace" fontSize="8.5" fill="rgba(194,188,216,0.85)" letterSpacing="1.5">MIRROR NOTICES</text><text fontFamily="Cormorant Garamond,serif" fontSize="13" fill="#1c1916" fontStyle="italic"><tspan x="36" y="440">You describe change as something</tspan><tspan x="36" dy="17">that happens to you,</tspan><tspan x="36" dy="17">not something you create.</tspan></text><rect x="116" y="558" width="68" height="4" rx="2" fill="rgba(28,25,22,0.12)" /></svg></div></div><span className="phone-label">Interpretation Lens</span></div>
          </div>
        </div>
      </section>

      <section id="what"><div className="container"><div className="two-col reveal"><div><p className="eyebrow"><span>What is Mirror</span></p><h2><span>The difference is<br /><em>the story.</em></span></h2><p><span>Mirror is a Self-Narrative OS. The same event can lead to completely different emotions, decisions, and futures — not because of what happened, but because of how you interpreted it.</span></p><p><span>Tarot, I Ching, symbols, and archetypes are reflection mediums. The medium changes. <strong>The interpretation is always yours.</strong></span></p></div><div style={{ paddingTop: 96 }}><p className="pull-quote"><span>"Most of us think we're trapped by reality. But often, we're trapped by our interpretation of it."</span></p></div></div></div></section>

      <section id="how"><div className="container"><div className="two-col reveal"><div><p className="eyebrow"><span>How It Works</span></p><h2><span>A quiet ritual<br /><em>of observation.</em></span></h2><p><span>Mirror is not a Tarot app. These are reflection mediums — surfaces that help you see what you already carry.</span></p><div className="medium-chips" style={{ marginTop: 28 }}><span className="chip">Tarot</span><span className="chip">I Ching</span><span className="chip">Symbols</span><span className="chip">Archetypes</span><span className="chip">More soon</span></div></div><div className="flow"><div className="flow-step"><span className="flow-num">01</span><div><div className="flow-label"><span>Choose a Reflection Medium</span></div><div className="flow-desc"><span>Tarot, I Ching, symbols, archetypes, and more.</span></div></div></div><div className="flow-step"><span className="flow-num">02</span><div><div className="flow-label"><span>Draw</span></div><div className="flow-desc"><span>Let intuition guide the selection.</span></div></div></div><div className="flow-step"><span className="flow-num">03</span><div><div className="flow-label"><span>Describe</span></div><div className="flow-desc"><span>What do you notice first?<br />What feeling appears? What story do you see?</span></div></div></div><div className="flow-step"><span className="flow-num">04</span><div><div className="flow-label"><span>Reflect</span></div><div className="flow-desc"><span>Mirror combines your interpretation with traditional meanings. Not to predict the future. <strong style={{ color: "var(--ink)" }}>To reveal how you create meaning.</strong></span></div></div></div><div className="flow-step"><span className="flow-num">05</span><div><div className="flow-label"><span>Reveal Your Interpretation Lens</span></div><div className="flow-desc"><span>Recurring narratives become visible over time.</span></div></div></div></div></div></div></section>

      <section id="lens"><div className="container--wide"><div className="lens-intro reveal"><p className="eyebrow"><span>Interpretation Lens</span></p><h2><span>How you tend to<br /><em>read the world.</em></span></h2><p><span>Mirror doesn't archive sessions. It reveals the patterns in how you interpret reality — the recurring lenses you carry without noticing.</span></p></div><div className="lens-card-wrap reveal"><svg viewBox="0 0 560 560" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 20 }}><defs><radialGradient id="lbg" cx="50%" cy="10%" r="80%"><stop offset="0%" stopColor="#f6f3ee" /><stop offset="100%" stopColor="#ede9e2" /></radialGradient><radialGradient id="lh1" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="rgba(212,175,168,0.12)"/><stop offset="100%" stopColor="rgba(212,175,168,0)"/></radialGradient><radialGradient id="lh2" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="rgba(194,188,216,0.11)"/><stop offset="100%" stopColor="rgba(194,188,216,0)"/></radialGradient><filter id="lf"><feGaussianBlur stdDeviation="22"/></filter></defs><rect width="560" height="560" fill="url(#lbg)" /><ellipse cx="460" cy="80" rx="210" ry="180" fill="url(#lh2)" filter="url(#lf)" opacity="0.5" /><ellipse cx="80" cy="420" rx="180" ry="160" fill="url(#lh1)" filter="url(#lf)" opacity="0.45" /><text x="40" y="50" fontFamily="DM Mono,monospace" fontSize="10" fill="#9a9088" letterSpacing="2.5">INTERPRETATION LENS</text><line x1="40" y1="63" x2="520" y2="63" stroke="rgba(28,25,22,0.06)" strokeWidth="1" /><text x="40" y="90" fontFamily="DM Mono,monospace" fontSize="9" fill="#c2bcd8" letterSpacing="2">INTERPRETATION PATTERNS</text><rect x="40" y="102" width="480" height="52" rx="10" fill="rgba(255,255,255,0.48)" stroke="rgba(255,255,255,0.68)" strokeWidth="1" /><rect x="52" y="115" width="2.5" height="26" rx="1.25" fill="#d4afa8" /><text x="68" y="126" fontFamily="Cormorant Garamond,serif" fontSize="17" fill="#1c1916" fontStyle="italic">Uncertainty is often read as danger</text><text x="68" y="144" fontFamily="DM Sans,sans-serif" fontSize="12" fill="#9a9088">A recurring way of meeting the unknown</text><rect x="40" y="162" width="480" height="44" rx="10" fill="rgba(255,255,255,0.30)" stroke="rgba(255,255,255,0.50)" strokeWidth="1" /><rect x="52" y="174" width="2.5" height="20" rx="1.25" fill="rgba(194,188,216,0.7)" /><text x="68" y="188" fontFamily="Cormorant Garamond,serif" fontSize="17" fill="#2a2520" fontStyle="italic">Action waits for certainty that rarely comes</text><text x="68" y="200" fontFamily="DM Sans,sans-serif" fontSize="12" fill="#9a9088">Appears across multiple contexts</text><line x1="40" y1="224" x2="520" y2="224" stroke="rgba(28,25,22,0.05)" strokeWidth="1" /><text x="40" y="244" fontFamily="DM Mono,monospace" fontSize="9" fill="#c2bcd8" letterSpacing="2">RECURRING NARRATIVES</text><ellipse cx="148" cy="290" rx="102" ry="30" fill="rgba(212,175,168,0.20)" stroke="rgba(212,175,168,0.50)" strokeWidth="1" /><text x="148" y="294" fontFamily="DM Sans,sans-serif" fontSize="13" fill="#2a2520" textAnchor="middle" fontWeight="500">Waiting for permission</text><ellipse cx="386" cy="280" rx="86" ry="26" fill="rgba(212,175,168,0.10)" stroke="rgba(212,175,168,0.30)" strokeWidth="1" /><text x="386" y="284" fontFamily="DM Sans,sans-serif" fontSize="12" fill="#4a4540" textAnchor="middle">Fear of uncertainty</text><ellipse cx="192" cy="332" rx="68" ry="22" fill="rgba(194,188,216,0.16)" stroke="rgba(194,188,216,0.40)" strokeWidth="1" /><text x="192" y="336" fontFamily="DM Sans,sans-serif" fontSize="11.5" fill="#4a4540" textAnchor="middle">Need for control</text><ellipse cx="400" cy="330" rx="64" ry="20" fill="rgba(194,188,216,0.08)" stroke="rgba(194,188,216,0.20)" strokeWidth="0.75" /><text x="400" y="334" fontFamily="DM Sans,sans-serif" fontSize="11" fill="#6a6058" textAnchor="middle">Desire for freedom</text><line x1="40" y1="372" x2="520" y2="372" stroke="rgba(28,25,22,0.05)" strokeWidth="1" /><text x="40" y="392" fontFamily="DM Mono,monospace" fontSize="9" fill="#c2bcd8" letterSpacing="2">RECURRING SYMBOLS</text><text x="54" y="432" fontFamily="Cormorant Garamond,serif" fontSize="30" fill="rgba(28,25,22,0.72)" fontStyle="italic">Moon</text><text x="172" y="428" fontFamily="Cormorant Garamond,serif" fontSize="24" fill="rgba(28,25,22,0.50)" fontStyle="italic">Water</text><text x="296" y="433" fontFamily="Cormorant Garamond,serif" fontSize="19" fill="rgba(28,25,22,0.34)" fontStyle="italic">Doors</text><text x="406" y="430" fontFamily="Cormorant Garamond,serif" fontSize="14" fill="rgba(28,25,22,0.22)" fontStyle="italic">Birds</text><line x1="40" y1="454" x2="520" y2="454" stroke="rgba(28,25,22,0.04)" strokeWidth="1" /><rect x="40" y="466" width="480" height="74" rx="14" fill="rgba(237,234,245,0.70)" stroke="rgba(194,188,216,0.36)" strokeWidth="1" /><text x="54" y="488" fontFamily="DM Mono,monospace" fontSize="9" fill="rgba(194,188,216,0.85)" letterSpacing="2">MIRROR NOTICES</text><text fontFamily="Cormorant Garamond,serif" fontSize="15" fill="#1c1916" fontStyle="italic"><tspan x="54" y="510">"You often describe change as something that happens to you,</tspan><tspan x="54" dy="20">rather than something you create."</tspan></text></svg></div></div></section>

      <section id="founder"><div className="container reveal"><div className="two-col"><div><p className="eyebrow"><span>Why I'm Building This</span></p><div><p style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 300, lineHeight: 1.8, color: "var(--ink)", marginBottom: 24 }}><span>I built Mirror because I needed it myself.</span></p><p style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 300, lineHeight: 1.8, color: "var(--ink)", marginBottom: 24 }}><span>I wanted a way to observe not only what happened, but how I kept interpreting what happened.</span></p><p style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 300, lineHeight: 1.8, color: "var(--ink)" }}><span>Mirror began as an attempt to build the tool I wished existed.</span></p></div><p style={{ fontFamily: "var(--serif)", fontSize: 15, fontStyle: "italic", color: "var(--ink-muted)", marginTop: 44 }}><span>— The Founder</span></p></div><div style={{ paddingTop: 72 }}><p className="pull-quote"><span>Most tools helped me record.<br />Few helped me observe.</span></p></div></div></div></section>

      <section id="founding"><div className="container reveal"><p className="eyebrow"><span>Founding Member</span></p><h2><span>Become a<br /><em>Founding Member</em></span></h2><p style={{ maxWidth: 520, marginTop: 24, fontSize: 17, lineHeight: 1.85 }}><span>Mirror is still being built. You're joining the earliest version of a new way to understand yourself.</span></p><ul className="benefits"><li><span>Lifetime access to Mirror</span></li><li><span>Your personal Interpretation Lens</span></li><li><span>Early access to future reflection systems</span></li><li><span>A voice in what Mirror becomes</span></li><li><span>Build-in-public access</span></li></ul><p className="founding-price">$2</p><p className="founding-price-note"><span>EARLY ACCESS · LIFETIME INCLUDED</span></p><div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14 }}><a href="#" className="btn-primary"><span>Become a Founding Member</span><span className="btn-sub"><span>$2 Early Access</span></span></a><p style={{ fontSize: 13, color: "var(--ink-muted)", margin: 0 }}><span>Want to contribute more? <a href="#" style={{ color: "var(--ink-soft)", borderBottom: "1px solid var(--line)" }}>Choose your own amount.</a></span></p></div></div></section>

      <footer><div className="footer-inner"><span className="footer-logo">Mirror</span><span className="footer-note"><span>A Self-Narrative OS · Built in Public</span></span></div></footer>
    </>
  );
}
