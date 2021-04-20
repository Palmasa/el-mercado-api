const index = require('../routes/index.routes');
const auth = require('../routes/auth.routes')
const product = require('../routes/product.routes')

module.exports = (app) => {
  app.use('/api', index)
  app.use('/api', auth)
  app.use('/api', product)
};
