import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SubTela from "../../components/SubTela.jsx";

const FAQS = [
  { p: "Como recarregar meu cartão de transporte?",     r: "Você pode recarregar na aba Saldo do aplicativo via Pix, ou nos pontos de recarga credenciados em Penedo." },
  { p: "Onde comprar o cartão Vambora Penedo?",          r: "O cartão pode ser solicitado na aba Saldo. Após o cadastro, ele será enviado ao endereço cadastrado no prazo de 5 dias úteis." },
  { p: "Com quanto tempo de antecedência devo chegar?", r: "Os horários exibidos são os horários de partida na origem. Recomendamos chegar 5 minutos antes do horário marcado." },
  { p: "A balsa aceita o cartão Vambora?",               r: "Sim! As balsas Penedo/Neópolis e a Balsa Turística aceitam o cartão Vambora e pagamento em dinheiro." },
  { p: "Como reportar um problema com uma linha?",       r: "Na tela de horários de cada linha há um botão para reportar problemas. Você também pode ligar para (82) 3551-1234." },
];

export default function CentralAjuda({ onVoltar }) {
  const [aberto, setAberto] = useState(null);
  return (
    <SubTela titulo="Central de Ajuda" subtitulo="Perguntas frequentes" onVoltar={onVoltar}>
      <div style={{ padding: "20px 16px" }}>
        {FAQS.map((faq, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 16, marginBottom: 10, boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
            <button onClick={() => setAberto(aberto === i ? null : i)} style={{ width: "100%", padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-family)", textAlign: "left" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--cor-texto)", flex: 1, paddingRight: 12 }}>{faq.p}</span>
              <ChevronDown size={16} color="var(--cor-texto-suave)" style={{ transform: aberto === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
            </button>
            {aberto === i && (
              <div style={{ padding: "0 18px 16px", fontSize: 13, color: "#555", fontWeight: 600, lineHeight: 1.6, borderTop: "1px solid var(--cor-borda-suave)", paddingTop: 12 }}>
                {faq.r}
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
