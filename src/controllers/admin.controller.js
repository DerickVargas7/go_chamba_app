import { getReportesAdminService, aprobarServicioService, rechazarServicioService, listPendingServicesOnly } from "../services/admin.service.js";

export const getReportesAdminController = async (req, res) => {
  try {
    const { page, pageSize, estado, motivo } = req.query;

    const data = await getReportesAdminService({
      page,
      pageSize,
      estado,
      motivo
    });

    res.json({
      success: true,
      ...data
    });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


export const aprobarServicioController = async (req, res) => {
  try {
    const { id } = req.params; // id del servicio
    const adminId = req.usuario.id;

    const data = await aprobarServicioService(id, adminId);

    res.json({
      success: true,
      message: "Servicio aprobado correctamente.",
      data
    });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};



export const rechazarServicioController = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.usuario.id;

    const data = await rechazarServicioService(id, adminId);
    res.json({
      success: true,
      message: "Servicio rechazado.",
      data
    });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


export const listPendingServicesController = async (req, res) => {
  try {
    const servicios = await listPendingServicesOnly();

    return res.status(200).json({
      success: true,
      message: "Servicios pendientes obtenidos correctamente",
      items: servicios,
    });
  } catch (error) {
    //console.error("Error en listPendingServicesController:", error);
    return res.status(500).json({
      success: false,
      error: "Error al obtener los servicios pendientes",
      details: error.message,
    });
  }
};