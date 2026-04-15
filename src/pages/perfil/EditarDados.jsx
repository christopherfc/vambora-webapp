import { useState } from "react";
import SubTela from "../../components/SubTela.jsx";
import Campo from "../../components/Campo.jsx";
import BtnSalvar from "../../components/BtnSalvar.jsx";
import Aviso from "../../components/Aviso.jsx";

export default function EditarDados({ onVoltar }) {
  const [nome,     setNome]     = useState("João Gaudêncio");
  const [email,    setEmail]    = useState("joao@email.com");
  const [telefone, setTelefone] = useState("(82) 99999-0000");
  const [salvo,    setSalvo]    = useState(false);

  function salvar() {
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);
  }

  return (
    <SubTela titulo="Editar Dados" subtitulo="Atualize suas informações pessoais" onVoltar={onVoltar}>
      <div style={{ padding: "20px 16px" }}>
        <div style={{ background: "#fff", borderRadius: 18, padding: "20px 16px", boxShadow: "var(--shadow-sm)" }}>
          <Campo label="Nome completo"  value={nome}     onChange={setNome}     placeholder="Seu nome" />
          <Campo label="E-mail"         value={email}    onChange={setEmail}    type="email" placeholder="seu@email.com" />
          <Campo label="Telefone"       value={telefone} onChange={setTelefone} placeholder="(00) 00000-0000" />
          {salvo && <Aviso tipo="ok" texto="Dados salvos com sucesso!" />}
          <BtnSalvar label="Salvar alterações" onClick={salvar} />
        </div>
      </div>
    </SubTela>
  );
}
