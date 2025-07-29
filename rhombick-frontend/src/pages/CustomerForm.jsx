import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { customerAPI } from '../services/api';

const CustomerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    email: '',
    phoneNumber: '',
    managerName: '',
    gstNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      fetchCustomer();
    }
  }, [id, isEdit]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getById(id);
      const customer = response.data;
      
      setFormData({
        customerId: customer.customerId || '',
        customerName: customer.customerName || '',
        email: customer.email || '',
        phoneNumber: customer.phoneNumber || '',
        managerName: customer.managerName || 
          (customer.manager ? `${customer.manager.firstName} ${customer.manager.lastName}` : ''),
        gstNumber: customer.gstNumber || ''
      });
    } catch (error) {
      console.error('Error fetching customer:', error);
      alert('Error loading customer data');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerId.trim()) {
      newErrors.customerId = 'Customer ID is required';
    }
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phoneNumber.toString().trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.toString().replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const submitData = {
        ...formData,
        phoneNumber: parseInt(formData.phoneNumber.toString().replace(/\D/g, ''))
      };

      if (isEdit) {
        await customerAPI.update(id, submitData);
      } else {
        await customerAPI.create(submitData);
      }

      navigate('/customers');
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Error saving customer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/customers')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to Customers
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Customer' : 'Add New Customer'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEdit ? 'Update customer information' : 'Fill in the customer details below'}
        </p>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="card space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer ID */}
            <div>
              <label htmlFor="customerId" className="form-label">
                Customer ID *
              </label>
              <input
                type="text"
                id="customerId"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                className={`form-input ${errors.customerId ? 'border-red-500' : ''}`}
                placeholder="e.g., CUST001"
                disabled={isEdit} // Don't allow editing customer ID
              />
              {errors.customerId && (
                <p className="mt-1 text-sm text-red-600">{errors.customerId}</p>
              )}
            </div>

            {/* Customer Name */}
            <div>
              <label htmlFor="customerName" className="form-label">
                Customer Name *
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className={`form-input ${errors.customerName ? 'border-red-500' : ''}`}
                placeholder="e.g., Acme Corporation"
              />
              {errors.customerName && (
                <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                placeholder="e.g., contact@company.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`form-input ${errors.phoneNumber ? 'border-red-500' : ''}`}
                placeholder="e.g., 9876543210"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Manager Name */}
            <div>
              <label htmlFor="managerName" className="form-label">
                Manager Name
              </label>
              <input
                type="text"
                id="managerName"
                name="managerName"
                value={formData.managerName}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., John Smith"
              />
            </div>

            {/* GST Number */}
            <div>
              <label htmlFor="gstNumber" className="form-label">
                GST Number
              </label>
              <input
                type="text"
                id="gstNumber"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., 33AAACA1234M1Z6"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/customers')}
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
                isEdit ? 'Update Customer' : 'Create Customer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;