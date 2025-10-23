import express from "express";

import  { getAllServicesController }  from "../controllers/service.controller.js";

const router = express.Router();

router.get("/works",getAllServicesController);

export default router;