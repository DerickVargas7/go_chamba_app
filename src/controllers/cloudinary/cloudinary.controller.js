import { uploadImageToCloudinary, uploadMultipleImagesToCloudinary } from "../../services/cloudinary/cloudinary.service.js";
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


export const uploadMultipleImagesController = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: "No se enviaron archivos" 
      });
    }

    // Subir a Cloudinary
    const imageUrls = await uploadMultipleImagesToCloudinary(req.files, "servicios");

    // Borrar archivos temporales
    req.files.forEach(file => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });

    return res.status(200).json({ 
      success: true,
      urls: imageUrls // Array de URLs
    });
  } catch (error) {
    // Si hay error, borrar todos los archivos temporales
    if (req.files) {
      req.files.forEach(file => {
        if (file?.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    console.error("Error en uploadMultipleImagesController:", error);
    return res.status(500).json({ 
      success: false,
      error: error.message || "Error al subir las imágenes" 
    });
  }
};