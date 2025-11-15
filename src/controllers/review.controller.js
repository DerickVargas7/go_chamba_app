import {
    crearReseñaService,
    getReseñasPerfilService

} from "../services/review.service.js"

export const crearReseñaController = async (req, res) => {
  try {
    const { id: usuarioId } = req.usuario;
    const { solicitudId } = req.params;
    const { calificacion, comentario } = req.body;

    const reseña = await crearReseñaService(
      usuarioId,
      solicitudId,
      calificacion,
      comentario
    );


    res.json({ success: true, reseña });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


export const getReseñasPerfilController = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const reseñas = await getReseñasPerfilService(usuarioId);
    

    return res.json({
      success: true,
      total: reseñas.length,
      data: reseñas,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};