/**
 * Campo de formulário reutilizável com label, input e elemento opcional à direita.
 */
export default function Campo({ label, value, onChange, type = "text", placeholder = "", rightElement }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "var(--cor-texto-suave)", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ position: "relative" }}>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ width: "100%", padding: "14px 16px", paddingRight: rightElement ? 48 : 16, borderRadius: 12, border: "1.5px solid var(--cor-borda)", fontSize: 14, fontWeight: 600, color: "var(--cor-texto)", background: "var(--cor-fundo-card)", fontFamily: "var(--font-family)", boxSizing: "border-box" }}
        />
        {rightElement && <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}>{rightElement}</div>}
      </div>
    </div>
  );
}
