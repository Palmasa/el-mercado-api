const index = require('../routes/index.routes');
const auth = require('../routes/auth.routes')

module.exports = (app) => {
  app.use('/api', index)
  app.use('/api', auth)
};
