/**
 * Middleware pour les routes non trouvées (404)
 */
function notFound(req, res, next) {
  const error = new Error(`Route non trouvée - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

/**
 * Middleware global de gestion des erreurs
 */
function errorHandler(err, req, res, next) {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Erreur interne du serveur";

  // Erreur Prisma : violation de contrainte unique
  if (err.code === "P2002") {
    statusCode = 409;
    message = `Cette valeur existe déjà (champ concerné : ${err.meta?.target})`;
  }

  // Erreur Prisma : enregistrement introuvable
  if (err.code === "P2025") {
    statusCode = 404;
    message = "Enregistrement introuvable.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}

module.exports = { notFound, errorHandler };
