const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  getCustomer,
  postCustomer,
  putCustomer,
  deleteCustomer,
  getCustomerByID,
} = require("../controller/customer.controller");

// Parameter validation middleware
router.param('id', (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid customer ID format" });
  }
  next();
});

// Routes
router.route("/")
  .get(getCustomer)
  .post(postCustomer);

router.route("/:id")
  .get(getCustomerByID)
  .put(putCustomer)
  .delete(deleteCustomer);

module.exports = router;