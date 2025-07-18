const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  createInvoice,
  getInvoices,
  getInvoice,
  updateInvoice,
  deleteInvoice,
  deleteInvoiceItem,
  addInvoiceItem,
  getInvoiceItem,
  updateInvoiceItem
} = require("../controller/invoice.controller");

// Parameter validation middleware
router.param('invoiceId', (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid invoice ID format" });
  }
  next();
});

router.param('itemId', (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid item ID format" });
  }
  next();
});

// Main invoice routes
router.route("/")
  .get(getInvoices)
  .post(createInvoice);

router.route("/:invoiceId")
  .get(getInvoice)
  .put(updateInvoice)
  .delete(deleteInvoice);

// Nested item routes
router.route("/:invoiceId/items")
  .post(addInvoiceItem);

router.route("/:invoiceId/items/:itemId")
  .get(getInvoiceItem)
  .put(updateInvoiceItem)
  .delete(deleteInvoiceItem);

module.exports = router;