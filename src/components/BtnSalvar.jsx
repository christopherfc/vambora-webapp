/**
 * Botão de salvar reutilizável (estilo vinho gradiente, largura total).
 */
export default function BtnSalvar({ label, onClick }) {
  return (
    <button onClick={onClick} style={{ width: "100%", padding: 16, borderRadius: 14, border: "none", background: "var(--cor-vinho-gradient)", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "var(--font-family)" }}>
      {label}
    </button>
  );
}
