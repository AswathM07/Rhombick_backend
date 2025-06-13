const express = require("express");
const router = express.Router();
const {getCustomer,postCustomer,putCustomer,deleteCustomer} = require("../controller/customer.controller");


router.get("/",getCustomer);

router.post("/",postCustomer);

router.put("/:id",putCustomer);

router.delete("/:id",deleteCustomer);

// Change from export default to module.exports
module.exports = router;