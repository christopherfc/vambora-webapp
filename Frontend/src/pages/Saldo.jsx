import { useState, useEffect } from "react";
import { Bus, Truck, Anchor, Zap, Plus, FileText, Send, ShieldCheck, X } from "lucide-react";
import QRCode from "qrcode";
import {
  buscarSaldo,
  buscarTransacoes,
  criarRecarga,
  criarSolicitacaoBeneficio,
  listarSolicitacoesBeneficio,
} from "../services/api.js";

const CONFIG_TIPO = {
  onibus:  { fundo: "var(--cor-onibus-fundo)", cor: "#2471A3", Icone: Bus    },
  barco:   { fundo: "var(--cor-barco-fundo)",  cor: "#1A5276", Icone: Anchor },
  van:     { fundo: "var(--cor-van-fundo)",    cor: "#1E8449", Icone: Truck  },
  recarga: { fundo: "var(--cor-sucesso-fundo)", cor: "#1E8449", Icone: Zap   },
};

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

function formatarTamanho(bytes = 0) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DocumentoPreview({ titulo, arquivo, url, onRemove }) {
  if (!arquivo || !url) return null;
  return (
    <div style={s.previewBox}>
      <img src={url} alt={`Previa ${titulo}`} style={s.previewImg} />
      <div style={s.previewInfo}>
        <div style={s.previewTitle}>{titulo}</div>
        <div style={s.fileHint}>{arquivo.name} | {formatarTamanho(arquivo.size)}</div>
      </div>
      <button type="button" style={s.previewRemove} onClick={onRemove} aria-label={`Remover ${titulo}`}>
        <X size={15} />
      </button>
    </div>
  );
}

// ─── Cartão Vambora ───────────────────────────────────────────────────────────
function CartaoVambora({ saldo, tipoCartao, numeroCartao }) {
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
          {(saldo ?? 0).toFixed(2).replace(".", ",")}
        </div>
      </div>

      {/* Linha inferior: número + tipo */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 18, position: "relative" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: 0.8, marginBottom: 3 }}>CARTÃO DE TRANSPORTE</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.75)", letterSpacing: 2.5, fontFamily: "monospace" }}>
            ••••  ••••  ••••  {numeroCartao || "----"}
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
  qrCard:       { margin: "14px 16px 0", background: "#fff", borderRadius: 16, padding: 16, boxShadow: "var(--shadow-sm)", textAlign: "center" },
  qrImg:        { width: 190, height: 190, margin: "8px auto", display: "block" },
  qrCodeText:   { fontSize: 13, fontWeight: 900, color: "var(--cor-vinho)", letterSpacing: 1 },
  recargaBox:   { display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "center" },
  recargaInput: { width: "100%", padding: "12px", borderRadius: 12, border: "1px solid var(--cor-borda)", fontFamily: "var(--font-family)", fontWeight: 800, boxSizing: "border-box" },
  erro:         { background: "var(--cor-erro-fundo)", color: "var(--cor-erro)", padding: 10, borderRadius: 10, fontSize: 13, fontWeight: 800 },
  sucesso:      { background: "var(--cor-sucesso-fundo)", color: "var(--cor-sucesso)", padding: 10, borderRadius: 10, fontSize: 13, fontWeight: 800 },
  beneficioBox: { margin: "14px 16px 0", background: "#fff", borderRadius: 16, padding: 16, boxShadow: "var(--shadow-sm)", display: "grid", gap: 10 },
  beneficioHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 },
  beneficioTitle: { display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 900, color: "var(--cor-vinho)" },
  beneficioStatus: { fontSize: 11, fontWeight: 900, color: "var(--cor-texto-suave)", textTransform: "uppercase" },
  field:        { display: "grid", gap: 5 },
  label:        { fontSize: 11, fontWeight: 900, color: "var(--cor-texto-suave)", textTransform: "uppercase" },
  input:        { width: "100%", padding: "12px", borderRadius: 12, border: "1px solid var(--cor-borda)", fontFamily: "var(--font-family)", fontWeight: 700, boxSizing: "border-box" },
  fileHint:     { fontSize: 11, color: "var(--cor-texto-suave)", fontWeight: 700 },
  previewBox:   { display: "grid", gridTemplateColumns: "74px 1fr auto", gap: 10, alignItems: "center", border: "1px solid var(--cor-borda)", borderRadius: 12, padding: 8, background: "var(--cor-borda-suave)" },
  previewImg:   { width: 74, height: 54, borderRadius: 8, objectFit: "cover", background: "#fff" },
  previewInfo:  { minWidth: 0 },
  previewTitle: { fontSize: 13, fontWeight: 900, color: "var(--cor-texto)" },
  previewRemove:{ width: 32, height: 32, border: "none", borderRadius: 10, background: "#fff", color: "var(--cor-erro)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
};

export default function Saldo() {
  const [tipoCartao,  setTipoCartao]  = useState("Comum");
  const [saldo,       setSaldo]       = useState(0);
  const [numeroCartao,setNumeroCartao]= useState("");
  const [qrSrc,       setQrSrc]       = useState("");
  const [valorRecarga,setValorRecarga]= useState("20");
  const [erroRecarga, setErroRecarga] = useState("");
  const [criandoRecarga, setCriandoRecarga] = useState(false);
  const [tipoSolicitado, setTipoSolicitado] = useState("Estudante");
  const [dadosBeneficio, setDadosBeneficio] = useState("");
  const [observacaoBeneficio, setObservacaoBeneficio] = useState("");
  const [documentoFrente, setDocumentoFrente] = useState(null);
  const [documentoVerso, setDocumentoVerso] = useState(null);
  const [documentoFrentePreview, setDocumentoFrentePreview] = useState("");
  const [documentoVersoPreview, setDocumentoVersoPreview] = useState("");
  const [solicitacoesBeneficio, setSolicitacoesBeneficio] = useState([]);
  const [msgBeneficio, setMsgBeneficio] = useState("");
  const [erroBeneficio, setErroBeneficio] = useState("");
  const [enviandoBeneficio, setEnviandoBeneficio] = useState(false);
  const [transacoes,  setTransacoes]  = useState([]);
  const [carregando,  setCarregando]  = useState(true);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      try {
        const [dadosSaldo, dadosTransacoes, dadosBeneficio] = await Promise.all([
          buscarSaldo(),
          buscarTransacoes(10),
          listarSolicitacoesBeneficio(),
        ]);
        setSaldo(dadosSaldo.saldo);
        if (dadosSaldo.cartao?.tipo) setTipoCartao(dadosSaldo.cartao.tipo);
        if (dadosSaldo.cartao?.numero) setNumeroCartao(dadosSaldo.cartao.numero);
        setTransacoes(dadosTransacoes.transacoes || []);
        setSolicitacoesBeneficio(dadosBeneficio.solicitacoes || []);
      } catch (e) {
        console.error(e);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  useEffect(() => {
    if (!numeroCartao) return;
    QRCode.toDataURL(numeroCartao, { margin: 1, width: 220 })
      .then(setQrSrc)
      .catch(() => setQrSrc(""));
  }, [numeroCartao]);

  useEffect(() => {
    if (!documentoFrente) {
      setDocumentoFrentePreview("");
      return;
    }
    const url = URL.createObjectURL(documentoFrente);
    setDocumentoFrentePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [documentoFrente]);

  useEffect(() => {
    if (!documentoVerso) {
      setDocumentoVersoPreview("");
      return;
    }
    const url = URL.createObjectURL(documentoVerso);
    setDocumentoVersoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [documentoVerso]);

  async function handleSolicitarBeneficio() {
    setMsgBeneficio("");
    setErroBeneficio("");
    if (!documentoFrente || !documentoVerso) {
      setErroBeneficio("Envie a foto da frente e do verso do documento.");
      return;
    }
    setEnviandoBeneficio(true);
    try {
      const formData = new FormData();
      formData.append("tipoSolicitado", tipoSolicitado);
      formData.append("dados", dadosBeneficio);
      formData.append("observacao", observacaoBeneficio);
      formData.append("documentoFrente", documentoFrente);
      formData.append("documentoVerso", documentoVerso);

      const data = await criarSolicitacaoBeneficio(formData);
      setSolicitacoesBeneficio([data.solicitacao, ...solicitacoesBeneficio]);
      setDadosBeneficio("");
      setObservacaoBeneficio("");
      setDocumentoFrente(null);
      setDocumentoVerso(null);
      setDocumentoFrentePreview("");
      setDocumentoVersoPreview("");
      setMsgBeneficio(data.mensagem || "Solicitacao enviada.");
    } catch (error) {
      setErroBeneficio(error.message);
    } finally {
      setEnviandoBeneficio(false);
    }
  }

  async function handleRecarga() {
    setErroRecarga("");
    setCriandoRecarga(true);
    try {
      const valor = Number(String(valorRecarga).replace(",", "."));
      const data = await criarRecarga(valor);
      if (data.recarga?.checkoutUrl) {
        window.location.href = data.recarga.checkoutUrl;
      } else {
        setErroRecarga("Nao foi possivel abrir o link de pagamento.");
      }
    } catch (error) {
      setErroRecarga(error.message);
    } finally {
      setCriandoRecarga(false);
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

  const solicitacaoPendente = solicitacoesBeneficio.find((s) => s.status === "PENDENTE");
  const ultimaSolicitacao = solicitacoesBeneficio[0];

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div style={s.blob1} />
        <div style={s.headerLabel}>Cartão de Transporte</div>
        <div style={s.headerTitulo}>Meu Saldo</div>
      </div>

      <CartaoVambora saldo={saldo} tipoCartao={tipoCartao} numeroCartao={numeroCartao} />

      <div style={s.qrCard}>
        <div style={s.secLabel}>QR Code do cartao</div>
        {qrSrc && <img src={qrSrc} alt="QR Code do cartao" style={s.qrImg} />}
        <div style={s.qrCodeText}>{numeroCartao}</div>
      </div>

      <div style={s.beneficioBox}>
        <div style={s.beneficioHeader}>
          <div style={s.beneficioTitle}><ShieldCheck size={17} /> Beneficio do cartao</div>
          <div style={s.beneficioStatus}>Atual: {tipoCartao}</div>
        </div>
        {solicitacaoPendente ? (
          <div style={s.sucesso}>Solicitacao de {solicitacaoPendente.tipoSolicitado} pendente de analise.</div>
        ) : (
          <>
            <label style={s.field}>
              <span style={s.label}>Categoria solicitada</span>
              <select style={s.input} value={tipoSolicitado} onChange={(e) => setTipoSolicitado(e.target.value)}>
                <option value="Estudante">Estudante</option>
                <option value="Idoso">Idoso</option>
              </select>
            </label>
            <label style={s.field}>
              <span style={s.label}>{tipoSolicitado === "Estudante" ? "Instituicao e matricula" : "Data de nascimento ou documento"}</span>
              <input
                style={s.input}
                value={dadosBeneficio}
                onChange={(e) => setDadosBeneficio(e.target.value)}
                placeholder={tipoSolicitado === "Estudante" ? "Ex: UFAL, matricula 20260001" : "Ex: Nascimento 10/05/1950"}
              />
            </label>
            <label style={s.field}>
              <span style={s.label}>Observacao</span>
              <textarea
                rows={3}
                style={s.input}
                value={observacaoBeneficio}
                onChange={(e) => setObservacaoBeneficio(e.target.value)}
                placeholder="Informacoes adicionais para o admin"
              />
            </label>
            <label style={s.field}>
              <span style={s.label}>Documento - frente</span>
              <input
                style={s.input}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setDocumentoFrente(e.target.files?.[0] || null)}
              />
              <span style={s.fileHint}>JPG, PNG ou WEBP ate 2MB.</span>
              <DocumentoPreview
                titulo="Frente do documento"
                arquivo={documentoFrente}
                url={documentoFrentePreview}
                onRemove={() => setDocumentoFrente(null)}
              />
            </label>
            <label style={s.field}>
              <span style={s.label}>Documento - verso</span>
              <input
                style={s.input}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setDocumentoVerso(e.target.files?.[0] || null)}
              />
              <span style={s.fileHint}>JPG, PNG ou WEBP ate 2MB.</span>
              <DocumentoPreview
                titulo="Verso do documento"
                arquivo={documentoVerso}
                url={documentoVersoPreview}
                onRemove={() => setDocumentoVerso(null)}
              />
            </label>
            <button style={s.btn(true)} onClick={handleSolicitarBeneficio} disabled={enviandoBeneficio}>
              <Send size={15} strokeWidth={2.5} /> Solicitar analise
            </button>
          </>
        )}
        {ultimaSolicitacao && ultimaSolicitacao.status !== "PENDENTE" && (
          <div style={ultimaSolicitacao.status === "APROVADA" ? s.sucesso : s.erro}>
            Ultima solicitacao: {ultimaSolicitacao.status.toLowerCase()}{ultimaSolicitacao.respostaAdmin ? ` - ${ultimaSolicitacao.respostaAdmin}` : ""}
          </div>
        )}
        {msgBeneficio && <div style={s.sucesso}>{msgBeneficio}</div>}
        {erroBeneficio && <div style={s.erro}>{erroBeneficio}</div>}
      </div>

      <div style={s.acoes}>
        <div style={s.botoesRow}>
          <button style={s.btn(true)} onClick={handleRecarga} disabled={criandoRecarga}>
            <Plus size={15} strokeWidth={2.5} /> Recarregar
          </button>
          <button style={s.btn(false)}>
            <FileText size={15} strokeWidth={2} /> Extrato
          </button>
        </div>
        <div style={s.recargaBox}>
          <input
            style={s.recargaInput}
            type="number"
            min="1"
            max="100"
            step="1"
            value={valorRecarga}
            onChange={(e) => setValorRecarga(e.target.value)}
            placeholder="Valor de R$1 a R$100"
          />
          <span style={{ fontSize: 12, fontWeight: 900, color: "var(--cor-texto-suave)" }}>R$1-R$100</span>
        </div>
        {erroRecarga && <div style={s.erro}>{erroRecarga}</div>}
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
