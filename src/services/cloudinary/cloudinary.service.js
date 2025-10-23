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
