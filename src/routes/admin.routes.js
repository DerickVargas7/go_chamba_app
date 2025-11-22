import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getReportesAdminController, aprobarServicioController, rechazarServicioController, listPendingServicesController } from "../controllers/admin.controller.js";

const router = express.Router();

router.get(
  "/admin/reports/services",
  verifyToken,
  getReportesAdminController
);

router.patch(
  "/admin/service/:id/approve",
  verifyToken,
  aprobarServicioController
);

router.patch(
  "/admin/service/:id/reject",
  verifyToken,
  rechazarServicioController
);


router.get(
  "/admin/services/pending",
  verifyToken,
  listPendingServicesController
);
export default router;
