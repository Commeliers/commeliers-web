const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://210.109.82.7:30770',
      changeOrigin: true,
    })
  );
};