const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  invoiceNo: { 
    type: String, 
    required: true, 
    unique: true 
  },
  invoiceDate: { 
    type: Date, 
    default: Date.now 
  },
  poNo: String,
  poDate: Date,
  dcNo: String,
  dcDate: Date,
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
 items: [{
    description: { type: String, required: true },
    hsnSac: String,
    quantity: { type: Number, required: true, min: 1 },
    rate: { type: Number, required: true, min: 0 },
    amount: Number
  }],
  cgstRate: {
    type: Number,
    default: 0
  },
  sgstRate: {
    type: Number,
    default: 0
  },
  igstRate: {
    type: Number,
    default: 0
  },
  subtotal: Number,
  taxAmount: Number,
  totalAmount: Number,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Calculate totals before saving
invoiceSchema.pre('save', function(next) {
  this.subtotal = this.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  
  // Calculate tax based on customer's state (example logic)
  const taxRate = this.customer.state === 'Karnataka' ? 
    { cgst: 9, sgst: 9, igst: 0 } : { cgst: 0, sgst: 0, igst: 18 };
  
  this.cgstRate = taxRate.cgst;
  this.sgstRate = taxRate.sgst;
  this.igstRate = taxRate.igst;
  
  this.taxAmount = this.subtotal * (this.cgstRate + this.sgstRate + this.igstRate) / 100;
  this.totalAmount = this.subtotal + this.taxAmount;
  
  next();
});

// item CRED methods
invoiceSchema.methods.addItem = function(item) {
  this.items.push(item);
  return this.save();
};

invoiceSchema.methods.updateItem = function(itemId, newData) {
  const itemToUpdate = this.items.id(itemId);
  if (!itemToUpdate) throw new Error('Item not found');
  
  Object.assign(itemToUpdate, newData);
  return this.save();
};

invoiceSchema.methods.getItem = function(itemId) {
  const item = this.items.id(itemId);
  if (!item) throw new Error('Item not found');
  return item;
};
invoiceSchema.methods.removeItem = function(itemId) {
  this.items = this.items.filter(item => item._id.toString() !== itemId.toString());
  return this.save();
};

module.exports = mongoose.model("Invoice", invoiceSchema);