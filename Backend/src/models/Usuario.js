import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
  nome:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  senha:    { type: String, required: true },
  telefone: { type: String, default: "" },
  endereco: {
    cep:         { type: String, default: "" },
    rua:         { type: String, default: "" },
    numero:      { type: String, default: "" },
    complemento: { type: String, default: "" },
    bairro:      { type: String, default: "" },
    cidade:      { type: String, default: "Penedo" },
    estado:      { type: String, default: "AL" },
  },
  preferencias: {
    notificacoesHorarios: { type: Boolean, default: true },
    alertasTarifa:        { type: Boolean, default: false },
    newsletter:           { type: Boolean, default: false },
  },
  cartao: {
    numero: { type: String, default: "4281" },
    tipo:   { type: String, enum: ["Comum", "Estudante", "Idoso"], default: "Comum" },
    saldo:  { type: Number, default: 22.50 },
  },
}, { timestamps: true });

export default mongoose.model("Usuario", UsuarioSchema);
