import jwt from "jsonwebtoken";

export const generateAppToken = (payload) => {
  const JWT_SECRET = process.env.JWT_SECRET; 
  
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET no está configurado en las variables de entorno');
  }

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

export const verifyAppToken = (token) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET no está configurado');
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};