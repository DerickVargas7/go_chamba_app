import prisma from "../../config/prismaClient.js"
import { uploadImageToCloudinary } from "../services/cloudinary/cloudinary.service.js";
import fs from "fs";

export const registerWorkerService = async (usuarioId, data) => {
  const { descripcion, carnetIdentidad, oficios = [] } = data;
  const perfil = await prisma.perfil.findUnique({
    where: { usuarioId: usuarioId },
  });
  if (!perfil) throw new Error("El usuario no tiene un perfil válido.");
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


export const createPublicationService = async (usuarioId, data, imagenesUrls = []) => {
  const { titulo, descripcion, precio } = data;
  
  const perfil = await prisma.perfil.findUnique({
    where: { usuarioId },
    include: { perfilTrabajador: true },
  });
  
  if (!perfil || !perfil.perfilTrabajador) {
    throw new Error("El usuario no tiene un perfil de trabajador activo.");
  }
  
  const perfilTrabajadorId = perfil.perfilTrabajador.id;

  // Validar cantidad de URLs
  if (imagenesUrls.length < 1 || imagenesUrls.length > 3) {
    throw new Error("Debes proporcionar entre 1 y 3 URLs de imágenes.");
  }

  // Transacción: crear servicio + referencias a imágenes
  const result = await prisma.$transaction(async (tx) => {
    const servicio = await tx.servicio.create({
      data: {
        trabajadorOficioId: `${perfilTrabajadorId}`,
        titulo,
        descripcion,
        precio: parseFloat(precio),
        perfilTrabajadorId,
        estadoModeracion: "PENDIENTE",
      },
    });

    // Guardar URLs en DB (ya están subidas a Cloudinary)
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

export async function listPublicationsService(
  usuarioId,
  { page = 1, pageSize = 10, estado, buscar, order = 'desc', oficioId }
) {
  // Encontrar el perfilTrabajador del usuario
  const perfil = await prisma.perfil.findUnique({
    where: { usuarioId },
    include: { perfilTrabajador: true },
  });
  if (!perfil || !perfil.perfilTrabajador) {
    const e = new Error('El usuario no tiene un perfil de trabajador activo.');
    e.status = 400;
    throw e;
  }
  const perfilTrabajadorId = perfil.perfilTrabajador.id;

  // filtros
  const where = { perfilTrabajadorId };
  if (estado) where.estadoModeracion = estado;             
  if (typeof oficioId !== 'undefined') where.oficioId = Number(oficioId);

  if (buscar && buscar.trim()) {
    where.OR = [
      { titulo: { contains: buscar, mode: 'insensitive' } },
      { descripcion: { contains: buscar, mode: 'insensitive' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  const [items, total] = await Promise.all([
    prisma.servicio.findMany({
      where,
      orderBy: { creadoEn: order === 'asc' ? 'asc' : 'desc' },
      skip,
      take,
      include: {
        imagenes: true,        
         
      },
    }),
    prisma.servicio.count({ where }),
  ]);

  return {
    items,
    pagination: {
      page: Number(page),
      pageSize: Number(pageSize),
      total,
      pages: Math.max(1, Math.ceil(total / Number(pageSize))),
    },
  };
};

//Actualizar publicación existente
export const updatePublicationService = async (usuarioId, servicioId, data) => {
  const { titulo, descripcion, precio } = data;
  // Verificar propiedad del servicio
  const servicio = await prisma.servicio.findUnique({
    where: { id: servicioId },
    include: {
      PerfilTrabajador: { include: { perfil: true } },
    },
  });

  if (!data || Object.keys(data).length == 0) {
    throw new Error("No se enviaron datos para actualizar.");
  }
  
  if (!servicio) throw new Error("Servicio no encontrado.");
  if (servicio.PerfilTrabajador.perfil.usuarioId !== usuarioId) {
    throw new Error("No tienes permisos para editar este servicio.");
  }
  const updateData = {};
  if (titulo !== undefined) updateData.titulo = titulo;
  if (descripcion !== undefined) updateData.descripcion = descripcion;
  if (precio !== undefined && !isNaN(precio)) {
    updateData.precio = parseFloat(precio);
  }
  // Si no hay cambios, lanzar error
  if (Object.keys(updateData).length === 0) {
    throw new Error("No se enviaron campos válidos para actualizar.");
  }

  // Siempre marcar como pendiente de revisión
  updateData.estadoModeracion = "PENDIENTE";

  // Ejecutar actualización
  const updated = await prisma.servicio.update({
    where: { id: servicioId },
    data: updateData,
  });

  return updated;
};


//Agregar imágenes a servicio existente
export const addServiceImagesService = async (usuarioId, servicioId, imagenesUrls) => {
  const servicio = await prisma.servicio.findUnique({
    where: { id: servicioId },
    include: { PerfilTrabajador: { include: { perfil: true } } },
  });

  if (!servicio) throw new Error("Servicio no encontrado.");
  if (servicio.PerfilTrabajador.perfil.usuarioId !== usuarioId)
    throw new Error("No autorizado.");

  const currentCount = await prisma.imagenServicio.count({
    where: { servicioId },
  });

  if (currentCount + imagenesUrls.length > 3)
    throw new Error("Máximo 3 imágenes por servicio.");

  // Crear registros con las URLs ya subidas
  await prisma.imagenServicio.createMany({
    data: imagenesUrls.map((url, index) => ({
      servicioId,
      imagenUrl: url,
      orden: currentCount + index,
    })),
  });

  return imagenesUrls;
};

//Eliminar imagen de servicio
export const deleteServiceImageService = async (usuarioId, servicioId, imagenId) => {
  const servicio = await prisma.servicio.findUnique({
    where: { id: servicioId },
    include: {
      PerfilTrabajador: { include: { perfil: true } },
      imagenes: true,
    },
  });

  if (!servicio) throw new Error("Servicio no encontrado.");
  if (servicio.PerfilTrabajador.perfil.usuarioId !== usuarioId)
    throw new Error("No autorizado.");

  const imagen = servicio.imagenes.find((img) => img.id === imagenId);
  if (!imagen) throw new Error("Imagen no encontrada.");

  await prisma.imagenServicio.delete({ where: { id: imagenId } });

  return { success: true, deleted: imagenId };
};