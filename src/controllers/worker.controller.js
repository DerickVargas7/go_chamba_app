import { registerWorkerService } from "../services/worker.service.js"

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
    console.error("Error al registrar trabajador:", error.message);
    return res.status(400).json({ error: error.message });
  }
};