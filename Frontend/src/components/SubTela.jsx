import { ArrowLeft } from "lucide-react";

/**
 * Header compartilhado das sub-telas (Editar Dados, Alterar Senha, etc.)
 * Exibe um botão "Voltar", título e subtítulo opcional.
 */
export default function SubTela({ titulo, subtitulo, onVoltar, children }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--cor-fundo)", fontFamily: "var(--font-family)", paddingBottom: 80 }}>
      <div style={{ background: "var(--cor-vinho-gradient)", padding: "28px 20px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(254,138,0,0.12)", pointerEvents: "none" }} />
        <button onClick={onVoltar} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8, color: "#fff", fontFamily: "var(--font-family)", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 18, position: "relative" }}>
          <ArrowLeft size={16} strokeWidth={2.5} /> Voltar
        </button>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", position: "relative" }}>{titulo}</div>
        {subtitulo && <div style={{ fontSize: 13, color: "var(--cor-primaria-soft)", fontWeight: 600, marginTop: 4, position: "relative" }}>{subtitulo}</div>}
      </div>
      {children}
    </div>
  );
}
