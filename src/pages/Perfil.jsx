import { useState } from "react";
import { ChevronRight, LogOut, Pencil } from "lucide-react";
import EditarDados from "./perfil/EditarDados.jsx";
import AlterarSenha from "./perfil/AlterarSenha.jsx";
import Endereco from "./perfil/Endereco.jsx";
import CentralAjuda from "./perfil/CentralAjuda.jsx";
import Termos from "./perfil/Termos.jsx";
import Privacidade from "./perfil/Privacidade.jsx";

const s = {
  container:    { minHeight: "100vh", background: "var(--cor-fundo)", fontFamily: "var(--font-family)", paddingBottom: 80 },
  header:       { background: "var(--cor-vinho-gradient)", padding: "44px 20px 72px", position: "relative", overflow: "hidden" },
  blob1:        { position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(254,138,0,0.13)", pointerEvents: "none" },
  headerTitulo: { fontSize: 24, fontWeight: 900, color: "#fff", position: "relative" },
  headerSub:    { fontSize: 13, color: "var(--cor-primaria-soft)", fontWeight: 600, marginTop: 4, position: "relative" },

  avatarWrap: { margin: "0 16px", marginTop: -46, display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 2, background: "#fff", borderRadius: 20, padding: "14px 16px", boxShadow: "var(--shadow-lg)" },
  avatar:     { width: 60, height: 60, borderRadius: 18, background: "var(--cor-primaria)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: "#fff", flexShrink: 0 },
  nomeWrap:   { flex: 1 },
  nome:       { fontSize: 17, fontWeight: 900, color: "var(--cor-texto)" },
  email:      { fontSize: 12, color: "var(--cor-texto-suave)", fontWeight: 600 },
  btnEditar:  { background: "var(--cor-primaria-light)", border: "none", borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontFamily: "var(--font-family)", fontSize: 12, fontWeight: 800, color: "var(--cor-primaria)" },

  body:      { padding: "16px 16px" },
  secao:     { background: "#fff", borderRadius: 18, marginBottom: 14, boxShadow: "var(--shadow-sm)", overflow: "hidden" },
  secLabel:  { fontSize: 11, fontWeight: 800, color: "var(--cor-texto-suave)", letterSpacing: 1, textTransform: "uppercase", padding: "14px 18px 8px" },
  item:      { display: "flex", alignItems: "center", padding: "14px 18px", borderTop: "1px solid var(--cor-borda-suave)", cursor: "pointer" },
  itemLabel: { flex: 1, fontSize: 14, fontWeight: 700, color: "var(--cor-texto)" },

  toggle:    (ativo) => ({ width: 44, height: 24, borderRadius: 999, background: ativo ? "var(--cor-primaria)" : "#E0D8D8", position: "relative", cursor: "pointer", border: "none", transition: "background 0.2s", flexShrink: 0 }),
  toggleDot: (ativo) => ({ position: "absolute", top: 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", left: ativo ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }),

  btnLogout: { width: "100%", padding: "16px", border: "none", background: "#fff", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer", fontFamily: "var(--font-family)", fontSize: 14, fontWeight: 800, color: "var(--cor-erro)", boxShadow: "var(--shadow-sm)", marginTop: 4 },
};

export default function Perfil({ onSair }) {
  const [tela,  setTela]  = useState(null); // null | "editar" | "senha" | "endereco" | "ajuda" | "termos" | "privacidade"
  const [prefs, setPrefs] = useState({ not: true, tarifa: false, news: false });

  if (tela === "editar")     return <EditarDados  onVoltar={() => setTela(null)} />;
  if (tela === "senha")      return <AlterarSenha onVoltar={() => setTela(null)} />;
  if (tela === "endereco")   return <Endereco      onVoltar={() => setTela(null)} />;
  if (tela === "ajuda")      return <CentralAjuda  onVoltar={() => setTela(null)} />;
  if (tela === "termos")     return <Termos        onVoltar={() => setTela(null)} />;
  if (tela === "privacidade")return <Privacidade   onVoltar={() => setTela(null)} />;

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div style={s.blob1} />
        <div style={s.headerTitulo}>Perfil</div>
        <div style={s.headerSub}>Suas informações e preferências</div>
      </div>

      <div style={s.avatarWrap}>
        <div style={s.avatar}>JG</div>
        <div style={s.nomeWrap}>
          <div style={s.nome}>João Gaudêncio</div>
          <div style={s.email}>joao@email.com</div>
        </div>
        <button style={s.btnEditar} onClick={() => setTela("editar")}>
          <Pencil size={13} strokeWidth={2} /> Editar
        </button>
      </div>

      <div style={s.body}>
        <div style={s.secao}>
          <div style={s.secLabel}>Minha Conta</div>
          {[
            { label: "Editar dados pessoais", tela: "editar"   },
            { label: "Alterar senha",          tela: "senha"    },
            { label: "Endereço de entrega",    tela: "endereco" },
          ].map(item => (
            <div key={item.tela} style={s.item} onClick={() => setTela(item.tela)}>
              <span style={s.itemLabel}>{item.label}</span>
              <ChevronRight size={16} color="var(--cor-texto-claro)" strokeWidth={2.5} />
            </div>
          ))}
        </div>

        <div style={s.secao}>
          <div style={s.secLabel}>Preferências</div>
          {[
            { label: "Notificações de horários", key: "not"    },
            { label: "Alertas de tarifa",         key: "tarifa" },
            { label: "Newsletter Vambora",         key: "news"   },
          ].map(item => (
            <div key={item.key} style={s.item}>
              <span style={s.itemLabel}>{item.label}</span>
              <button style={s.toggle(prefs[item.key])} onClick={() => setPrefs(p => ({ ...p, [item.key]: !p[item.key] }))}>
                <div style={s.toggleDot(prefs[item.key])} />
              </button>
            </div>
          ))}
        </div>

        <div style={s.secao}>
          <div style={s.secLabel}>Suporte</div>
          {[
            { label: "Central de ajuda",         tela: "ajuda"       },
            { label: "Termos de uso",             tela: "termos"      },
            { label: "Política de privacidade",   tela: "privacidade" },
          ].map(item => (
            <div key={item.tela} style={s.item} onClick={() => setTela(item.tela)}>
              <span style={s.itemLabel}>{item.label}</span>
              <ChevronRight size={16} color="var(--cor-texto-claro)" strokeWidth={2.5} />
            </div>
          ))}
        </div>

        <button style={s.btnLogout} onClick={onSair}>
          <LogOut size={18} strokeWidth={2} /> Sair da conta
        </button>
      </div>
    </div>
  );
}
