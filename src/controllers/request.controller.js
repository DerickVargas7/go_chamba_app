import {
  aceptarSolicitudService,
  rechazarSolicitudService,
    getSolicitudesTrabajadorService,
    completarSolicitudService
} from "../services/request.service.js";

export const aceptarSolicitudController = async (req, res) => {
  try {
    const { perfilTrabajadorId } = req.usuario;
    const { id } = req.params;

    const solicitud = await aceptarSolicitudService(perfilTrabajadorId, id);

    res.json({
      success: true,
      message: "Solicitud aceptada.",
      data: solicitud
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


export const rechazarSolicitudController = async (req, res) => {
  try {
    const { perfilTrabajadorId } = req.usuario;
    const { id } = req.params;

    const solicitud = await rechazarSolicitudService(perfilTrabajadorId, id);

    res.json({
      success: true,
      message: "Solicitud rechazada.",
      data: solicitud
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


export const getSolicitudesTrabajadorController = async (req, res) => {
  try {
    const { perfilTrabajadorId } = req.usuario;

    if (!perfilTrabajadorId)
      return res.status(403).json({ success: false, error: "Solo trabajadores pueden ver solicitudes." });

    const solicitudes = await getSolicitudesTrabajadorService(perfilTrabajadorId);

    return res.json({ success: true, solicitudes });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

export const completarSolicitudController = async (req, res) => {
  try {
    const { perfilTrabajadorId } = req.usuario;
    const { id } = req.params;

    const result = await completarSolicitudService(perfilTrabajadorId, id);

    res.json({ success: true, solicitud: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


