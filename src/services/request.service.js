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
export const getSolicitudesAceptadasService = async (clienteId) => {
  const solicitudes = await prisma.solicitudServicio.findMany({
    where: {
      clienteId,
      estado: "ACEPTADA",
    },
    include: {
      servicio: {
        include: {
          Oficio: {
            select: {
              nombre: true,
            },
          },
          PerfilTrabajador: {
            include: {
              perfil: {
                select: {
                  nombreCompleto: true,
                },
              },
            },
          },
        },
      },
      cliente: {
        include: {
          perfil: {
            select: {
              fotoUrl: true,
            },
          },
        },
      },
    },
  });

  if (!solicitudes.length) return [];


  return solicitudes.map((s) => ({
    id: s.id,
    clienteId: s.clienteId,
    servicioId: s.servicioId,
    estado: s.estado,
    mensaje: s.mensaje,
    fechaSolicitada: s.fechaSolicitada,
    creadoEn: s.creadoEn,
    actualizadoEn: s.actualizadoEn,

    servicio: {
      id: s.servicio.id,
      trabajadorOficioId: s.servicio.trabajadorOficioId,
      titulo: s.servicio.titulo,
      descripcion: s.servicio.descripcion,
      precio: s.servicio.precio,
      esActivo: s.servicio.esActivo,
      estadoModeracion: s.servicio.estadoModeracion,
      creadoEn: s.servicio.creadoEn,
      actualizadoEn: s.servicio.actualizadoEn,
      perfilTrabajadorId: s.servicio.perfilTrabajadorId,
      oficioId: s.servicio.oficioId,

    
      categoria: s.servicio.Oficio?.nombre || "Sin categoría",
      trabajador: {
        nombreCompleto:
          s.servicio.PerfilTrabajador?.perfil?.nombreCompleto ||
          "Trabajador",
      },
    },

    cliente: {
      id: s.cliente.id,
      email: s.cliente.email,
      imagenUrl: s.cliente.perfil?.fotoUrl || "",
      password: s.cliente.password,
      esActivo: s.cliente.esActivo,
      creadoEn: s.cliente.creadoEn,
      es_configurado: s.cliente.es_configurado,
      actualizadoEn: s.cliente.actualizadoEn,
      telefono: s.cliente.telefono,
      googleId: s.cliente.googleId,
      departamento: s.cliente.departamento,
      tiene_whatsapp: s.cliente.tiene_whatsapp,
    },
  }));
};

