const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/quiz',
    createProxyMiddleware({
      target: 'http://146.56.99.80:8080',
      changeOrigin: true,
    })
  );
};
