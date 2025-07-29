import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { invoiceAPI, customerAPI } from '../services/api';

const InvoiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    invoiceNo: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    poNo: '',
    poDate: new Date().toISOString().split('T')[0],
    dcNo: '',
    dcDate: new Date().toISOString().split('T')[0],
    customer: '',
    items: [
      {
        description: '',
        hsnSac: '',
        quantity: 1,
        rate: 0,
        amount: 0
      }
    ],
    cgstRate: 0,
    sgstRate: 0,
    igstRate: 18
  });

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCustomers();
    if (isEdit) {
      fetchInvoice();
    }
  }, [id, isEdit]);

  const fetchCustomers = async () => {
    try {
      const response = await customerAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await invoiceAPI.getById(id);
      const invoice = response.data;
      
      setFormData({
        invoiceNo: invoice.invoiceNo || '',
        invoiceDate: invoice.invoiceDate ? invoice.invoiceDate.split('T')[0] : '',
        poNo: invoice.poNo || '',
        poDate: invoice.poDate ? invoice.poDate.split('T')[0] : '',
        dcNo: invoice.dcNo || '',
        dcDate: invoice.dcDate ? invoice.dcDate.split('T')[0] : '',
        customer: invoice.customer || '',
        items: invoice.items.length > 0 ? invoice.items : [
          { description: '', hsnSac: '', quantity: 1, rate: 0, amount: 0 }
        ],
        cgstRate: invoice.cgstRate || 0,
        sgstRate: invoice.sgstRate || 0,
        igstRate: invoice.igstRate || 18
      });
    } catch (error) {
      console.error('Error fetching invoice:', error);
      alert('Error loading invoice data');
    } finally {
      setLoading(false);
    }
  };

  const calculateItemAmount = (quantity, rate) => {
    return quantity * rate;
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const cgst = (subtotal * formData.cgstRate) / 100;
    const sgst = (subtotal * formData.sgstRate) / 100;
    const igst = (subtotal * formData.igstRate) / 100;
    const taxAmount = cgst + sgst + igst;
    const totalAmount = subtotal + taxAmount;

    return { subtotal, cgst, sgst, igst, taxAmount, totalAmount };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };

    // Recalculate amount when quantity or rate changes
    if (field === 'quantity' || field === 'rate') {
      const quantity = field === 'quantity' ? parseFloat(value) || 0 : updatedItems[index].quantity;
      const rate = field === 'rate' ? parseFloat(value) || 0 : updatedItems[index].rate;
      updatedItems[index].amount = calculateItemAmount(quantity, rate);
    }

    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { description: '', hsnSac: '', quantity: 1, rate: 0, amount: 0 }
      ]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.invoiceNo.trim()) {
      newErrors.invoiceNo = 'Invoice number is required';
    }
    if (!formData.customer) {
      newErrors.customer = 'Customer is required';
    }
    if (!formData.poNo.trim()) {
      newErrors.poNo = 'PO number is required';
    }

    // Validate items
    formData.items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`item_${index}_description`] = 'Description is required';
      }
      if (!item.hsnSac.trim()) {
        newErrors[`item_${index}_hsnSac`] = 'HSN/SAC is required';
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = 'Quantity must be greater than 0';
      }
      if (item.rate < 0) {
        newErrors[`item_${index}_rate`] = 'Rate cannot be negative';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const totals = calculateTotals();
      const submitData = {
        ...formData,
        ...totals
      };

      if (isEdit) {
        await invoiceAPI.update(id, submitData);
      } else {
        await invoiceAPI.create(submitData);
      }

      navigate('/invoices');
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Error saving invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/invoices')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to Invoices
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Invoice' : 'Create New Invoice'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEdit ? 'Update invoice information' : 'Fill in the invoice details below'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="invoiceNo" className="form-label">
                Invoice Number *
              </label>
              <input
                type="text"
                id="invoiceNo"
                name="invoiceNo"
                value={formData.invoiceNo}
                onChange={handleInputChange}
                className={`form-input ${errors.invoiceNo ? 'border-red-500' : ''}`}
                placeholder="e.g., INV-001"
              />
              {errors.invoiceNo && (
                <p className="mt-1 text-sm text-red-600">{errors.invoiceNo}</p>
              )}
            </div>

            <div>
              <label htmlFor="invoiceDate" className="form-label">
                Invoice Date *
              </label>
              <input
                type="date"
                id="invoiceDate"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div>
              <label htmlFor="customer" className="form-label">
                Customer *
              </label>
              <select
                id="customer"
                name="customer"
                value={formData.customer}
                onChange={handleInputChange}
                className={`form-input ${errors.customer ? 'border-red-500' : ''}`}
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer._id} value={customer._id}>
                    {customer.customerName}
                  </option>
                ))}
              </select>
              {errors.customer && (
                <p className="mt-1 text-sm text-red-600">{errors.customer}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <label htmlFor="poNo" className="form-label">
                PO Number *
              </label>
              <input
                type="text"
                id="poNo"
                name="poNo"
                value={formData.poNo}
                onChange={handleInputChange}
                className={`form-input ${errors.poNo ? 'border-red-500' : ''}`}
                placeholder="e.g., PO-2023-001"
              />
              {errors.poNo && (
                <p className="mt-1 text-sm text-red-600">{errors.poNo}</p>
              )}
            </div>

            <div>
              <label htmlFor="poDate" className="form-label">
                PO Date
              </label>
              <input
                type="date"
                id="poDate"
                name="poDate"
                value={formData.poDate}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div>
              <label htmlFor="dcNo" className="form-label">
                DC Number
              </label>
              <input
                type="text"
                id="dcNo"
                name="dcNo"
                value={formData.dcNo}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., DC-2023-001"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <label htmlFor="dcDate" className="form-label">
                DC Date
              </label>
              <input
                type="date"
                id="dcDate"
                name="dcDate"
                value={formData.dcDate}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Items</h3>
            <button
              type="button"
              onClick={addItem}
              className="btn btn-secondary text-sm"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Item {index + 1}</h4>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="md:col-span-2">
                    <label className="form-label">Description *</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className={`form-input ${errors[`item_${index}_description`] ? 'border-red-500' : ''}`}
                      placeholder="Item description"
                    />
                    {errors[`item_${index}_description`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`item_${index}_description`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">HSN/SAC *</label>
                    <input
                      type="text"
                      value={item.hsnSac}
                      onChange={(e) => handleItemChange(index, 'hsnSac', e.target.value)}
                      className={`form-input ${errors[`item_${index}_hsnSac`] ? 'border-red-500' : ''}`}
                      placeholder="HSN/SAC"
                    />
                    {errors[`item_${index}_hsnSac`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`item_${index}_hsnSac`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Quantity *</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className={`form-input ${errors[`item_${index}_quantity`] ? 'border-red-500' : ''}`}
                      min="0"
                      step="0.01"
                    />
                    {errors[`item_${index}_quantity`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`item_${index}_quantity`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">Rate</label>
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                      className={`form-input ${errors[`item_${index}_rate`] ? 'border-red-500' : ''}`}
                      min="0"
                      step="0.01"
                    />
                    {errors[`item_${index}_rate`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`item_${index}_rate`]}</p>
                    )}
                  </div>
                </div>

                <div className="mt-3 text-right">
                  <span className="text-sm text-gray-600">
                    Amount: ₹{item.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tax Information */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="cgstRate" className="form-label">
                CGST Rate (%)
              </label>
              <input
                type="number"
                id="cgstRate"
                name="cgstRate"
                value={formData.cgstRate}
                onChange={handleInputChange}
                className="form-input"
                min="0"
                max="100"
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="sgstRate" className="form-label">
                SGST Rate (%)
              </label>
              <input
                type="number"
                id="sgstRate"
                name="sgstRate"
                value={formData.sgstRate}
                onChange={handleInputChange}
                className="form-input"
                min="0"
                max="100"
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="igstRate" className="form-label">
                IGST Rate (%)
              </label>
              <input
                type="number"
                id="igstRate"
                name="igstRate"
                value={formData.igstRate}
                onChange={handleInputChange}
                className="form-input"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{totals.subtotal.toFixed(2)}</span>
            </div>
            {totals.cgst > 0 && (
              <div className="flex justify-between">
                <span>CGST ({formData.cgstRate}%):</span>
                <span>₹{totals.cgst.toFixed(2)}</span>
              </div>
            )}
            {totals.sgst > 0 && (
              <div className="flex justify-between">
                <span>SGST ({formData.sgstRate}%):</span>
                <span>₹{totals.sgst.toFixed(2)}</span>
              </div>
            )}
            {totals.igst > 0 && (
              <div className="flex justify-between">
                <span>IGST ({formData.igstRate}%):</span>
                <span>₹{totals.igst.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total Amount:</span>
              <span>₹{totals.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/invoices')}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              isEdit ? 'Update Invoice' : 'Create Invoice'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;