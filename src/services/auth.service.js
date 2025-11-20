// src/services/auth.service.js
import  prisma  from "../../config/prismaClient.js";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
import { generateAppToken } from "../auth/tokenService.js";


// verificamos el token de google
export const verifyGoogleToken = async (id_token) => {
  const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload();
};

// creamos o buscamos el usuaario en la base de datos
export const findOrCreateGoogleUser = async (payload) => {
  const { email, sub, name, picture } = payload;

  let user = await prisma.usuario.findUnique({
    where: { email },
    include: {
      perfil: {
        include: {
          perfilTrabajador: true, 
        },
      },
      roles: true,
    },
  });

  let wasCreated = false;

  if (!user) {
    const [newUser] = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.usuario.create({
        data: {
          email,
          googleId: sub,
          perfil: {
            create: {
              nombreCompleto: name || "Usuario sin nombre",
              fotoUrl: picture || "",
              telefono: "",
            },
          },
        },
        include: {
          perfil: {
            include: { perfilTrabajador: true },
          },
          roles: true,
        },
      });

      await tx.usuarioRol.create({
        data: {
          usuarioId: createdUser.id,
          rol: "CLIENTE", // Por defecto cliente
        },
      });

      return [createdUser];
    });

    user = newUser;
    wasCreated = true;
  }

  return { user, wasCreated };
};



// finalizar el registro del usuario
export const completeGoogleRegistration = async (data) => {
  const { userId, nombreCompleto, direccion, departamento, telefono, password, fotoUrl, tiene_whatsapp } = data;

  const user = await prisma.usuario.findUnique({ where: { id: userId }, include: { perfil: true } });
  if (!user) throw new Error("Usuario no encontrado");

  // Validar si el teléfono ya está registrado por otro usuario
  const existingPhone = await prisma.usuario.findUnique({ where: { telefono } });
  if (existingPhone && existingPhone.id !== userId) {
    throw new Error("El número de teléfono ya está registrado.");
  }

  // Hash de contraseña si se ingresó
  const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;

  const updatedUser = await prisma.usuario.update({
    where: { id: userId },
    data: {
      telefono,
      departamento,
      password: hashedPassword,
      es_configurado: true,
      tiene_whatsapp: tiene_whatsapp,
      perfil: {
        update: {
          nombreCompleto,
          direccion,
          telefono,
          fotoUrl,
        },
      },
    },
    include: { perfil: true },
  });

  return updatedUser;
};

export const createUserService = async (data) => {
  const {
    email,
    password,
    nombreCompleto,
    telefono,
    fotoUrl,
    direccion,
    departamento,
    tiene_whatsapp
  } = data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.usuario.create({
        data: {
          email,
          password: hashedPassword,
          departamento,
          es_configurado: true,
          tiene_whatsapp,
          perfil: {
            create: {
              nombreCompleto,
              telefono,
              direccion,
              fotoUrl: fotoUrl || "",
            },
          },
        },
        include: { perfil: true },
      });

      await tx.usuarioRol.create({
        data: {
          usuarioId: createdUser.id,
          rol: "CLIENTE",
        },
      });

      return [createdUser];
    });

    const token = generateAppToken({
      usuarioId: user.id,
      perfilId: user.perfil.id,
      perfilTrabajadorId: null,
      roles: ["CLIENTE"],
    });

    return { user, token };

  } catch (error) {
    if (error.code === "P2002") {
      throw new Error("El correo electronico ya esta registrado. Intenta con otro.");
    }
    throw error;
  }
};


export const loginUserService = async (email, password) => {
  const user = await prisma.usuario.findUnique({
    where: { email },
    include: {
      perfil: true,
      roles: true,
    },
  });

  if (!user) {
    throw new Error("Credenciales inválidas. Revise su correo y contraseña.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Contraseña incorrecta.");
  }

  const es_trabajador = user.roles.some((rol) => rol.rol === "TRABAJADOR");
  
  let perfilTrabajadorId = null;
  if (es_trabajador) {
    const perfilTrabajador = await prisma.perfilTrabajador.findUnique({
      where: { perfilId: user.perfil.id },
      select: { id: true }
    });
    perfilTrabajadorId = perfilTrabajador?.id || null;
  }

  const token = generateAppToken({
    usuarioId: user.id,
    perfilId: user.perfil.id,
    perfilTrabajadorId,
    roles: user.roles.map(r => r.rol)
  });

  const { password: _, ...userWithoutPassword } = user;

  return {
    user: {
      ...userWithoutPassword,
      es_trabajador,
    },
    token,
  };
};
