import  prisma  from "../../config/prismaClient.js";

export const reportarServicioService = async (usuarioId, servicioId, motivo, descripcion) => {
 // 3. Prevenir reportes duplicados
  const existe = await prisma.reporteServicio.findUnique({
    where: {
      servicioId_usuarioId: { servicioId, usuarioId }
    }
  });

  if (existe) {
    throw new Error("Ya has reportado este servicio.");
  }

  // 4. Crear el reporte
  const reporte = await prisma.reporteServicio.create({
    data: {
      servicioId,
      usuarioId,
      motivo,
      descripcion,
    },
  });

  return reporte;
};


export const desestimarReporteService = async (reporteId, adminId) => {
  const reporte = await prisma.reporteServicio.findUnique({
    where: { id: reporteId },
  });
 if(reporte.estado === "DESESTIMADO") {
    throw new Error("El reporte ya ha sido desestimado.");
  }
  if (!reporte) throw new Error("Reporte no encontrado.");

  return prisma.reporteServicio.update({
    where: { id: reporteId },
    data: {
      estado: "DESESTIMADO",
      resolucion:"Reporte desestimado por el administrador.",
      resueltoEn: new Date(),
    },
  });
};


export const resolverReporteEliminandoServicioService = async (reporteId) => {
  const reporte = await prisma.reporteServicio.findUnique({
    where: { id: reporteId },
  });

  if(reporte.estado === "RESUELTO") {
    throw new Error("El reporte ya ha sido resuelto.");
  }

  if (!reporte) throw new Error("Reporte no encontrado.");

  const servicio = await prisma.servicio.findUnique({
    where: { id: reporte.servicioId },
  });

  if (!servicio) throw new Error("Servicio asociado no encontrado.");

  return prisma.$transaction(async (tx) => {
    await tx.servicio.update({
      where: { id: servicio.id },
      data: {
        esActivo: false,
        estadoModeracion: "SUSPENDIDO",
      },
    });

   
    const reporteActualizado = await tx.reporteServicio.update({
      where: { id: reporteId },
      data: {
        estado: "RESUELTO",
        resolucion: "Servicio inhabilitado por infringir normas.",
        resueltoEn: new Date(),
      },
    });

    return reporteActualizado;
  });
};