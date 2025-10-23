-- CreateEnum
CREATE TYPE "TipoRol" AS ENUM ('CLIENTE', 'TRABAJADOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'COMPLETADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "EstadoModeracion" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO', 'SUSPENDIDO');

-- CreateEnum
CREATE TYPE "AccionModeracion" AS ENUM ('APROBAR', 'RECHAZAR', 'SUSPENDER', 'REACTIVAR');

-- CreateEnum
CREATE TYPE "NivelAdmin" AS ENUM ('MODERADOR', 'ADMINISTRADOR', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "MotivoReporte" AS ENUM ('CONTENIDO_INAPROPIADO', 'INFORMACION_FALSA', 'SPAM', 'PRECIO_FRAUDULENTO', 'SERVICIO_ILEGAL', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoReporte" AS ENUM ('PENDIENTE', 'EN_REVISION', 'RESUELTO', 'DESESTIMADO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "esActivo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "es_configurado" BOOLEAN NOT NULL DEFAULT false,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,
    "telefono" TEXT,
    "googleId" TEXT,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_roles" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "rol" "TipoRol" NOT NULL,

    CONSTRAINT "usuario_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfiles_admin" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "nivel" "NivelAdmin" NOT NULL DEFAULT 'MODERADOR',
    "permisos" TEXT[],
    "esActivo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perfiles_admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfiles" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "nombreCompleto" TEXT NOT NULL,
    "fotoUrl" TEXT NOT NULL,
    "descripcion" TEXT,
    "telefono" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perfiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfiles_trabajador" (
    "id" TEXT NOT NULL,
    "perfilId" TEXT NOT NULL,
    "estaDisponible" BOOLEAN NOT NULL DEFAULT true,
    "tarifaPorHora" DOUBLE PRECISION,
    "añosExperiencia" INTEGER,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perfiles_trabajador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oficios" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "iconoUrl" TEXT,
    "esActivo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "oficios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trabajador_oficios" (
    "id" TEXT NOT NULL,
    "perfilTrabajadorId" TEXT NOT NULL,
    "oficioId" TEXT NOT NULL,
    "esPrincipal" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trabajador_oficios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicios" (
    "id" TEXT NOT NULL,
    "trabajadorOficioId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "esActivo" BOOLEAN NOT NULL DEFAULT true,
    "estadoModeracion" "EstadoModeracion" NOT NULL DEFAULT 'PENDIENTE',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,
    "perfilTrabajadorId" TEXT,
    "oficioId" TEXT,

    CONSTRAINT "servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moderaciones_servicio" (
    "id" TEXT NOT NULL,
    "servicioId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "accion" "AccionModeracion" NOT NULL,
    "estadoAnterior" "EstadoModeracion" NOT NULL,
    "estadoNuevo" "EstadoModeracion" NOT NULL,
    "motivo" TEXT,
    "notas" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "moderaciones_servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reportes_servicio" (
    "id" TEXT NOT NULL,
    "servicioId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "motivo" "MotivoReporte" NOT NULL,
    "descripcion" TEXT,
    "estado" "EstadoReporte" NOT NULL DEFAULT 'PENDIENTE',
    "resueltoEn" TIMESTAMP(3),
    "resolucion" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reportes_servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagenes_servicio" (
    "id" TEXT NOT NULL,
    "servicioId" TEXT NOT NULL,
    "imagenUrl" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "imagenes_servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitudes_servicio" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "servicioId" TEXT NOT NULL,
    "estado" "EstadoSolicitud" NOT NULL DEFAULT 'PENDIENTE',
    "mensaje" TEXT,
    "fechaSolicitada" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitudes_servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reseñas" (
    "id" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,
    "objetivoId" TEXT NOT NULL,
    "solicitudId" TEXT,
    "calificacion" SMALLINT NOT NULL,
    "comentario" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reseñas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_telefono_key" ON "usuarios"("telefono");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_googleId_key" ON "usuarios"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_roles_usuarioId_rol_key" ON "usuario_roles"("usuarioId", "rol");

-- CreateIndex
CREATE UNIQUE INDEX "perfiles_admin_usuarioId_key" ON "perfiles_admin"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "perfiles_usuarioId_key" ON "perfiles"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "perfiles_trabajador_perfilId_key" ON "perfiles_trabajador"("perfilId");

-- CreateIndex
CREATE UNIQUE INDEX "oficios_nombre_key" ON "oficios"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "trabajador_oficios_perfilTrabajadorId_oficioId_key" ON "trabajador_oficios"("perfilTrabajadorId", "oficioId");

-- CreateIndex
CREATE INDEX "servicios_estadoModeracion_creadoEn_idx" ON "servicios"("estadoModeracion", "creadoEn");

-- CreateIndex
CREATE INDEX "moderaciones_servicio_servicioId_creadoEn_idx" ON "moderaciones_servicio"("servicioId", "creadoEn");

-- CreateIndex
CREATE INDEX "moderaciones_servicio_adminId_creadoEn_idx" ON "moderaciones_servicio"("adminId", "creadoEn");

-- CreateIndex
CREATE INDEX "reportes_servicio_estado_creadoEn_idx" ON "reportes_servicio"("estado", "creadoEn");

-- CreateIndex
CREATE UNIQUE INDEX "reportes_servicio_servicioId_usuarioId_key" ON "reportes_servicio"("servicioId", "usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "reseñas_autorId_objetivoId_solicitudId_key" ON "reseñas"("autorId", "objetivoId", "solicitudId");

-- AddForeignKey
ALTER TABLE "usuario_roles" ADD CONSTRAINT "usuario_roles_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfiles_admin" ADD CONSTRAINT "perfiles_admin_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfiles" ADD CONSTRAINT "perfiles_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfiles_trabajador" ADD CONSTRAINT "perfiles_trabajador_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "perfiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trabajador_oficios" ADD CONSTRAINT "trabajador_oficios_perfilTrabajadorId_fkey" FOREIGN KEY ("perfilTrabajadorId") REFERENCES "perfiles_trabajador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trabajador_oficios" ADD CONSTRAINT "trabajador_oficios_oficioId_fkey" FOREIGN KEY ("oficioId") REFERENCES "oficios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicios" ADD CONSTRAINT "servicios_trabajadorOficioId_fkey" FOREIGN KEY ("trabajadorOficioId") REFERENCES "trabajador_oficios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicios" ADD CONSTRAINT "servicios_perfilTrabajadorId_fkey" FOREIGN KEY ("perfilTrabajadorId") REFERENCES "perfiles_trabajador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicios" ADD CONSTRAINT "servicios_oficioId_fkey" FOREIGN KEY ("oficioId") REFERENCES "oficios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderaciones_servicio" ADD CONSTRAINT "moderaciones_servicio_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "servicios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moderaciones_servicio" ADD CONSTRAINT "moderaciones_servicio_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes_servicio" ADD CONSTRAINT "reportes_servicio_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "servicios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes_servicio" ADD CONSTRAINT "reportes_servicio_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagenes_servicio" ADD CONSTRAINT "imagenes_servicio_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "servicios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_servicio" ADD CONSTRAINT "solicitudes_servicio_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_servicio" ADD CONSTRAINT "solicitudes_servicio_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reseñas" ADD CONSTRAINT "reseñas_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reseñas" ADD CONSTRAINT "reseñas_objetivoId_fkey" FOREIGN KEY ("objetivoId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reseñas" ADD CONSTRAINT "reseñas_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "solicitudes_servicio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
