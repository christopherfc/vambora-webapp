import { useState, useEffect } from "react";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";
import { buscarNotificacoes, marcarNotificacaoLida } from "../services/api.js";

const CONFIG_TIPO = {
  alerta:  { fundo: "var(--cor-alerta-fundo)", cor: "var(--cor-alerta)", Icone: AlertTriangle  },
  info:    { fundo: "var(--cor-info-fundo)",    cor: "var(--cor-info)",   Icone: Info           },
  sucesso: { fundo: "var(--cor-sucesso-fundo)", cor: "var(--cor-sucesso)", Icone: CheckCircle   },
};

function formatarData(dataISO) {
  const data = new Date(dataISO);
  const agora = new Date();
  const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const ontem = new Date(hoje);
  ontem.setDate(ontem.getDate() - 1);
  const dataObj = new Date(data.getFullYear(), data.getMonth(), data.getDate());

  const hhmm = `${String(data.getHours()).padStart(2, "0")}:${String(data.getMinutes()).padStart(2, "0")}`;

  if (dataObj.getTime() === hoje.getTime()) return `Hoje, ${hhmm}`;
  if (dataObj.getTime() === ontem.getTime()) return `Ontem, ${hhmm}`;
  return `${String(data.getDate()).padStart(2, "0")}/${String(data.getMonth() + 1).padStart(2, "0")}, ${hhmm}`;
}

const s = {
  container:    { minHeight: "100vh", background: "var(--cor-fundo)", fontFamily: "var(--font-family)", paddingBottom: 80 },
  header:       { background: "var(--cor-vinho-gradient)", padding: "28px 20px", position: "relative", overflow: "hidden" },
  blob1:        { position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(254,138,0,0.12)", pointerEvents: "none" },
  headerTitulo: { fontSize: 22, fontWeight: 900, color: "#fff", position: "relative" },
  headerSub:    { fontSize: 13, color: "var(--cor-primaria-soft)", fontWeight: 600, marginTop: 4, position: "relative" },

  body:      { padding: "16px" },
  secLabel:  { fontSize: 12, fontWeight: 800, color: "var(--cor-texto-suave)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12, marginTop: 8 },
  card:      { background: "#fff", borderRadius: 16, padding: "14px 16px", marginBottom: 10, boxShadow: "var(--shadow-sm)", display: "flex", gap: 14, alignItems: "flex-start", position: "relative" },
  cardNova:  { borderLeft: "3px solid var(--cor-primaria)" },
  icone:     { width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 },
  info:      { flex: 1 },
  titulo:    { fontSize: 14, fontWeight: 800, color: "var(--cor-texto)", marginBottom: 4 },
  descricao: { fontSize: 12, color: "#666", fontWeight: 600, lineHeight: 1.5, marginBottom: 6 },
  data:      { fontSize: 11, color: "#B0A0A0", fontWeight: 600 },
  badge:     { position: "absolute", top: 14, right: 14, width: 8, height: 8, borderRadius: "50%", background: "var(--cor-primaria)" },
  loading:   { textAlign: "center", padding: "48px 0", color: "var(--cor-primaria)", fontSize: 14, fontWeight: 800 },
};

export default function Notificacoes({ onAtualizar }) {
  const [notifs,     setNotifs]     = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const data = await buscarNotificacoes();
        setNotifs(data.notificacoes || []);
      } catch (e) {
        console.error(e);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  const naoLidas = notifs.filter(n => !n.lida);
  const lidas    = notifs.filter(n => n.lida);

  async function marcarLida(id) {
    setNotifs(prev => prev.map(n => n._id === id ? { ...n, lida: true } : n));
    try {
      await marcarNotificacaoLida(id);
      onAtualizar?.();
    } catch (e) {
      console.error(e);
    }
  }

  function renderCard(n) {
    const cfg = CONFIG_TIPO[n.tipo];
    return (
      <div key={n._id}
        style={{ ...s.card, ...(n.lida ? {} : s.cardNova) }}
        onClick={() => marcarLida(n._id)}>
        <div style={{ ...s.icone, background: cfg.fundo }}>
          <cfg.Icone size={20} color={cfg.cor} strokeWidth={1.75} />
        </div>
        <div style={s.info}>
          <div style={s.titulo}>{n.titulo}</div>
          <div style={s.descricao}>{n.descricao}</div>
          <div style={s.data}>{formatarData(n.data)}</div>
        </div>
        {!n.lida && <div style={s.badge} />}
      </div>
    );
  }

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div style={s.blob1} />
        <div style={s.headerTitulo}>Avisos</div>
        <div style={s.headerSub}>
          {carregando
            ? "Carregando..."
            : naoLidas.length > 0
              ? `${naoLidas.length} nova${naoLidas.length > 1 ? "s" : ""} notificaç${naoLidas.length > 1 ? "ões" : "ão"}`
              : "Tudo em dia por aqui"}
        </div>
      </div>
      <div style={s.body}>
        {carregando && <div style={s.loading}>Carregando notificações...</div>}
        {!carregando && naoLidas.length > 0 && <><div style={s.secLabel}>Novas</div>{naoLidas.map(renderCard)}</>}
        {!carregando && lidas.length > 0    && <><div style={s.secLabel}>Anteriores</div>{lidas.map(renderCard)}</>}
      </div>
    </div>
  );
}
