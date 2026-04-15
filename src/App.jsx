import { useState } from "react";
import Login from "./pages/Login.jsx";
import Loading from "./pages/Loading.jsx";
import BottomNav from "./components/BottomNav.jsx";
import LinhasList from "./pages/LinhasList.jsx";
import HorariosList from "./pages/HorariosList.jsx";
import Mapa from "./pages/Mapa.jsx";
import Saldo from "./pages/Saldo.jsx";
import Notificacoes from "./pages/Notificacoes.jsx";
import Perfil from "./pages/Perfil.jsx";

export default function App() {
  const [logado,           setLogado]           = useState(false);
  const [carregando,       setCarregando]       = useState(false);
  const [abaAtiva,         setAbaAtiva]         = useState("rotas");
  const [linhaSelecionada, setLinhaSelecionada] = useState(null);

  function handleEntrar() {
    setCarregando(true);
  }

  function handleLoadingDone() {
    setCarregando(false);
    setLogado(true);
  }

  /* ── Tela de Login ── */
  if (!logado && !carregando) {
    return <Login onEntrar={handleEntrar} />;
  }

  /* ── Tela de Loading (transição pós-login) ── */
  if (carregando) {
    return <Loading onDone={handleLoadingDone} />;
  }

  /* ── App principal ── */
  function mudarAba(aba) {
    setAbaAtiva(aba);
    setLinhaSelecionada(null);
  }

  return (
    <>
      {abaAtiva === "rotas" && !linhaSelecionada && (
        <LinhasList onSelecionarLinha={setLinhaSelecionada} />
      )}
      {abaAtiva === "rotas" && linhaSelecionada && (
        <HorariosList
          linha={linhaSelecionada}
          onVoltar={() => setLinhaSelecionada(null)}
        />
      )}
      {abaAtiva === "mapa"         && <Mapa onVerHorarios={(linha) => { setLinhaSelecionada(linha); setAbaAtiva("rotas"); }} />}
      {abaAtiva === "saldo"        && <Saldo />}
      {abaAtiva === "notificacoes" && <Notificacoes />}
      {abaAtiva === "perfil"       && <Perfil onSair={() => setLogado(false)} />}

      <BottomNav abaAtiva={abaAtiva} onMudar={mudarAba} notificacoes={2} />
    </>
  );
}
