import { Bus, MapPin, CreditCard, Bell, User, Shield, Navigation } from "lucide-react";

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
    height: "var(--nav-height, 64px)",
    background: "var(--cor-fundo-card)",
    boxShadow: "var(--shadow-nav)",
    display: "flex", alignItems: "center", justifyContent: "space-around",
    zIndex: 10000,
    fontFamily: "var(--font-family)",
  },
  item: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
    cursor: "pointer", background: "none", border: "none",
    padding: "4px 12px", borderRadius: 12, flex: 1,
    transition: "opacity 0.15s",
  },
};

export default function BottomNav({ abaAtiva, onMudar, notificacoes = 0, admin = false, motorista = false }) {
  const abas = [
    ...ABAS,
    ...(motorista ? [{ id: "motorista", label: "Motor", Icone: Navigation }] : []),
    ...(admin ? [{ id: "admin", label: "Admin", Icone: Shield }] : []),
  ];
  return (
    <nav style={s.nav}>
      {abas.map(({ id, label, Icone }) => {
        const ativo = abaAtiva === id;
        const cor   = ativo ? "var(--cor-primaria)" : "var(--cor-texto-suave)";
        return (
          <button key={id} style={s.item} onClick={() => onMudar(id)}>
            <div style={{ position: "relative" }}>
              <Icone size={22} color={cor} strokeWidth={ativo ? 2.25 : 1.75} />
              {id === "notificacoes" && notificacoes > 0 && (
                <span style={{
                  position: "absolute", top: -2, right: -4,
                  width: 8, height: 8, borderRadius: "50%",
                  background: "var(--cor-primaria)", border: "2px solid #fff",
                }} />
              )}
            </div>
            <span style={{
              fontSize: 10,
              fontWeight: ativo ? 800 : 600,
              color: cor,
              letterSpacing: 0.3,
              fontFamily: "var(--font-family)",
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
