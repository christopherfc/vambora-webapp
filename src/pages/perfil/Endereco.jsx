import { useState } from "react";
import SubTela from "../../components/SubTela.jsx";
import Campo from "../../components/Campo.jsx";
import BtnSalvar from "../../components/BtnSalvar.jsx";
import Aviso from "../../components/Aviso.jsx";

export default function Endereco({ onVoltar }) {
  const [cep,         setCep]         = useState("");
  const [rua,         setRua]         = useState("");
  const [numero,      setNumero]      = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro,      setBairro]      = useState("");
  const [cidade,      setCidade]      = useState("Penedo");
  const [estado,      setEstado]      = useState("AL");
  const [salvo,       setSalvo]       = useState(false);

  function salvar() {
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);
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
