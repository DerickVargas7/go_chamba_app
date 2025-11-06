import { createSolicitudService } from "../services/client.service.js";

export const createSolicitudController = async (req, res) => {
  try {
    const { id: usuarioId, perfilId } = req.usuario; 
    const { id: servicioId } = req.params;
    const nuevaSolicitud = await createSolicitudService(usuarioId,perfilId,servicioId);

    res.status(201).json({
      success: true,
      message: "Solicitud creada correctamente.",
      data: nuevaSolicitud,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
