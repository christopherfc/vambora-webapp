import mongoose from "mongoose";

const LinhaSchema = new mongoose.Schema({
  numero:         { type: Number, required: true },
  nome:           { type: String, required: true },
  tipoTransporte: { type: String, enum: ["onibus", "van", "barco"], required: true },
  tarifa:         { type: Number, required: true },
  infoPagamento:  { type: String, required: true },
  origem:         { type: String, required: true },
  destino:        { type: String, required: true },
  ativo:          { type: Boolean, default: true },
  rota:           { type: [[Number]], required: true },
  horarios: {
    util:            { type: [String], default: [] },
    sabado:          { type: [String], default: [] },
    domingo_feriado: { type: [String], default: [] },
  },
}, { timestamps: true });

export default mongoose.model("Linha", LinhaSchema);
