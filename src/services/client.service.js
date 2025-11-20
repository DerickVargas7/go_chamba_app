import  prisma  from "../../config/prismaClient.js";

export const createSolicitudService = async (clienteId, perfilIdCliente, servicioId) => {

  // 1) Verificar que el servicio exista
  const servicio = await prisma.servicio.findUnique({
    where: { id: servicioId },
    select: { 
      id: true,
      esActivo: true,
      PerfilTrabajador: {
        select: { perfilId: true }
      }
    },
  });

  if (!servicio) throw new Error("Servicio no encontrado.");

  if (!servicio.esActivo) {
    throw new Error("Este servicio no está disponible.");
  }

  // 2) Evitar solicitarse a sí mismo
  if (servicio.PerfilTrabajador?.perfilId === perfilIdCliente) {
    throw new Error("No puedes solicitar tu propio servicio.");
  }

  // 3) Verificar si ya existe una solicitud previa al mismo servicio
  const solicitudExistente = await prisma.solicitudServicio.findFirst({
    where: {
      clienteId,
      servicioId,
      estado: {
        in: ["PENDIENTE", "ACEPTADA", "COMPLETADA"], 
      }
    }
  });

  if (solicitudExistente) {
    throw new Error("Ya has solicitado este servicio previamente.");
  }

  // 4) Crear solicitud si todo OK
  const solicitud = await prisma.solicitudServicio.create({
    data: {
      clienteId,
      servicioId,
    },
  });

  return solicitud;
};
