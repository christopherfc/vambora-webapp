import { useState } from "react";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";

const NOTIFICACOES = [
  { id: 1, tipo: "alerta",  titulo: "Linha 7 com horário alterado",  descricao: "A Balsa Penedo / Neópolis terá horários reduzidos neste final de semana devido à manutenção.", data: "Hoje, 09:15",   lida: false },
  { id: 2, tipo: "info",    titulo: "Nova linha disponível",          descricao: "A Linha 8 — Balsa Turística Rio São Francisco está disponível a partir de hoje.",              data: "Hoje, 07:00",   lida: false },
  { id: 3, tipo: "sucesso", titulo: "Recarga confirmada",             descricao: "Sua recarga de R$20,00 foi processada com sucesso e já está disponível no seu saldo.",          data: "Ontem, 19:42",  lida: true  },
  { id: 4, tipo: "alerta",  titulo: "Atenção: Linha 3 suspensa",      descricao: "A Linha 3 — Santa Luzia / Terminal estará suspensa amanhã por conta de obras na via.",         data: "Ontem, 14:00",  lida: true  },
  { id: 5, tipo: "info",    titulo: "Tarifa reajustada",              descricao: "A partir de 01/08, a tarifa das linhas de ônibus municipais passará para R$3,70.",             data: "10/07, 08:00",  lida: true  },
  { id: 6, tipo: "sucesso", titulo: "Cadastro realizado com sucesso", descricao: "Bem-vindo ao Vambora Penedo! Seu cartão de transporte já está ativo.",                         data: "08/07, 10:30",  lida: true  },
];

const CONFIG_TIPO = {
  alerta:  { fundo: "var(--cor-alerta-fundo)", cor: "var(--cor-alerta)", Icone: AlertTriangle  },
  info:    { fundo: "var(--cor-info-fundo)",    cor: "var(--cor-info)",   Icone: Info           },
  sucesso: { fundo: "var(--cor-sucesso-fundo)", cor: "var(--cor-sucesso)", Icone: CheckCircle   },
};

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
};

export default function Notificacoes() {
  const [notifs, setNotifs] = useState(NOTIFICACOES);

  const naoLidas = notifs.filter(n => !n.lida);
  const lidas    = notifs.filter(n => n.lida);

  function marcarLida(id) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
  }

  function renderCard(n) {
    const cfg = CONFIG_TIPO[n.tipo];
    return (
      <div key={n.id}
        style={{ ...s.card, ...(n.lida ? {} : s.cardNova) }}
        onClick={() => marcarLida(n.id)}>
        <div style={{ ...s.icone, background: cfg.fundo }}>
          <cfg.Icone size={20} color={cfg.cor} strokeWidth={1.75} />
        </div>
        <div style={s.info}>
          <div style={s.titulo}>{n.titulo}</div>
          <div style={s.descricao}>{n.descricao}</div>
          <div style={s.data}>{n.data}</div>
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
          {naoLidas.length > 0
            ? `${naoLidas.length} nova${naoLidas.length > 1 ? "s" : ""} notificaç${naoLidas.length > 1 ? "ões" : "ão"}`
            : "Tudo em dia por aqui"}
        </div>
      </div>
      <div style={s.body}>
        {naoLidas.length > 0 && <><div style={s.secLabel}>Novas</div>{naoLidas.map(renderCard)}</>}
        {lidas.length > 0    && <><div style={s.secLabel}>Anteriores</div>{lidas.map(renderCard)}</>}
      </div>
    </div>
  );
}
