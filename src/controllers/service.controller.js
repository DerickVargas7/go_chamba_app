import { getAllServices, listAllPublicationsService} from "../services/service.service.js";


export const getAllServicesController = async (req, res) => {
    try{
        const services = await getAllServices();
        return res.json(services);
    }
    catch(error){}
    res.error(500).json({error: "Error al obtener los oficios"});
    }



export const listAllPublicationsController = async (req, res) => {
  try {
    const { page, pageSize, buscar, oficioId, order } = req.query;

    const result = await listAllPublicationsService({
      page,
      pageSize,
      buscar,
      oficioId,
      order,
    });

    return res.status(200).json({
      success: true,
      message: "Servicios obtenidos correctamente",
      ...result,
    });
  } catch (error) {
    //console.error("Error en listAllPublicationsController:", error);
    return res.status(500).json({
      success: false,
      error: "Error al obtener los servicios",
      details: error.message,
    });
  }
};
