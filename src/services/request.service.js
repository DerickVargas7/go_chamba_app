import prisma from "../../config/prismaClient.js";

export const getSolicitudesTrabajadorService = async (perfilTrabajadorId) => {
  const solicitudes = await prisma.solicitudServicio.findMany({
    where: {
      servicio: {
        perfilTrabajadorId
      }
    },
    orderBy: { creadoEn: "desc" },
    include: {
      cliente: {
        select: {
          id: true,
          email: true,
          telefono: true,
          perfil: {
            select: { nombreCompleto: true, fotoUrl: true }
          }
        }
      },
      servicio: {
        select: {
          id: true,
          titulo: true,
          precio: true,
          descripcion: true
        }
      }
    }
  });

  return solicitudes;
};


export const aceptarSolicitudService = async (perfilTrabajadorId, solicitudId) => {
  const solicitud = await prisma.solicitudServicio.findUnique({
    where: { id: solicitudId },
    include: {
      servicio: { select: { perfilTrabajadorId: true } }
    }
  });

  if (!solicitud) throw new Error("Solicitud no encontrada.");

  if (solicitud.servicio.perfilTrabajadorId !== perfilTrabajadorId)
    throw new Error("No tienes permiso para aceptar esta solicitud.");

  return prisma.solicitudServicio.update({
    where: { id: solicitudId },
    data: { estado: "ACEPTADA" }
  });
};


export const rechazarSolicitudService = async (perfilTrabajadorId, solicitudId) => {
  const solicitud = await prisma.solicitudServicio.findUnique({
    where: { id: solicitudId },
    include: {
      servicio: { select: { perfilTrabajadorId: true } }
    }
  });

  if (!solicitud) throw new Error("Solicitud no encontrada.");

  if (solicitud.servicio.perfilTrabajadorId !== perfilTrabajadorId)
    throw new Error("No tienes permiso para rechazar esta solicitud.");

  return prisma.solicitudServicio.update({
    where: { id: solicitudId },
    data: { estado: "RECHAZADA" }
  });
};

export const completarSolicitudService = async (perfilTrabajadorId, solicitudId) => {
  const solicitud = await prisma.solicitudServicio.findUnique({
    where: { id: solicitudId },
    include: { servicio: true },
  });

  if (!solicitud) throw new Error("Solicitud no encontrada.");

  if (solicitud.servicio.perfilTrabajadorId !== perfilTrabajadorId)
    throw new Error("No autorizado.");

  return prisma.solicitudServicio.update({
    where: { id: solicitudId },
    data: { estado: "COMPLETADA" },
  });
};
