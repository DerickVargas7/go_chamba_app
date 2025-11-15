import express from "express"
import {
    getReseñasPerfilController,
    crearReseñaController
} from "../controllers/review.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/review/:usuarioId/", 
    verifyToken,
    getReseñasPerfilController);


router.post("/review/:solicitudId/", 
    verifyToken,
    crearReseñaController);

export default router;