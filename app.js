require('dotenv').config();

// DB
require('./config/db.config');

// DEBUG
require('./config/debug.config');

// EXPRESS
const express = require('express');
const app = express();

// MIDDLEWARES
require('./config/middleware.config')(app);

// ROUTES
require('./config/routes.config')(app);

// ERRORS MIDDLEWARE
require('./config/errors.config')(app);

const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));