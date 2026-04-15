import { useEffect, useState } from "react";

/* ── Mini bolhas flutuantes (partículas orgânicas) ── */
const BUBBLES = [
  { size: 18, x: "12%",  delay: 0,    dur: 3.6, color: "rgba(254,138,0,0.35)" },
  { size: 10, x: "28%",  delay: 0.5,  dur: 4.2, color: "rgba(245,201,154,0.5)" },
  { size: 24, x: "70%",  delay: 1.0,  dur: 3.0, color: "rgba(254,138,0,0.25)" },
  { size: 14, x: "85%",  delay: 0.3,  dur: 4.8, color: "rgba(61,16,16,0.18)" },
  { size: 20, x: "45%",  delay: 1.4,  dur: 3.4, color: "rgba(254,138,0,0.30)" },
  { size: 12, x: "58%",  delay: 0.8,  dur: 4.0, color: "rgba(245,201,154,0.45)" },
  { size: 8,  x: "92%",  delay: 1.8,  dur: 5.0, color: "rgba(254,138,0,0.20)" },
  { size: 16, x: "5%",   delay: 2.0,  dur: 3.8, color: "rgba(61,16,16,0.14)" },
  { size: 22, x: "38%",  delay: 0.2,  dur: 3.2, color: "rgba(254,138,0,0.22)" },
  { size: 9,  x: "78%",  delay: 1.6,  dur: 4.5, color: "rgba(245,201,154,0.40)" },
];

/* ── Texto rotativo ── */
const FRASES = [
  "Preparando sua viagem…",
  "Conectando rotas…",
  "Quase lá…",
];

export default function Loading({ onDone }) {
  const [fraseIdx, setFraseIdx] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);

  /* Rotacionar frases */
  useEffect(() => {
    const t = setInterval(() => setFraseIdx(i => (i + 1) % FRASES.length), 1600);
    return () => clearInterval(t);
  }, []);

  /* Progresso de 0→100 em ~2.8s */
  useEffect(() => {
    const start = Date.now();
    const total = 2800;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / total, 1);
      /* ease-out cubic */
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(Math.round(eased * 100));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  /* Sair após 3s */
  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 2800);
    const t2 = setTimeout(() => onDone?.(), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#fff",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-family)",
      overflow: "hidden",
      opacity: fadeOut ? 0 : 1,
      transition: "opacity 0.55s ease",
    }}>
      <style>{`
        /* ── Blobs de fundo (mesmos do Login) ── */
        @keyframes ldMorphTL {
          0%   { border-radius: 71% 29% 62% 38% / 44% 57% 43% 56%; transform: translate(0,0) scale(1); }
          33%  { border-radius: 42% 58% 75% 25% / 60% 35% 65% 40%; transform: translate(8px,12px) scale(1.04); }
          66%  { border-radius: 58% 42% 38% 62% / 35% 68% 32% 65%; transform: translate(-6px,6px) scale(0.97); }
          100% { border-radius: 71% 29% 62% 38% / 44% 57% 43% 56%; transform: translate(0,0) scale(1); }
        }
        @keyframes ldMorphTLSoft {
          0%   { border-radius: 38% 62% 42% 58% / 60% 36% 64% 40%; transform: translate(0,0) scale(1); }
          33%  { border-radius: 65% 35% 58% 42% / 40% 62% 38% 60%; transform: translate(-10px,8px) scale(1.05); }
          66%  { border-radius: 50% 50% 30% 70% / 55% 45% 55% 45%; transform: translate(6px,-10px) scale(0.96); }
          100% { border-radius: 38% 62% 42% 58% / 60% 36% 64% 40%; transform: translate(0,0) scale(1); }
        }
        @keyframes ldMorphTR {
          0%   { border-radius: 62% 38% 46% 54% / 38% 65% 35% 62%; transform: translate(0,0) scale(1); }
          50%  { border-radius: 38% 62% 62% 38% / 55% 42% 58% 45%; transform: translate(-6px,14px) scale(1.08); }
          100% { border-radius: 62% 38% 46% 54% / 38% 65% 35% 62%; transform: translate(0,0) scale(1); }
        }
        @keyframes ldMorphBR {
          0%   { border-radius: 42% 58% 35% 65% / 57% 40% 60% 43%; transform: translate(0,0) scale(1); }
          33%  { border-radius: 60% 40% 55% 45% / 40% 60% 40% 60%; transform: translate(-10px,-8px) scale(1.06); }
          66%  { border-radius: 35% 65% 42% 58% / 62% 38% 55% 45%; transform: translate(8px,-14px) scale(0.95); }
          100% { border-radius: 42% 58% 35% 65% / 57% 40% 60% 43%; transform: translate(0,0) scale(1); }
        }

        /* ── Blob central: pulso + morph contínuo ── */
        @keyframes ldBlobPulse {
          0%   { border-radius: 62% 38% 46% 54% / 55% 48% 52% 45%; transform: scale(0.92); }
          25%  { border-radius: 42% 58% 65% 35% / 40% 62% 38% 60%; transform: scale(1.08); }
          50%  { border-radius: 70% 30% 40% 60% / 58% 38% 62% 42%; transform: scale(0.95); }
          75%  { border-radius: 35% 65% 55% 45% / 45% 55% 45% 55%; transform: scale(1.10); }
          100% { border-radius: 62% 38% 46% 54% / 55% 48% 52% 45%; transform: scale(0.92); }
        }

        /* ── Ripples (ondas expandindo) ── */
        @keyframes ldRipple {
          0%   { transform: scale(1);   opacity: 0.50; }
          100% { transform: scale(2.8); opacity: 0;    }
        }

        /* ── Bolinha flutuando para cima ── */
        @keyframes ldFloat {
          0%   { transform: translateY(0) scale(1);   opacity: 0; }
          10%  { opacity: 1; }
          80%  { opacity: 0.7; }
          100% { transform: translateY(-110vh) scale(0.4); opacity: 0; }
        }

        /* ── Glow do blob central ── */
        @keyframes ldGlow {
          0%, 100% { box-shadow: 0 0 30px 8px rgba(254,138,0,0.30), 0 8px 40px rgba(254,138,0,0.20); }
          50%      { box-shadow: 0 0 50px 16px rgba(254,138,0,0.50), 0 8px 60px rgba(254,138,0,0.35); }
        }

        /* ── Texto crossfade ── */
        @keyframes ldTxtPulse {
          0%, 100% { opacity: 0.45; }
          50%      { opacity: 1;    }
        }

        /* ── Entrada suave da tela ── */
        @keyframes ldFadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }

        /* ── Barra de progresso brilhando ── */
        @keyframes ldBarShine {
          0%   { background-position: -200px 0; }
          100% { background-position: 200px 0;  }
        }

        .ld2-blob-tl      { animation: ldMorphTL      9s ease-in-out infinite; }
        .ld2-blob-tl-soft { animation: ldMorphTLSoft  11s ease-in-out infinite; }
        .ld2-blob-tr      { animation: ldMorphTR      7s ease-in-out infinite; }
        .ld2-blob-br      { animation: ldMorphBR      10s ease-in-out infinite; }
        .ld2-center-blob  { animation: ldBlobPulse 2.2s ease-in-out infinite, ldGlow 2.2s ease-in-out infinite; }
        .ld2-ripple-1     { animation: ldRipple   2.4s ease-out infinite; }
        .ld2-ripple-2     { animation: ldRipple   2.4s ease-out infinite 0.8s; }
        .ld2-ripple-3     { animation: ldRipple   2.4s ease-out infinite 1.6s; }
        .ld2-txt          { animation: ldTxtPulse 1.6s ease-in-out infinite; }
        .ld2-page         { animation: ldFadeIn   0.6s ease both; }
      `}</style>

      {/* ── Blobs de fundo ── */}
      <div className="ld2-blob-tl" style={{
        position: "fixed", top: -60, left: -60, width: 260, height: 240,
        background: "var(--cor-primaria)", zIndex: 0,
      }} />
      <div className="ld2-blob-tl-soft" style={{
        position: "fixed", top: 80, left: 10, width: 200, height: 180,
        background: "#F5C99A", zIndex: 0,
      }} />
      <div className="ld2-blob-tr" style={{
        position: "fixed", top: 60, right: -24, width: 70, height: 120,
        background: "var(--cor-vinho-escuro)", zIndex: 0,
      }} />
      <div className="ld2-blob-br" style={{
        position: "fixed", bottom: -50, right: -50, width: 230, height: 210,
        background: "#F5C99A", zIndex: 0,
      }} />

      {/* ── Mini bolhas flutuantes ── */}
      {BUBBLES.map((b, i) => (
        <div key={i} style={{
          position: "fixed",
          bottom: -30,
          left: b.x,
          width: b.size,
          height: b.size,
          borderRadius: "50%",
          background: b.color,
          zIndex: 0,
          animation: `ldFloat ${b.dur}s ease-in-out infinite`,
          animationDelay: `${b.delay}s`,
        }} />
      ))}

      {/* ── Conteúdo central ── */}
      <div className="ld2-page" style={{
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 36,
      }}>

        {/* Logo */}
        <div style={{
          fontSize: 32, fontWeight: 900, letterSpacing: "-0.5px",
          lineHeight: 1, textAlign: "center",
        }}>
          <span style={{ color: "var(--cor-primaria)" }}>vam</span>
          <span style={{ color: "var(--cor-texto)" }}>bora</span>
          <span style={{ color: "var(--cor-primaria)" }}>.</span>
          <span style={{ color: "var(--cor-texto)", fontSize: 20, fontWeight: 700 }}> penedo</span>
        </div>

        {/* Blob central + ripples */}
        <div style={{
          position: "relative", width: 110, height: 110,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {/* Onda 1 */}
          <div className="ld2-ripple-1" style={{
            position: "absolute", inset: 0,
            borderRadius: "50%",
            background: "rgba(254,138,0,0.18)",
          }} />
          {/* Onda 2 */}
          <div className="ld2-ripple-2" style={{
            position: "absolute", inset: 0,
            borderRadius: "50%",
            background: "rgba(254,138,0,0.12)",
          }} />
          {/* Onda 3 */}
          <div className="ld2-ripple-3" style={{
            position: "absolute", inset: 0,
            borderRadius: "50%",
            background: "rgba(254,138,0,0.08)",
          }} />

          {/* Blob central estilizado */}
          <div className="ld2-center-blob" style={{
            width: 110, height: 110,
            background: "linear-gradient(140deg, #FE8A00 0%, #E07000 40%, #C96200 60%, #7A2828 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {/* Ícone de ônibus estilizado dentro do blob */}
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}>
              <rect x="4" y="3" width="16" height="16" rx="4" fill="rgba(255,255,255,0.92)" />
              <rect x="6" y="6" width="12" height="6" rx="2" fill="#FE8A00" opacity="0.7" />
              <circle cx="8.5" cy="20" r="1.5" fill="rgba(255,255,255,0.92)" />
              <circle cx="15.5" cy="20" r="1.5" fill="rgba(255,255,255,0.92)" />
              <rect x="11" y="13" width="2" height="4" rx="0.5" fill="rgba(255,255,255,0.5)" />
            </svg>
          </div>
        </div>

        {/* Barra de progresso orgânica */}
        <div style={{
          width: 180, height: 6,
          borderRadius: 100,
          background: "rgba(254,138,0,0.12)",
          overflow: "hidden",
          position: "relative",
        }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            borderRadius: 100,
            background: "linear-gradient(90deg, #FE8A00, #E07000, #FE8A00)",
            backgroundSize: "400px 100%",
            animation: "ldBarShine 1.4s linear infinite",
            transition: "width 0.15s ease",
          }} />
        </div>

        {/* Texto rotativo */}
        <div className="ld2-txt" style={{
          fontSize: 13, fontWeight: 700,
          color: "var(--cor-texto-suave)", letterSpacing: 0.8,
          textTransform: "uppercase",
          minHeight: 20, textAlign: "center",
        }}>
          {FRASES[fraseIdx]}
        </div>
      </div>
    </div>
  );
}
