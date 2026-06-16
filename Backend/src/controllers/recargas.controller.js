import prisma from "../config/prisma.js";

const MP_API = "https://api.mercadopago.com";

function validarValor(valor) {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return null;
  const arredondado = Number(numero.toFixed(2));
  if (arredondado < 1 || arredondado > 100) return null;
  return arredondado;
}

function mpHeaders() {
  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!token) throw new Error("MERCADO_PAGO_ACCESS_TOKEN nao configurado");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export const criarRecarga = async (req, res) => {
  try {
    const valor = validarValor(req.body.valor);
    if (!valor) {
      return res.status(400).json({ mensagem: "Valor de recarga deve estar entre R$1 e R$100" });
    }

    const usuario = await prisma.user.findUnique({ where: { id: req.usuario } });
    if (!usuario) return res.status(404).json({ mensagem: "Usuario nao encontrado" });

    const recarga = await prisma.recarga.create({
      data: {
        usuarioId: req.usuario,
        valor,
      },
    });

    const backendUrl = process.env.BACKEND_URL || "";
    const frontendUrl = process.env.FRONTEND_URL || "";
    const preferencePayload = {
      items: [
        {
          id: `recarga-${recarga.id}`,
          title: "Recarga Vambora Penedo",
          description: `Recarga do cartao ${usuario.cartaoNumero}`,
          quantity: 1,
          currency_id: "BRL",
          unit_price: valor,
        },
      ],
      payer: {
        name: usuario.nome,
        email: usuario.email,
      },
      external_reference: String(recarga.id),
      notification_url: backendUrl ? `${backendUrl}/api/webhooks/mercado-pago` : undefined,
      back_urls: frontendUrl ? {
        success: `${frontendUrl}/`,
        failure: `${frontendUrl}/`,
        pending: `${frontendUrl}/`,
      } : undefined,
      auto_return: "approved",
    };

    const mpRes = await fetch(`${MP_API}/checkout/preferences`, {
      method: "POST",
      headers: mpHeaders(),
      body: JSON.stringify(preferencePayload),
    });
    const mpData = await mpRes.json();
    if (!mpRes.ok) {
      await prisma.recarga.update({ where: { id: recarga.id }, data: { status: "RECUSADA" } });
      return res.status(400).json({ mensagem: mpData.message || "Erro ao criar pagamento no Mercado Pago" });
    }

    const checkoutUrl = mpData.init_point || mpData.sandbox_init_point;
    const atualizada = await prisma.recarga.update({
      where: { id: recarga.id },
      data: {
        preferenceId: mpData.id,
        checkoutUrl,
      },
    });

    res.status(201).json({
      recarga: {
        id: atualizada.id,
        valor: Number(atualizada.valor),
        status: atualizada.status,
        checkoutUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ mensagem: error.message || "Erro ao criar recarga" });
  }
};

export const listarRecargas = async (req, res) => {
  try {
    const recargas = await prisma.recarga.findMany({
      where: { usuarioId: req.usuario },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    res.json({
      recargas: recargas.map((r) => ({
        id: r.id,
        valor: Number(r.valor),
        status: r.status,
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao listar recargas" });
  }
};

async function buscarPagamento(paymentId) {
  const res = await fetch(`${MP_API}/v1/payments/${paymentId}`, {
    headers: mpHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erro ao consultar pagamento");
  return data;
}

export const mercadoPagoWebhook = async (req, res) => {
  try {
    const paymentId = req.body?.data?.id || req.query?.id || req.query?.["data.id"];
    const type = req.body?.type || req.query?.type || req.query?.topic;

    res.status(200).json({ received: true });

    if (!paymentId || (type && !["payment", "merchant_order"].includes(type))) return;

    const pagamento = await buscarPagamento(paymentId);
    const recargaId = Number(pagamento.external_reference);
    if (!recargaId || pagamento.status !== "approved") {
      if (recargaId && ["rejected", "cancelled"].includes(pagamento.status)) {
        await prisma.recarga.updateMany({
          where: { id: recargaId, status: "PENDENTE" },
          data: { status: "RECUSADA", paymentId: String(paymentId) },
        });
      }
      return;
    }

    const recarga = await prisma.recarga.findUnique({ where: { id: recargaId } });
    if (!recarga || recarga.status === "APROVADA") return;

    await prisma.$transaction(async (tx) => {
      await tx.recarga.update({
        where: { id: recarga.id },
        data: {
          status: "APROVADA",
          paymentId: String(paymentId),
        },
      });
      await tx.user.update({
        where: { id: recarga.usuarioId },
        data: { saldo: { increment: Number(recarga.valor) } },
      });
      await tx.transacao.create({
        data: {
          usuarioId: recarga.usuarioId,
          descricao: "Recarga via Mercado Pago",
          valor: Number(recarga.valor),
          tipo: "recarga",
          data: new Date(),
        },
      });
    });
  } catch (error) {
    console.error("Erro no webhook Mercado Pago:", error);
  }
};
