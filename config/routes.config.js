const index = require('../routes/index.routes');
const auth = require('../routes/auth.routes')
const product = require('../routes/product.routes')
const supplier = require('../routes/supplier.routes')
const shipping = require('../routes/shipping.routes')
const users = require('../routes/user.routes')

module.exports = (app) => {
  app.use('/api', index)
  app.use('/api', auth)
  app.use('/api', product)
  app.use('/api', supplier)
  app.use('/api', shipping)
  app.use('/api', users)
};
