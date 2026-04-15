import { Check } from "lucide-react";

/**
 * Aviso de feedback (sucesso ou erro) reutilizável.
 */
export default function Aviso({ tipo, texto }) {
  const bg  = tipo === "erro" ? "var(--cor-erro-fundo)"   : "var(--cor-sucesso-fundo)";
  const cor = tipo === "erro" ? "var(--cor-erro)"         : "var(--cor-sucesso)";
  return (
    <div style={{ background: bg, borderRadius: 10, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8, color: cor, fontWeight: 700, fontSize: 13 }}>
      {tipo !== "erro" && <Check size={16} />}{texto}
    </div>
  );
}
