import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import SubTela from "../../components/SubTela.jsx";
import Campo from "../../components/Campo.jsx";
import BtnSalvar from "../../components/BtnSalvar.jsx";
import Aviso from "../../components/Aviso.jsx";
import { alterarSenha } from "../../services/api.js";

export default function AlterarSenha({ onVoltar }) {
  const [atual,        setAtual]        = useState("");
  const [nova,         setNova]         = useState("");
  const [confirma,     setConfirma]     = useState("");
  const [verAtual,     setVerAtual]     = useState(false);
  const [verNova,      setVerNova]      = useState(false);
  const [erro,         setErro]         = useState("");
  const [salvo,        setSalvo]        = useState(false);

  async function salvar() {
    setErro("");
    if (!atual)              return setErro("Informe a senha atual.");
    if (nova.length < 6)     return setErro("A nova senha deve ter ao menos 6 caracteres.");
    if (nova !== confirma)   return setErro("As senhas não coincidem.");

    try {
      await alterarSenha(atual, nova);
      setSalvo(true);
      setTimeout(() => { setSalvo(false); onVoltar(); }, 2000);
    } catch (e) {
      setErro(e.message || "Erro ao alterar senha");
    }
  }

  const olhinho = (ver, set) => (
    <button type="button" onClick={() => set(!ver)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0 }}>
      {ver ? <EyeOff size={18} color="var(--cor-texto-suave)" /> : <Eye size={18} color="var(--cor-texto-suave)" />}
    </button>
  );

  return (
    <SubTela titulo="Alterar Senha" subtitulo="Crie uma senha forte e segura" onVoltar={onVoltar}>
      <div style={{ padding: "20px 16px" }}>
        <div style={{ background: "#fff", borderRadius: 18, padding: "20px 16px", boxShadow: "var(--shadow-sm)" }}>
          <Campo label="Senha atual"        value={atual}    onChange={setAtual}    type={verAtual ? "text" : "password"} placeholder="••••••••"             rightElement={olhinho(verAtual, setVerAtual)} />
          <Campo label="Nova senha"         value={nova}     onChange={setNova}     type={verNova  ? "text" : "password"} placeholder="mínimo 6 caracteres"   rightElement={olhinho(verNova,  setVerNova)}  />
          <Campo label="Confirmar nova senha" value={confirma} onChange={setConfirma} type={verNova  ? "text" : "password"} placeholder="repita a nova senha" />
          {erro  && <Aviso tipo="erro" texto={erro} />}
          {salvo && <Aviso tipo="ok"   texto="Senha alterada! Voltando..." />}
          <BtnSalvar label="Alterar senha" onClick={salvar} />
        </div>
      </div>
    </SubTela>
  );
}
