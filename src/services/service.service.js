import prisma from "../../config/prismaClient.js";

export const getAllServices = async () => {
    return await prisma.oficio.findMany();

}


export const listAllPublicationsService = async ({
  page = 1,
  pageSize = 10,
  buscar,
  oficioId,
  order = "desc",
}) => {
  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  const where = {
    esActivo: true,
    estadoModeracion: "PENDIENTE",  //cambiar despues
  };

  if (buscar && buscar.trim()) {
    where.OR = [
      { titulo: { contains: buscar, mode: "insensitive" } },
      { descripcion: { contains: buscar, mode: "insensitive" } },
    ];
  }

  if (oficioId) {
    where.oficioId = oficioId;
  }

  const [items, total] = await Promise.all([
    prisma.servicio.findMany({
      where,
      orderBy: { creadoEn: order === "asc" ? "asc" : "desc" },
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