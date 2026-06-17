import multer from "multer";

const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!TIPOS_PERMITIDOS.includes(file.mimetype)) {
      return cb(new Error("Envie apenas imagens JPG, PNG ou WEBP"));
    }
    cb(null, true);
  },
});

const camposDocumentos = upload.fields([
  { name: "documentoFrente", maxCount: 1 },
  { name: "documentoVerso", maxCount: 1 },
]);

export default function uploadDocumentos(req, res, next) {
  camposDocumentos(req, res, (error) => {
    if (!error) return next();
    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ mensagem: "Cada imagem deve ter no maximo 2MB" });
    }
    return res.status(400).json({ mensagem: error.message || "Erro ao enviar documentos" });
  });
}
