import { reportarServicioService,desestimarReporteService, resolverReporteEliminandoServicioService } from "../services/report.service.js";


export const reportarServicioController = async (req, res) => {
  try {
    const { id: usuarioId } = req.usuario; // viene del token
    const { servicioId } = req.params;
    const { motivo, descripcion } = req.body;

    if (!motivo) {
      return res.status(400).json({ success: false, error: "El motivo es obligatorio." });
    }

    const reporte = await reportarServicioService(
      usuarioId,
      servicioId,
      motivo,
      descripcion || null
    );

    res.status(201).json({
      success: true,
      message: "Reporte enviado correctamente.",
      data: reporte,
    });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};



export const desestimarReporteController = async (req, res) => {
  try {
    const { id } = req.params; // id del reporte
    const adminId = req.usuario.id;

    const data = await desestimarReporteService(id, adminId);

    res.json({ success: true, message: "Reporte desestimado.", data });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};



export const eliminarServicioPorReporteController = async (req, res) => {
  try {
    const { id } = req.params; // id del reporte
    const adminId = req.usuario.id;

    const data = await resolverReporteEliminandoServicioService(id, adminId);

    res.json({ success: true, message: "Servicio inhabilitado y reporte resuelto.", data });

  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};