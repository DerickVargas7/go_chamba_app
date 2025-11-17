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


export const completarSolicitudService = async (clienteId, solicitudId) => {
  const solicitud = await prisma.solicitudServicio.findUnique({
    where: { id: solicitudId },
    include: { servicio: true },
  });

  if (!solicitud) throw new Error("Solicitud no encontrada.");

  if (solicitud.clienteId !== clienteId) 
    throw new Error("No autorizado para completar esta solicitud.");

  // Aquí marcamos la solicitud como completada
  return prisma.solicitudServicio.update({
    where: { id: solicitudId },
    data: { estado: "COMPLETADA" },
  });
};




// service
// service
// service
export const getSolicitudesAceptadasService = async (clienteId) => {
  const solicitudes = await prisma.solicitudServicio.findMany({
    where: {
      clienteId,            // filtramos por cliente
      estado: "ACEPTADA",   // solo solicitudes aceptadas
    },
    include: {
      servicio: true,        // incluir el servicio asociado
      cliente: {             // incluir el cliente asociado
        include: {           // incluimos el perfil con la foto
          perfil: {
            select: {
              fotoUrl: true,  // seleccionamos solo la fotoUrl
            },
          },
        },
      },
    },
  });

  if (!solicitudes.length) throw new Error("No tienes solicitudes aceptadas.");

  // Ahora aquí mapeamos para asignar fotoUrl directamente al cliente
  return solicitudes.map(solicitud => ({
    ...solicitud,
    cliente: {
      ...solicitud.cliente,
      imagenUrl: solicitud.cliente.perfil?.fotoUrl || null, // asignamos directamente fotoUrl
    },
  }));
};

