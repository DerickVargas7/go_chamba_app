import { getAllServices } from "../services/service.service.js";


export const getAllServicesController = async (req, res) => {
    try{
        const services = await getAllServices();
        return res.json(services);
    }
    catch(error){}
    res.error(500).json({error: "Error al obtener los oficios"});
    }
