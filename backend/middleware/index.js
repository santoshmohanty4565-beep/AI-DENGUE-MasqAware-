/**
 * MosqAware — Backend Middleware
 * Request logging, error handling, rate limiting, auth
 */

// Request timing middleware
function requestTimer(req, res, next) {
  req._startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - req._startTime;
    if (duration > 1000) {
      console.warn(`⚠️ Slow request: ${req.method} ${req.url} took ${duration}ms`);
    }
  });
  next();
}

// API key validation middleware (optional, for production)
function apiKeyAuth(req, res, next) {
  // Skip auth for health check and static files
  if (req.path === '/api/health' || !req.path.startsWith('/api')) {
    return next();
  }

  const apiKey = req.headers['x-api-key'] || req.query.api_key;

  // In development mode, bypass auth
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or missing API key',
    });
  }

  next();
}

// Error handling middleware
function errorHandler(err, req, res, next) {
  console.error(`❌ Error: ${err.message}`);
  console.error(err.stack);

  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

// 404 handler for unknown API routes
function notFoundHandler(req, res, next) {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      status: 'error',
      message: `API endpoint not found: ${req.method} ${req.path}`,
      availableEndpoints: [
        'GET  /api/health',
        'GET  /api/dashboard/stats',
        'GET  /api/districts',
        'GET  /api/districts/:id',
        'GET  /api/predict/2027',
        'GET  /api/predict/shap',
        'GET  /api/villages',
        'POST /api/assistant/chat',
        'POST /api/detect-mosquito',
        'GET  /api/v1/map/state',
        'GET  /api/v1/map/blocks/:district_code',
        'GET  /api/v1/map/villages/:block_code',
        'GET  /api/v1/risk/districts',
        'GET  /api/v1/risk/hotspots',
        'GET  /api/v1/analytics/district/:code',
      ],
    });
  }
  next();
}

module.exports = {
  requestTimer,
  apiKeyAuth,
  errorHandler,
  notFoundHandler,
};
