import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import SubTela from "../../components/SubTela.jsx";
import { buscarFaqs } from "../../services/api.js";

export default function CentralAjuda({ onVoltar }) {
  const [aberto, setAberto] = useState(null);
  const [faqs,   setFaqs]   = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const data = await buscarFaqs();
        setFaqs(data.faqs || []);
      } catch (e) {
        console.error(e);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  return (
    <SubTela titulo="Central de Ajuda" subtitulo="Perguntas frequentes" onVoltar={onVoltar}>
      <div style={{ padding: "20px 16px" }}>
        {carregando && (
          <div style={{ textAlign: "center", padding: "32px 0", color: "var(--cor-primaria)", fontWeight: 800, fontSize: 14 }}>Carregando...</div>
        )}
        {!carregando && faqs.map((faq, i) => (
          <div key={faq._id || i} style={{ background: "#fff", borderRadius: 16, marginBottom: 10, boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
            <button onClick={() => setAberto(aberto === i ? null : i)} style={{ width: "100%", padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-family)", textAlign: "left" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--cor-texto)", flex: 1, paddingRight: 12 }}>{faq.pergunta}</span>
              <ChevronDown size={16} color="var(--cor-texto-suave)" style={{ transform: aberto === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
            </button>
            {aberto === i && (
              <div style={{ padding: "0 18px 16px", fontSize: 13, color: "#555", fontWeight: 600, lineHeight: 1.6, borderTop: "1px solid var(--cor-borda-suave)", paddingTop: 12 }}>
                {faq.resposta}
              </div>
            )}
          </div>
        ))}
        <div style={{ background: "var(--cor-primaria-light)", borderRadius: 16, padding: 18, marginTop: 8, textAlign: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "var(--cor-primaria)", marginBottom: 4 }}>Ainda precisa de ajuda?</div>
          <div style={{ fontSize: 13, color: "var(--cor-texto-suave)", fontWeight: 600 }}>Ligue: (82) 3551-1234</div>
          <div style={{ fontSize: 12, color: "#B0A0A0", fontWeight: 600, marginTop: 2 }}>Seg–Sex, 7h às 18h</div>
        </div>
      </div>
    </SubTela>
  );
}
