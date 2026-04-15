import { useState } from "react";
import SubTela from "../../components/SubTela.jsx";
import Campo from "../../components/Campo.jsx";
import BtnSalvar from "../../components/BtnSalvar.jsx";
import Aviso from "../../components/Aviso.jsx";
import { atualizarPerfil } from "../../services/api.js";

export default function EditarDados({ onVoltar, perfil }) {
  const [nome,     setNome]     = useState(perfil?.nome     || "");
  const [email,    setEmail]    = useState(perfil?.email    || "");
  const [telefone, setTelefone] = useState(perfil?.telefone || "");
  const [salvo,    setSalvo]    = useState(false);
  const [erro,     setErro]     = useState("");

  async function salvar() {
    setErro("");
    try {
      await atualizarPerfil({ nome, email, telefone });
      setSalvo(true);
      setTimeout(() => setSalvo(false), 2500);
    } catch (e) {
      setErro(e.message || "Erro ao salvar dados");
    }
  }

  return (
    <SubTela titulo="Editar Dados" subtitulo="Atualize suas informações pessoais" onVoltar={onVoltar}>
      <div style={{ padding: "20px 16px" }}>
        <div style={{ background: "#fff", borderRadius: 18, padding: "20px 16px", boxShadow: "var(--shadow-sm)" }}>
          <Campo label="Nome completo"  value={nome}     onChange={setNome}     placeholder="Seu nome" />
          <Campo label="E-mail"         value={email}    onChange={setEmail}    type="email" placeholder="seu@email.com" />
          <Campo label="Telefone"       value={telefone} onChange={setTelefone} placeholder="(00) 00000-0000" />
          {erro  && <Aviso tipo="erro" texto={erro} />}
          {salvo && <Aviso tipo="ok" texto="Dados salvos com sucesso!" />}
          <BtnSalvar label="Salvar alterações" onClick={salvar} />
        </div>
      </div>
    </SubTela>
  );
}
