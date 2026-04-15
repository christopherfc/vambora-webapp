import { useState } from "react";
import SubTela from "../../components/SubTela.jsx";
import Campo from "../../components/Campo.jsx";
import BtnSalvar from "../../components/BtnSalvar.jsx";
import Aviso from "../../components/Aviso.jsx";
import { atualizarEndereco } from "../../services/api.js";

export default function Endereco({ onVoltar, perfil }) {
  const end = perfil?.endereco || {};
  const [cep,         setCep]         = useState(end.cep         || "");
  const [rua,         setRua]         = useState(end.rua         || "");
  const [numero,      setNumero]      = useState(end.numero      || "");
  const [complemento, setComplemento] = useState(end.complemento || "");
  const [bairro,      setBairro]      = useState(end.bairro      || "");
  const [cidade,      setCidade]      = useState(end.cidade      || "Penedo");
  const [estado,      setEstado]      = useState(end.estado      || "AL");
  const [salvo,       setSalvo]       = useState(false);

  async function salvar() {
    try {
      await atualizarEndereco({ cep, rua, numero, complemento, bairro, cidade, estado });
      setSalvo(true);
      setTimeout(() => setSalvo(false), 2500);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <SubTela titulo="Endereço de Entrega" subtitulo="Onde você quer receber seu cartão" onVoltar={onVoltar}>
      <div style={{ padding: "20px 16px" }}>
        <div style={{ background: "#fff", borderRadius: 18, padding: "20px 16px", boxShadow: "var(--shadow-sm)" }}>
          <Campo label="CEP"          value={cep}    onChange={setCep}    placeholder="00000-000" />
          <Campo label="Rua / Avenida" value={rua}   onChange={setRua}    placeholder="Nome da rua" />
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: "0 0 110px" }}><Campo label="Número"      value={numero}      onChange={setNumero}      placeholder="123" /></div>
            <div style={{ flex: 1 }}          ><Campo label="Complemento" value={complemento} onChange={setComplemento} placeholder="Apto, bloco…" /></div>
          </div>
          <Campo label="Bairro" value={bairro} onChange={setBairro} placeholder="Seu bairro" />
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}          ><Campo label="Cidade" value={cidade} onChange={setCidade} /></div>
            <div style={{ flex: "0 0 80px" }} ><Campo label="Estado" value={estado} onChange={setEstado} /></div>
          </div>
          {salvo && <Aviso tipo="ok" texto="Endereço salvo com sucesso!" />}
          <BtnSalvar label="Salvar endereço" onClick={salvar} />
        </div>
      </div>
    </SubTela>
  );
}
