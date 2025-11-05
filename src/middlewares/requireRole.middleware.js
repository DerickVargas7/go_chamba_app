export const requireRole = (role) => {
  return (req, res, next) => {
    const { roles } = req.usuario || {};

    if (!roles?.includes(role)) {
      return res.status(403).json({
        success: false,
        error: `Acceso restringido. Se requiere el rol: ${role}`,
      });
    }

    next();
  };
};
