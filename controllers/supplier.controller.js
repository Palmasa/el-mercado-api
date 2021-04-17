const Supplier = require("../models/Supplier.model")

// Get all suppliers
module.exports.suppliers = async (req, res, next) => {
  const listSuppliers = await Supplier.find()
  try { res.json(listSuppliers) }
  catch { next }
}

// Edit profile: commerce && owner

// Config: email && password