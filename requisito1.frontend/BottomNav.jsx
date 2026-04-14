import { Bus, MapPin, CreditCard, Bell, User } from "lucide-react";

const ABAS = [
  { id: "rotas",         label: "Rotas",  Icone: Bus        },
  { id: "mapa",          label: "Mapa",   Icone: MapPin     },
  { id: "saldo",         label: "Saldo",  Icone: CreditCard },
  { id: "notificacoes",  label: "Avisos", Icone: Bell       },
  { id: "perfil",        label: "Perfil", Icone: User       },
];

const s = {
  nav: {
    position: "fixed", bottom: 0, left: 0, right: 0,
    height: 64,
    background: "#fff",
    boxShadow: "0 -1px 0 #F0E8E8, 0 -4px 20px rgba(97,40,40,0.07)",
    display: "flex", alignItems: "center", justifyContent: "space-around",
    zIndex: 10000,
    fontFamily: "'Nunito', sans-serif",
  },
  item: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
    cursor: "pointer", background: "none", border: "none",
    padding: "4px 12px", borderRadius: 12, flex: 1,
    transition: "opacity 0.15s",
  },
};

export default function BottomNav({ abaAtiva, onMudar, notificacoes = 0 }) {
  return (
    <nav style={s.nav}>
      {ABAS.map(({ id, label, Icone }) => {
        const ativo = abaAtiva === id;
        const cor   = ativo ? "#FE8A00" : "#9E7E7E";
        return (
          <button key={id} style={s.item} onClick={() => onMudar(id)}>
            <div style={{ position: "relative" }}>
              <Icone size={22} color={cor} strokeWidth={ativo ? 2.25 : 1.75} />
              {id === "notificacoes" && notificacoes > 0 && (
                <span style={{
                  position: "absolute", top: -2, right: -4,
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#FE8A00", border: "2px solid #fff",
                }} />
              )}
            </div>
            <span style={{
              fontSize: 10,
              fontWeight: ativo ? 800 : 600,
              color: cor,
              letterSpacing: 0.3,
              fontFamily: "'Nunito', sans-serif",
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
