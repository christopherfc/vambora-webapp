import { useState } from "react";
import { login, registrar } from "../services/api.js";

const s = {
  page: {
    minHeight: "100vh",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-family)",
    position: "relative",
    overflow: "hidden",
  },

  /* Blobs decorativos */
  blobTL: {
    position: "fixed", top: -60, left: -60,
    width: 260, height: 240,
    borderRadius: "71% 29% 62% 38% / 44% 57% 43% 56%",
    background: "var(--cor-primaria)",
    zIndex: 0,
  },
  blobTLSoft: {
    position: "fixed", top: 80, left: 10,
    width: 200, height: 180,
    borderRadius: "38% 62% 42% 58% / 60% 36% 64% 40%",
    background: "#F5C99A",
    zIndex: 0,
  },
  blobTR: {
    position: "fixed", top: 60, right: -24,
    width: 70, height: 120,
    borderRadius: "62% 38% 46% 54% / 38% 65% 35% 62%",
    background: "var(--cor-vinho-escuro)",
    zIndex: 0,
  },
  blobBR: {
    position: "fixed", bottom: -50, right: -50,
    width: 230, height: 210,
    borderRadius: "42% 58% 35% 65% / 57% 40% 60% 43%",
    background: "#F5C99A",
    zIndex: 0,
  },

  form: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: 340,
    padding: "0 24px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  logo: {
    fontSize: 36,
    fontWeight: 900,
    letterSpacing: "-1px",
    lineHeight: 1,
    marginBottom: 4,
  },
  logoSub: {
    fontSize: 13,
    color: "var(--cor-texto-suave)",
    fontWeight: 600,
    marginBottom: 16,
  },

  titulo: {
    fontSize: 32,
    fontWeight: 900,
    color: "#1a1a1a",
    lineHeight: 1.1,
    marginBottom: 8,
  },

  input: {
    width: "100%",
    padding: "14px 18px",
    borderRadius: 12,
    border: "none",
    background: "#F2F2F2",
    fontSize: 14,
    fontFamily: "var(--font-family)",
    outline: "none",
    color: "#333",
    boxSizing: "border-box",
  },

  phoneRow: {
    display: "flex",
    gap: 0,
    background: "#F2F2F2",
    borderRadius: 12,
    overflow: "hidden",
  },
  phoneFlag: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: "14px 12px",
    fontSize: 14,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontFamily: "var(--font-family)",
    color: "#333",
    borderRight: "1px solid #E0E0E0",
    whiteSpace: "nowrap",
  },
  phoneInput: {
    flex: 1,
    padding: "14px 12px",
    border: "none",
    background: "transparent",
    fontSize: 14,
    fontFamily: "var(--font-family)",
    outline: "none",
    color: "#333",
  },

  linkEsqueci: {
    fontSize: 12,
    color: "#555",
    textDecoration: "underline",
    cursor: "pointer",
    background: "none",
    border: "none",
    fontFamily: "var(--font-family)",
    textAlign: "left",
    padding: 0,
    marginTop: -4,
  },

  btnPrimario: {
    width: "100%",
    padding: "15px",
    borderRadius: 12,
    border: "none",
    background: "var(--cor-primaria)",
    color: "#fff",
    fontSize: 16,
    fontWeight: 800,
    cursor: "pointer",
    fontFamily: "var(--font-family)",
    marginTop: 4,
    transition: "opacity 0.2s",
  },

  btnDesabilitado: {
    width: "100%",
    padding: "15px",
    borderRadius: 12,
    border: "none",
    background: "#ccc",
    color: "#fff",
    fontSize: 16,
    fontWeight: 800,
    cursor: "not-allowed",
    fontFamily: "var(--font-family)",
    marginTop: 4,
  },

  linkSecundario: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "var(--font-family)",
    textDecoration: "underline",
    padding: 0,
  },

  linkDestaque: {
    color: "var(--cor-primaria)",
    fontWeight: 700,
    textDecoration: "underline",
    cursor: "pointer",
    background: "none",
    border: "none",
    fontFamily: "var(--font-family)",
    fontSize: 13,
  },

  rodape: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    fontSize: 13,
    color: "#555",
  },

  erro: {
    background: "var(--cor-erro-fundo, #FFF0F0)",
    color: "var(--cor-erro, #C0392B)",
    padding: "10px 14px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 700,
    textAlign: "center",
  },
};

export default function Login({ onEntrar }) {
  const [tela, setTela] = useState("login"); // "login" | "cadastro"
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      await login(email, senha);
      onEntrar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  }

  async function handleCadastro(e) {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      await registrar(nome, email, senha, telefone);
      onEntrar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div style={s.page}>
      <style>{`
        @keyframes morphTL {
          0%   { border-radius: 71% 29% 62% 38% / 44% 57% 43% 56%; transform: translate(0,0) scale(1); }
          33%  { border-radius: 42% 58% 75% 25% / 60% 35% 65% 40%; transform: translate(8px, 12px) scale(1.04); }
          66%  { border-radius: 58% 42% 38% 62% / 35% 68% 32% 65%; transform: translate(-6px, 6px) scale(0.97); }
          100% { border-radius: 71% 29% 62% 38% / 44% 57% 43% 56%; transform: translate(0,0) scale(1); }
        }
        @keyframes morphTLSoft {
          0%   { border-radius: 38% 62% 42% 58% / 60% 36% 64% 40%; transform: translate(0,0) scale(1); }
          33%  { border-radius: 65% 35% 58% 42% / 40% 62% 38% 60%; transform: translate(-10px, 8px) scale(1.05); }
          66%  { border-radius: 50% 50% 30% 70% / 55% 45% 55% 45%; transform: translate(6px, -10px) scale(0.96); }
          100% { border-radius: 38% 62% 42% 58% / 60% 36% 64% 40%; transform: translate(0,0) scale(1); }
        }
        @keyframes morphTR {
          0%   { border-radius: 62% 38% 46% 54% / 38% 65% 35% 62%; transform: translate(0,0) scale(1); }
          50%  { border-radius: 38% 62% 62% 38% / 55% 42% 58% 45%; transform: translate(-6px, 14px) scale(1.08); }
          100% { border-radius: 62% 38% 46% 54% / 38% 65% 35% 62%; transform: translate(0,0) scale(1); }
        }
        @keyframes morphBR {
          0%   { border-radius: 42% 58% 35% 65% / 57% 40% 60% 43%; transform: translate(0,0) scale(1); }
          33%  { border-radius: 60% 40% 55% 45% / 40% 60% 40% 60%; transform: translate(-10px, -8px) scale(1.06); }
          66%  { border-radius: 35% 65% 42% 58% / 62% 38% 55% 45%; transform: translate(8px, -14px) scale(0.95); }
          100% { border-radius: 42% 58% 35% 65% / 57% 40% 60% 43%; transform: translate(0,0) scale(1); }
        }
        .blob-tl      { animation: morphTL     9s ease-in-out infinite; }
        .blob-tl-soft { animation: morphTLSoft 11s ease-in-out infinite; }
        .blob-tr      { animation: morphTR     7s ease-in-out infinite; }
        .blob-br      { animation: morphBR     10s ease-in-out infinite; }
      `}</style>

      {/* Blobs */}
      <div style={s.blobTL} className="blob-tl" />
      <div style={s.blobTLSoft} className="blob-tl-soft" />
      <div style={s.blobTR} className="blob-tr" />
      <div style={s.blobBR} className="blob-br" />

      {tela === "login" ? (
        <form style={s.form} onSubmit={handleLogin}>
          <div style={s.logo}>
            <span style={{ color: "var(--cor-primaria)" }}>vam</span>
            <span style={{ color: "var(--cor-texto)" }}>bora</span>
            <span style={{ color: "var(--cor-primaria)" }}>.</span>
            <span style={{ color: "var(--cor-texto)", fontSize: 22, fontWeight: 700 }}> penedo</span>
          </div>
          <div style={s.logoSub}>Conectando pessoas, movendo Penedo.</div>
          <input
            style={s.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            style={s.input}
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
          />
          <button type="button" style={s.linkEsqueci}>
            Esqueci minha senha!
          </button>
          {erro && tela === "login" && <div style={s.erro}>{erro}</div>}
          <button type="submit" style={enviando ? s.btnDesabilitado : s.btnPrimario} disabled={enviando}>
            {enviando ? "Entrando..." : "Entrar"}
          </button>
          <div style={s.rodape}>
            <span>Ainda não tem uma conta?</span>
            <button
              type="button"
              style={s.linkDestaque}
              onClick={() => setTela("cadastro")}
            >
              Crie aqui!
            </button>
          </div>
        </form>
      ) : (
        <form style={s.form} onSubmit={handleCadastro}>
          <div style={s.logo}>
            <span style={{ color: "var(--cor-primaria)" }}>vam</span>
            <span style={{ color: "var(--cor-texto)" }}>bora</span>
            <span style={{ color: "var(--cor-primaria)" }}>.</span>
            <span style={{ color: "var(--cor-texto)", fontSize: 22, fontWeight: 700 }}> penedo</span>
          </div>
          <div style={s.titulo}>Criar<br />Conta</div>
          <input
            style={s.input}
            type="text"
            placeholder="Nome completo"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
          />
          <input
            style={s.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            style={s.input}
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
          />
          <div style={s.phoneRow}>
            <span style={s.phoneFlag}>🇧🇷 ▾</span>
            <input
              style={s.phoneInput}
              type="tel"
              placeholder="Seu número"
              value={telefone}
              onChange={e => setTelefone(e.target.value)}
            />
          </div>
          {erro && tela === "cadastro" && <div style={s.erro}>{erro}</div>}
          <button type="submit" style={enviando ? s.btnDesabilitado : s.btnPrimario} disabled={enviando}>
            {enviando ? "Criando conta..." : "Finalizar"}
          </button>
          <button
            type="button"
            style={s.linkSecundario}
            onClick={() => setTela("login")}
          >
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
}
