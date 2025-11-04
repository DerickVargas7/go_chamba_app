import { registerWorkerService, 
  createPublicationService,
  listPublicationsService,
  updatePublicationService,
  addServiceImagesService,
  deleteServiceImageService, } from "../services/worker.service.js"

export const registerWorkerController = async (req, res) => {
  try {
    const usuarioId = req.usuarioId; // viene del JWT (middleware de auth)
    const data = req.body;

    const newWorker = await registerWorkerService(usuarioId, data);

    return res.status(201).json({
      message: "Registro de trabajador completado correctamente",
      trabajador: newWorker,
    });
  } catch (error) {
   // console.error("Error al registrar trabajador:", error.message);
    return res.status(400).json({ error: error.message });
  }
};

export const createPublicationController = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const data = req.body;
    
    // Cambia esto también
    const imagenesUrls = req.body.imagenesUrls || [];

    const nuevaPublicacion = await createPublicationService(
      usuarioId, 
      data, 
      imagenesUrls
    );

    return res.status(201).json({
      success: true,
      message: "Publicación creada correctamente. Está en revisión.",
      data: nuevaPublicacion,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
export async function listPublicationsController(req, res) {
  try {
    const usuarioId = req.usuarioId; // viene del JWT por verifyToken
    const { page, pageSize, estado, buscar, order, oficioId } = req.query;

    const data = await listPublicationsService(usuarioId, {
      page,
      pageSize,
      estado,
      buscar,
      order,
      oficioId,
    });

    return res.json({ success: true, ...data });
  } catch (err) {
    const status = err.status || 500;
   // console.error('listPublicationsController error:', err);
    return res.status(status).json({ ok: false, message: err.message || 'Error interno' });
  }
};

export const updatePublicationController = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const { id } = req.params;
    const updated = await updatePublicationService(usuarioId, id, req.body);

    res.status(200).json({ success: true, servicio: updated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const addServiceImagesController = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const { id } = req.params;
    
    // Si envías JSON, ya viene como array
    const imagenesUrls = req.body.imagenesUrls || [];

    if (imagenesUrls.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: "No se proporcionaron URLs de imágenes" 
      });
    }

    const urls = await addServiceImagesService(usuarioId, id, imagenesUrls);

    res.status(200).json({ success: true, imagenes: urls });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteServiceImageController = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const { id, imagenId } = req.params;

    const result = await deleteServiceImageService(usuarioId, id, imagenId);

    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};