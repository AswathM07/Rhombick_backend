const mongoose = require('mongoose');

const validateId = (paramName) => {
  return (req, res, next, id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        error: "Invalid ID",
        details: `${paramName} ID must be a valid MongoDB ObjectID` 
      });
    }
    next();
  };
};

module.exports = {
  validateCustomerId: validateId('Customer'),
  validateInvoiceId: validateId('Invoice'),
  validateItemId: validateId('Item')
};