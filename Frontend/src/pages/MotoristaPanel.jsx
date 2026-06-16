import { useEffect, useState } from "react";
import { MapPin, Navigation, Square, RefreshCw } from "lucide-react";
import {
  motoristaListarLinhas,
} from "../services/api.js";
import {
  startMotoristaTracker,
  stopMotoristaTracker,
  subscribeMotoristaTracker,
} from "../services/motoristaTracker.js";

const s = {
  page: { minHeight: "100vh", background: "var(--cor-fundo)", fontFamily: "var(--font-family)", paddingBottom: 84 },
  header: { background: "var(--cor-vinho-gradient)", padding: "30px 20px 26px", color: "#fff" },
  title: { fontSize: 24, fontWeight: 900 },
  sub: { color: "var(--cor-primaria-soft)", fontSize: 13, fontWeight: 700, marginTop: 4 },
  body: { maxWidth: 520, margin: "0 auto", padding: 16 },
  panel: { background: "#fff", borderRadius: 10, padding: 16, boxShadow: "var(--shadow-sm)", marginBottom: 14 },
  label: { fontSize: 11, fontWeight: 900, color: "var(--cor-texto-suave)", textTransform: "uppercase", marginBottom: 6 },
  select: { width: "100%", border: "1px solid var(--cor-borda)", borderRadius: 8, padding: "12px", fontFamily: "var(--font-family)", fontWeight: 800 },
  btn: (kind = "primary") => ({ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, border: "none", borderRadius: 10, padding: "14px", background: kind === "danger" ? "var(--cor-erro)" : kind === "ghost" ? "var(--cor-borda-suave)" : "var(--cor-primaria)", color: kind === "ghost" ? "var(--cor-vinho)" : "#fff", fontWeight: 900, cursor: "pointer", fontFamily: "var(--font-family)", marginTop: 10 }),
  status: { display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 800, color: "var(--cor-texto)", marginTop: 10 },
  dot: (active) => ({ width: 10, height: 10, borderRadius: "50%", background: active ? "var(--cor-sucesso)" : "var(--cor-texto-claro)" }),
  msg: { background: "#fff", borderRadius: 10, padding: 12, color: "var(--cor-texto-suave)", fontSize: 13, fontWeight: 700, boxShadow: "var(--shadow-sm)" },
};

export default function MotoristaPanel() {
  const [linhas, setLinhas] = useState([]);
  const [linhaId, setLinhaId] = useState("");
  const [tracker, setTracker] = useState({ ativo: false, trip: null, ultima: null, erro: "" });
  const [msg, setMsg] = useState("");

  async function carregarLinhas() {
    try {
      const data = await motoristaListarLinhas();
      setLinhas(data.linhas || []);
      if (!linhaId && data.linhas?.[0]) setLinhaId(String(data.linhas[0].id));
    } catch (error) {
      setMsg(error.message);
    }
  }

  useEffect(() => {
    carregarLinhas();
    return subscribeMotoristaTracker(setTracker);
  }, []);

  function iniciar() {
    setMsg("");
    if (!linhaId) {
      setMsg("Selecione uma linha antes de iniciar.");
      return;
    }
    const linha = linhas.find((item) => String(item.id) === String(linhaId));
    startMotoristaTracker(linhaId, linha?.nome || "").catch((error) => setMsg(error.message));
  }

  async function parar() {
    await stopMotoristaTracker().catch((error) => setMsg(error.message));
  }

  const ativo = tracker.ativo;
  const ultima = tracker.ultima;
  const linhaAtual = linhas.find((linha) => String(linha.id) === String(tracker.trip?.linhaId || linhaId));

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.title}>Motorista</div>
        <div style={s.sub}>Compartilhe a localizacao do veiculo em tempo real.</div>
      </div>
      <div style={s.body}>
        <div style={s.panel}>
          <div style={s.label}>Linha em operacao</div>
          <select style={s.select} value={tracker.trip?.linhaId || linhaId} onChange={(e) => setLinhaId(e.target.value)} disabled={ativo}>
            {linhas.length === 0 && <option value="">Nenhuma linha vinculada</option>}
            {linhas.map((linha) => (
              <option key={linha.id} value={linha.id}>Linha {linha.numero} - {linha.nome}</option>
            ))}
          </select>

          <div style={s.status}>
            <span style={s.dot(ativo)} />
            {ativo ? `Compartilhando ${linhaAtual?.nome || tracker.trip?.linhaNome || ""}` : "Compartilhamento parado"}
          </div>

          {!ativo ? (
            <button style={s.btn()} onClick={iniciar}><Navigation size={18} />Iniciar viagem</button>
          ) : (
            <button style={s.btn("danger")} onClick={parar}><Square size={18} />Parar viagem</button>
          )}
          <button style={s.btn("ghost")} onClick={carregarLinhas}><RefreshCw size={18} />Atualizar linhas</button>
        </div>

        {ultima && (
          <div style={s.panel}>
            <div style={s.label}>Ultima localizacao enviada</div>
            <div style={s.status}><MapPin size={18} />{ultima.latitude.toFixed(6)}, {ultima.longitude.toFixed(6)}</div>
            <div style={s.msg}>Precisao aproximada: {Math.round(ultima.precisao || 0)}m</div>
          </div>
        )}

        {(msg || tracker.erro) && <div style={s.msg}>{msg || tracker.erro}</div>}
      </div>
    </div>
  );
}
