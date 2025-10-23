import prisma from "../../config/prismaClient.js"

export const registerWorkerService = async (usuarioId, data) => {
  const { descripcion, carnetIdentidad, oficios = [] } = data;

  // Buscar perfil del usuario
  const perfil = await prisma.perfil.findUnique({
    where: { usuarioId: usuarioId },
  });
  if (!perfil) throw new Error("El usuario no tiene un perfil válido.");

  // Verificar si ya tiene perfil de trabajador
  const existingWorker = await prisma.perfilTrabajador.findUnique({
    where: { perfilId: perfil.id },
  });
  if (existingWorker) {
    throw new Error("El usuario ya está registrado como trabajador.");
  }

  // Crear perfil de trabajador y sus relaciones dentro de una transaccion
  const result = await prisma.$transaction(async (tx) => {
    // Crear el perfil de trabajador
    const newWorkerProfile = await tx.perfilTrabajador.create({
      data: {
        perfilId: perfil.id,
        descripcion,
        carnetIdentidad,
      },
    });

    // Asociar los oficios seleccionados
    await Promise.all(
      oficios.map((oficioId) =>
        tx.trabajadorOficio.create({
          data: {
            perfilTrabajadorId: newWorkerProfile.id,
            oficioId,
          },
        })
      )
    );

    // Agregar el rol TRABAJADOR si no lo tiene
    const existingRole = await tx.usuarioRol.findFirst({
      where: { usuarioId: usuarioId, rol: "TRABAJADOR" },
    });

    if (!existingRole) {
      await tx.usuarioRol.create({
        data: {
          usuarioId: usuarioId,
          rol: "TRABAJADOR",
        },
      });
    }
    return newWorkerProfile;
  });

  return result;
};