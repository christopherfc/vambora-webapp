import SubTela from "../../components/SubTela.jsx";

const PRIVACIDADE = [
  ["Dados que coletamos",      "Coletamos nome, e-mail, telefone e endereço para prestação do serviço. Também coletamos dados de uso do app para melhoria contínua."],
  ["Como usamos seus dados",   "Seus dados são usados para: (a) gerenciar seu cartão de transporte; (b) enviar notificações de horários e tarifas; (c) melhorar o aplicativo."],
  ["Compartilhamento",         "Não vendemos nem compartilhamos seus dados com terceiros, exceto quando exigido por lei ou para a prestação do serviço de transporte municipal."],
  ["Segurança",                "Utilizamos criptografia e boas práticas de segurança. O acesso é restrito a funcionários autorizados da Prefeitura de Penedo."],
  ["Seus direitos (LGPD)",     "Conforme a Lei 13.709/2018 (LGPD), você pode acessar, corrigir, portar e excluir seus dados. Solicite pelo e-mail: privacidade@penedo.al.gov.br."],
  ["Contato",                  "Dúvidas sobre privacidade? Entre em contato: privacidade@penedo.al.gov.br"],
];

export default function Privacidade({ onVoltar }) {
  return (
    <SubTela titulo="Política de Privacidade" subtitulo="Como tratamos seus dados" onVoltar={onVoltar}>
      <div style={{ padding: "20px 16px" }}>
        <div style={{ background: "#fff", borderRadius: 18, padding: "20px 18px", boxShadow: "var(--shadow-sm)", fontSize: 13, color: "var(--cor-texto-body)", fontWeight: 600, lineHeight: 1.8 }}>
          {PRIVACIDADE.map(([titulo, texto]) => (
            <div key={titulo} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "var(--cor-vinho)", marginBottom: 6 }}>{titulo}</div>
              <div>{texto}</div>
            </div>
          ))}
        </div>
      </div>
    </SubTela>
  );
}
