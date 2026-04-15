import { useState, useEffect, useCallback } from "react";
import Login from "./pages/Login.jsx";
import Loading from "./pages/Loading.jsx";
import BottomNav from "./components/BottomNav.jsx";
import LinhasList from "./pages/LinhasList.jsx";
import HorariosList from "./pages/HorariosList.jsx";
import Mapa from "./pages/Mapa.jsx";
import Saldo from "./pages/Saldo.jsx";
import Notificacoes from "./pages/Notificacoes.jsx";
import Perfil from "./pages/Perfil.jsx";
import { estaLogado, logout, contarNotificacoesNaoLidas } from "./services/api.js";

export default function App() {
  const [logado,           setLogado]           = useState(estaLogado());
  const [carregando,       setCarregando]       = useState(false);
  const [abaAtiva,         setAbaAtiva]         = useState("rotas");
  const [linhaSelecionada, setLinhaSelecionada] = useState(null);
  const [notiCount,        setNotiCount]        = useState(0);

  /* ── Conta notificações não-lidas ── */
  const atualizarNotiCount = useCallback(async () => {
    if (!logado) return;
    try {
      const data = await contarNotificacoesNaoLidas();
      setNotiCount(data.count || 0);
    } catch { /* silencia */ }
  }, [logado]);

  useEffect(() => {
    atualizarNotiCount();
  }, [atualizarNotiCount, abaAtiva]);

  function handleEntrar() {
    setCarregando(true);
  }

  function handleLoadingDone() {
    setCarregando(false);
    setLogado(true);
  }

  function handleSair() {
    logout();
    setLogado(false);
    setAbaAtiva("rotas");
    setLinhaSelecionada(null);
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
      {abaAtiva === "notificacoes" && <Notificacoes onAtualizar={atualizarNotiCount} />}
      {abaAtiva === "perfil"       && <Perfil onSair={handleSair} />}

      <BottomNav abaAtiva={abaAtiva} onMudar={mudarAba} notificacoes={notiCount} />
    </>
  );
}
