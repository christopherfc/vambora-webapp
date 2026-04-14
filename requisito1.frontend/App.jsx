import { useState } from "react";
import Login from "./Login.jsx";
import Loading from "./Loading.jsx";
import BottomNav from "./BottomNav.jsx";
import LinhasList from "./LinhasList.jsx";
import HorariosList from "./HorariosList.jsx";
import Mapa from "./Mapa.jsx";
import Saldo from "./Saldo.jsx";
import Notificacoes from "./Notificacoes.jsx";
import Perfil from "./Perfil.jsx";

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
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #fff; }
          input:focus { outline: none; }
        `}</style>
        <Login onEntrar={handleEntrar} />
      </>
    );
  }

  /* ── Tela de Loading (transição pós-login) ── */
  if (carregando) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #fff; }
        `}</style>
        <Loading onDone={handleLoadingDone} />
      </>
    );
  }

  /* ── App principal ── */
  function mudarAba(aba) {
    setAbaAtiva(aba);
    setLinhaSelecionada(null);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F7F3F3; }
        input:focus { outline: none; }
        button:focus { outline: none; }
      `}</style>

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
