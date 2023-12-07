const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/v1/notificacion',
    createProxyMiddleware({
      target: 'https://mailnotification.onrender.com',
      changeOrigin: true,
    })
  );
};
