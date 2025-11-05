//generar token jwt
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET; 

export const generateAppToken = (payload) => {
  return jwt.sign(
    {
      usuarioId: payload.usuarioId,
      perfilId: payload.perfilId,
      perfilTrabajadorId: payload.perfilTrabajadorId || null,
      roles: payload.roles, 
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};