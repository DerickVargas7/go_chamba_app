import express from "express";


import  { getAllServicesController, listAllPublicationsController}  from "../controllers/service.controller.js";

const router = express.Router();

router.get("/works",getAllServicesController);

router.get("/services", listAllPublicationsController);



export default router;