import { LINHAS, HORARIOS } from "../data/mock.js";

const DELAY = 600;

function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function buscarLinhas(tipo = "", busca = "") {
  await esperar(DELAY);

  let resultado = [...LINHAS];

  if (tipo) {
    resultado = resultado.filter(l => l.tipoTransporte === tipo);
  }

  if (busca) {
    const termo = busca.toLowerCase();
    resultado = resultado.filter(l =>
      l.nome.toLowerCase().includes(termo)   ||
      l.origem.toLowerCase().includes(termo) ||
      l.destino.toLowerCase().includes(termo)
    );
  }

  return { total: resultado.length, linhas: resultado };
}

export async function buscarHorarios(idLinha) {
  await esperar(DELAY);

  const linha    = LINHAS.find(l => l._id === String(idLinha));
  const horarios = HORARIOS[String(idLinha)];

  if (!linha || !horarios) throw new Error("Linha não encontrada.");

  return { linha, horarios };
}
