const express = require("express");
const router = express.Router();
const {
  createInvoice,
  getInvoices,
  getInvoice,
  updateInvoice,
  deleteInvoice,
  deleteInvoiceItem,addInvoiceItem,getInvoiceItem,updateInvoiceItem
} = require("../controller/invoice.controller");

router.post("/", createInvoice);
router.get("/", getInvoices);
router.get("/:id", getInvoice);
router.put("/:id", updateInvoice);
router.delete("/:id", deleteInvoice);

// Add these with your existing routes
router.post('/:invoiceId/items', addInvoiceItem);          // Create item
router.get('/:invoiceId/items/:itemId', getInvoiceItem);    // Get single item
router.put('/:invoiceId/items/:itemId', updateInvoiceItem); // Update item
router.delete('/:invoiceId/items/:itemId', deleteInvoiceItem); // Delete item

module.exports = router;