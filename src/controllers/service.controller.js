import { getAllServices, listAllPublicationsService, getServiceByIdService, desactivarServicioService , listApprovedServicesOnly} from "../services/service.service.js";


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

export const listApprovedServicesController = async (req, res) => {
  try {
    const servicios = await listApprovedServicesOnly();

    return res.status(200).json({
      success: true,
      message: "Servicios aprobados obtenidos correctamente",
      items: servicios,
    });
  } catch (error) {
    //console.error("Error en listApprovedServicesController:", error);
    return res.status(500).json({
      success: false,
      error: "Error al obtener los servicios aprobados",
      details: error.message,
    });
  }
};



export const getServiceByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const servicio = await getServiceByIdService(id);

    res.status(200).json({ success: true, data: servicio });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};


export const desactivarServicioController = async (req, res) => {
  try {
    const { perfilTrabajadorId } = req.usuario;
    const { id } = req.params;

    if (!perfilTrabajadorId) {
      return res.status(403).json({ success: false, error: "Solo trabajadores pueden desactivar servicios." });
    }

    const result = await desactivarServicioService(perfilTrabajadorId, id);

    res.json({
      success: true,
      message: "Servicio desactivado correctamente.",
      servicio: result
    });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
