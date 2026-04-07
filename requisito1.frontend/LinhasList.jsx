import { useState, useEffect, useCallback } from "react";
import { buscarLinhas } from "../services/api.js";

const CONFIG_TIPO = {
  onibus: { emoji: "🚌", corFundo: "#E8F4FF", corTexto: "#2471A3", label: "Ônibus"     },
  van:    { emoji: "🚐", corFundo: "#E8FFF0", corTexto: "#1E8449", label: "Van"         },
  barco:  { emoji: "⛵", corFundo: "#EAF0FF", corTexto: "#1A5276", label: "Balsa/Barco" },
};

const CHIPS = [
  { valor: "todos",  label: "Todos"  },
  { valor: "onibus", label: "Ônibus" },
  { valor: "van",    label: "Van"    },
  { valor: "barco",  label: "Balsa"  },
];

const s = {
  container:  { minHeight: "100vh", background: "#FCFAFA", fontFamily: "'Nunito', sans-serif" },
  header:     { background: "linear-gradient(135deg, #612828 0%, #8B3A3A 100%)", padding: "28px 20px 40px", position: "relative", overflow: "hidden" },
  blob1:      { position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%", background: "rgba(254,138,0,0.15)", pointerEvents: "none" },
  blob2:      { position: "absolute", bottom: -40, left: "25%", width: 120, height: 120, borderRadius: "50%", background: "rgba(254,138,0,0.08)", pointerEvents: "none" },
  logo:       { fontSize: 30, fontWeight: 900, color: "#FE8A00", letterSpacing: "-1px", position: "relative" },
  logoSub:    { color: "#FFC886", fontWeight: 600, fontSize: 13, marginTop: 4, position: "relative" },
  body:       { padding: "20px 16px", maxWidth: 500, margin: "0 auto" },
  searchWrap: { position: "relative", marginBottom: 14 },
  searchIcon: { position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" },
  searchInput:{ width: "100%", padding: "12px 16px 12px 40px", borderRadius: 14, border: "2px solid #F0E8E8", background: "#fff", fontSize: 14, fontFamily: "'Nunito', sans-serif", outline: "none", color: "#333", boxSizing: "border-box", transition: "border 0.2s" },
  filtros:    { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  chipAtivo:  { padding: "7px 18px", borderRadius: 999, background: "#FE8A00", color: "#fff", fontWeight: 800, fontSize: 13, border: "none", cursor: "pointer", fontFamily: "'Nunito', sans-serif" },
  chipInativo:{ padding: "7px 18px", borderRadius: 999, background: "#fff", color: "#612828", fontWeight: 700, fontSize: 13, border: "2px solid #F0E8E8", cursor: "pointer", fontFamily: "'Nunito', sans-serif" },
  secTitulo:  { fontSize: 12, fontWeight: 800, color: "#9E7E7E", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 },
  card:       { background: "#fff", borderRadius: 18, padding: "16px 18px", marginBottom: 12, boxShadow: "0 2px 12px rgba(97,40,40,0.07)", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", border: "2px solid transparent", transition: "all 0.18s" },
  cardHover:  { border: "2px solid #FE8A00", transform: "translateY(-2px)", boxShadow: "0 8px 24px rgba(254,138,0,0.14)" },
  icone:      { width: 50, height: 50, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 },
  cardInfo:   { flex: 1, minWidth: 0 },
  cardNum:    { fontSize: 11, fontWeight: 800, color: "#FE8A00", letterSpacing: 1, textTransform: "uppercase" },
  cardNome:   { fontSize: 14, fontWeight: 800, color: "#2D1515", marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  cardRota:   { fontSize: 12, color: "#9E7E7E", fontWeight: 600 },
  tag:        { display: "inline-block", padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 800, marginTop: 4, letterSpacing: 0.5 },
  tarifa:     { background: "#FFF4E6", borderRadius: 12, padding: "8px 14px", textAlign: "center", flexShrink: 0 },
  tarifaVal:  { fontSize: 16, fontWeight: 900, color: "#FE8A00", display: "block" },
  tarifaLbl:  { fontSize: 10, color: "#C47A00", fontWeight: 700, letterSpacing: 0.3 },
  centralize: { textAlign: "center", padding: "48px 0", color: "#C4A0A0", fontSize: 14, fontWeight: 600 },
  loading:    { textAlign: "center", padding: "48px 0", color: "#FE8A00", fontSize: 15, fontWeight: 800 },
  seta:       { fontSize: 18, color: "#DDD", flexShrink: 0 },
};

export default function LinhasList({ onSelecionarLinha }) {
  const [linhas,     setLinhas]     = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca,      setBusca]      = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [hoverId,    setHoverId]    = useState(null);

  const carregarLinhas = useCallback(async () => {
    setCarregando(true);
    try {
      const tipo  = filtroTipo === "todos" ? "" : filtroTipo;
      const dados = await buscarLinhas(tipo, busca);
      setLinhas(dados.linhas);
    } catch (e) {
      console.error(e);
    } finally {
      setCarregando(false);
    }
  }, [filtroTipo, busca]);

  useEffect(() => {
    const delay = busca ? 400 : 0;
    const timer = setTimeout(carregarLinhas, delay);
    return () => clearTimeout(timer);
  }, [carregarLinhas]);

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div style={s.blob1} />
        <div style={s.blob2} />
        <div style={s.logo}>
          vam<span style={{ color: "#fff" }}>bora</span>
          <span style={{ color: "#FFC886" }}>.</span>
        </div>
        <div style={s.logoSub}>Conectando pessoas, movendo Penedo.</div>
      </div>

      <div style={s.body}>
        <div style={s.searchWrap}>
          <span style={s.searchIcon}>🔍</span>
          <input
            style={s.searchInput}
            placeholder="Buscar por linha, origem ou destino..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>

        <div style={s.filtros}>
          {CHIPS.map(chip => (
            <button
              key={chip.valor}
              style={filtroTipo === chip.valor ? s.chipAtivo : s.chipInativo}
              onClick={() => setFiltroTipo(chip.valor)}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <div style={s.secTitulo}>
          {carregando
            ? "Buscando..."
            : `${linhas.length} linha${linhas.length !== 1 ? "s" : ""} disponíve${linhas.length !== 1 ? "is" : "l"}`}
        </div>

        {carregando && <div style={s.loading}>Carregando linhas... 🚌</div>}

        {!carregando && linhas.length === 0 && (
          <div style={s.centralize}>Nenhuma linha encontrada. 🔍</div>
        )}

        {!carregando && linhas.map(linha => {
          const cfg   = CONFIG_TIPO[linha.tipoTransporte] || CONFIG_TIPO.onibus;
          const hover = hoverId === linha._id;
          return (
            <div
              key={linha._id}
              style={{ ...s.card, ...(hover ? s.cardHover : {}) }}
              onMouseEnter={() => setHoverId(linha._id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => onSelecionarLinha(linha)}
            >
              <div style={{ ...s.icone, background: cfg.corFundo }}>
                {cfg.emoji}
              </div>
              <div style={s.cardInfo}>
                <div style={s.cardNum}>Linha {linha.numero}</div>
                <div style={s.cardNome}>{linha.nome}</div>
                <div style={s.cardRota}>{linha.origem} → {linha.destino}</div>
                <span style={{ ...s.tag, background: cfg.corFundo, color: cfg.corTexto }}>
                  {cfg.label}
                </span>
              </div>
              <div style={s.tarifa}>
                <span style={s.tarifaVal}>R${linha.tarifa.toFixed(2)}</span>
                <span style={s.tarifaLbl}>tarifa</span>
              </div>
              <span style={s.seta}>›</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
