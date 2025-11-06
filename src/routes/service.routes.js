import express from "express";


import  { getAllServicesController, listAllPublicationsController, getServiceByIdController}  from "../controllers/service.controller.js";

const router = express.Router();

router.get("/works",getAllServicesController);

router.get("/services", listAllPublicationsController);

router.get("/services/:id", getServiceByIdController);



export default router;