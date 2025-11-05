import express from "express";
import multer from "multer";
import { createWorkerSchema } from "../validations/worker.schema.js";
import { validateSchema } from "../middlewares/schema/validateSchema.middleware.js";
import { registerWorkerController,
         createPublicationController ,
         listPublicationsController,
         updatePublicationController,
         addServiceImagesController,
         deleteServiceImageController
        } from "../controllers/worker.controller.js"
import { uploadMultipleImagesController } from "../controllers/cloudinary/cloudinary.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/requireRole.middleware.js";   
const upload = multer({ dest: "uploads/" });

const router  = express.Router();
//ruta para registrar trabajador
router.post(
    "/worker/register-worker",
    verifyToken, 
    requireRole("TRABAJADOR"),
    validateSchema(createWorkerSchema), 
    registerWorkerController
);
 //ruta para subir imagenes de servicio
router.post(
  "/worker/upload-service-images",
  verifyToken, 
  requireRole("TRABAJADOR"),
  upload.array("imagenes", 3),
  uploadMultipleImagesController
);
//ruta para crear publicacion de servicio
router.post(
  "/worker/publication",
 
  verifyToken,
  requireRole("TRABAJADOR"),
  createPublicationController
);

//ruta para listar publicaciones de trabajador
router.get(
  '/worker/publications', 
  
  verifyToken,
  requireRole("TRABAJADOR"),
  listPublicationsController);

//ruta para actualizar publicacion de servicio
router.patch("/services/:id",
   verifyToken, 
   requireRole("TRABAJADOR"),
   updatePublicationController);

//ruta para agregar imagenes a servicio
router.post(
  "/worker/service/:id/images",
  verifyToken,
  requireRole("TRABAJADOR"),
  addServiceImagesController
);

//ruta para eliminar imagen de servicio
router.delete(
  "/services/:id/images/:imagenId",
  verifyToken,
   requireRole("TRABAJADOR"),
  deleteServiceImageController
);  

export default router;