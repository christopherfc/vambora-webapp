import mongoose from "mongoose";

const NotificacaoSchema = new mongoose.Schema({
  usuario:   { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  tipo:      { type: String, enum: ["alerta", "info", "sucesso"], required: true },
  titulo:    { type: String, required: true },
  descricao: { type: String, required: true },
  lida:      { type: Boolean, default: false },
  data:      { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Notificacao", NotificacaoSchema);
