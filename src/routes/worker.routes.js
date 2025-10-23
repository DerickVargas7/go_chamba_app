import express from "express";
import { createWorkerSchema } from "../validations/worker.schema.js";
import { validateSchema } from "../middlewares/schema/validateSchema.middleware.js";
import { registerWorkerController } from "../controllers/worker.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js";

const router  = express.Router();
router.post("/worker/register-worker",verifyToken, validateSchema(createWorkerSchema), registerWorkerController);

export default router;