import express from "express";
import {
  aceptarSolicitudController,
  rechazarSolicitudController,
  getSolicitudesTrabajadorController,
  completarSolicitudController,
    getSolicitudesAceptadasController
} from "../controllers/request.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/requests",
    verifyToken,
     getSolicitudesTrabajadorController);

router.post("/request/:id/approve",
    verifyToken,
     aceptarSolicitudController);

router.post("/request/:id/reject", 
    verifyToken,
    rechazarSolicitudController);

router.post("/request/:id/complete", 
    verifyToken, 
    completarSolicitudController);


router.get("/request/accepted", 
    verifyToken,  
    getSolicitudesAceptadasController);


export default router;