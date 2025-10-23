import Joi from "joi";

export const googleCompleteSchema = Joi.object({
  userId: Joi.string().required(),
  nombreCompleto: Joi.string().min(3).max(100).required(),
  direccion: Joi.string().min(5).required(),
  departamento: Joi.string().valid(
    "La Paz",
    "Cochabamba",
    "Santa Cruz",
    "Oruro",
    "Potosí",
    "Tarija",
    "Beni",
    "Pando",
    "Chuquisaca"
  ).required(),
   telefono: Joi.string()
    .pattern(/^[0-9]{7,10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Solo se aceptan caracteres numéricos',
      'string.empty': 'El teléfono es requerido',
      'any.required': 'El teléfono es requerido'
    }),
  tiene_whatsapp: Joi.boolean().required(),
  password: Joi.string().min(6).optional(),
  confirmPassword: Joi.string().min(6).optional().equal(Joi.ref('password')),
  fotoUrl: Joi.string().uri().optional(),
});

export const googleVerifySchema = Joi.object({
  id_token: Joi.string().required(),
});

export const createUserSchema = Joi.object({
  nombreCompleto: Joi.string().min(3).max(100).required(),
  direccion: Joi.string().min(5).required(),
  email: Joi.string().email().required(),
  departamento: Joi.string().valid(
    "La Paz",
    "Cochabamba",
    "Santa Cruz",
    "Oruro",
    "Potosí",
    "Tarija",
    "Beni",
    "Pando",
    "Chuquisaca"
  ).required(),
   telefono: Joi.string()
    .pattern(/^[0-9]{7,10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Solo se aceptan caracteres numéricos',
      'string.empty': 'El teléfono es requerido',
      'any.required': 'El teléfono es requerido'
    }),
  tiene_whatsapp: Joi.boolean().required(),
  password: Joi.string().min(6).optional(),
  confirmPassword: Joi.string().min(6).optional().equal(Joi.ref('password')),
  fotoUrl: Joi.string().uri().optional(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});