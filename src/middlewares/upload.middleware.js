import multer from "multer";
import path from "path";

// almacenamiento temporal 
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imagenes con los siguientes formatos (jpg, png, webp)"));
  }
};

// máximo 5MB
export const upload = multer({storage,fileFilter,limits: { fileSize: 5 * 1024 * 1024 },});
