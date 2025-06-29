const Customer = require("../models/customer.model");
const mongoose = require("mongoose");

// Change all exports to CommonJS syntax
const getCustomer = async (req, res) => {
  try {
    // Get page and limit from query parameters, default to 1 and 10 if not provided
    const { page = 1, limit = 10, search = "", sort = "_id" } = req.query;
    const skip = (page - 1) * limit;
    // Create search query
     const searchQuery = search
      ? {
          $or: [
            { customerId: { $regex: search, $options: "i" } },
            { customerName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phoneNumber: { $regex: search, $options: "i" } },
            { "address.street": { $regex: search, $options: "i" } },
            { "address.city": { $regex: search, $options: "i" } },
            { "address.state": { $regex: search, $options: "i" } },
            { "address.postalCode": { $regex: search, $options: "i" } },
            { managerName: { $regex: search, $options: "i" } },
            { gstNumber: { $regex: search, $options: "i" } }
          ],
        }
      : {};

    const customers = await Customer.find(searchQuery)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Customer.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      data: customers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.log("Error in fetching customer", error.message);
    res.status(500).json({ success: false, data: "Server error" });
  }
};

const postCustomer = async (req, res) => {
  const customer = req.body;
  const newCustomer = new Customer(customer);

  try {
    await newCustomer.save();
    res.status(201).json({ success: true, data: newCustomer });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const putCustomer = async (req, res) => {
  const { id } = req.params;
  const customer = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid customer ID" });
  }
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(id, customer, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedCustomer });
  } catch (error) {
    console.log("Error in updating customer", error.message);
    res.status(404).json({ success: false, message: "Customer Not Found" });
  }
};

const deleteCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    await Customer.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Customer Deleted" });
  } catch (error) {
    console.log("Error in deleting customer", error.message);
    res.status(404).json({ success: false, message: "Customer Not Found" });
  }
};

const getCustomerByID = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid customer ID" });
  }
  try {
    const customer = await Customer.findById(id);
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    console.log("Error in fetching customer", error.message);
    res.status(500).json({ success: false, data: "Server error" });
  }
};

module.exports = {
  getCustomer,
  postCustomer,
  putCustomer,
  deleteCustomer,
  getCustomerByID,
};
