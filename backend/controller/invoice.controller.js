const Invoice = require("../models/invoice.model");
// const Customer = require("../models/customer.model");

// Create new invoice
exports.createInvoice = async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all invoices
exports.getInvoices = async (req, res) => {
  try {
    // Get page and limit from query parameters, default to 1 and 10 if not provided
    const { page = 1, limit = 10, search = '', sort = '_id' } = req.query;
    const skip = (page - 1) * limit;

    // Create search query
    const searchQuery = search
      ? {
          $or: [
            { invoiceNumber: { $regex: search, $options: 'i' } },
            { status: { $regex: search, $options: 'i' } },
            // Add other fields you want to search by
          ]
        }
      : {};

    const invoices = await Invoice.find().populate('customer').skip(skip).limit(limit);

    const total = await Invoice.countDocuments();

    res.status(200).json({success: true,data: invoices,
      pagination: {page,limit,total,totalPages: Math.ceil(total / limit)}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single invoice
exports.getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('customer');
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update invoice
exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }
    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }
    res.status(200).json({ success: true, message: "Invoice deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete item from invoice
exports.deleteInvoiceItem = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.invoiceId);
    
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    const initialItemCount = invoice.items.length;
    invoice.items = invoice.items.filter(
      item => item._id.toString() !== req.params.itemId
    );
    
    if (invoice.items.length === initialItemCount) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    const updatedInvoice = await invoice.save();
    res.status(200).json({ success: true, data: updatedInvoice });
    
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Add item to invoice
exports.addInvoiceItem = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.invoiceId);
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    const updatedInvoice = await invoice.addItem(req.body);
    res.status(200).json({ success: true, data: updatedInvoice });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update item in invoice
exports.updateInvoiceItem = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.invoiceId);
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    const updatedInvoice = await invoice.updateItem(req.params.itemId, req.body);
    res.status(200).json({ success: true, data: updatedInvoice });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get specific item from invoice
exports.getInvoiceItem = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.invoiceId);
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    const item = invoice.getItem(req.params.itemId);
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
