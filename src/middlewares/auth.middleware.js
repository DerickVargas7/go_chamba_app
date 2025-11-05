// middlewares/auth.middleware.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token requerido" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    req.usuario = {
      id: decoded.usuarioId,
      perfilId: decoded.perfilId || null,
      perfilTrabajadorId: decoded.perfilTrabajadorId || null,
      roles: decoded.roles || []
    };
    
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};