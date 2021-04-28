const cors = require("cors")

module.exports.corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN || 300,
  allowedHeaders: ["Content-Type", "Authorization", "zip", "cart"]
})