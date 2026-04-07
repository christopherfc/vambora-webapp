import { useState } from "react";
import LinhasList from "./components/LinhasList.jsx";
import HorariosList from "./components/HorariosList.jsx";

export default function App() {
  const [linhaSelecionada, setLinhaSelecionada] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #FCFAFA; }
        input:focus { border-color: #FE8A00 !important; }
      `}</style>

      {linhaSelecionada === null ? (
        <LinhasList onSelecionarLinha={linha => setLinhaSelecionada(linha)} />
      ) : (
        <HorariosList
          linha={linhaSelecionada}
          onVoltar={() => setLinhaSelecionada(null)}
        />
      )}
    </>
  );
}
