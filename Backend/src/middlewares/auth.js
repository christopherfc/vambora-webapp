import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ mensagem: "Token nao fornecido" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = Number(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({ mensagem: "Token invalido ou expirado" });
  }
};

export default auth;
