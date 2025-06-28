const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  customerId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: "India" },
  },
  managerName: { type: String, required: true },
  gstNumber: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
