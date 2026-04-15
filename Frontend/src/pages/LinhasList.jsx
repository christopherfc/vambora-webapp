import { useState, useEffect, useCallback } from "react";
import { Bus, Truck, Anchor, Search, ChevronRight, ArrowRight } from "lucide-react";
import { buscarLinhas, buscarEstatisticas } from "../services/api.js";

const CONFIG_TIPO = {
  onibus: { corFundo: "var(--cor-onibus-fundo)", corTexto: "#2471A3", label: "Ônibus",      Icone: Bus    },
  van:    { corFundo: "var(--cor-van-fundo)",    corTexto: "#1E8449", label: "Van",          Icone: Truck  },
  barco:  { corFundo: "var(--cor-barco-fundo)",  corTexto: "#1A5276", label: "Balsa/Barco", Icone: Anchor },
};

const CHIPS = [
  { valor: "todos",  label: "Todos"  },
  { valor: "onibus", label: "Ônibus" },
  { valor: "van",    label: "Van"    },
  { valor: "barco",  label: "Balsa"  },
];

const s = {
  container:   { minHeight: "100vh", background: "var(--cor-fundo)", fontFamily: "var(--font-family)", paddingBottom: 88 },
  header:      { background: "var(--cor-vinho-gradient)", padding: "32px 20px 44px", position: "relative", overflow: "hidden" },
  hBlob1:      { position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(254,138,0,0.15)", pointerEvents: "none" },
  hBlob2:      { position: "absolute", bottom: -40, left: "20%", width: 130, height: 130, borderRadius: "50%", background: "rgba(254,138,0,0.07)", pointerEvents: "none" },
  logo:        { fontSize: 30, fontWeight: 900, color: "var(--cor-primaria)", letterSpacing: "-1px", position: "relative" },
  logoSub:     { color: "var(--cor-primaria-soft)", fontWeight: 600, fontSize: 13, marginTop: 4, position: "relative" },
  statsRow:    { display: "flex", gap: 10, margin: "16px 16px 0", position: "relative" },
  statCard:    { flex: 1, background: "rgba(255,255,255,0.12)", borderRadius: 14, padding: "10px 12px", backdropFilter: "blur(8px)" },
  statVal:     { fontSize: 20, fontWeight: 900, color: "#fff" },
  statLbl:     { fontSize: 10, color: "var(--cor-primaria-soft)", fontWeight: 700, letterSpacing: 0.5, marginTop: 2 },

  body:        { padding: "20px 16px", maxWidth: 500, margin: "0 auto" },
  searchWrap:  { position: "relative", marginBottom: 14 },
  searchIco:   { position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex" },
  searchInput: { width: "100%", padding: "13px 16px 13px 42px", borderRadius: 14, border: "2px solid var(--cor-borda)", background: "#fff", fontSize: 14, fontFamily: "var(--font-family)", outline: "none", color: "#333", boxSizing: "border-box", transition: "border 0.2s" },

  filtros:     { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  chipAtivo:   { padding: "7px 18px", borderRadius: 999, background: "var(--cor-primaria)", color: "#fff", fontWeight: 800, fontSize: 13, border: "none", cursor: "pointer", fontFamily: "var(--font-family)" },
  chipInativo: { padding: "7px 18px", borderRadius: 999, background: "#fff", color: "var(--cor-vinho)", fontWeight: 700, fontSize: 13, border: "2px solid var(--cor-borda)", cursor: "pointer", fontFamily: "var(--font-family)" },

  secTitulo:   { fontSize: 12, fontWeight: 800, color: "var(--cor-texto-suave)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 },
  card:        { background: "#fff", borderRadius: 18, padding: "16px 18px", marginBottom: 12, boxShadow: "var(--shadow-md)", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", border: "2px solid transparent", transition: "all 0.18s" },
  cardHover:   { border: "2px solid var(--cor-primaria)", transform: "translateY(-2px)", boxShadow: "0 8px 24px rgba(254,138,0,0.14)" },
  icone:       { width: 50, height: 50, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  cardInfo:    { flex: 1, minWidth: 0 },
  cardNum:     { fontSize: 11, fontWeight: 800, color: "var(--cor-primaria)", letterSpacing: 1, textTransform: "uppercase" },
  cardNome:    { fontSize: 14, fontWeight: 800, color: "var(--cor-texto)", marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  cardRota:    { fontSize: 12, color: "var(--cor-texto-suave)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4, marginBottom: 4 },
  tag:         { display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 800, letterSpacing: 0.5 },
  tarifa:      { background: "var(--cor-primaria-light)", borderRadius: 12, padding: "8px 12px", textAlign: "center", flexShrink: 0 },
  tarifaVal:   { fontSize: 15, fontWeight: 900, color: "var(--cor-primaria)", display: "block" },
  tarifaLbl:   { fontSize: 10, color: "#C47A00", fontWeight: 700, letterSpacing: 0.3 },
  centralize:  { textAlign: "center", padding: "48px 0", color: "var(--cor-texto-claro)", fontSize: 14, fontWeight: 600, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },
  loading:     { display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 0", gap: 12, color: "var(--cor-primaria)", fontSize: 14, fontWeight: 800 },
};

export default function LinhasList({ onSelecionarLinha }) {
  const [linhas,     setLinhas]     = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca,      setBusca]      = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [hoverId,    setHoverId]    = useState(null);
  const [stats,      setStats]      = useState({ totalLinhas: "—", tiposModal: "—", tarifaMinima: "—" });

  useEffect(() => {
    buscarEstatisticas()
      .then(data => setStats(data))
      .catch(() => {});
  }, []);

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
        <div style={s.hBlob1} />
        <div style={s.hBlob2} />
        <div style={s.logo}>
          vam<span style={{ color: "#fff" }}>bora</span>
          <span style={{ color: "var(--cor-primaria-soft)" }}>.</span>
        </div>
        <div style={s.logoSub}>Conectando pessoas, movendo Penedo.</div>
        <div style={s.statsRow}>
          <div style={s.statCard}><div style={s.statVal}>{stats.totalLinhas}</div><div style={s.statLbl}>Linhas ativas</div></div>
          <div style={s.statCard}><div style={s.statVal}>{stats.tiposModal}</div><div style={s.statLbl}>Tipos de modal</div></div>
          <div style={s.statCard}><div style={s.statVal}>R${typeof stats.tarifaMinima === "number" ? stats.tarifaMinima.toFixed(2).replace(".", ",") : "—"}</div><div style={s.statLbl}>Tarifa mínima</div></div>
        </div>
      </div>

      <div style={s.body}>
        <div style={s.searchWrap}>
          <span style={s.searchIco}><Search size={16} color="#B0A0A0" strokeWidth={2.5} /></span>
          <input
            style={s.searchInput}
            placeholder="Buscar por linha, origem ou destino..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>

        <div style={s.filtros}>
          {CHIPS.map(chip => (
            <button key={chip.valor}
              style={filtroTipo === chip.valor ? s.chipAtivo : s.chipInativo}
              onClick={() => setFiltroTipo(chip.valor)}>
              {chip.label}
            </button>
          ))}
        </div>

        <div style={s.secTitulo}>
          {carregando ? "Buscando..." : `${linhas.length} linha${linhas.length !== 1 ? "s" : ""} disponíve${linhas.length !== 1 ? "is" : "l"}`}
        </div>

        {carregando && (
          <div style={s.loading}>
            <Bus size={32} color="var(--cor-primaria)" strokeWidth={1.5} />
            Carregando linhas...
          </div>
        )}

        {!carregando && linhas.length === 0 && (
          <div style={s.centralize}>
            <Search size={28} color="#D0C0C0" />
            Nenhuma linha encontrada.
          </div>
        )}

        {!carregando && linhas.map(linha => {
          const cfg   = CONFIG_TIPO[linha.tipoTransporte] || CONFIG_TIPO.onibus;
          const hover = hoverId === linha._id;
          return (
            <div key={linha._id}
              style={{ ...s.card, ...(hover ? s.cardHover : {}) }}
              onMouseEnter={() => setHoverId(linha._id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => onSelecionarLinha(linha)}>
              <div style={{ ...s.icone, background: cfg.corFundo }}>
                <cfg.Icone size={24} color={cfg.corTexto} strokeWidth={1.75} />
              </div>
              <div style={s.cardInfo}>
                <div style={s.cardNum}>Linha {linha.numero}</div>
                <div style={s.cardNome}>{linha.nome}</div>
                <div style={s.cardRota}>
                  {linha.origem}
                  <ArrowRight size={12} color="var(--cor-texto-claro)" strokeWidth={2.5} />
                  {linha.destino}
                </div>
                <span style={{ ...s.tag, background: cfg.corFundo, color: cfg.corTexto }}>
                  <cfg.Icone size={10} color={cfg.corTexto} strokeWidth={2} />
                  {cfg.label}
                </span>
              </div>
              <div style={s.tarifa}>
                <span style={s.tarifaVal}>R${linha.tarifa.toFixed(2)}</span>
                <span style={s.tarifaLbl}>tarifa</span>
              </div>
              <ChevronRight size={18} color="#D0C0C0" strokeWidth={2.5} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
