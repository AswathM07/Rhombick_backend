const Customer = require("../models/customer.model");
const mongoose = require("mongoose");

// Change all exports to CommonJS syntax
const getCustomer = async (req, res) => {
    try {
        const customer = await Customer.find({});
        res.status(200).json({ success: true, data: customer });
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
        return res.status(404).json({ success: false, message: "Invalid customer ID" });
    }
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(id, customer, { new: true });
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

module.exports = {
    getCustomer,
    postCustomer,
    putCustomer,
    deleteCustomer
};