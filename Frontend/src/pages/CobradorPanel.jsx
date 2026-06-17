import { useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, CreditCard, RefreshCw, StopCircle, XCircle } from "lucide-react";
import { cobradorCobrar, cobradorConsultarCobranca, cobradorListarLinhas } from "../services/api.js";

const READER_ID = "qr-reader-cobrador";

const s = {
  page: { minHeight: "100vh", background: "var(--cor-fundo)", fontFamily: "var(--font-family)", paddingBottom: 84 },
  header: { background: "var(--cor-vinho-gradient)", padding: "30px 20px 26px", color: "#fff" },
  title: { fontSize: 24, fontWeight: 900 },
  sub: { color: "var(--cor-primaria-soft)", fontSize: 13, fontWeight: 700, marginTop: 4 },
  body: { maxWidth: 520, margin: "0 auto", padding: 16 },
  panel: { background: "#fff", borderRadius: 10, padding: 16, boxShadow: "var(--shadow-sm)", marginBottom: 14 },
  label: { fontSize: 11, fontWeight: 900, color: "var(--cor-texto-suave)", textTransform: "uppercase", marginBottom: 6 },
  input: { width: "100%", border: "1px solid var(--cor-borda)", borderRadius: 8, padding: "12px", fontFamily: "var(--font-family)", fontWeight: 800, boxSizing: "border-box" },
  btn: (kind = "primary") => ({ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, border: "none", borderRadius: 10, padding: "14px", background: kind === "danger" ? "var(--cor-erro)" : kind === "ghost" ? "var(--cor-borda-suave)" : "var(--cor-primaria)", color: kind === "ghost" ? "var(--cor-vinho)" : "#fff", fontWeight: 900, cursor: "pointer", fontFamily: "var(--font-family)", marginTop: 10 }),
  reader: { width: "100%", minHeight: 260, borderRadius: 10, overflow: "hidden", background: "var(--cor-borda-suave)", marginTop: 10 },
  msg: (ok) => ({ background: ok ? "var(--cor-sucesso-fundo)" : "var(--cor-erro-fundo)", color: ok ? "var(--cor-sucesso)" : "var(--cor-erro)", borderRadius: 10, padding: 12, fontSize: 13, fontWeight: 800, marginTop: 10 }),
  summary: { border: "1px solid var(--cor-borda)", borderRadius: 10, padding: 12, marginTop: 12 },
  row: { display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--cor-borda-suave)", fontSize: 13 },
  rowLabel: { color: "var(--cor-texto-suave)", fontWeight: 800 },
  rowValue: { color: "var(--cor-texto)", fontWeight: 900, textAlign: "right" },
};

export default function CobradorPanel() {
  const [linhas, setLinhas] = useState([]);
  const [linhaId, setLinhaId] = useState("");
  const [codigo, setCodigo] = useState("");
  const [lendo, setLendo] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [resumo, setResumo] = useState(null);
  const scannerRef = useRef(null);
  const processandoRef = useRef(false);

  async function carregarLinhas() {
    const data = await cobradorListarLinhas();
    setLinhas(data.linhas || []);
    if (!linhaId && data.linhas?.[0]) setLinhaId(String(data.linhas[0].id));
  }

  useEffect(() => {
    carregarLinhas().catch((error) => setResultado({ ok: false, texto: error.message }));
    return () => pararLeitura();
  }, []);

  async function consultar(valorCodigo = codigo) {
    if (processandoRef.current) return;
    processandoRef.current = true;
    setResultado(null);
    setResumo(null);
    try {
      const data = await cobradorConsultarCobranca({ linhaId: Number(linhaId), codigo: String(valorCodigo).trim() });
      setResumo(data.cobranca);
    } catch (error) {
      setResultado({ ok: false, texto: error.message });
    } finally {
      setTimeout(() => { processandoRef.current = false; }, 800);
    }
  }

  async function confirmarCobranca() {
    if (processandoRef.current || !resumo) return;
    processandoRef.current = true;
    setResultado(null);
    try {
      const data = await cobradorCobrar({ linhaId: Number(linhaId), codigo: String(codigo).trim() });
      setCodigo("");
      setResumo(null);
      setResultado({ ok: true, texto: `${data.mensagem}. ${data.passageiro.nome} - saldo R$${Number(data.saldo).toFixed(2)}` });
    } catch (error) {
      setResultado({ ok: false, texto: error.message });
    } finally {
      setTimeout(() => { processandoRef.current = false; }, 1200);
    }
  }

  async function iniciarLeitura() {
    if (!linhaId) {
      setResultado({ ok: false, texto: "Selecione uma linha antes de ler o QR Code." });
      return;
    }
    setResultado(null);
    const { Html5Qrcode } = await import("html5-qrcode");
    const scanner = new Html5Qrcode(READER_ID);
    scannerRef.current = scanner;
    await scanner.start(
      { facingMode: "environment" },
      { fps: 8, qrbox: { width: 220, height: 220 } },
      async (decodedText) => {
        if (processandoRef.current) return;
        setCodigo(decodedText);
        await consultar(decodedText);
        await pararLeitura();
      }
    );
    setLendo(true);
  }

  async function pararLeitura() {
    if (!scannerRef.current) return;
    try {
      await scannerRef.current.stop();
      await scannerRef.current.clear();
    } catch {
      // scanner may already be stopped
    }
    scannerRef.current = null;
    setLendo(false);
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.title}>Cobrador</div>
        <div style={s.sub}>Leia o QR Code do cartao e cobre a tarifa da linha.</div>
      </div>
      <div style={s.body}>
        <div style={s.panel}>
          <div style={s.label}>Linha</div>
          <select style={s.input} value={linhaId} onChange={(e) => { setLinhaId(e.target.value); setResumo(null); }} disabled={lendo}>
            {linhas.length === 0 && <option value="">Nenhuma linha vinculada</option>}
            {linhas.map((linha) => <option key={linha.id} value={linha.id}>Linha {linha.numero} - {linha.nome}</option>)}
          </select>
          {!lendo ? (
            <button style={s.btn()} onClick={iniciarLeitura}><Camera size={18} />Ler QR Code</button>
          ) : (
            <button style={s.btn("danger")} onClick={pararLeitura}><StopCircle size={18} />Parar camera</button>
          )}
          <button style={s.btn("ghost")} onClick={carregarLinhas}><RefreshCw size={18} />Atualizar linhas</button>
          <div id={READER_ID} style={s.reader} />
        </div>

        <div style={s.panel}>
          <div style={s.label}>Codigo do cartao manual</div>
          <input style={s.input} value={codigo} onChange={(e) => { setCodigo(e.target.value); setResumo(null); }} placeholder="Numero do cartao" />
          <button style={s.btn()} onClick={() => consultar()}><CreditCard size={18} />Consultar cartao</button>
          {resumo && (
            <div style={s.summary}>
              <div style={s.row}><span style={s.rowLabel}>Passageiro</span><span style={s.rowValue}>{resumo.passageiro.nome}</span></div>
              <div style={s.row}><span style={s.rowLabel}>Cartao</span><span style={s.rowValue}>{resumo.passageiro.cartao}</span></div>
              <div style={s.row}><span style={s.rowLabel}>Tipo</span><span style={s.rowValue}>{resumo.passageiro.tipoCartao}</span></div>
              <div style={s.row}><span style={s.rowLabel}>Linha</span><span style={s.rowValue}>{resumo.linha.numero} - {resumo.linha.nome}</span></div>
              <div style={s.row}><span style={s.rowLabel}>Valor cheio</span><span style={s.rowValue}>R${Number(resumo.valorOriginal).toFixed(2)}</span></div>
              <div style={s.row}><span style={s.rowLabel}>Desconto</span><span style={s.rowValue}>{Number(resumo.descontoPercentual).toFixed(0)}%</span></div>
              <div style={s.row}><span style={s.rowLabel}>Valor final</span><span style={s.rowValue}>R${Number(resumo.valor).toFixed(2)}</span></div>
              <div style={{ ...s.row, borderBottom: "none" }}><span style={s.rowLabel}>Saldo apos</span><span style={s.rowValue}>R${Number(resumo.saldoAposCobranca).toFixed(2)}</span></div>
              {resumo.podeCobrar ? (
                <button style={s.btn()} onClick={confirmarCobranca}><CheckCircle2 size={18} />Confirmar cobranca</button>
              ) : (
                <div style={s.msg(false)}><XCircle size={16} /> Saldo insuficiente para concluir a cobranca.</div>
              )}
            </div>
          )}
          {resultado && <div style={s.msg(resultado.ok)}>{resultado.texto}</div>}
        </div>
      </div>
    </div>
  );
}
