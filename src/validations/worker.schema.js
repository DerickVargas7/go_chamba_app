import Joi from "joi";

export const createWorkerSchema = Joi.object({
  descripcion: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      "string.empty": "La descripción es obligatoria.",
      "string.min": "La descripción debe tener al menos 10 caracteres.",
      "string.max": "La descripción no puede superar los 500 caracteres.",
    }),

  carnetIdentidad: Joi.string()
    .trim()
    .min(5)
    .max(20)
    .required()
    .messages({
      "string.empty": "El carnet de identidad es obligatorio.",
      "string.min": "El carnet de identidad debe tener al menos 5 caracteres.",
      "string.max": "El carnet de identidad no puede superar los 20 caracteres.",
    }),

  oficios: Joi.array()
    .items(
      Joi.string()
        .trim()
        .required()
        .messages({
          "string.empty": "Cada oficio debe tener un identificador válido.",
        })
    )
    .min(1)
    .max(3)
    .required()
    .messages({
      "array.base": "El campo oficios debe ser un arreglo.",
      "array.min": "Debes seleccionar al menos un oficio.",
      "array.max": "Solo puedes seleccionar hasta 3 oficios.",
    }),
});
