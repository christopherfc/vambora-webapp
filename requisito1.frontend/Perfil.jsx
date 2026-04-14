import { useState } from "react";
import { ChevronRight, LogOut, Pencil, ArrowLeft, Eye, EyeOff, Check, ChevronDown } from "lucide-react";

// ─── Header compartilhado das sub-telas ───────────────────────────────────────
function SubTela({ titulo, subtitulo, onVoltar, children }) {
  return (
    <div style={{ minHeight: "100vh", background: "#F7F3F3", fontFamily: "'Nunito', sans-serif", paddingBottom: 80 }}>
      <div style={{ background: "linear-gradient(135deg, #612828 0%, #8B3A3A 100%)", padding: "28px 20px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(254,138,0,0.12)", pointerEvents: "none" }} />
        <button onClick={onVoltar} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8, color: "#fff", fontFamily: "'Nunito', sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 18, position: "relative" }}>
          <ArrowLeft size={16} strokeWidth={2.5} /> Voltar
        </button>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", position: "relative" }}>{titulo}</div>
        {subtitulo && <div style={{ fontSize: 13, color: "#FFC886", fontWeight: 600, marginTop: 4, position: "relative" }}>{subtitulo}</div>}
      </div>
      {children}
    </div>
  );
}

// ─── Campo de formulário ──────────────────────────────────────────────────────
function Campo({ label, value, onChange, type = "text", placeholder = "", rightElement }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#9E7E7E", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ position: "relative" }}>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ width: "100%", padding: "14px 16px", paddingRight: rightElement ? 48 : 16, borderRadius: 12, border: "1.5px solid #E8DFDF", fontSize: 14, fontWeight: 600, color: "#2D1515", background: "#fff", fontFamily: "'Nunito', sans-serif", boxSizing: "border-box" }}
        />
        {rightElement && <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}>{rightElement}</div>}
      </div>
    </div>
  );
}

function BtnSalvar({ label, onClick }) {
  return (
    <button onClick={onClick} style={{ width: "100%", padding: 16, borderRadius: 14, border: "none", background: "linear-gradient(135deg, #612828, #8B3A3A)", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'Nunito', sans-serif" }}>
      {label}
    </button>
  );
}

function Aviso({ tipo, texto }) {
  const bg  = tipo === "erro"  ? "#FFF0F0" : "#E8FFF0";
  const cor = tipo === "erro"  ? "#C0392B" : "#1E8449";
  return (
    <div style={{ background: bg, borderRadius: 10, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8, color: cor, fontWeight: 700, fontSize: 13 }}>
      {tipo !== "erro" && <Check size={16} />}{texto}
    </div>
  );
}

// ─── Editar Dados Pessoais ────────────────────────────────────────────────────
function EditarDados({ onVoltar }) {
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
        <div style={{ background: "#fff", borderRadius: 18, padding: "20px 16px", boxShadow: "0 2px 10px rgba(97,40,40,0.06)" }}>
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

// ─── Alterar Senha ────────────────────────────────────────────────────────────
function AlterarSenha({ onVoltar }) {
  const [atual,        setAtual]        = useState("");
  const [nova,         setNova]         = useState("");
  const [confirma,     setConfirma]     = useState("");
  const [verAtual,     setVerAtual]     = useState(false);
  const [verNova,      setVerNova]      = useState(false);
  const [erro,         setErro]         = useState("");
  const [salvo,        setSalvo]        = useState(false);

  function salvar() {
    setErro("");
    if (!atual)              return setErro("Informe a senha atual.");
    if (nova.length < 6)     return setErro("A nova senha deve ter ao menos 6 caracteres.");
    if (nova !== confirma)   return setErro("As senhas não coincidem.");
    setSalvo(true);
    setTimeout(() => { setSalvo(false); onVoltar(); }, 2000);
  }

  const olhinho = (ver, set) => (
    <button type="button" onClick={() => set(!ver)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 0 }}>
      {ver ? <EyeOff size={18} color="#9E7E7E" /> : <Eye size={18} color="#9E7E7E" />}
    </button>
  );

  return (
    <SubTela titulo="Alterar Senha" subtitulo="Crie uma senha forte e segura" onVoltar={onVoltar}>
      <div style={{ padding: "20px 16px" }}>
        <div style={{ background: "#fff", borderRadius: 18, padding: "20px 16px", boxShadow: "0 2px 10px rgba(97,40,40,0.06)" }}>
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

// ─── Endereço de Entrega ──────────────────────────────────────────────────────
function Endereco({ onVoltar }) {
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
        <div style={{ background: "#fff", borderRadius: 18, padding: "20px 16px", boxShadow: "0 2px 10px rgba(97,40,40,0.06)" }}>
          <Campo label="CEP"          value={cep}    onChange={setCep}    placeholder="00000-000" />
          <Campo label="Rua / Avenida" value={rua}   onChange={setRua}    placeholder="Nome da rua" />
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: "0 0 110px" }}><Campo label="Número"      value={numero}      onChange={setNumero}      placeholder="123" /></div>
            <div style={{ flex: 1 }}           ><Campo label="Complemento" value={complemento} onChange={setComplemento} placeholder="Apto, bloco…" /></div>
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

// ─── Central de Ajuda ─────────────────────────────────────────────────────────
const FAQS = [
  { p: "Como recarregar meu cartão de transporte?",     r: "Você pode recarregar na aba Saldo do aplicativo via Pix, ou nos pontos de recarga credenciados em Penedo." },
  { p: "Onde comprar o cartão Vambora Penedo?",          r: "O cartão pode ser solicitado na aba Saldo. Após o cadastro, ele será enviado ao endereço cadastrado no prazo de 5 dias úteis." },
  { p: "Com quanto tempo de antecedência devo chegar?", r: "Os horários exibidos são os horários de partida na origem. Recomendamos chegar 5 minutos antes do horário marcado." },
  { p: "A balsa aceita o cartão Vambora?",               r: "Sim! As balsas Penedo/Neópolis e a Balsa Turística aceitam o cartão Vambora e pagamento em dinheiro." },
  { p: "Como reportar um problema com uma linha?",       r: "Na tela de horários de cada linha há um botão para reportar problemas. Você também pode ligar para (82) 3551-1234." },
];

function CentralAjuda({ onVoltar }) {
  const [aberto, setAberto] = useState(null);
  return (
    <SubTela titulo="Central de Ajuda" subtitulo="Perguntas frequentes" onVoltar={onVoltar}>
      <div style={{ padding: "20px 16px" }}>
        {FAQS.map((faq, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 16, marginBottom: 10, boxShadow: "0 2px 10px rgba(97,40,40,0.06)", overflow: "hidden" }}>
            <button onClick={() => setAberto(aberto === i ? null : i)} style={{ width: "100%", padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", fontFamily: "'Nunito', sans-serif", textAlign: "left" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#2D1515", flex: 1, paddingRight: 12 }}>{faq.p}</span>
              <ChevronDown size={16} color="#9E7E7E" style={{ transform: aberto === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
            </button>
            {aberto === i && (
              <div style={{ padding: "0 18px 16px", fontSize: 13, color: "#555", fontWeight: 600, lineHeight: 1.6, borderTop: "1px solid #F5EFEF", paddingTop: 12 }}>
                {faq.r}
              </div>
            )}
          </div>
        ))}
        <div style={{ background: "#FFF4E6", borderRadius: 16, padding: 18, marginTop: 8, textAlign: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#FE8A00", marginBottom: 4 }}>Ainda precisa de ajuda?</div>
          <div style={{ fontSize: 13, color: "#9E7E7E", fontWeight: 600 }}>Ligue: (82) 3551-1234</div>
          <div style={{ fontSize: 12, color: "#B0A0A0", fontWeight: 600, marginTop: 2 }}>Seg–Sex, 7h às 18h</div>
        </div>
      </div>
    </SubTela>
  );
}

// ─── Termos de Uso ────────────────────────────────────────────────────────────
const TERMOS = [
  ["1. Aceitação dos Termos",     "Ao utilizar o Vambora Penedo, você concorda com estes Termos. Caso não concorde, não utilize o aplicativo."],
  ["2. Uso do Aplicativo",        "O Vambora Penedo é um aplicativo de informações e gerenciamento de transporte público coletivo do município de Penedo, AL. O uso é permitido apenas para fins pessoais e não comerciais."],
  ["3. Cadastro e Conta",         "Para usar Saldo e Cartão de Transporte, é necessário criar uma conta. Você é responsável pela segurança das suas credenciais."],
  ["4. Cartão de Transporte",     "O cartão é pessoal e intransferível. O saldo é não reembolsável, salvo casos previstos em regulamento municipal."],
  ["5. Horários e Informações",   "Os horários têm caráter informativo. O município não se responsabiliza por atrasos causados por fatores externos (clima, trânsito, greves)."],
  ["6. Alterações destes Termos", "Estes termos podem ser atualizados a qualquer momento. Mudanças significativas serão comunicadas por notificação no app."],
];

function Termos({ onVoltar }) {
  return (
    <SubTela titulo="Termos de Uso" subtitulo="Última atualização: 01/07/2025" onVoltar={onVoltar}>
      <div style={{ padding: "20px 16px" }}>
        <div style={{ background: "#fff", borderRadius: 18, padding: "20px 18px", boxShadow: "0 2px 10px rgba(97,40,40,0.06)", fontSize: 13, color: "#444", fontWeight: 600, lineHeight: 1.8 }}>
          {TERMOS.map(([titulo, texto]) => (
            <div key={titulo} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#612828", marginBottom: 6 }}>{titulo}</div>
              <div>{texto}</div>
            </div>
          ))}
        </div>
      </div>
    </SubTela>
  );
}

// ─── Política de Privacidade ──────────────────────────────────────────────────
const PRIVACIDADE = [
  ["Dados que coletamos",      "Coletamos nome, e-mail, telefone e endereço para prestação do serviço. Também coletamos dados de uso do app para melhoria contínua."],
  ["Como usamos seus dados",   "Seus dados são usados para: (a) gerenciar seu cartão de transporte; (b) enviar notificações de horários e tarifas; (c) melhorar o aplicativo."],
  ["Compartilhamento",         "Não vendemos nem compartilhamos seus dados com terceiros, exceto quando exigido por lei ou para a prestação do serviço de transporte municipal."],
  ["Segurança",                "Utilizamos criptografia e boas práticas de segurança. O acesso é restrito a funcionários autorizados da Prefeitura de Penedo."],
  ["Seus direitos (LGPD)",     "Conforme a Lei 13.709/2018 (LGPD), você pode acessar, corrigir, portar e excluir seus dados. Solicite pelo e-mail: privacidade@penedo.al.gov.br."],
  ["Contato",                  "Dúvidas sobre privacidade? Entre em contato: privacidade@penedo.al.gov.br"],
];

function Privacidade({ onVoltar }) {
  return (
    <SubTela titulo="Política de Privacidade" subtitulo="Como tratamos seus dados" onVoltar={onVoltar}>
      <div style={{ padding: "20px 16px" }}>
        <div style={{ background: "#fff", borderRadius: 18, padding: "20px 18px", boxShadow: "0 2px 10px rgba(97,40,40,0.06)", fontSize: 13, color: "#444", fontWeight: 600, lineHeight: 1.8 }}>
          {PRIVACIDADE.map(([titulo, texto]) => (
            <div key={titulo} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#612828", marginBottom: 6 }}>{titulo}</div>
              <div>{texto}</div>
            </div>
          ))}
        </div>
      </div>
    </SubTela>
  );
}

// ─── Tela principal ───────────────────────────────────────────────────────────
const s = {
  container:    { minHeight: "100vh", background: "#F7F3F3", fontFamily: "'Nunito', sans-serif", paddingBottom: 80 },
  header:       { background: "linear-gradient(135deg, #612828 0%, #8B3A3A 100%)", padding: "44px 20px 72px", position: "relative", overflow: "hidden" },
  blob1:        { position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(254,138,0,0.13)", pointerEvents: "none" },
  headerTitulo: { fontSize: 24, fontWeight: 900, color: "#fff", position: "relative" },
  headerSub:    { fontSize: 13, color: "#FFC886", fontWeight: 600, marginTop: 4, position: "relative" },

  avatarWrap: { margin: "0 16px", marginTop: -46, display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 2, background: "#fff", borderRadius: 20, padding: "14px 16px", boxShadow: "0 4px 20px rgba(97,40,40,0.10)" },
  avatar:     { width: 60, height: 60, borderRadius: 18, background: "#FE8A00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: "#fff", flexShrink: 0 },
  nomeWrap:   { flex: 1 },
  nome:       { fontSize: 17, fontWeight: 900, color: "#2D1515" },
  email:      { fontSize: 12, color: "#9E7E7E", fontWeight: 600 },
  btnEditar:  { background: "#FFF4E6", border: "none", borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 800, color: "#FE8A00" },

  body:      { padding: "16px 16px" },
  secao:     { background: "#fff", borderRadius: 18, marginBottom: 14, boxShadow: "0 2px 10px rgba(97,40,40,0.06)", overflow: "hidden" },
  secLabel:  { fontSize: 11, fontWeight: 800, color: "#9E7E7E", letterSpacing: 1, textTransform: "uppercase", padding: "14px 18px 8px" },
  item:      { display: "flex", alignItems: "center", padding: "14px 18px", borderTop: "1px solid #F5EFEF", cursor: "pointer" },
  itemLabel: { flex: 1, fontSize: 14, fontWeight: 700, color: "#2D1515" },

  toggle:    (ativo) => ({ width: 44, height: 24, borderRadius: 999, background: ativo ? "#FE8A00" : "#E0D8D8", position: "relative", cursor: "pointer", border: "none", transition: "background 0.2s", flexShrink: 0 }),
  toggleDot: (ativo) => ({ position: "absolute", top: 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", left: ativo ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }),

  btnLogout: { width: "100%", padding: "16px", border: "none", background: "#fff", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer", fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 800, color: "#C0392B", boxShadow: "0 2px 10px rgba(97,40,40,0.06)", marginTop: 4 },
};

export default function Perfil({ onSair }) {
  const [tela,  setTela]  = useState(null); // null | "editar" | "senha" | "endereco" | "ajuda" | "termos" | "privacidade"
  const [prefs, setPrefs] = useState({ not: true, tarifa: false, news: false });

  if (tela === "editar")     return <EditarDados  onVoltar={() => setTela(null)} />;
  if (tela === "senha")      return <AlterarSenha onVoltar={() => setTela(null)} />;
  if (tela === "endereco")   return <Endereco      onVoltar={() => setTela(null)} />;
  if (tela === "ajuda")      return <CentralAjuda  onVoltar={() => setTela(null)} />;
  if (tela === "termos")     return <Termos        onVoltar={() => setTela(null)} />;
  if (tela === "privacidade")return <Privacidade   onVoltar={() => setTela(null)} />;

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div style={s.blob1} />
        <div style={s.headerTitulo}>Perfil</div>
        <div style={s.headerSub}>Suas informações e preferências</div>
      </div>

      <div style={s.avatarWrap}>
        <div style={s.avatar}>JG</div>
        <div style={s.nomeWrap}>
          <div style={s.nome}>João Gaudêncio</div>
          <div style={s.email}>joao@email.com</div>
        </div>
        <button style={s.btnEditar} onClick={() => setTela("editar")}>
          <Pencil size={13} strokeWidth={2} /> Editar
        </button>
      </div>

      <div style={s.body}>
        <div style={s.secao}>
          <div style={s.secLabel}>Minha Conta</div>
          {[
            { label: "Editar dados pessoais", tela: "editar"   },
            { label: "Alterar senha",          tela: "senha"    },
            { label: "Endereço de entrega",    tela: "endereco" },
          ].map(item => (
            <div key={item.tela} style={s.item} onClick={() => setTela(item.tela)}>
              <span style={s.itemLabel}>{item.label}</span>
              <ChevronRight size={16} color="#C4A0A0" strokeWidth={2.5} />
            </div>
          ))}
        </div>

        <div style={s.secao}>
          <div style={s.secLabel}>Preferências</div>
          {[
            { label: "Notificações de horários", key: "not"    },
            { label: "Alertas de tarifa",         key: "tarifa" },
            { label: "Newsletter Vambora",         key: "news"   },
          ].map(item => (
            <div key={item.key} style={s.item}>
              <span style={s.itemLabel}>{item.label}</span>
              <button style={s.toggle(prefs[item.key])} onClick={() => setPrefs(p => ({ ...p, [item.key]: !p[item.key] }))}>
                <div style={s.toggleDot(prefs[item.key])} />
              </button>
            </div>
          ))}
        </div>

        <div style={s.secao}>
          <div style={s.secLabel}>Suporte</div>
          {[
            { label: "Central de ajuda",         tela: "ajuda"       },
            { label: "Termos de uso",             tela: "termos"      },
            { label: "Política de privacidade",   tela: "privacidade" },
          ].map(item => (
            <div key={item.tela} style={s.item} onClick={() => setTela(item.tela)}>
              <span style={s.itemLabel}>{item.label}</span>
              <ChevronRight size={16} color="#C4A0A0" strokeWidth={2.5} />
            </div>
          ))}
        </div>

        <button style={s.btnLogout} onClick={onSair}>
          <LogOut size={18} strokeWidth={2} /> Sair da conta
        </button>
      </div>
    </div>
  );
}
