import mongoose from "mongoose";

const FaqSchema = new mongoose.Schema({
  pergunta: { type: String, required: true },
  resposta: { type: String, required: true },
  ordem:    { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Faq", FaqSchema);
