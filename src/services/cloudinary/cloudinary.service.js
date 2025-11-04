import cloudinary from "../../../config/cloudinary.js";

export const uploadImageToCloudinary = async (filePath, folder = "users") => {
  if (!filePath) {
    throw new Error("No se recibió ruta de archivo para subir");
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "image",
      transformation: [
        { quality: "auto" },
        { fetch_format: "auto" }
      ]
    });
    
    return result.secure_url;
  } catch (error) {
    throw new Error(`Error al subir imagen a Cloudinary: ${error.message}`);
  }
};

export const uploadMultipleImagesToCloudinary = async (files, folder = "servicios") => {
  if (!files || files.length === 0) {
    throw new Error("No se recibieron archivos para subir");
  }

  if (files.length > 3) {
    throw new Error("Máximo 3 imágenes permitidas");
  }

  try {
    const urls = [];
    
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder,
        resource_type: "image",
        transformation: [
          { quality: "auto" },
          { fetch_format: "auto" }
        ]
      });
      urls.push(result.secure_url);
    }

    return urls;
  } catch (error) {
    throw new Error(`Error al subir imágenes a Cloudinary: ${error.message}`);
  }
};


