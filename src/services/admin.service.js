import prisma from "../../config/prismaClient.js";

export const getReportesAdminService = async () => {
  const reportes = await prisma.reporteServicio.findMany({
    where: {
      estado: "PENDIENTE",
    },
    orderBy: { creadoEn: "desc" },
    include: {
      servicio: {
        select: {
          id: true,
          titulo: true,
          descripcion: true,
          precio: true,
          oficioId: true,
          PerfilTrabajador: {
            include: {
              perfil: {
                select: {
                  nombreCompleto: true,
                  fotoUrl: true
                }
              }
            }
          }
        }
      },
      usuario: { // usuario que reportó
        select: {
          id: true,
          email: true,
          perfil: {
            select: {
              nombreCompleto: true,
              fotoUrl: true,
            }
          }
        }
      }
    }
  });

  return reportes;
};

export const aprobarServicioService = async (servicioId, adminId) => {
  const servicio = await prisma.servicio.findUnique({
    where: { id: servicioId },
  });

  if (!servicio) throw new Error("Servicio no encontrado.");

  return prisma.servicio.update({
    where: { id: servicioId },
    data: {
      estadoModeracion: "APROBADO",
      actualizadoEn: new Date(),
    },
  });
};



export const rechazarServicioService = async (servicioId, adminId) => {
  const servicio = await prisma.servicio.findUnique({
    where: { id: servicioId },
  });

  if (!servicio) throw new Error("Servicio no encontrado.");

  return prisma.servicio.update({
    where: { id: servicioId },
    data: {
      estadoModeracion: "RECHAZADO",
      actualizadoEn: new Date(),
    },
  });
};


export const listPendingServicesOnly = async () => {
  const servicios = await prisma.servicio.findMany({
    where: {
      estadoModeracion: "PENDIENTE",
    },
    orderBy: { creadoEn: "desc" },
    include: {
      imagenes: true,
      Oficio: { select: { id: true, nombre: true } },
      PerfilTrabajador: {
        include: {
          perfil: {
            select: {
              nombreCompleto: true,
              fotoUrl: true,
              telefono: true,
            },
          },
        },
      },
    },
  });

  return servicios.map((serv) => ({
    id: serv.id,
    titulo: serv.titulo,
    descripcion: serv.descripcion,
    precio: serv.precio,
    oficio: {
      id: serv.Oficio?.id || null,
      nombre: serv.Oficio?.nombre || "Sin oficio",
    },
    trabajador: {
      nombreCompleto: serv.PerfilTrabajador?.perfil?.nombreCompleto || "Desconocido",
      fotoUrl: serv.PerfilTrabajador?.perfil?.fotoUrl || null,
      telefono: serv.PerfilTrabajador?.perfil?.telefono || null,
    },
    imagenes: serv.imagenes.map((img) => img.imagenUrl),
    creadoEn: serv.creadoEn,
  }));
};