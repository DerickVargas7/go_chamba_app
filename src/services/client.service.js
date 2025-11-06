import  prisma  from "../../config/prismaClient.js";

export const createSolicitudService = async (clienteId, perfilIdCliente, servicioId) => {

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

  if (!servicio) {
    throw new Error("Servicio no encontrado.");
  }

  if (!servicio.esActivo) {
    throw new Error("Este servicio no está disponible.");
  }


  if (servicio.PerfilTrabajador.perfilId === perfilIdCliente) {
    throw new Error("No puedes solicitar tu propio servicio.");
  }


  const solicitud = await prisma.solicitudServicio.create({
    data: {
      clienteId,  
      servicioId,  
    },
  });

  return solicitud;
};