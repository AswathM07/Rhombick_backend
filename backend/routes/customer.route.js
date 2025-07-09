const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth");
const {
  getCustomer,
  postCustomer,
  putCustomer,
  deleteCustomer,
  getCustomerByID,
} = require("../controller/customer.controller");

// Apply JWT protection to all subsequent customer routes
router.use(protect);

router.get("/", getCustomer);

router.post("/", postCustomer);

router.put("/:id", putCustomer);

router.delete("/:id", deleteCustomer);

router.get("/:id", getCustomerByID);

// Change from export default to module.exports
module.exports = router;
