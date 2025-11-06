import prisma from "../../config/prismaClient.js";

export const getAllServices = async () => {
    return await prisma.oficio.findMany();

}


export const listAllPublicationsService = async ({
  page = 1,
  pageSize = 10,
  buscar,
  oficioId,
  precioMin,
  precioMax,
}) => {
  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  const where = {};

  if (buscar && buscar.trim()) {
    where.OR = [
      { titulo: { contains: buscar, mode: "insensitive" } },
      { descripcion: { contains: buscar, mode: "insensitive" } },
    ];
  }

  if (oficioId) {
    where.oficioId = String(oficioId);
  }

  if (precioMin || precioMax) {
    where.precio = {};
    if (precioMin) where.precio.gte = parseFloat(precioMin);
    if (precioMax) where.precio.lte = parseFloat(precioMax);
  }

  const [items, total] = await Promise.all([
    prisma.servicio.findMany({
      where,
      orderBy: { creadoEn: "desc" },
      skip,
      take,
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
    }),
    prisma.servicio.count({ where }),
  ]);

  const servicios = items.map((serv) => ({
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

  return {
    items: servicios,
    pagination: {
      page: Number(page),
      pageSize: Number(pageSize),
      total,
      pages: Math.max(1, Math.ceil(total / Number(pageSize))),
    },
  };
};


export const getServiceByIdService = async (servicioId) => {
  const servicio = await prisma.servicio.findUnique({
    where: { id: servicioId },
    include: {
      imagenes: { 
        select: { 
          id: true,
          imagenUrl: true,
          orden: true
        },
        orderBy: { orden: 'asc' } // Para que vengan ordenadas
      },
      Oficio: { select: { id: true, nombre: true } },
    },
  });

  if (!servicio) throw new Error("Servicio no encontrado.");

  return {
    id: servicio.id,
    titulo: servicio.titulo,
    descripcion: servicio.descripcion,
    precio: servicio.precio,
    categoria: servicio.Oficio
      ? { id: servicio.Oficio.id, nombre: servicio.Oficio.nombre }
      : { id: null, nombre: "Sin categoría" },
    imagenes: servicio.imagenes.map((img) => ({
      id: img.id,
      imagenUrl: img.imagenUrl,
      orden: img.orden
    }))
  };
};
