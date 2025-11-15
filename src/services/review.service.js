import prisma from "../../config/prismaClient.js"

export const crearReseñaService = async (autorId, solicitudId, calificacion, comentario) => {
  const solicitud = await prisma.solicitudServicio.findUnique({
    where: { id: solicitudId },
    include: {
      cliente: true,
      servicio: {
        include: {
          PerfilTrabajador: {
            include: {
              perfil: true
            }
          }
        }
      }
    }
  });

  if (!solicitud) throw new Error("Solicitud no encontrada.");
  if (solicitud.estado !== "COMPLETADA")
    throw new Error("Solo puedes reseñar solicitudes completadas.");

  // El autor debe ser el cliente
  if (solicitud.clienteId !== autorId)
    throw new Error("No autorizado para reseñar este servicio.");

  const objetivoId = solicitud.servicio.PerfilTrabajador.perfil.usuarioId;

  return prisma.reseña.create({
    data: {
      autorId,
      objetivoId,
      solicitudId,
      calificacion,
      comentario,
    },
  });
};

export const getReseñasPerfilService = async (usuarioId) => {
  return prisma.reseña.findMany({
    where: { objetivoId: usuarioId },
    include: {
      autor: {
        select: {
          id: true,
          email: true,
          perfil: {
            select: {
              nombreCompleto: true,
              fotoUrl: true,
            },
          },
        },
      }
    }
  });
};
