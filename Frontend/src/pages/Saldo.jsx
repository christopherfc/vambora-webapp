import { useState, useEffect } from "react";
import { Bus, Truck, Anchor, Zap, Plus, FileText } from "lucide-react";
import { buscarSaldo, buscarTransacoes, alterarTipoCartao } from "../services/api.js";

const CONFIG_TIPO = {
  onibus:  { fundo: "var(--cor-onibus-fundo)", cor: "#2471A3", Icone: Bus    },
  barco:   { fundo: "var(--cor-barco-fundo)",  cor: "#1A5276", Icone: Anchor },
  van:     { fundo: "var(--cor-van-fundo)",    cor: "#1E8449", Icone: Truck  },
  recarga: { fundo: "var(--cor-sucesso-fundo)", cor: "#1E8449", Icone: Zap   },
};

const TIPOS_CARTAO = ["Comum", "Estudante", "Idoso"];

// ─── Ícone de chip de cartão ──────────────────────────────────────────────────
function Chip() {
  return (
    <div style={{ width: 42, height: 32, background: "linear-gradient(135deg,#C8922A,#F0CA60,#C8922A)", borderRadius: 7, boxShadow: "inset 0 1px 4px rgba(255,255,255,0.45), 0 2px 8px rgba(0,0,0,0.5)", padding: "4px 5px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ display: "flex", gap: 3 }}>
        <div style={{ flex: 1, height: 3, background: "rgba(100,60,0,0.35)", borderRadius: 1 }} />
        <div style={{ flex: 1, height: 3, background: "rgba(100,60,0,0.35)", borderRadius: 1 }} />
      </div>
      <div style={{ height: 3, background: "rgba(100,60,0,0.3)", borderRadius: 1 }} />
      <div style={{ display: "flex", gap: 3 }}>
        <div style={{ flex: 1, height: 3, background: "rgba(100,60,0,0.35)", borderRadius: 1 }} />
        <div style={{ flex: 1, height: 3, background: "rgba(100,60,0,0.35)", borderRadius: 1 }} />
      </div>
    </div>
  );
}

// ─── Ícone contactless ────────────────────────────────────────────────────────
function Contactless() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path d="M4 13 Q13 3 22 13"  stroke="rgba(255,255,255,0.55)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <path d="M7.5 16 Q13 8 18.5 16" stroke="rgba(255,255,255,0.7)"  strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <path d="M11 18.5 Q13 15 15 18.5" stroke="rgba(255,255,255,0.85)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <circle cx="13" cy="21" r="1.6" fill="rgba(255,255,255,0.9)"/>
    </svg>
  );
}

// ─── Helpers de formatação de data ────────────────────────────────────────────
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

// ─── Cartão Vambora ───────────────────────────────────────────────────────────
function CartaoVambora({ saldo, tipoCartao }) {
  return (
    <div style={{
      margin: "0 16px",
      marginTop: -30,
      borderRadius: 22,
      position: "relative",
      zIndex: 2,
      overflow: "hidden",
      background: "linear-gradient(140deg, #1C0404 0%, #4A1414 35%, #7A2828 65%, #963232 100%)",
      boxShadow: "0 16px 48px rgba(30,0,0,0.45), 0 4px 12px rgba(0,0,0,0.3)",
      padding: "22px 22px 20px",
      minHeight: 196,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}>

      {/* Círculos decorativos */}
      <div style={{ position: "absolute", top: -40, right: -40, width: 170, height: 170, borderRadius: "50%", background: "rgba(254,138,0,0.12)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -50, left: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(254,138,0,0.08)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "30%", right: "25%", width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

      {/* Linha superior: chip + logo + contactless */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative" }}>
        <Chip />
        <div style={{ textAlign: "center", lineHeight: 1 }}>
          <span style={{ fontSize: 15, fontWeight: 900, color: "var(--cor-primaria)", letterSpacing: -0.5 }}>vam</span>
          <span style={{ fontSize: 15, fontWeight: 900, color: "#fff",    letterSpacing: -0.5 }}>bora</span>
          <span style={{ fontSize: 15, fontWeight: 900, color: "var(--cor-primaria)"                      }}>.</span>
          <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: 1.5, textTransform: "uppercase", marginTop: 2 }}>penedo</div>
        </div>
        <Contactless />
      </div>

      {/* Saldo */}
      <div style={{ position: "relative", marginTop: 18 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,200,134,0.8)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>Saldo disponível</div>
        <div style={{ fontSize: 34, fontWeight: 900, color: "#fff", letterSpacing: -1, lineHeight: 1 }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: "rgba(255,255,255,0.7)", verticalAlign: "super", marginRight: 2 }}>R$</span>
          {saldo.toFixed(2).replace(".", ",")}
        </div>
      </div>

      {/* Linha inferior: número + tipo */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 18, position: "relative" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: 0.8, marginBottom: 3 }}>CARTÃO DE TRANSPORTE</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.75)", letterSpacing: 2.5, fontFamily: "monospace" }}>
            ••••  ••••  ••••  4281
          </div>
        </div>
        <div style={{ background: "rgba(254,138,0,0.25)", border: "1px solid rgba(254,138,0,0.5)", borderRadius: 8, padding: "4px 10px" }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "var(--cor-primaria-soft)", letterSpacing: 0.5 }}>{tipoCartao.toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
}

const s = {
  container:    { minHeight: "100vh", background: "var(--cor-fundo)", fontFamily: "var(--font-family)", paddingBottom: 80 },
  header:       { background: "var(--cor-vinho-gradient)", padding: "28px 20px 52px", position: "relative", overflow: "hidden" },
  blob1:        { position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(254,138,0,0.13)", pointerEvents: "none" },
  headerLabel:  { fontSize: 12, fontWeight: 700, color: "var(--cor-primaria-soft)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4, position: "relative" },
  headerTitulo: { fontSize: 24, fontWeight: 900, color: "#fff", position: "relative" },

  acoes:        { margin: "14px 16px 0", background: "#fff", borderRadius: 16, padding: "14px 16px", boxShadow: "0 2px 12px rgba(97,40,40,0.08)", display: "flex", flexDirection: "column", gap: 12 },
  chipRow:      { display: "flex", gap: 8 },
  chipCartao:   (ativo) => ({ padding: "6px 16px", borderRadius: 999, background: ativo ? "var(--cor-primaria)" : "var(--cor-borda-suave)", color: ativo ? "#fff" : "var(--cor-texto-suave)", fontSize: 12, fontWeight: 800, border: "none", cursor: "pointer", fontFamily: "var(--font-family)", transition: "all 0.15s" }),
  botoesRow:    { display: "flex", gap: 10 },
  btn:          (primary) => ({ flex: 1, padding: "12px", borderRadius: 12, fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "var(--font-family)", border: "none", background: primary ? "var(--cor-primaria)" : "var(--cor-borda-suave)", color: primary ? "#fff" : "var(--cor-vinho)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }),

  body:         { padding: "20px 16px" },
  secLabel:     { fontSize: 12, fontWeight: 800, color: "var(--cor-texto-suave)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 },
  card:         { background: "#fff", borderRadius: 16, padding: "14px 16px", marginBottom: 10, boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", gap: 14 },
  icone:        { width: 42, height: 42, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  info:         { flex: 1, minWidth: 0 },
  infoNome:     { fontSize: 13, fontWeight: 700, color: "var(--cor-texto)", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  infoData:     { fontSize: 11, color: "var(--cor-texto-suave)", fontWeight: 600 },
  valor:        (pos) => ({ fontSize: 15, fontWeight: 900, color: pos ? "var(--cor-sucesso)" : "var(--cor-texto)", flexShrink: 0 }),
  loading:      { textAlign: "center", padding: "48px 0", color: "var(--cor-primaria)", fontSize: 14, fontWeight: 800 },
};

export default function Saldo() {
  const [tipoCartao,  setTipoCartao]  = useState("Comum");
  const [saldo,       setSaldo]       = useState(0);
  const [transacoes,  setTransacoes]  = useState([]);
  const [carregando,  setCarregando]  = useState(true);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      try {
        const [dadosSaldo, dadosTransacoes] = await Promise.all([
          buscarSaldo(),
          buscarTransacoes(10),
        ]);
        setSaldo(dadosSaldo.saldo);
        if (dadosSaldo.cartao?.tipo) setTipoCartao(dadosSaldo.cartao.tipo);
        setTransacoes(dadosTransacoes.transacoes || []);
      } catch (e) {
        console.error(e);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  async function handleTipoCartao(tipo) {
    setTipoCartao(tipo);
    try {
      await alterarTipoCartao(tipo);
    } catch (e) {
      console.error(e);
    }
  }

  if (carregando) {
    return (
      <div style={s.container}>
        <div style={s.header}>
          <div style={s.blob1} />
          <div style={s.headerLabel}>Cartão de Transporte</div>
          <div style={s.headerTitulo}>Meu Saldo</div>
        </div>
        <div style={s.loading}>Carregando...</div>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div style={s.blob1} />
        <div style={s.headerLabel}>Cartão de Transporte</div>
        <div style={s.headerTitulo}>Meu Saldo</div>
      </div>

      <CartaoVambora saldo={saldo} tipoCartao={tipoCartao} />

      <div style={s.acoes}>
        <div style={s.chipRow}>
          {TIPOS_CARTAO.map(t => (
            <button key={t} style={s.chipCartao(tipoCartao === t)} onClick={() => handleTipoCartao(t)}>{t}</button>
          ))}
        </div>
        <div style={s.botoesRow}>
          <button style={s.btn(true)}>
            <Plus size={15} strokeWidth={2.5} /> Recarregar
          </button>
          <button style={s.btn(false)}>
            <FileText size={15} strokeWidth={2} /> Extrato
          </button>
        </div>
      </div>

      <div style={s.body}>
        <div style={s.secLabel}>Últimas transações</div>
        {transacoes.map(t => {
          const cfg = CONFIG_TIPO[t.tipo] || CONFIG_TIPO.onibus;
          const pos = t.valor > 0;
          return (
            <div key={t._id} style={s.card}>
              <div style={{ ...s.icone, background: cfg.fundo }}>
                <cfg.Icone size={18} color={cfg.cor} strokeWidth={1.75} />
              </div>
              <div style={s.info}>
                <div style={s.infoNome}>{t.descricao}</div>
                <div style={s.infoData}>{formatarData(t.data)}</div>
              </div>
              <div style={s.valor(pos)}>
                {pos ? "+" : ""}R${Math.abs(t.valor).toFixed(2).replace(".", ",")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
