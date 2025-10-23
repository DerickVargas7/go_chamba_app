import { uploadImageToCloudinary } from "../../services/cloudinary/cloudinary.service.js";
import fs from "fs";

export const uploadImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: "No se envió ningún archivo" 
      });
    }

    // Subir a Cloudinary
    const imageUrl = await uploadImageToCloudinary(req.file.path);

    // Borrar archivo temporal
    fs.unlinkSync(req.file.path);

    return res.status(200).json({ 
      success: true,
      url: imageUrl 
    });
  } catch (error) {
    // Si hay error y existe el archivo, borrarlo
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error("Error en uploadImageController:", error);
    return res.status(500).json({ 
      success: false,
      error: "Error al subir la imagen" 
    });
  }
};