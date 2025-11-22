import express from "express";
import {verifyToken} from "../middlewares/auth.middleware.js";


import  { getAllServicesController,listApprovedServicesController ,listAllPublicationsController, getServiceByIdController, desactivarServicioController}  from "../controllers/service.controller.js";

const router = express.Router();

router.get("/works",getAllServicesController);

router.get("/services", listApprovedServicesController);

//router.get("/services", listAllPublicationsController);

router.get("/services/:id", getServiceByIdController);

router.patch("/services/:id/desactivate",verifyToken,
     desactivarServicioController);


export default router;