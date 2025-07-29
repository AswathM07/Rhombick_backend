import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  UsersIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { customerAPI, invoiceAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    monthlyGrowth: 0
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [customersResponse, invoicesResponse] = await Promise.all([
        customerAPI.getAll(),
        invoiceAPI.getAll()
      ]);

      const customers = customersResponse.data;
      const invoices = invoicesResponse.data;

      // Calculate stats
      const totalRevenue = invoices.reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);
      
      // Get recent invoices (last 5)
      const sortedInvoices = invoices
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      // Calculate monthly data for chart
      const monthlyStats = calculateMonthlyStats(invoices);

      setStats({
        totalCustomers: customers.length,
        totalInvoices: invoices.length,
        totalRevenue,
        monthlyGrowth: 12.5 // Mock growth percentage
      });

      setRecentInvoices(sortedInvoices);
      setMonthlyData(monthlyStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyStats = (invoices) => {
    const monthlyData = {};
    
    invoices.forEach(invoice => {
      const date = new Date(invoice.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, revenue: 0, count: 0 };
      }
      
      monthlyData[monthKey].revenue += invoice.totalAmount || 0;
      monthlyData[monthKey].count += 1;
    });

    return Object.values(monthlyData).slice(-6); // Last 6 months
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const StatCard = ({ title, value, icon: Icon, change, changeType, linkTo }) => (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`flex items-center mt-1 ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'increase' ? (
                <ArrowUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm font-medium">{change}%</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Icon className="h-8 w-8 text-primary-600" />
          {linkTo && (
            <Link
              to={linkTo}
              className="btn btn-primary text-sm"
            >
              <PlusIcon className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/customers/new" className="btn btn-secondary">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Customer
          </Link>
          <Link to="/invoices/new" className="btn btn-primary">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Invoice
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={UsersIcon}
          linkTo="/customers/new"
        />
        <StatCard
          title="Total Invoices"
          value={stats.totalInvoices}
          icon={DocumentTextIcon}
          linkTo="/invoices/new"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={CurrencyDollarIcon}
          change={stats.monthlyGrowth}
          changeType="increase"
        />
        <StatCard
          title="Average Invoice"
          value={formatCurrency(stats.totalInvoices > 0 ? stats.totalRevenue / stats.totalInvoices : 0)}
          icon={DocumentTextIcon}
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
            <Link to="/invoices" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentInvoices.length > 0 ? (
              recentInvoices.map((invoice) => (
                <div key={invoice._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{invoice.invoiceNo}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(invoice.totalAmount)}
                    </p>
                    <Link
                      to={`/invoices/view/${invoice._id}`}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No invoices yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;