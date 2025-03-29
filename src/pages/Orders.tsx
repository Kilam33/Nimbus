import { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  Printer,
  RefreshCw,
  ChevronDown,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  Plus,
  Settings,
  Truck,
  Package,
  CreditCard
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface Order {
  id: number;
  orderNumber: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled' | 'processing' | 'shipped';
  total: number;
  items: number;
  customer: string;
  paymentMethod: string;
  shippingMethod: string;
  itemsDetails: {
    id: number;
    name: string;
    quantity: number;
    price: number;
    sku: string;
  }[];
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' }>({
    key: 'date',
    direction: 'descending'
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Simulate API call
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockOrders: Order[] = [
        {
          id: 1,
          orderNumber: 'ORD-2024-001',
          date: '2024-03-27T10:30:00',
          status: 'completed',
          total: 1299.99,
          items: 5,
          customer: 'Acme Corporation',
          paymentMethod: 'Credit Card',
          shippingMethod: 'Express',
          itemsDetails: [
            { id: 101, name: 'Laptop Pro X', quantity: 1, price: 999.99, sku: 'LPX-001' },
            { id: 102, name: 'Wireless Mouse', quantity: 2, price: 49.99, sku: 'WM-202' },
            { id: 103, name: 'USB-C Hub', quantity: 2, price: 99.99, sku: 'UCH-305' }
          ]
        },
        {
          id: 2,
          orderNumber: 'ORD-2024-002',
          date: '2024-03-27T14:45:00',
          status: 'processing',
          total: 499.99,
          items: 2,
          customer: 'Tech Solutions Inc.',
          paymentMethod: 'Bank Transfer',
          shippingMethod: 'Standard',
          itemsDetails: [
            { id: 201, name: 'Bluetooth Headphones', quantity: 1, price: 149.99, sku: 'BH-410' },
            { id: 202, name: 'Screen Protector', quantity: 1, price: 349.99, sku: 'SP-550' }
          ]
        },
        {
          id: 3,
          orderNumber: 'ORD-2024-003',
          date: '2024-03-26T09:15:00',
          status: 'shipped',
          total: 799.99,
          items: 3,
          customer: 'Digital Ventures LLC',
          paymentMethod: 'PayPal',
          shippingMethod: 'Express',
          itemsDetails: [
            { id: 301, name: 'Smart Watch', quantity: 1, price: 249.99, sku: 'SW-720' },
            { id: 302, name: 'Phone Case', quantity: 2, price: 274.99, sku: 'PC-880' }
          ]
        },
        {
          id: 4,
          orderNumber: 'ORD-2024-004',
          date: '2024-03-25T16:20:00',
          status: 'pending',
          total: 1199.99,
          items: 4,
          customer: 'Innovate Tech',
          paymentMethod: 'Credit Card',
          shippingMethod: 'Overnight',
          itemsDetails: [
            { id: 401, name: 'Gaming Console', quantity: 1, price: 499.99, sku: 'GC-150' },
            { id: 402, name: 'Controller', quantity: 2, price: 299.99, sku: 'CT-250' },
            { id: 403, name: 'HDMI Cable', quantity: 1, price: 99.99, sku: 'HC-350' }
          ]
        },
        {
          id: 5,
          orderNumber: 'ORD-2024-005',
          date: '2024-03-24T11:10:00',
          status: 'cancelled',
          total: 599.99,
          items: 2,
          customer: 'Future Systems',
          paymentMethod: 'Credit Card',
          shippingMethod: 'Standard',
          itemsDetails: [
            { id: 501, name: 'External SSD', quantity: 1, price: 199.99, sku: 'ESSD-100' },
            { id: 502, name: 'USB Flash Drive', quantity: 1, price: 399.99, sku: 'UFD-200' }
          ]
        }
      ];

      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setIsLoading(false);
      setLastRefreshed(new Date());
    };

    fetchOrders();
  }, []);

  /// Apply filters and sorting
  useEffect(() => {
    let result = [...orders];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.itemsDetails.some(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    // Apply date range filter
    if (dateRange.start && dateRange.end) {
      result = result.filter(order => {
        const orderDate = new Date(order.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    // Apply sorting - Fixed type safety issue
    result.sort((a, b) => {
      const key = sortConfig.key as keyof Order;
      if (a[key] < b[key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter, dateRange, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-400" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-rose-400" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-indigo-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-900/30 text-emerald-400';
      case 'pending':
        return 'bg-amber-900/30 text-amber-400';
      case 'cancelled':
        return 'bg-rose-900/30 text-rose-400';
      case 'processing':
        return 'bg-blue-900/30 text-blue-400';
      case 'shipped':
        return 'bg-indigo-900/30 text-indigo-400';
      default:
        return 'bg-slate-900/30 text-slate-400';
    }
  };

  const refreshData = () => {
    // In a real app, this would refetch from the API
    setLastRefreshed(new Date());
  };

  const exportOrders = () => {
    // In a real app, this would generate a CSV or PDF
    alert('Export functionality would be implemented here');
  };

  const printOrders = () => {
    // In a real app, this would open print dialog
    alert('Print functionality would be implemented here');
  };

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM dd, yyyy h:mm a');
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ?
      <ArrowUp className="h-3 w-3 ml-1" /> :
      <ArrowDown className="h-3 w-3 ml-1" />;
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Order Management</h1>
            <p className="text-slate-400 mt-1">
              Last updated: {format(lastRefreshed, 'h:mm:ss a')}
              <button
                onClick={refreshData}
                disabled={isLoading}
                className={`ml-3 ${isLoading ? 'text-slate-500' : 'text-indigo-400 hover:text-indigo-300'} inline-flex items-center`}
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </p>
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white text-sm flex items-center transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </button>
            <button
              onClick={exportOrders}
              className="p-2 bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors"
              title="Export"
            >
              <Download className="h-5 w-5 text-slate-400" />
            </button>
            <button
              onClick={printOrders}
              className="p-2 bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors"
              title="Print"
            >
              <Printer className="h-5 w-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm text-slate-400 mb-1">From</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">To</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-800">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-300"
                    onClick={() => requestSort('orderNumber')}
                  >
                    <div className="flex items-center">
                      Order #
                      {getSortIcon('orderNumber')}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-300"
                    onClick={() => requestSort('date')}
                  >
                    <div className="flex items-center">
                      Date
                      {getSortIcon('date')}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-300"
                    onClick={() => requestSort('customer')}
                  >
                    <div className="flex items-center">
                      Customer
                      {getSortIcon('customer')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-300"
                    onClick={() => requestSort('items')}
                  >
                    <div className="flex items-center">
                      Items
                      {getSortIcon('items')}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-300"
                    onClick={() => requestSort('total')}
                  >
                    <div className="flex items-center">
                      Total
                      {getSortIcon('total')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-800 divide-y divide-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-slate-400">
                      <RefreshCw className="h-6 w-6 mx-auto animate-spin" />
                      <p className="mt-2">Loading orders...</p>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-slate-400">
                      No orders found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-700/50 transition-colors duration-200"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-indigo-400">{order.orderNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">{formatDate(order.date)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">{order.customer}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(order.status)}
                          <span
                            className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">{order.items} items</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-emerald-400">
                          ${order.total.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-400 hover:text-indigo-300">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedOrder.orderNumber}</h2>
                    <p className="text-slate-400">{formatDate(selectedOrder.date)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="p-1 rounded-full hover:bg-slate-700"
                    >
                      <XCircle className="h-5 w-5 text-slate-400" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-slate-400 mb-2">Customer</h3>
                    <p className="text-white">{selectedOrder.customer}</p>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-slate-400 mb-2">Payment Method</h3>
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-slate-300" />
                      <span className="text-white">{selectedOrder.paymentMethod}</span>
                    </div>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-slate-400 mb-2">Shipping Method</h3>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-2 text-slate-300" />
                      <span className="text-white">{selectedOrder.shippingMethod}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium text-white mb-3">Order Items</h3>
                  <div className="bg-slate-700/50 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-700">
                      <thead className="bg-slate-800">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Product</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">SKU</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Qty</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Price</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        {selectedOrder.itemsDetails.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">{item.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-400">{item.sku}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">{item.quantity}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">${item.price.toFixed(2)}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-emerald-400">
                              ${(item.quantity * item.price).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="bg-slate-700/50 p-4 rounded-lg w-full md:w-1/3">
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-400">Subtotal:</span>
                      <span className="text-slate-300">${selectedOrder.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-400">Shipping:</span>
                      <span className="text-slate-300">$0.00</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg">
                      <span className="text-white">Total:</span>
                      <span className="text-emerald-400">${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800 text-sm text-slate-500 text-center">
          <p>© 2024 Inventory Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Orders;