import prisma from "../../config/prismaClient.js";

export const registerWorkerService = async (perfilId, data) => {
  const { descripcion, carnetIdentidad, oficios = [] } = data;

  const existingWorker = await prisma.perfilTrabajador.findUnique({
    where: { perfilId },
  });

  if (existingWorker) {
    throw new Error("El usuario ya está registrado como trabajador.");
  }

  const result = await prisma.$transaction(async (tx) => {
    const newWorkerProfile = await tx.perfilTrabajador.create({
      data: {
        perfilId,
        descripcion,
        carnetIdentidad,
      },
    });

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
    const existingRole = await tx.usuarioRol.findFirst({
      where: { usuarioId: data.usuarioId, rol: "TRABAJADOR" },
    });

    if (!existingRole) {
      await tx.usuarioRol.create({
        data: {
          usuarioId: data.usuarioId,
          rol: "TRABAJADOR",
        },
      });
    }

    return newWorkerProfile;
  });

  return result;
};

export const createPublicationService = async (
  perfilTrabajadorId,
  data,
  imagenesUrls = []
) => {
  const { titulo, descripcion, precio, oficioId } = data;

  if (imagenesUrls.length < 1 || imagenesUrls.length > 3) {
    throw new Error("Debes proporcionar entre 1 y 3 URLs de imágenes.");
  }

  const result = await prisma.$transaction(async (tx) => {
    const servicio = await tx.servicio.create({
      data: {
        trabajadorOficioId: `${perfilTrabajadorId}`,
        titulo,
        descripcion,
        precio: parseFloat(precio),
        perfilTrabajadorId,
        oficioId: oficioId,
      },
    });

    await tx.imagenServicio.createMany({
      data: imagenesUrls.map((url, index) => ({
        servicioId: servicio.id,
        imagenUrl: url,
        orden: index,
      })),
    });

    return servicio;
  });

  return result;
};

export async function listPublicationsService(perfilTrabajadorId) {
  const servicios = await prisma.servicio.findMany({
    where: {
      perfilTrabajadorId,
      estadoModeracion: "APROBADO",
    },
    orderBy: { creadoEn: "desc" },
    include: {
      imagenes: true,
      Oficio: {
        select: { id: true, nombre: true },
      },
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
    estadoModeracion: serv.estadoModeracion,
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
}

export const updatePublicationService = async (servicioId, data) => {
  const { titulo, descripcion, precio, oficioId } = data;

  if (!data || Object.keys(data).length === 0) {
    throw new Error("No se enviaron datos para actualizar.");
  }

  const servicio = await prisma.servicio.findUnique({
    where: { id: servicioId },
    select: { perfilTrabajadorId: true },
  });

  if (!servicio) throw new Error("Servicio no encontrado.");

  const updateData = {
    ...(titulo !== undefined && { titulo }),
    ...(descripcion !== undefined && { descripcion }),
    ...(precio !== undefined &&
      !isNaN(precio) && { precio: parseFloat(precio) }),
    ...(oficioId !== undefined && { oficioId }),
    estadoModeracion: "PENDIENTE",
  };

  if (Object.keys(updateData).length === 1) {
    // Solo estadoModeracion
    throw new Error("No se enviaron campos válidos para actualizar.");
  }

  const updated = await prisma.servicio.update({
    where: { id: servicioId },
    data: updateData,
  });

  return updated;
};

export const addServiceImagesService = async (
  perfilTrabajadorId,
  servicioId,
  imagenesUrls
) => {
  const servicio = await prisma.servicio.findUnique({
    where: { id: servicioId },
    select: { perfilTrabajadorId: true },
  });

  if (!servicio) throw new Error("Servicio no encontrado.");
  if (servicio.perfilTrabajadorId !== perfilTrabajadorId)
    throw new Error("No autorizado.");

  const currentCount = await prisma.imagenServicio.count({
    where: { servicioId },
  });

  if (currentCount + imagenesUrls.length > 3)
    throw new Error("Máximo 3 imágenes por servicio.");

  await prisma.imagenServicio.createMany({
    data: imagenesUrls.map((url, index) => ({
      servicioId,
      imagenUrl: url,
      orden: currentCount + index,
    })),
  });

  return imagenesUrls;
};

export const deleteServiceImageService = async (
  perfilTrabajadorId,
  servicioId,
  imagenId
) => {
  const servicio = await prisma.servicio.findUnique({
    where: { id: servicioId },
    select: {
      perfilTrabajadorId: true,
      imagenes: {
        where: { id: imagenId },
      },
    },
  });

  if (!servicio) throw new Error("Servicio no encontrado.");
  if (servicio.perfilTrabajadorId !== perfilTrabajadorId)
    throw new Error("No autorizado.");
  if (servicio.imagenes.length === 0) throw new Error("Imagen no encontrada.");

  await prisma.imagenServicio.delete({ where: { id: imagenId } });

  return { success: true, imagen_eliminada: imagenId };
};
