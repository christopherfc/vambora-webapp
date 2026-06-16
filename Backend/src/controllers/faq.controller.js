import prisma from "../config/prisma.js";
import { serializarFaq } from "../utils/serializers.js";

export const listarFaqs = async (req, res) => {
  try {
    const faqs = await prisma.faq.findMany({ orderBy: [{ ordem: "asc" }, { id: "asc" }] });
    res.json({ faqs: faqs.map(serializarFaq) });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar FAQs" });
  }
};
