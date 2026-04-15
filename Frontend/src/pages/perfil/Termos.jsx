import SubTela from "../../components/SubTela.jsx";

const TERMOS = [
  ["1. Aceitação dos Termos",     "Ao utilizar o Vambora Penedo, você concorda com estes Termos. Caso não concorde, não utilize o aplicativo."],
  ["2. Uso do Aplicativo",        "O Vambora Penedo é um aplicativo de informações e gerenciamento de transporte público coletivo do município de Penedo, AL. O uso é permitido apenas para fins pessoais e não comerciais."],
  ["3. Cadastro e Conta",         "Para usar Saldo e Cartão de Transporte, é necessário criar uma conta. Você é responsável pela segurança das suas credenciais."],
  ["4. Cartão de Transporte",     "O cartão é pessoal e intransferível. O saldo é não reembolsável, salvo casos previstos em regulamento municipal."],
  ["5. Horários e Informações",   "Os horários têm caráter informativo. O município não se responsabiliza por atrasos causados por fatores externos (clima, trânsito, greves)."],
  ["6. Alterações destes Termos", "Estes termos podem ser atualizados a qualquer momento. Mudanças significativas serão comunicadas por notificação no app."],
];

export default function Termos({ onVoltar }) {
  return (
    <SubTela titulo="Termos de Uso" subtitulo="Última atualização: 01/07/2025" onVoltar={onVoltar}>
      <div style={{ padding: "20px 16px" }}>
        <div style={{ background: "#fff", borderRadius: 18, padding: "20px 18px", boxShadow: "var(--shadow-sm)", fontSize: 13, color: "var(--cor-texto-body)", fontWeight: 600, lineHeight: 1.8 }}>
          {TERMOS.map(([titulo, texto]) => (
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
