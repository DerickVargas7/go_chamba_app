//generar token jwt
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET; 

export const generateAppToken = (usuarioId) => {
  return jwt.sign({ usuarioId }, JWT_SECRET, { expiresIn: "7d" });
};