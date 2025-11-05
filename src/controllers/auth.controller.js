import {
  verifyGoogleToken,
  findOrCreateGoogleUser,
  completeGoogleRegistration as completeGoogleRegistrationService,
  createUserService,
  loginUserService,
} from "../services/auth.service.js";

import { generateAppToken } from "../auth/tokenService.js";

export const verifyGoogleAuth = async (req, res) => {
  try {
    const { id_token } = req.body;
    const payload = await verifyGoogleToken(id_token);

    // Buscar o crear usuario
    const { user, wasCreated } = await findOrCreateGoogleUser(payload);

    // Construir token con toda la info necesaria
    const token = generateAppToken({
      id: user.id,
      perfilId: user.perfil?.id,
      perfilTrabajadorId: user.perfil?.perfilTrabajador?.id,
      roles: user.roles || [],
    });

    return res.json({
      success: true,
      token,
      user,
      wasCreated,
      needsSetup: !user.es_configurado,
      message: wasCreated
        ? "Usuario registrado con Google exitosamente"
        : "Inicio de sesión con Google exitoso",
    });
  } catch (error) {
    console.error("Error en verifyGoogleAuth:", error);
    res.status(500).json({ error: "Error verificando Google token" });
  }
};


export const completeGoogleRegistration = async (req, res) => {
  try {
    const updatedUser = await completeGoogleRegistrationService(req.body);
    return res.json({ message: "Perfil completado exitosamente", user: updatedUser });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Error completando registro" });
  }
};


export const createUserController = async (req, res) => {
  try {
    const data = req.body;
    const { user, token } = await createUserService(data);

    return res.status(201).json({
      message: "Usuario registrado exitosamente.",
      user,
      token,
    });
  } catch (error) {
    console.error("Error en registerUser:", error);
    return res.status(400).json({ error: error.message });
  }
};

export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones básicas (ya haces validación de formato antes)
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Debe ingresar el correo y la contraseña." });
    }

    const { user, token } = await loginUserService(email, password);

    return res.status(200).json({
      message: "Inicio de sesión exitoso.",
      user,
      token,
    });
  } catch (error) {
    console.error("Error en loginUser:", error);
    return res.status(401).json({ error: error.message });
  }
};