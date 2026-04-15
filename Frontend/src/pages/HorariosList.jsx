import { useState, useEffect } from "react";
import {
  ArrowLeft, ArrowRight, Bus, Truck, Anchor,
  Calendar, Sun, Star, Clock, CreditCard, Check,
} from "lucide-react";
import { buscarHorarios } from "../services/api.js";

const TABS = [
  { valor: "util",            label: "Dias Úteis",  Icone: Calendar },
  { valor: "sabado",          label: "Sábado",      Icone: Sun      },
  { valor: "domingo_feriado", label: "Dom/Feriado", Icone: Star     },
];

const CONFIG_TIPO = {
  onibus: { label: "Ônibus",      Icone: Bus    },
  van:    { label: "Van",          Icone: Truck  },
  barco:  { label: "Balsa/Barco", Icone: Anchor },
};

const s = {
  container:  { minHeight: "100vh", background: "var(--cor-fundo)", fontFamily: "var(--font-family)", paddingBottom: 88 },
  header:     { background: "var(--cor-vinho-gradient)", padding: "20px 20px 30px", position: "relative", overflow: "hidden" },
  blob:       { position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(254,138,0,0.13)", pointerEvents: "none" },
  blob2:      { position: "absolute", bottom: -20, left: "10%", width: 90, height: 90, borderRadius: "50%", background: "rgba(254,138,0,0.07)", pointerEvents: "none" },
  btnVoltar:  { background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 10, color: "var(--cor-primaria-soft)", fontWeight: 700, fontSize: 14, padding: "7px 14px", cursor: "pointer", marginBottom: 16, fontFamily: "var(--font-family)", display: "inline-flex", alignItems: "center", gap: 6, position: "relative" },
  titulo:     { fontSize: 22, fontWeight: 900, color: "#fff", position: "relative" },
  subtitulo:  { fontSize: 13, color: "var(--cor-primaria-soft)", fontWeight: 600, marginTop: 4, position: "relative", display: "flex", alignItems: "center", gap: 6 },

  infoBar:   { display: "flex", gap: 10, margin: "14px 16px 0" },
  infoCard:  { flex: 1, background: "#fff", borderRadius: 14, padding: "12px 10px", boxShadow: "0 2px 10px rgba(97,40,40,0.08)", textAlign: "center" },
  infoValor: { fontSize: 17, fontWeight: 900, color: "var(--cor-primaria)", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 },
  infoLabel: { fontSize: 10, color: "var(--cor-texto-suave)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 4 },

  body:       { padding: "20px 16px", maxWidth: 500, margin: "0 auto" },
  tabs:       { display: "flex", background: "#fff", borderRadius: 14, padding: 4, gap: 4, marginBottom: 20, boxShadow: "var(--shadow-sm)" },
  tabAtiva:   { flex: 1, padding: "10px 4px", borderRadius: 11, background: "var(--cor-primaria)", color: "#fff", fontWeight: 800, fontSize: 11, border: "none", cursor: "pointer", fontFamily: "var(--font-family)", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 },
  tabInativa: { flex: 1, padding: "10px 4px", borderRadius: 11, background: "transparent", color: "var(--cor-texto-suave)", fontWeight: 700, fontSize: 11, border: "none", cursor: "pointer", fontFamily: "var(--font-family)", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 },

  secTitulo: { fontSize: 12, fontWeight: 800, color: "var(--cor-texto-suave)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 },
  grade:     { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 },
  chip:      { background: "#fff", borderRadius: 12, padding: "12px 6px", textAlign: "center", boxShadow: "var(--shadow-sm)", border: "2px solid transparent", transition: "all 0.15s" },
  chipHover: { border: "2px solid var(--cor-primaria)", background: "#FFF8F0", transform: "scale(1.03)" },
  horaTexto: { fontSize: 18, fontWeight: 900, color: "var(--cor-texto)", letterSpacing: 0.5 },
  horaLabel: { fontSize: 10, color: "var(--cor-texto-suave)", fontWeight: 600, marginTop: 2 },

  vazio:    { textAlign: "center", padding: "32px 0", color: "var(--cor-texto-claro)", fontSize: 14, background: "#fff", borderRadius: 14 },
  loading:  { display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 0", gap: 12, color: "var(--cor-primaria)", fontSize: 14, fontWeight: 800 },

  pagamento: { background: "#fff", borderRadius: 16, padding: "16px 18px", boxShadow: "var(--shadow-md)", marginTop: 4 },
  pagTitulo: { fontSize: 13, fontWeight: 800, color: "var(--cor-vinho)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 },
  pagItem:   { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--cor-texto-body)", fontWeight: 600, marginBottom: 8 },
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
        <button style={s.btnVoltar} onClick={onVoltar}>
          <ArrowLeft size={16} strokeWidth={2.5} /> Voltar
        </button>
        <div style={s.titulo}>Linha {linha.numero}</div>
        <div style={s.subtitulo}>
          {linha.origem}
          <ArrowRight size={12} color="var(--cor-primaria-soft)" strokeWidth={2.5} style={{ opacity: 0.7 }} />
          {linha.destino}
        </div>
      </div>

      <div style={s.infoBar}>
        <div style={s.infoCard}>
          <div style={s.infoValor}>R${linha.tarifa.toFixed(2)}</div>
          <div style={s.infoLabel}>Tarifa</div>
        </div>
        <div style={s.infoCard}>
          <div style={s.infoValor}>{horarios.util.length}</div>
          <div style={s.infoLabel}>Viagens / útil</div>
        </div>
        <div style={s.infoCard}>
          <div style={s.infoValor}>
            <cfg.Icone size={18} color="var(--cor-primaria)" strokeWidth={1.75} />
          </div>
          <div style={s.infoLabel}>{cfg.label}</div>
        </div>
      </div>

      <div style={s.body}>
        <div style={s.tabs}>
          {TABS.map(tab => {
            const ativo = tabAtiva === tab.valor;
            return (
              <button key={tab.valor}
                style={ativo ? s.tabAtiva : s.tabInativa}
                onClick={() => setTabAtiva(tab.valor)}>
                <tab.Icone size={13} strokeWidth={2} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div style={s.secTitulo}>
          {carregando ? "Carregando..." : `${horariosAtuais.length} horário${horariosAtuais.length !== 1 ? "s" : ""}`}
        </div>

        {carregando && (
          <div style={s.loading}>
            <Clock size={32} color="var(--cor-primaria)" strokeWidth={1.5} />
            Carregando horários...
          </div>
        )}

        {!carregando && (
          horariosAtuais.length === 0
            ? <div style={s.vazio}>Sem horários para este dia.</div>
            : (
              <div style={s.grade}>
                {horariosAtuais.map((h, i) => {
                  const [hora, min] = h.split(":");
                  const hover = hoverId === i;
                  return (
                    <div key={i}
                      style={{ ...s.chip, ...(hover ? s.chipHover : {}) }}
                      onMouseEnter={() => setHoverId(i)}
                      onMouseLeave={() => setHoverId(null)}>
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
            <div style={s.pagTitulo}>
              <CreditCard size={16} color="var(--cor-vinho)" strokeWidth={2} />
              Formas de pagamento
            </div>
            {linha.infoPagamento.split(", ").map(forma => (
              <div key={forma} style={s.pagItem}>
                <Check size={14} color="var(--cor-primaria)" strokeWidth={2.5} /> {forma}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
