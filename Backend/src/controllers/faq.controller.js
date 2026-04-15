import Faq from "../models/Faq.js";

export const listarFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ ordem: 1 });
    res.json({ faqs });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar FAQs" });
  }
};
