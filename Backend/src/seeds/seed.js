import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";
import Linha from "../models/Linha.js";
import Transacao from "../models/Transacao.js";
import Notificacao from "../models/Notificacao.js";
import Faq from "../models/Faq.js";

const LINHAS_DATA = [
  {
    numero: 1,
    nome: "Linha 1 - Cerquinha / Centro",
    tipoTransporte: "onibus",
    tarifa: 3.50,
    infoPagamento: "Dinheiro, Cartão de Transporte, Pix",
    origem: "Cerquinha",
    destino: "Centro",
    ativo: true,
    rota: [[-10.294255,-36.58359],[-10.297785,-36.577432],[-10.295532,-36.572808],[-10.289189,-36.564065],[-10.285943,-36.55879],[-10.284805,-36.557183],[-10.285791,-36.551445],[-10.286889,-36.545254],[-10.289141,-36.535289],[-10.296331,-36.525677],[-10.311601,-36.523191]],
    horarios: {
      util: ["05:30","06:30","07:30","08:30","09:30","10:30","11:30","12:30","13:30","14:30","15:30","16:30","17:30","18:30","19:30","20:30","21:30"],
      sabado: ["06:00","07:30","09:00","10:30","12:00","14:00","16:00","18:00","20:00"],
      domingo_feriado: ["07:00","09:00","11:00","13:00","15:00","17:00"],
    },
  },
  {
    numero: 2,
    nome: "Linha 2 - Residencial Velho / Centro",
    tipoTransporte: "onibus",
    tarifa: 3.50,
    infoPagamento: "Dinheiro, Cartão de Transporte, Pix",
    origem: "Residencial Velho",
    destino: "Centro",
    ativo: true,
    rota: [[-10.294255,-36.58359],[-10.296589,-36.58056],[-10.297553,-36.578343],[-10.297459,-36.57672],[-10.296434,-36.575393],[-10.295853,-36.573119],[-10.294895,-36.572355],[-10.292947,-36.571767],[-10.291877,-36.571302],[-10.290461,-36.568025],[-10.288248,-36.562865]],
    horarios: {
      util: ["05:30","06:30","07:30","08:30","09:30","10:30","11:30","12:30","13:30","14:30","15:30","16:30","17:30","18:30","19:30","21:00"],
      sabado: ["06:00","07:30","09:00","11:00","13:00","15:00","17:30","20:00"],
      domingo_feriado: ["08:00","10:00","12:00","15:00","18:00"],
    },
  },
  {
    numero: 3,
    nome: "Linha 3 - Santa Luzia / Terminal",
    tipoTransporte: "onibus",
    tarifa: 3.50,
    infoPagamento: "Dinheiro, Cartão de Transporte",
    origem: "Santa Luzia",
    destino: "Terminal Central",
    ativo: true,
    rota: [[-10.294255,-36.58359],[-10.292294,-36.58524],[-10.288858,-36.582426],[-10.286721,-36.578746],[-10.284617,-36.573473],[-10.283423,-36.570446],[-10.282387,-36.568563],[-10.279652,-36.565654],[-10.27946,-36.563368]],
    horarios: {
      util: ["06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","22:00"],
      sabado: ["06:30","08:00","10:00","12:00","14:00","16:30","19:00"],
      domingo_feriado: ["08:00","10:30","13:00","16:00","18:00"],
    },
  },
  {
    numero: 4,
    nome: "Circular - Centro Histórico",
    tipoTransporte: "onibus",
    tarifa: 3.50,
    infoPagamento: "Dinheiro, Cartão de Transporte, Pix",
    origem: "Centro",
    destino: "Centro",
    ativo: true,
    rota: [[-10.294255,-36.58359],[-10.291698,-36.585755],[-10.288873,-36.580227],[-10.288702,-36.575943],[-10.286129,-36.579796],[-10.285769,-36.578427],[-10.287997,-36.581744],[-10.289824,-36.583379],[-10.289162,-36.585499],[-10.290745,-36.586454],[-10.293667,-36.584364],[-10.294255,-36.58359]],
    horarios: {
      util: ["06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"],
      sabado: ["07:00","09:00","11:00","13:00","15:00","17:00","19:00"],
      domingo_feriado: ["09:00","11:00","14:00","17:00"],
    },
  },
  {
    numero: 5,
    nome: "Van - Penedo / Paulo Barbosa Uchoa",
    tipoTransporte: "van",
    tarifa: 25.00,
    infoPagamento: "Dinheiro, Pix",
    origem: "Penedo",
    destino: "Paulo Barbosa Uchoa",
    ativo: true,
    rota: [[-10.294255,-36.58359],[-10.282614,-36.55802],[-10.263845,-36.55881],[-10.246519,-36.56296],[-10.236661,-36.566379],[-10.222938,-36.568911],[-10.210398,-36.567148],[-10.190000,-36.570000]],
    horarios: {
      util: ["05:00","07:00","09:00","11:00","13:00","15:00","17:00","19:00"],
      sabado: ["06:00","09:00","12:00","16:00"],
      domingo_feriado: ["07:00","11:00","15:00"],
    },
  },
  {
    numero: 6,
    nome: "Van - Penedo / Arapiraca",
    tipoTransporte: "van",
    tarifa: 35.00,
    infoPagamento: "Dinheiro, Pix",
    origem: "Penedo",
    destino: "Arapiraca",
    ativo: true,
    rota: [[-10.294255,-36.58359],[-10.282614,-36.55802],[-10.263845,-36.55881],[-10.222938,-36.568911],[-10.183972,-36.558469],[-10.168261,-36.554165],[-10.068579,-36.523013],[-10.020089,-36.506258],[-9.985816,-36.515775],[-9.967311,-36.521244],[-9.854537,-36.575034],[-9.830636,-36.590953],[-9.754629,-36.661694]],
    horarios: {
      util: ["05:00","07:00","09:00","13:00","17:00","19:00"],
      sabado: ["06:00","10:00","15:00"],
      domingo_feriado: ["07:00","13:00"],
    },
  },
  {
    numero: 7,
    nome: "Balsa - Penedo / Neópolis",
    tipoTransporte: "barco",
    tarifa: 6.00,
    infoPagamento: "Dinheiro",
    origem: "Penedo",
    destino: "Neópolis",
    ativo: true,
    rota: [[-10.292500,-36.586200],[-10.300000,-36.583000],[-10.310000,-36.579500],[-10.316966,-36.576913]],
    horarios: {
      util: ["06:00","07:30","09:00","10:30","12:00","13:30","15:00","16:30","18:00"],
      sabado: ["07:00","09:00","11:00","13:00","15:00","17:00"],
      domingo_feriado: ["08:00","10:00","12:00","16:00"],
    },
  },
  {
    numero: 8,
    nome: "Balsa Turística - Rio São Francisco",
    tipoTransporte: "barco",
    tarifa: 15.00,
    infoPagamento: "Dinheiro, Cartão, Pix",
    origem: "Porto de Penedo",
    destino: "Ilha do Ouro",
    ativo: true,
    rota: [[-10.292500,-36.586200],[-10.294000,-36.594000],[-10.296000,-36.606000],[-10.298000,-36.620000]],
    horarios: {
      util: ["08:00","10:00","12:00","14:00","16:00","18:00"],
      sabado: ["08:00","10:30","13:00","15:30","18:00"],
      domingo_feriado: ["09:00","11:00","14:00","17:00"],
    },
  },
];

const FAQS_DATA = [
  { pergunta: "Como recarregar meu cartão de transporte?", resposta: "Você pode recarregar na aba Saldo do aplicativo via Pix, ou nos pontos de recarga credenciados em Penedo.", ordem: 1 },
  { pergunta: "Onde comprar o cartão Vambora Penedo?", resposta: "O cartão pode ser solicitado na aba Saldo. Após o cadastro, ele será enviado ao endereço cadastrado no prazo de 5 dias úteis.", ordem: 2 },
  { pergunta: "Com quanto tempo de antecedência devo chegar?", resposta: "Os horários exibidos são os horários de partida na origem. Recomendamos chegar 5 minutos antes do horário marcado.", ordem: 3 },
  { pergunta: "A balsa aceita o cartão Vambora?", resposta: "Sim! As balsas Penedo/Neópolis e a Balsa Turística aceitam o cartão Vambora e pagamento em dinheiro.", ordem: 4 },
  { pergunta: "Como reportar um problema com uma linha?", resposta: "Na tela de horários de cada linha há um botão para reportar problemas. Você também pode ligar para (82) 3551-1234.", ordem: 5 },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📦 Conectado ao MongoDB");

    // Limpar todas as collections
    await Usuario.deleteMany({});
    await Linha.deleteMany({});
    await Transacao.deleteMany({});
    await Notificacao.deleteMany({});
    await Faq.deleteMany({});
    console.log("🗑️  Collections limpas");

    // 1. Criar usuário padrão
    const senhaHash = await bcrypt.hash("123456", 10);
    const usuario = await Usuario.create({
      nome: "João Gaudêncio",
      email: "joao@email.com",
      senha: senhaHash,
      telefone: "(82) 99999-0000",
      cartao: { numero: "4281", tipo: "Comum", saldo: 22.50 },
    });
    console.log(`👤 Usuário criado: ${usuario.nome} (${usuario.email})`);

    // 2. Inserir linhas
    const linhas = await Linha.insertMany(LINHAS_DATA);
    console.log(`🚌 ${linhas.length} linhas inseridas`);

    // 3. Inserir transações
    const agora = new Date();
    const transacoes = await Transacao.insertMany([
      { usuario: usuario._id, descricao: "Linha 1 — Cerquinha / Centro",     valor: -3.50,  tipo: "onibus",  data: new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 8, 32) },
      { usuario: usuario._id, descricao: "Recarga via Pix",                  valor: 20.00,  tipo: "recarga", data: new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 7, 55) },
      { usuario: usuario._id, descricao: "Balsa — Penedo / Neópolis",        valor: -6.00,  tipo: "barco",   data: new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() - 1, 14, 10) },
      { usuario: usuario._id, descricao: "Linha 3 — Santa Luzia / Terminal", valor: -3.50,  tipo: "onibus",  data: new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() - 1, 7, 20) },
      { usuario: usuario._id, descricao: "Recarga via Pix",                  valor: 50.00,  tipo: "recarga", data: new Date(agora.getFullYear(), agora.getMonth(), 12, 19, 40) },
      { usuario: usuario._id, descricao: "Van — Penedo / Arapiraca",         valor: -35.00, tipo: "van",     data: new Date(agora.getFullYear(), agora.getMonth(), 10, 6, 5) },
      { usuario: usuario._id, descricao: "Linha 4 — Circular Centro",        valor: -3.50,  tipo: "onibus",  data: new Date(agora.getFullYear(), agora.getMonth(), 9, 12, 30) },
    ]);
    console.log(`💳 ${transacoes.length} transações inseridas`);

    // 4. Inserir notificações
    const notificacoes = await Notificacao.insertMany([
      { usuario: usuario._id, tipo: "alerta",  titulo: "Linha 7 com horário alterado",  descricao: "A Balsa Penedo / Neópolis terá horários reduzidos neste final de semana devido à manutenção.", lida: false, data: new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 9, 15) },
      { usuario: usuario._id, tipo: "info",    titulo: "Nova linha disponível",          descricao: "A Linha 8 — Balsa Turística Rio São Francisco está disponível a partir de hoje.",              lida: false, data: new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 7, 0) },
      { usuario: usuario._id, tipo: "sucesso", titulo: "Recarga confirmada",             descricao: "Sua recarga de R$20,00 foi processada com sucesso e já está disponível no seu saldo.",          lida: true,  data: new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() - 1, 19, 42) },
      { usuario: usuario._id, tipo: "alerta",  titulo: "Atenção: Linha 3 suspensa",      descricao: "A Linha 3 — Santa Luzia / Terminal estará suspensa amanhã por conta de obras na via.",         lida: true,  data: new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() - 1, 14, 0) },
      { usuario: usuario._id, tipo: "info",    titulo: "Tarifa reajustada",              descricao: "A partir de 01/08, a tarifa das linhas de ônibus municipais passará para R$3,70.",             lida: true,  data: new Date(agora.getFullYear(), agora.getMonth(), 10, 8, 0) },
      { usuario: usuario._id, tipo: "sucesso", titulo: "Cadastro realizado com sucesso", descricao: "Bem-vindo ao Vambora Penedo! Seu cartão de transporte já está ativo.",                         lida: true,  data: new Date(agora.getFullYear(), agora.getMonth(), 8, 10, 30) },
    ]);
    console.log(`🔔 ${notificacoes.length} notificações inseridas`);

    // 5. Inserir FAQs
    const faqs = await Faq.insertMany(FAQS_DATA);
    console.log(`❓ ${faqs.length} FAQs inseridas`);

    console.log("\n✅ Seed concluído com sucesso!");
    console.log("   Login padrão: joao@email.com / 123456");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro no seed:", error);
    process.exit(1);
  }
}

seed();
