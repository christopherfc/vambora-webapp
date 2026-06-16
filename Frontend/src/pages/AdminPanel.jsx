import { useEffect, useMemo, useState } from "react";
import { Plus, Save, Trash2, RefreshCw, Route, HelpCircle, Bell, Users } from "lucide-react";
import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  adminAtualizarLinha,
  adminAtualizarUsuario,
  adminCriarLinha,
  adminListarFaqs,
  adminListarLinhas,
  adminListarNotificacoes,
  adminListarUsuarios,
  adminRemoverFaq,
  adminRemoverLinha,
  adminRemoverNotificacao,
  adminResumo,
  adminSalvarFaq,
  adminSalvarNotificacao,
} from "../services/api.js";

const emptyLinha = {
  numero: "",
  nome: "",
  tipoTransporte: "onibus",
  tarifa: "",
  infoPagamento: "Dinheiro, Pix",
  origem: "",
  destino: "",
  ativo: true,
  rotaTexto: "",
  util: "",
  sabado: "",
  domingo_feriado: "",
};

const emptyFaq = { pergunta: "", resposta: "", ordem: 0 };
const emptyNotificacao = { tipo: "info", titulo: "", descricao: "", lida: false };

const s = {
  page: { minHeight: "100vh", background: "var(--cor-fundo)", fontFamily: "var(--font-family)", paddingBottom: 84 },
  header: { background: "var(--cor-vinho-gradient)", padding: "28px 20px 24px", color: "#fff" },
  title: { fontSize: 24, fontWeight: 900 },
  sub: { color: "var(--cor-primaria-soft)", fontSize: 13, fontWeight: 700, marginTop: 3 },
  body: { maxWidth: 1060, margin: "0 auto", padding: 16 },
  stats: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: 14 },
  stat: { background: "#fff", borderRadius: 8, padding: 12, boxShadow: "var(--shadow-sm)" },
  statVal: { fontSize: 24, fontWeight: 900, color: "var(--cor-primaria)" },
  statLbl: { fontSize: 11, fontWeight: 800, color: "var(--cor-texto-suave)", textTransform: "uppercase" },
  tabs: { display: "flex", gap: 8, overflowX: "auto", marginBottom: 14 },
  tab: (active) => ({ display: "inline-flex", alignItems: "center", gap: 7, border: "none", borderRadius: 8, padding: "10px 14px", background: active ? "var(--cor-primaria)" : "#fff", color: active ? "#fff" : "var(--cor-vinho)", fontWeight: 900, cursor: "pointer", boxShadow: "var(--shadow-sm)" }),
  grid: { display: "grid", gridTemplateColumns: "minmax(260px, 360px) 1fr", gap: 14, alignItems: "start" },
  panel: { background: "#fff", borderRadius: 8, padding: 14, boxShadow: "var(--shadow-sm)" },
  panelTitle: { fontSize: 14, fontWeight: 900, color: "var(--cor-vinho)", marginBottom: 12 },
  field: { display: "flex", flexDirection: "column", gap: 5, marginBottom: 10 },
  label: { fontSize: 11, fontWeight: 900, color: "var(--cor-texto-suave)", textTransform: "uppercase" },
  input: { width: "100%", border: "1px solid var(--cor-borda)", borderRadius: 8, padding: "10px 11px", fontFamily: "var(--font-family)", fontSize: 13 },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  actions: { display: "flex", gap: 8, flexWrap: "wrap" },
  btn: (kind = "primary") => ({ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, border: "none", borderRadius: 8, padding: "10px 12px", background: kind === "danger" ? "var(--cor-erro)" : kind === "ghost" ? "var(--cor-borda-suave)" : "var(--cor-primaria)", color: kind === "ghost" ? "var(--cor-vinho)" : "#fff", fontWeight: 900, cursor: "pointer", fontFamily: "var(--font-family)" }),
  list: { display: "grid", gap: 8 },
  item: (active) => ({ background: active ? "var(--cor-primaria-light)" : "#fff", border: `1px solid ${active ? "var(--cor-primaria)" : "var(--cor-borda)"}`, borderRadius: 8, padding: 12, cursor: "pointer" }),
  itemTop: { display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" },
  itemTitle: { fontSize: 14, fontWeight: 900, color: "var(--cor-texto)" },
  itemSub: { fontSize: 12, fontWeight: 700, color: "var(--cor-texto-suave)", marginTop: 3 },
  msg: { margin: "0 0 12px", padding: 10, borderRadius: 8, background: "#E8FFF0", color: "#1E8449", fontSize: 13, fontWeight: 800 },
  mapBox: { height: 260, borderRadius: 8, overflow: "hidden", border: "1px solid var(--cor-borda)", marginBottom: 10 },
  hint: { fontSize: 12, lineHeight: 1.35, color: "var(--cor-texto-suave)", fontWeight: 700, marginBottom: 8 },
  scheduleBox: { border: "1px solid var(--cor-borda)", borderRadius: 8, padding: 10, marginBottom: 12 },
  scheduleTabs: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 },
  smallTab: (active) => ({ border: "none", borderRadius: 8, padding: "8px 10px", background: active ? "var(--cor-primaria)" : "var(--cor-borda-suave)", color: active ? "#fff" : "var(--cor-vinho)", fontSize: 12, fontWeight: 900, cursor: "pointer", fontFamily: "var(--font-family)" }),
  chipList: { display: "flex", gap: 6, flexWrap: "wrap", margin: "10px 0" },
  timeChip: { display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid var(--cor-borda)", borderRadius: 999, padding: "6px 8px 6px 10px", background: "#fff", fontSize: 13, fontWeight: 900, color: "var(--cor-texto)" },
  chipRemove: { border: "none", borderRadius: 999, width: 20, height: 20, background: "var(--cor-borda-suave)", color: "var(--cor-vinho)", cursor: "pointer", fontWeight: 900 },
  miniGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))", gap: 8, alignItems: "end", marginTop: 8 },
};

function parseLista(texto) {
  return String(texto || "").split(/[\n,;]/).map((v) => v.trim()).filter(Boolean);
}

function normalizarHorario(valor) {
  const match = String(valor || "").trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return "";
  const hora = Number(match[1]);
  const minuto = Number(match[2]);
  if (hora < 0 || hora > 23 || minuto < 0 || minuto > 59) return "";
  return `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;
}

function horarioParaMinutos(horario) {
  const [h, m] = horario.split(":").map(Number);
  return h * 60 + m;
}

function minutosParaHorario(total) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function ordenarHorarios(lista) {
  return [...new Set(lista.map(normalizarHorario).filter(Boolean))]
    .sort((a, b) => horarioParaMinutos(a) - horarioParaMinutos(b));
}

function parseRota(texto) {
  return String(texto || "")
    .split("\n")
    .map((linha) => linha.split(",").map((v) => Number(v.trim())))
    .filter((p) => p.length >= 2 && Number.isFinite(p[0]) && Number.isFinite(p[1]));
}

function linhaToForm(linha) {
  return {
    ...emptyLinha,
    ...linha,
    rotaTexto: (linha.rota || []).map((p) => `${p[0]}, ${p[1]}`).join("\n"),
    util: (linha.horarios?.util || []).join(", "),
    sabado: (linha.horarios?.sabado || []).join(", "),
    domingo_feriado: (linha.horarios?.domingo_feriado || []).join(", "),
  };
}

function linhaPayload(form) {
  return {
    numero: Number(form.numero),
    nome: form.nome,
    tipoTransporte: form.tipoTransporte,
    tarifa: Number(form.tarifa),
    infoPagamento: form.infoPagamento,
    origem: form.origem,
    destino: form.destino,
    ativo: Boolean(form.ativo),
    rota: parseRota(form.rotaTexto),
    horarios: {
      util: parseLista(form.util),
      sabado: parseLista(form.sabado),
      domingo_feriado: parseLista(form.domingo_feriado),
    },
  };
}

function ClickHandler({ onAdd }) {
  useMapEvents({
    click(e) {
      onAdd([Number(e.latlng.lat.toFixed(7)), Number(e.latlng.lng.toFixed(7))]);
    },
  });
  return null;
}

function RouteEditorMap({ pontos, onChange }) {
  const center = pontos[0] || [-10.2900, -36.5840];

  function addPoint(ponto) {
    onChange([...pontos, ponto]);
  }

  function removePoint(index) {
    onChange(pontos.filter((_, i) => i !== index));
  }

  return (
    <>
      <div style={s.hint}>Clique no mapa para montar a rota na ordem do trajeto. Clique em um ponto para remover.</div>
      <div style={s.mapBox}>
        <MapContainer center={center} zoom={14} style={{ height: "100%", width: "100%" }} zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onAdd={addPoint} />
          {pontos.length > 1 && <Polyline positions={pontos} pathOptions={{ color: "#FE8A00", weight: 5, opacity: 0.9 }} />}
          {pontos.map((ponto, index) => (
            <CircleMarker
              key={`${ponto[0]}-${ponto[1]}-${index}`}
              center={ponto}
              radius={8}
              pathOptions={{ color: "#612828", fillColor: "#FE8A00", fillOpacity: 1, weight: 2 }}
              eventHandlers={{ click: () => removePoint(index) }}
            >
              <Tooltip permanent direction="top" offset={[0, -8]}>{index + 1}</Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </>
  );
}

function ScheduleEditor({ form, onChange, onNotice }) {
  const dias = [
    { key: "util", label: "Dias uteis" },
    { key: "sabado", label: "Sabado" },
    { key: "domingo_feriado", label: "Dom/Feriado" },
  ];
  const [diaAtivo, setDiaAtivo] = useState("util");
  const [novoHorario, setNovoHorario] = useState("");
  const [inicio, setInicio] = useState("05:30");
  const [fim, setFim] = useState("21:30");
  const [intervalo, setIntervalo] = useState(60);

  const horarios = ordenarHorarios(parseLista(form[diaAtivo]));

  function setHorarios(key, lista) {
    onChange({ ...form, [key]: ordenarHorarios(lista).join(", ") });
  }

  function adicionarHorario() {
    const horario = normalizarHorario(novoHorario);
    if (!horario) {
      onNotice("Informe um horario valido no formato HH:MM.");
      return;
    }
    setHorarios(diaAtivo, [...horarios, horario]);
    setNovoHorario("");
  }

  function removerHorario(horario) {
    setHorarios(diaAtivo, horarios.filter((item) => item !== horario));
  }

  function gerarIntervalo() {
    const hInicio = normalizarHorario(inicio);
    const hFim = normalizarHorario(fim);
    const passo = Number(intervalo);

    if (!hInicio || !hFim || !Number.isFinite(passo) || passo <= 0) {
      onNotice("Preencha inicio, fim e intervalo corretamente.");
      return;
    }

    const minInicio = horarioParaMinutos(hInicio);
    const minFim = horarioParaMinutos(hFim);
    if (minFim < minInicio) {
      onNotice("O horario final precisa ser depois do inicial.");
      return;
    }

    const gerados = [];
    for (let atual = minInicio; atual <= minFim; atual += passo) {
      gerados.push(minutosParaHorario(atual));
    }
    setHorarios(diaAtivo, gerados);
  }

  return (
    <div style={s.scheduleBox}>
      <div style={s.panelTitle}>Horarios</div>
      <div style={s.scheduleTabs}>
        {dias.map((dia) => (
          <button key={dia.key} type="button" style={s.smallTab(diaAtivo === dia.key)} onClick={() => setDiaAtivo(dia.key)}>
            {dia.label}
          </button>
        ))}
      </div>

      <div style={s.actions}>
        <input
          style={{ ...s.input, maxWidth: 120 }}
          placeholder="HH:MM"
          value={novoHorario}
          onChange={(e) => setNovoHorario(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              adicionarHorario();
            }
          }}
        />
        <button type="button" style={s.btn("ghost")} onClick={adicionarHorario}>Adicionar</button>
      </div>

      <div style={s.chipList}>
        {horarios.length === 0 && <div style={s.itemSub}>Nenhum horario cadastrado para este dia.</div>}
        {horarios.map((horario) => (
          <span key={horario} style={s.timeChip}>
            {horario}
            <button type="button" style={s.chipRemove} onClick={() => removerHorario(horario)}>x</button>
          </span>
        ))}
      </div>

      <div style={s.hint}>Gerar horarios por intervalo</div>
      <div style={s.miniGrid}>
        <label style={s.field}><span style={s.label}>Inicio</span><input style={s.input} value={inicio} onChange={(e) => setInicio(e.target.value)} /></label>
        <label style={s.field}><span style={s.label}>Fim</span><input style={s.input} value={fim} onChange={(e) => setFim(e.target.value)} /></label>
        <label style={s.field}><span style={s.label}>Minutos</span><input style={s.input} type="number" min="1" value={intervalo} onChange={(e) => setIntervalo(e.target.value)} /></label>
        <button type="button" style={s.btn("ghost")} onClick={gerarIntervalo}>Gerar</button>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [aba, setAba] = useState("linhas");
  const [resumo, setResumo] = useState({});
  const [linhas, setLinhas] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [linhaForm, setLinhaForm] = useState(emptyLinha);
  const [faqForm, setFaqForm] = useState(emptyFaq);
  const [notiForm, setNotiForm] = useState(emptyNotificacao);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [msg, setMsg] = useState("");

  const selecionadaId = linhaForm.id || linhaForm._id;
  const faqId = faqForm.id || faqForm._id;
  const notiId = notiForm.id || notiForm._id;

  async function carregar() {
    const [r, l, f, n, u] = await Promise.all([
      adminResumo(),
      adminListarLinhas(),
      adminListarFaqs(),
      adminListarNotificacoes(),
      adminListarUsuarios(),
    ]);
    setResumo(r);
    setLinhas(l.linhas || []);
    setFaqs(f.faqs || []);
    setNotificacoes(n.notificacoes || []);
    setUsuarios(u.usuarios || []);
  }

  useEffect(() => {
    carregar().catch((e) => setMsg(e.message));
  }, []);

  function avisar(texto) {
    setMsg(texto);
    setTimeout(() => setMsg(""), 2600);
  }

  async function salvarLinha(e) {
    e.preventDefault();
    const payload = linhaPayload(linhaForm);
    if (selecionadaId) await adminAtualizarLinha(selecionadaId, payload);
    else await adminCriarLinha(payload);
    await carregar();
    setLinhaForm(emptyLinha);
    avisar("Linha salva.");
  }

  function atualizarRotaVisual(pontos) {
    setLinhaForm({
      ...linhaForm,
      rotaTexto: pontos.map((p) => `${p[0]}, ${p[1]}`).join("\n"),
    });
  }

  function desfazerPonto() {
    const pontos = parseRota(linhaForm.rotaTexto);
    atualizarRotaVisual(pontos.slice(0, -1));
  }

  function limparRota() {
    atualizarRotaVisual([]);
  }

  async function removerLinha() {
    if (!selecionadaId) return;
    await adminRemoverLinha(selecionadaId);
    await carregar();
    setLinhaForm(emptyLinha);
    avisar("Linha removida.");
  }

  async function salvarFaq(e) {
    e.preventDefault();
    await adminSalvarFaq(faqForm);
    await carregar();
    setFaqForm(emptyFaq);
    avisar("FAQ salva.");
  }

  async function salvarNotificacao(e) {
    e.preventDefault();
    await adminSalvarNotificacao(notiForm);
    await carregar();
    setNotiForm(emptyNotificacao);
    avisar("Notificacao salva.");
  }

  async function salvarUsuario(e) {
    e.preventDefault();
    await adminAtualizarUsuario(usuarioEditando.id, usuarioEditando);
    await carregar();
    setUsuarioEditando(null);
    avisar("Usuario atualizado.");
  }

  function toggleLinhaMotorista(linhaId) {
    const atuais = usuarioEditando?.motoristaLinhas || [];
    const existe = atuais.map(String).includes(String(linhaId));
    setUsuarioEditando({
      ...usuarioEditando,
      motoristaLinhas: existe
        ? atuais.filter((id) => String(id) !== String(linhaId))
        : [...atuais, linhaId],
    });
  }

  const tabs = useMemo(() => [
    { id: "linhas", label: "Linhas", Icone: Route },
    { id: "faqs", label: "FAQ", Icone: HelpCircle },
    { id: "notificacoes", label: "Avisos", Icone: Bell },
    { id: "usuarios", label: "Usuarios", Icone: Users },
  ], []);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.title}>Painel Admin</div>
        <div style={s.sub}>Gerencie rotas, horarios e informacoes do app.</div>
      </div>
      <div style={s.body}>
        {msg && <div style={s.msg}>{msg}</div>}
        <div style={s.stats}>
          {[
            ["Linhas", resumo.linhas ?? 0],
            ["Usuarios", resumo.usuarios ?? 0],
            ["FAQs", resumo.faqs ?? 0],
            ["Avisos", resumo.notificacoes ?? 0],
          ].map(([label, value]) => <div key={label} style={s.stat}><div style={s.statVal}>{value}</div><div style={s.statLbl}>{label}</div></div>)}
        </div>
        <div style={s.tabs}>
          {tabs.map(({ id, label, Icone }) => <button key={id} style={s.tab(aba === id)} onClick={() => setAba(id)}><Icone size={16} />{label}</button>)}
          <button style={s.tab(false)} onClick={() => carregar().then(() => avisar("Dados atualizados."))}><RefreshCw size={16} />Atualizar</button>
        </div>

        {aba === "linhas" && (
          <div style={s.grid}>
            <form style={s.panel} onSubmit={salvarLinha}>
              <div style={s.panelTitle}>{selecionadaId ? "Editar linha" : "Nova linha"}</div>
              <div style={s.row}>
                <label style={s.field}><span style={s.label}>Numero</span><input style={s.input} value={linhaForm.numero} onChange={(e) => setLinhaForm({ ...linhaForm, numero: e.target.value })} required /></label>
                <label style={s.field}><span style={s.label}>Tipo</span><select style={s.input} value={linhaForm.tipoTransporte} onChange={(e) => setLinhaForm({ ...linhaForm, tipoTransporte: e.target.value })}><option value="onibus">Onibus</option><option value="van">Van</option><option value="barco">Barco/Balsa</option></select></label>
              </div>
              <label style={s.field}><span style={s.label}>Nome</span><input style={s.input} value={linhaForm.nome} onChange={(e) => setLinhaForm({ ...linhaForm, nome: e.target.value })} required /></label>
              <div style={s.row}>
                <label style={s.field}><span style={s.label}>Origem</span><input style={s.input} value={linhaForm.origem} onChange={(e) => setLinhaForm({ ...linhaForm, origem: e.target.value })} required /></label>
                <label style={s.field}><span style={s.label}>Destino</span><input style={s.input} value={linhaForm.destino} onChange={(e) => setLinhaForm({ ...linhaForm, destino: e.target.value })} required /></label>
              </div>
              <div style={s.row}>
                <label style={s.field}><span style={s.label}>Tarifa</span><input style={s.input} type="number" step="0.01" value={linhaForm.tarifa} onChange={(e) => setLinhaForm({ ...linhaForm, tarifa: e.target.value })} required /></label>
                <label style={s.field}><span style={s.label}>Ativa</span><select style={s.input} value={linhaForm.ativo ? "1" : "0"} onChange={(e) => setLinhaForm({ ...linhaForm, ativo: e.target.value === "1" })}><option value="1">Sim</option><option value="0">Nao</option></select></label>
              </div>
              <label style={s.field}><span style={s.label}>Pagamento</span><input style={s.input} value={linhaForm.infoPagamento} onChange={(e) => setLinhaForm({ ...linhaForm, infoPagamento: e.target.value })} /></label>
              <RouteEditorMap pontos={parseRota(linhaForm.rotaTexto)} onChange={atualizarRotaVisual} />
              <div style={{ ...s.actions, marginBottom: 10 }}>
                <button type="button" style={s.btn("ghost")} onClick={desfazerPonto}>Desfazer ponto</button>
                <button type="button" style={s.btn("ghost")} onClick={limparRota}>Limpar rota</button>
              </div>
              <label style={s.field}><span style={s.label}>Pontos da rota, um por linha: latitude, longitude</span><textarea rows={5} style={s.input} value={linhaForm.rotaTexto} onChange={(e) => setLinhaForm({ ...linhaForm, rotaTexto: e.target.value })} /></label>
              <ScheduleEditor form={linhaForm} onChange={setLinhaForm} onNotice={avisar} />
              <div style={s.actions}>
                <button style={s.btn()}><Save size={16} />Salvar</button>
                <button type="button" style={s.btn("ghost")} onClick={() => setLinhaForm(emptyLinha)}><Plus size={16} />Nova</button>
                {selecionadaId && <button type="button" style={s.btn("danger")} onClick={removerLinha}><Trash2 size={16} />Apagar</button>}
              </div>
            </form>
            <div style={s.panel}>
              <div style={s.panelTitle}>Linhas cadastradas</div>
              <div style={s.list}>{linhas.map((linha) => <div key={linha.id} style={s.item(String(selecionadaId) === String(linha.id))} onClick={() => setLinhaForm(linhaToForm(linha))}><div style={s.itemTop}><div style={s.itemTitle}>Linha {linha.numero} - {linha.nome}</div><strong>R${Number(linha.tarifa).toFixed(2)}</strong></div><div style={s.itemSub}>{linha.origem} para {linha.destino} | {linha.tipoTransporte} | {linha.ativo ? "ativa" : "inativa"}</div></div>)}</div>
            </div>
          </div>
        )}

        {aba === "faqs" && (
          <div style={s.grid}>
            <form style={s.panel} onSubmit={salvarFaq}>
              <div style={s.panelTitle}>{faqId ? "Editar FAQ" : "Nova FAQ"}</div>
              <label style={s.field}><span style={s.label}>Pergunta</span><input style={s.input} value={faqForm.pergunta} onChange={(e) => setFaqForm({ ...faqForm, pergunta: e.target.value })} required /></label>
              <label style={s.field}><span style={s.label}>Resposta</span><textarea rows={6} style={s.input} value={faqForm.resposta} onChange={(e) => setFaqForm({ ...faqForm, resposta: e.target.value })} required /></label>
              <label style={s.field}><span style={s.label}>Ordem</span><input style={s.input} type="number" value={faqForm.ordem} onChange={(e) => setFaqForm({ ...faqForm, ordem: e.target.value })} /></label>
              <div style={s.actions}><button style={s.btn()}><Save size={16} />Salvar</button><button type="button" style={s.btn("ghost")} onClick={() => setFaqForm(emptyFaq)}><Plus size={16} />Nova</button>{faqId && <button type="button" style={s.btn("danger")} onClick={() => adminRemoverFaq(faqId).then(carregar).then(() => setFaqForm(emptyFaq))}><Trash2 size={16} />Apagar</button>}</div>
            </form>
            <div style={s.panel}><div style={s.panelTitle}>FAQs</div><div style={s.list}>{faqs.map((faq) => <div key={faq.id} style={s.item(String(faqId) === String(faq.id))} onClick={() => setFaqForm(faq)}><div style={s.itemTitle}>{faq.pergunta}</div><div style={s.itemSub}>Ordem {faq.ordem}</div></div>)}</div></div>
          </div>
        )}

        {aba === "notificacoes" && (
          <div style={s.grid}>
            <form style={s.panel} onSubmit={salvarNotificacao}>
              <div style={s.panelTitle}>{notiId ? "Editar aviso" : "Novo aviso"}</div>
              <label style={s.field}><span style={s.label}>Tipo</span><select style={s.input} value={notiForm.tipo} onChange={(e) => setNotiForm({ ...notiForm, tipo: e.target.value })}><option value="info">Info</option><option value="alerta">Alerta</option><option value="sucesso">Sucesso</option></select></label>
              <label style={s.field}><span style={s.label}>Titulo</span><input style={s.input} value={notiForm.titulo} onChange={(e) => setNotiForm({ ...notiForm, titulo: e.target.value })} required /></label>
              <label style={s.field}><span style={s.label}>Descricao</span><textarea rows={6} style={s.input} value={notiForm.descricao} onChange={(e) => setNotiForm({ ...notiForm, descricao: e.target.value })} required /></label>
              <label style={s.field}><span style={s.label}>Usuario especifico, opcional</span><input style={s.input} value={notiForm.usuarioId || ""} onChange={(e) => setNotiForm({ ...notiForm, usuarioId: e.target.value })} /></label>
              <div style={s.actions}><button style={s.btn()}><Save size={16} />Salvar</button><button type="button" style={s.btn("ghost")} onClick={() => setNotiForm(emptyNotificacao)}><Plus size={16} />Nova</button>{notiId && <button type="button" style={s.btn("danger")} onClick={() => adminRemoverNotificacao(notiId).then(carregar).then(() => setNotiForm(emptyNotificacao))}><Trash2 size={16} />Apagar</button>}</div>
            </form>
            <div style={s.panel}><div style={s.panelTitle}>Avisos</div><div style={s.list}>{notificacoes.map((n) => <div key={n.id} style={s.item(String(notiId) === String(n.id))} onClick={() => setNotiForm(n)}><div style={s.itemTitle}>{n.titulo}</div><div style={s.itemSub}>{n.tipo} | {n.usuarioId ? `usuario ${n.usuarioId}` : "geral"}</div></div>)}</div></div>
          </div>
        )}

        {aba === "usuarios" && (
          <div style={s.grid}>
            <form style={s.panel} onSubmit={salvarUsuario}>
              <div style={s.panelTitle}>Editar usuario</div>
              {!usuarioEditando && <div style={s.itemSub}>Selecione um usuario na lista.</div>}
              {usuarioEditando && <>
                <label style={s.field}><span style={s.label}>Nome</span><input style={s.input} value={usuarioEditando.nome} onChange={(e) => setUsuarioEditando({ ...usuarioEditando, nome: e.target.value })} /></label>
                <label style={s.field}><span style={s.label}>Email</span><input style={s.input} value={usuarioEditando.email} onChange={(e) => setUsuarioEditando({ ...usuarioEditando, email: e.target.value })} /></label>
                <label style={s.field}><span style={s.label}>Telefone</span><input style={s.input} value={usuarioEditando.telefone || ""} onChange={(e) => setUsuarioEditando({ ...usuarioEditando, telefone: e.target.value })} /></label>
                <div style={s.row}>
                  <label style={s.field}><span style={s.label}>Role</span><select style={s.input} value={usuarioEditando.role} onChange={(e) => setUsuarioEditando({ ...usuarioEditando, role: e.target.value })}><option value="USER">USER</option><option value="MOTORISTA">MOTORISTA</option><option value="ADMIN">ADMIN</option></select></label>
                  <label style={s.field}><span style={s.label}>Saldo</span><input style={s.input} type="number" step="0.01" value={usuarioEditando.cartao?.saldo ?? usuarioEditando.saldo ?? 0} onChange={(e) => setUsuarioEditando({ ...usuarioEditando, saldo: e.target.value })} /></label>
                </div>
                {usuarioEditando.role === "MOTORISTA" && (
                  <div style={s.field}>
                    <span style={s.label}>Linhas permitidas para o motorista</span>
                    <div style={s.list}>
                      {linhas.length === 0 && <div style={s.itemSub}>Cadastre linhas antes de vincular motoristas.</div>}
                      {linhas.map((linha) => {
                        const marcado = (usuarioEditando.motoristaLinhas || []).map(String).includes(String(linha.id));
                        return (
                          <label key={linha.id} style={{ ...s.item(marcado), display: "flex", alignItems: "center", gap: 10 }}>
                            <input type="checkbox" checked={marcado} onChange={() => toggleLinhaMotorista(linha.id)} />
                            <span style={s.itemTitle}>Linha {linha.numero} - {linha.nome}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
                <button style={s.btn()}><Save size={16} />Salvar usuario</button>
              </>}
            </form>
            <div style={s.panel}><div style={s.panelTitle}>Usuarios</div><div style={s.list}>{usuarios.map((u) => <div key={u.id} style={s.item(usuarioEditando?.id === u.id)} onClick={() => setUsuarioEditando({ ...u, saldo: u.cartao?.saldo || 0 })}><div style={s.itemTitle}>{u.nome}</div><div style={s.itemSub}>{u.email} | {u.role} | R${Number(u.cartao?.saldo || 0).toFixed(2)}</div></div>)}</div></div>
          </div>
        )}
      </div>
    </div>
  );
}
