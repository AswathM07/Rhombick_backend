import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  PrinterIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { invoiceAPI, customerAPI } from '../services/api';

const InvoiceView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoiceData();
  }, [id]);

  const fetchInvoiceData = async () => {
    try {
      setLoading(true);
      const [invoiceResponse, customersResponse] = await Promise.all([
        invoiceAPI.getById(id),
        customerAPI.getAll()
      ]);
      
      const invoiceData = invoiceResponse.data;
      const customersData = customersResponse.data;
      
      setInvoice(invoiceData);
      setCustomer(customersData.find(c => c._id === invoiceData.customer));
    } catch (error) {
      console.error('Error fetching invoice data:', error);
      alert('Error loading invoice data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // This would typically generate a PDF
    alert('PDF download feature would be implemented here');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Invoice not found</p>
        <button
          onClick={() => navigate('/invoices')}
          className="btn btn-primary mt-4"
        >
          Back to Invoices
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/invoices')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to Invoices
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="btn btn-secondary"
          >
            <PrinterIcon className="h-4 w-4 mr-2" />
            Print
          </button>
          <button
            onClick={handleDownload}
            className="btn btn-secondary"
          >
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            Download PDF
          </button>
          <Link
            to={`/invoices/edit/${id}`}
            className="btn btn-primary"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit Invoice
          </Link>
        </div>
      </div>

      {/* Invoice Document */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none">
        {/* Invoice Header */}
        <div className="bg-primary-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">INVOICE</h1>
              <p className="text-primary-100 mt-1">Rhombick Technologies</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold">{invoice.invoiceNo}</h2>
              <p className="text-primary-100">Date: {formatDate(invoice.invoiceDate)}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Company and Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* From */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">From:</h3>
              <div className="text-gray-700">
                <p className="font-semibold">Rhombick Technologies</p>
                <p>123 Business Street</p>
                <p>Technology Park</p>
                <p>Bangalore, Karnataka 560001</p>
                <p>GST: 29ABCDE1234F1Z5</p>
              </div>
            </div>

            {/* To */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
              {customer && (
                <div className="text-gray-700">
                  <p className="font-semibold">{customer.customerName}</p>
                  <p>{customer.email}</p>
                  <p>Phone: {customer.phoneNumber}</p>
                  {customer.gstNumber && <p>GST: {customer.gstNumber}</p>}
                  {customer.managerName && <p>Manager: {customer.managerName}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <h4 className="font-semibold text-gray-900">Purchase Order</h4>
              <p className="text-gray-700">{invoice.poNo}</p>
              <p className="text-sm text-gray-500">Date: {formatDate(invoice.poDate)}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Delivery Challan</h4>
              <p className="text-gray-700">{invoice.dcNo}</p>
              <p className="text-sm text-gray-500">Date: {formatDate(invoice.dcDate)}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Payment Terms</h4>
              <p className="text-gray-700">Net 30 Days</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      HSN/SAC
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Rate
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-200">
                        {item.description}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-200">
                        {item.hsnSac}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 text-right border-r border-gray-200">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 text-right border-r border-gray-200">
                        {formatCurrency(item.rate)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 text-right font-medium">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full md:w-1/2">
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
                </div>
                
                {invoice.cgst > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">CGST ({invoice.cgstRate}%):</span>
                    <span className="font-medium">{formatCurrency(invoice.cgst)}</span>
                  </div>
                )}
                
                {invoice.sgst > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">SGST ({invoice.sgstRate}%):</span>
                    <span className="font-medium">{formatCurrency(invoice.sgst)}</span>
                  </div>
                )}
                
                {invoice.igst > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">IGST ({invoice.igstRate}%):</span>
                    <span className="font-medium">{formatCurrency(invoice.igst)}</span>
                  </div>
                )}
                
                <div className="flex justify-between py-3 border-t-2 border-gray-300">
                  <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-lg font-bold text-primary-600">
                    {formatCurrency(invoice.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Terms & Conditions:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Payment is due within 30 days of invoice date</li>
                  <li>• Late payments may incur additional charges</li>
                  <li>• All disputes must be raised within 7 days</li>
                </ul>
              </div>
              <div className="text-right">
                <div className="mb-4">
                  <p className="font-semibold text-gray-900">Authorized Signatory</p>
                  <div className="mt-8 border-b border-gray-400 w-48 ml-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Rhombick Technologies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          @page {
            margin: 0.5in;
          }
          body {
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceView;