import { useState, useEffect } from "react";
import { buscarHorarios } from "../services/api.js";

const TABS = [
  { valor: "util",            label: "Dias Úteis",  emoji: "📅" },
  { valor: "sabado",          label: "Sábado",      emoji: "🌤️" },
  { valor: "domingo_feriado", label: "Dom/Feriado", emoji: "🌟" },
];

const CONFIG_TIPO = {
  onibus: { emoji: "🚌", label: "Ônibus"     },
  van:    { emoji: "🚐", label: "Van"         },
  barco:  { emoji: "⛵", label: "Balsa/Barco" },
};

const s = {
  container:  { minHeight: "100vh", background: "#FCFAFA", fontFamily: "'Nunito', sans-serif" },
  header:     { background: "linear-gradient(135deg, #612828 0%, #8B3A3A 100%)", padding: "20px 20px 28px", position: "relative", overflow: "hidden" },
  blob:       { position: "absolute", top: -40, right: -40, width: 150, height: 150, borderRadius: "50%", background: "rgba(254,138,0,0.14)", pointerEvents: "none" },
  blob2:      { position: "absolute", bottom: -20, left: "10%", width: 80, height: 80, borderRadius: "50%", background: "rgba(254,138,0,0.08)", pointerEvents: "none" },
  btnVoltar:  { background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, color: "#FFC886", fontWeight: 700, fontSize: 14, padding: "7px 14px", cursor: "pointer", marginBottom: 16, fontFamily: "'Nunito', sans-serif", display: "inline-flex", alignItems: "center", gap: 6, position: "relative" },
  titulo:     { fontSize: 22, fontWeight: 900, color: "#fff", position: "relative" },
  subtitulo:  { fontSize: 13, color: "#FFC886", fontWeight: 600, marginTop: 4, position: "relative" },
  infoBar:    { display: "flex", gap: 10, margin: "14px 16px 0" },
  infoCard:   { flex: 1, background: "#fff", borderRadius: 14, padding: "12px 10px", boxShadow: "0 2px 10px rgba(97,40,40,0.08)", textAlign: "center" },
  infoValor:  { fontSize: 17, fontWeight: 900, color: "#FE8A00" },
  infoLabel:  { fontSize: 10, color: "#9E7E7E", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 },
  body:       { padding: "20px 16px", maxWidth: 500, margin: "0 auto" },
  tabs:       { display: "flex", background: "#fff", borderRadius: 14, padding: 4, gap: 4, marginBottom: 20, boxShadow: "0 2px 10px rgba(97,40,40,0.06)" },
  tabAtiva:   { flex: 1, padding: "10px 4px", borderRadius: 11, background: "#FE8A00", color: "#fff", fontWeight: 800, fontSize: 12, border: "none", cursor: "pointer", fontFamily: "'Nunito', sans-serif" },
  tabInativa: { flex: 1, padding: "10px 4px", borderRadius: 11, background: "transparent", color: "#9E7E7E", fontWeight: 700, fontSize: 12, border: "none", cursor: "pointer", fontFamily: "'Nunito', sans-serif" },
  secTitulo:  { fontSize: 12, fontWeight: 800, color: "#9E7E7E", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 },
  grade:      { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 },
  chip:       { background: "#fff", borderRadius: 12, padding: "12px 6px", textAlign: "center", boxShadow: "0 2px 8px rgba(97,40,40,0.06)", border: "2px solid transparent", transition: "all 0.15s" },
  chipHover:  { border: "2px solid #FE8A00", background: "#FFF8F0", transform: "scale(1.03)" },
  horaTexto:  { fontSize: 18, fontWeight: 900, color: "#2D1515", letterSpacing: 0.5 },
  horaLabel:  { fontSize: 10, color: "#9E7E7E", fontWeight: 600, marginTop: 2 },
  vazio:      { textAlign: "center", padding: "32px 0", color: "#C4A0A0", fontSize: 14, background: "#fff", borderRadius: 14 },
  loading:    { textAlign: "center", padding: "48px 0", color: "#FE8A00", fontSize: 15, fontWeight: 800 },
  pagamento:  { background: "#fff", borderRadius: 16, padding: "16px 18px", boxShadow: "0 2px 10px rgba(97,40,40,0.07)", marginTop: 4 },
  pagTitulo:  { fontSize: 13, fontWeight: 800, color: "#612828", marginBottom: 10 },
  pagItem:    { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#444", fontWeight: 600, marginBottom: 6 },
  check:      { color: "#FE8A00", fontWeight: 900 },
};

export default function HorariosList({ linha, onVoltar }) {
  const [horarios,   setHorarios]   = useState({ util: [], sabado: [], domingo_feriado: [] });
  const [carregando, setCarregando] = useState(true);
  const [tabAtiva,   setTabAtiva]   = useState("util");
  const [hoverId,    setHoverId]    = useState(null);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      try {
        const dados = await buscarHorarios(linha._id);
        setHorarios(dados.horarios);
      } catch (e) {
        console.error(e);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [linha._id]);

  const horariosAtuais = horarios[tabAtiva] || [];
  const cfg = CONFIG_TIPO[linha.tipoTransporte] || CONFIG_TIPO.onibus;

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div style={s.blob} />
        <div style={s.blob2} />
        <button style={s.btnVoltar} onClick={onVoltar}>← Voltar</button>
        <div style={s.titulo}>Linha {linha.numero}</div>
        <div style={s.subtitulo}>{linha.origem} → {linha.destino}</div>
      </div>

      <div style={s.infoBar}>
        <div style={s.infoCard}>
          <div style={s.infoValor}>R${linha.tarifa.toFixed(2)}</div>
          <div style={s.infoLabel}>Tarifa</div>
        </div>
        <div style={s.infoCard}>
          <div style={s.infoValor}>{horarios.util.length}</div>
          <div style={s.infoLabel}>Viagens / dia útil</div>
        </div>
        <div style={s.infoCard}>
          <div style={{ ...s.infoValor, fontSize: 20 }}>{cfg.emoji}</div>
          <div style={s.infoLabel}>{cfg.label}</div>
        </div>
      </div>

      <div style={s.body}>
        <div style={s.tabs}>
          {TABS.map(tab => (
            <button
              key={tab.valor}
              style={tabAtiva === tab.valor ? s.tabAtiva : s.tabInativa}
              onClick={() => setTabAtiva(tab.valor)}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>

        <div style={s.secTitulo}>
          {carregando
            ? "Carregando..."
            : `${horariosAtuais.length} horário${horariosAtuais.length !== 1 ? "s" : ""}`}
        </div>

        {carregando && <div style={s.loading}>Carregando horários... ⏱️</div>}

        {!carregando && (
          horariosAtuais.length === 0
            ? <div style={s.vazio}>Sem horários para este dia. 😕</div>
            : (
              <div style={s.grade}>
                {horariosAtuais.map((h, i) => {
                  const [hora, min] = h.split(":");
                  const hover = hoverId === i;
                  return (
                    <div
                      key={i}
                      style={{ ...s.chip, ...(hover ? s.chipHover : {}) }}
                      onMouseEnter={() => setHoverId(i)}
                      onMouseLeave={() => setHoverId(null)}
                    >
                      <div style={s.horaTexto}>{hora}:{min}</div>
                      <div style={s.horaLabel}>partida</div>
                    </div>
                  );
                })}
              </div>
            )
        )}

        {!carregando && (
          <div style={s.pagamento}>
            <div style={s.pagTitulo}>💳 Formas de pagamento</div>
            {linha.infoPagamento.split(", ").map(forma => (
              <div key={forma} style={s.pagItem}>
                <span style={s.check}>✓</span> {forma}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
