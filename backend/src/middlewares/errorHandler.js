function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  console.error(`[ERROR] ${status}: ${message}`);
  if (status === 500) console.error(err.stack);

  res.status(status).json({
    error: message,
    status
  });
}

module.exports = errorHandler;
