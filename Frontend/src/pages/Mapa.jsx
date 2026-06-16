import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import { Bus, Truck, Anchor, ArrowRight, X, Clock } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { buscarLinhas, buscarHorarios, buscarVeiculosAtivos } from "../services/api.js";

// Fix Leaflet default icon bug with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const COR_TIPO = {
  onibus: "#2471A3",
  van:    "#1E8449",
  barco:  "#8E44AD",
};

const ICONE_TIPO = {
  onibus: Bus,
  van:    Truck,
  barco:  Anchor,
};

function veiculoIcone(tipo, label) {
  const simbolo = tipo === "van" ? "🚐" : tipo === "barco" ? "⛴" : "🚌";
  const cor = COR_TIPO[tipo] || "#FE8A00";
  return L.divIcon({
    className: "veiculo-marker",
    html: `<div style="display:flex;align-items:center;gap:6px;transform:translate(-17px,-17px);">
      <div style="width:34px;height:34px;border-radius:999px;background:${cor};border:3px solid white;box-shadow:0 4px 14px rgba(0,0,0,.28);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">${simbolo}</div>
      <div style="background:white;color:#2D1515;border:1px solid rgba(97,40,40,.16);box-shadow:0 3px 12px rgba(0,0,0,.18);border-radius:999px;padding:4px 8px;font-size:11px;font-weight:900;white-space:nowrap;font-family:Nunito, sans-serif">${label || "Em rota"}</div>
    </div>`,
    iconSize: [120, 34],
    iconAnchor: [17, 17],
  });
}

const CHIPS = [
  { valor: "todos",  label: "Todos"  },
  { valor: "onibus", label: "Ônibus" },
  { valor: "van",    label: "Van"    },
  { valor: "barco",  label: "Balsa"  },
];

// Cache de horários para o painel de detalhes
const horariosCache = {};

async function proximoHorario(linhaId) {
  try {
    if (!horariosCache[linhaId]) {
      const data = await buscarHorarios(linhaId);
      horariosCache[linhaId] = data.horarios;
    }
    const horarios = horariosCache[linhaId];
    const agora  = new Date();
    const hAtual = agora.getHours() * 60 + agora.getMinutes();
    const dia    = agora.getDay();
    const chave  = dia === 0 || dia === 6 ? (dia === 6 ? "sabado" : "domingo_feriado") : "util";
    const lista  = (horarios || {})[chave] || [];
    const prox   = lista.find(h => {
      const [hh, mm] = h.split(":").map(Number);
      return hh * 60 + mm > hAtual;
    });
    return prox || lista[0] || "—";
  } catch {
    return "—";
  }
}

// Força recentrar o mapa quando a aba abre
function RecenterMap() {
  const map = useMap();
  useEffect(() => {
    map.setView([-10.2900, -36.5840], 14);
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);
  return null;
}

const s = {
  wrapper:    { display: "flex", flexDirection: "column", height: "calc(100vh - 64px)", fontFamily: "var(--font-family)" },
  header:     { background: "var(--cor-vinho-gradient)", padding: "18px 20px 14px", position: "relative", overflow: "hidden", flexShrink: 0 },
  hBlob:      { position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(254,138,0,0.14)", pointerEvents: "none" },
  hTitulo:    { fontSize: 20, fontWeight: 900, color: "#fff", position: "relative" },
  hSub:       { fontSize: 12, color: "var(--cor-primaria-soft)", fontWeight: 600, marginTop: 2, position: "relative" },
  filtros:    { display: "flex", gap: 8, padding: "10px 16px", background: "#fff", boxShadow: "0 2px 8px rgba(97,40,40,0.06)", flexShrink: 0, overflowX: "auto" },
  chipAtivo:  { padding: "6px 16px", borderRadius: 999, background: "var(--cor-primaria)", color: "#fff", fontWeight: 800, fontSize: 12, border: "none", cursor: "pointer", fontFamily: "var(--font-family)", whiteSpace: "nowrap" },
  chipInativo:{ padding: "6px 16px", borderRadius: 999, background: "var(--cor-borda-suave)", color: "var(--cor-vinho)", fontWeight: 700, fontSize: 12, border: "none", cursor: "pointer", fontFamily: "var(--font-family)", whiteSpace: "nowrap" },
  mapWrap:    { flex: 1, position: "relative", overflow: "hidden" },
  legenda:    { position: "absolute", top: 12, right: 12, zIndex: 1000, background: "rgba(255,255,255,0.95)", borderRadius: 14, padding: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", backdropFilter: "blur(8px)" },
  legItem:    { display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 12, fontWeight: 700, color: "var(--cor-texto)" },
  legBolinha: (cor) => ({ width: 10, height: 10, borderRadius: "50%", background: cor, flexShrink: 0 }),

  painel:     (aberto) => ({
    position: "fixed", bottom: 64, left: 0, right: 0, zIndex: 2000,
    background: "#fff", borderRadius: "20px 20px 0 0",
    boxShadow: "0 -8px 40px rgba(97,40,40,0.18)",
    padding: "20px 20px 24px",
    transform: aberto ? "translateY(0)" : "translateY(110%)",
    transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    fontFamily: "var(--font-family)",
  }),
  painelHandle: { width: 40, height: 4, borderRadius: 999, background: "#E0D8D8", margin: "0 auto 16px" },
  painelHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 },
  painelTitulo: { fontSize: 16, fontWeight: 900, color: "var(--cor-texto)", marginBottom: 2 },
  painelRota:   { fontSize: 13, color: "var(--cor-texto-suave)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 },
  painelInfo:   { display: "flex", gap: 10, marginBottom: 16 },
  infoCard:     (cor) => ({ flex: 1, background: cor + "18", borderRadius: 12, padding: "10px 12px", textAlign: "center" }),
  infoVal:      (cor) => ({ fontSize: 18, fontWeight: 900, color: cor, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }),
  infoLbl:      { fontSize: 10, color: "var(--cor-texto-suave)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 },
  btnVerHor:    (cor) => ({ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: cor, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "var(--font-family)" }),
  btnFechar:    { background: "var(--cor-borda-suave)", border: "none", borderRadius: 10, padding: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
};

export default function Mapa({ onVerHorarios }) {
  const [filtro,       setFiltro]       = useState("todos");
  const [linhaSel,     setLinhaSel]     = useState(null);
  const [painelAberto, setPainelAberto] = useState(false);
  const [todasLinhas,  setTodasLinhas]  = useState([]);
  const [veiculos,     setVeiculos]     = useState([]);
  const [proxHorario,  setProxHorario]  = useState("—");

  /* Buscar todas as linhas do backend ao montar */
  useEffect(() => {
    async function carregar() {
      try {
        const dados = await buscarLinhas();
        setTodasLinhas(dados.linhas);
      } catch (e) {
        console.error(e);
      }
    }
    carregar();
  }, []);

  useEffect(() => {
    let ativo = true;
    async function carregarVeiculos() {
      try {
        const dados = await buscarVeiculosAtivos();
        if (ativo) setVeiculos(dados.veiculos || []);
      } catch (e) {
        console.error(e);
      }
    }
    carregarVeiculos();
    const timer = setInterval(carregarVeiculos, 5000);
    return () => {
      ativo = false;
      clearInterval(timer);
    };
  }, []);

  const linhasFiltradas = todasLinhas.filter(l => filtro === "todos" || l.tipoTransporte === filtro);
  const veiculosFiltrados = veiculos.filter(v => filtro === "todos" || v.linha?.tipoTransporte === filtro);

  async function abrirPainel(linha) {
    setLinhaSel(linha);
    setPainelAberto(true);
    const prox = await proximoHorario(linha._id);
    setProxHorario(prox);
  }

  function fecharPainel() {
    setPainelAberto(false);
    setTimeout(() => setLinhaSel(null), 300);
  }

  return (
    <div style={s.wrapper}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.hBlob} />
        <div style={s.hTitulo}>Mapa de Rotas</div>
        <div style={s.hSub}>Penedo, Alagoas</div>
      </div>

      {/* Filtros */}
      <div style={s.filtros}>
        {CHIPS.map(chip => (
          <button key={chip.valor}
            style={filtro === chip.valor ? s.chipAtivo : s.chipInativo}
            onClick={() => setFiltro(chip.valor)}>
            {chip.label}
          </button>
        ))}
      </div>

      {/* Mapa */}
      <div style={s.mapWrap}>
        <MapContainer
          center={[-10.2900, -36.5840]}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <RecenterMap />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {linhasFiltradas.map(linha => {
            const cor = COR_TIPO[linha.tipoTransporte] || "#999";
            const pts = linha.rota.map(p => [p[0], p[1]]);
            return (
              <Polyline
                key={linha._id}
                positions={pts}
                pathOptions={{ color: cor, weight: 5, opacity: 0.85, dashArray: linha.tipoTransporte === "barco" ? "10, 8" : null }}
                eventHandlers={{
                  click: () => abrirPainel(linha),
                  mouseover: (e) => e.target.setStyle({ weight: 8, opacity: 1 }),
                  mouseout:  (e) => e.target.setStyle({ weight: 5, opacity: 0.85 }),
                }}
              />
            );
          })}

          {linhasFiltradas.map(linha => {
            const inicio = linha.rota[0];
            if (!inicio) return null;
            return (
              <Marker key={`mk-${linha._id}`} position={[inicio[0], inicio[1]]}
                eventHandlers={{ click: () => abrirPainel(linha) }}
              />
            );
          })}

          {veiculosFiltrados.map((veiculo) => (
            <Marker
              key={`veiculo-${veiculo.id}`}
              position={[veiculo.latitude, veiculo.longitude]}
              icon={veiculoIcone(veiculo.linha?.tipoTransporte, veiculo.linha ? `Linha ${veiculo.linha.numero}` : "Em rota")}
            >
              <Popup>
                <strong>{veiculo.motorista}</strong><br />
                {veiculo.linha ? `Linha ${veiculo.linha.numero} - ${veiculo.linha.nome}` : "Linha em operacao"}
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Legenda */}
        <div style={s.legenda}>
          {[
            { tipo: "onibus", label: "Ônibus"  },
            { tipo: "van",    label: "Van"      },
            { tipo: "barco",  label: "Balsa"    },
          ].map(({ tipo, label }) => (
            <div key={tipo} style={s.legItem}>
              <div style={s.legBolinha(COR_TIPO[tipo])} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Painel de detalhes */}
      {linhaSel && (
        <div style={s.painel(painelAberto)}>
          <div style={s.painelHandle} />
          <div style={s.painelHeader}>
            <div>
              <div style={s.painelTitulo}>{linhaSel.nome}</div>
              <div style={s.painelRota}>
                {linhaSel.origem}
                <ArrowRight size={12} color="var(--cor-texto-claro)" />
                {linhaSel.destino}
              </div>
            </div>
            <button style={s.btnFechar} onClick={fecharPainel}>
              <X size={18} color="var(--cor-texto-suave)" strokeWidth={2.5} />
            </button>
          </div>

          {(() => {
            const Icone = ICONE_TIPO[linhaSel.tipoTransporte] || Bus;
            const cor   = COR_TIPO[linhaSel.tipoTransporte];
            const prox  = proxHorario;
            return (
              <>
                <div style={s.painelInfo}>
                  <div style={s.infoCard(cor)}>
                    <div style={s.infoVal(cor)}>R${linhaSel.tarifa.toFixed(2)}</div>
                    <div style={s.infoLbl}>Tarifa</div>
                  </div>
                  <div style={s.infoCard(cor)}>
                    <div style={s.infoVal(cor)}>
                      <Clock size={16} color={cor} strokeWidth={2} /> {prox}
                    </div>
                    <div style={s.infoLbl}>Próxima partida</div>
                  </div>
                  <div style={s.infoCard(cor)}>
                    <div style={s.infoVal(cor)}>
                      <Icone size={18} color={cor} strokeWidth={1.75} />
                    </div>
                    <div style={s.infoLbl}>
                      {linhaSel.tipoTransporte === "onibus" ? "Ônibus" : linhaSel.tipoTransporte === "van" ? "Van" : "Balsa"}
                    </div>
                  </div>
                </div>
                <button style={s.btnVerHor(cor)} onClick={() => { fecharPainel(); onVerHorarios(linhaSel); }}>
                  Ver horários completos
                </button>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
