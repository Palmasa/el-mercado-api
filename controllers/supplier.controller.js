const Supplier = require("../models/Supplier.model")


module.exports.suppliers = async (req, res, next) => {
  const listSuppliers = await Supplier.find()
  try { res.json(listSuppliers) }
  catch { next }
}