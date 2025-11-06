import express from 'express';
import { createSolicitudController } from '../controllers/client.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import {requireRole} from '../middlewares/requireRole.middleware.js';


const router = express.Router();
router.post('/services/:id/requests', 
    verifyToken,
    requireRole("CLIENTE"),
    createSolicitudController);

export default router;