const index = require('../routes/index.routes');

module.exports = (app) => {
  app.use('/api', index);
};
