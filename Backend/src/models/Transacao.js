import mongoose from "mongoose";

const TransacaoSchema = new mongoose.Schema({
  usuario:   { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  descricao: { type: String, required: true },
  valor:     { type: Number, required: true },
  tipo:      { type: String, enum: ["onibus", "van", "barco", "recarga"], required: true },
  data:      { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Transacao", TransacaoSchema);
