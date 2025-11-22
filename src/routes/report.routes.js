import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { reportarServicioController, desestimarReporteController,eliminarServicioPorReporteController } from "../controllers/report.controller.js";

const router = express.Router();


router.post("/report/:servicioId/service",
  verifyToken,
  reportarServicioController);

router.patch(
  "/admin/report/:id/desestimate",
  verifyToken,
  desestimarReporteController
);

router.patch(
  "/admin/report/:id/unable-service",
  verifyToken,
  eliminarServicioPorReporteController
);


export default router;
