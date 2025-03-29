import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, DollarSign, ShoppingCart, TrendingUp, AlertTriangle, 
  Truck, BarChart2, Calendar, Clock, Settings, Search, Filter, 
  RefreshCw, Archive, ArrowDown, ArrowUp
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell 
} from 'recharts';

// Dashboard component interfaces
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend: string;
  trendDirection: 'positive' | 'negative' | 'neutral';
  onClick?: () => void;
  color?: string;
}

interface AlertProps {
  id: number;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp?: string;
}

interface ShipmentProps {
  id: number;
  product: string;
  quantity: number;
  expectedDate: string;
  supplier?: string;
  status?: string;
}

interface InventoryItemProps {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  threshold: number;
  category: string;
  location: string;
}

interface DashboardData {
  totalProducts: number;
  revenue: number;
  orders: number;
  lowStockItems: number;
  trends: {
    totalProducts: string;
    revenue: string;
    orders: string;
    lowStockItems: string;
  };
  recentAlerts: AlertProps[];
  upcomingShipments: ShipmentProps[];
  inventoryTrends: {
    name: string;
    products: number;
    revenue: number;
  }[];
  categoryBreakdown: {
    name: string;
    value: number;
    color: string;
  }[];
  lowStockInventory: InventoryItemProps[];
  topSellingProducts: {
    id: number;
    name: string;
    sold: number;
    revenue: number;
    inStock: number;
  }[];
}

// Component for stat cards in dashboard
const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendDirection,
  onClick,
  color = 'indigo' 
}) => {
  // Determine trend color based on direction
  const trendColorMap = {
    positive: 'text-emerald-400',
    negative: 'text-rose-400',
    neutral: 'text-slate-400'
  };

  const bgColorMap = {
    indigo: 'bg-indigo-900/30',
    emerald: 'bg-emerald-900/30',
    amber: 'bg-amber-900/30',
    rose: 'bg-rose-900/30'
  };

  const textColorMap = {
    indigo: 'text-indigo-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400'
  };

  return (
    <div 
      className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700 hover:border-slate-600 transition-all duration-300"
      onClick={onClick}
    >
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-full ${bgColorMap[color as keyof typeof bgColorMap]} mr-4`}>
          <Icon className={`h-6 w-6 ${textColorMap[color as keyof typeof textColorMap]}`} />
        </div>
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
      <div className="flex items-center">
        {trendDirection === 'positive' ? (
          <ArrowUp className={`h-4 w-4 mr-2 ${trendColorMap[trendDirection]}`} />
        ) : trendDirection === 'negative' ? (
          <ArrowDown className={`h-4 w-4 mr-2 ${trendColorMap[trendDirection]}`} />
        ) : (
          <TrendingUp className={`h-4 w-4 mr-2 ${trendColorMap[trendDirection]}`} />
        )}
        <span className={`text-sm ${trendColorMap[trendDirection]}`}>
          {trend}
        </span>
      </div>
    </div>
  );
};

// Alert component with severity indicator
const Alert: React.FC<{ alert: AlertProps }> = ({ alert }) => {
  const severityColors = {
    high: 'bg-rose-500',
    medium: 'bg-amber-500',
    low: 'bg-blue-500'
  };
  
  return (
    <div className="flex items-center p-3 bg-slate-700/50 rounded-lg mb-2 border border-slate-600 hover:bg-slate-700 transition-all">
      <div className={`w-3 h-3 rounded-full ${severityColors[alert.severity]} mr-3`}></div>
      <div className="flex-grow">
        <p className="text-slate-200">{alert.message}</p>
        {alert.timestamp && <p className="text-xs text-slate-400 mt-1">{alert.timestamp}</p>}
      </div>
    </div>
  );
};

// InventoryItem component for low stock items
const InventoryItem: React.FC<{ item: InventoryItemProps }> = ({ item }) => {
  const percentage = Math.round((item.quantity / item.threshold) * 100);
  
  return (
    <div className="p-3 bg-slate-700/50 rounded-lg mb-2 border border-slate-600 hover:bg-slate-700 transition-all">
      <div className="flex justify-between mb-1">
        <span className="font-medium text-slate-200">{item.name}</span>
        <span className="text-slate-400 text-sm">{item.sku}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-slate-400 text-sm">{item.location} • {item.category}</span>
        <span className="text-slate-200">{item.quantity} / {item.threshold}</span>
      </div>
      <div className="mt-2 h-2 w-full bg-slate-600 rounded-full overflow-hidden">
        <div 
          className={`h-full ${percentage < 30 ? 'bg-rose-500' : percentage < 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

// Mock data service
const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    // Simulate API call
    return {
      totalProducts: 246,
      revenue: 24567,
      orders: 156,
      lowStockItems: 12,
      trends: {
        totalProducts: '+12.4%',
        revenue: '+8.2%',
        orders: '+15.3%',
        lowStockItems: '-2.4%'
      },
      recentAlerts: [
        { id: 1, message: 'Laptop XPS 15 stock below threshold', severity: 'high', timestamp: '30 min ago' },
        { id: 2, message: 'Order #4592 awaiting approval', severity: 'medium', timestamp: '2 hours ago' },
        { id: 3, message: 'Weekly inventory report ready', severity: 'low', timestamp: '5 hours ago' },
        { id: 4, message: 'New supplier application received', severity: 'medium', timestamp: 'Yesterday' }
      ],
      upcomingShipments: [
        { id: 1, product: 'Laptop XPS 15', quantity: 50, expectedDate: '2024-04-15', supplier: 'Dell Inc.', status: 'In Transit' },
        { id: 2, product: 'Smartphone Galaxy S24', quantity: 100, expectedDate: '2024-04-20', supplier: 'Samsung', status: 'Processing' },
        { id: 3, product: 'Wireless Earbuds Pro', quantity: 200, expectedDate: '2024-04-25', supplier: 'Audio Technologies', status: 'Confirmed' }
      ],
      inventoryTrends: [
        { name: 'Jan', products: 200, revenue: 15000 },
        { name: 'Feb', products: 220, revenue: 18000 },
        { name: 'Mar', products: 246, revenue: 24567 },
        { name: 'Apr', products: 280, revenue: 32000 },
        { name: 'May', products: 310, revenue: 36500 },
        { name: 'Jun', products: 350, revenue: 42000 }
      ],
      categoryBreakdown: [
        { name: 'Electronics', value: 45, color: '#8b5cf6' },
        { name: 'Accessories', value: 25, color: '#22d3ee' },
        { name: 'Peripherals', value: 15, color: '#f97316' },
        { name: 'Components', value: 10, color: '#f43f5e' },
        { name: 'Other', value: 5, color: '#a3e635' }
      ],
      lowStockInventory: [
        { id: 1, name: 'Laptop XPS 15', sku: 'LAP-XPS-15', quantity: 5, threshold: 20, category: 'Electronics', location: 'Warehouse A' },
        { id: 2, name: 'Wireless Mouse MX', sku: 'ACC-MX-001', quantity: 8, threshold: 30, category: 'Accessories', location: 'Warehouse B' },
        { id: 3, name: 'Mechanical Keyboard', sku: 'KEY-MK-102', quantity: 12, threshold: 25, category: 'Peripherals', location: 'Warehouse A' },
        { id: 4, name: 'USB-C Hub', sku: 'HUB-USC-01', quantity: 7, threshold: 40, category: 'Accessories', location: 'Warehouse C' }
      ],
      topSellingProducts: [
        { id: 1, name: 'Smartphone Galaxy S23', sold: 120, revenue: 96000, inStock: 85 },
        { id: 2, name: 'Wireless Earbuds Pro', sold: 200, revenue: 36000, inStock: 150 },
        { id: 3, name: 'Smart Watch Series 8', sold: 80, revenue: 32000, inStock: 45 },
        { id: 4, name: 'USB-C Power Adapter', sold: 350, revenue: 21000, inStock: 230 }
      ]
    };
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    throw err;
  }
};

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalProducts: 0,
    revenue: 0,
    orders: 0,
    lowStockItems: 0,
    trends: {
      totalProducts: '',
      revenue: '',
      orders: '',
      lowStockItems: ''
    },
    recentAlerts: [],
    upcomingShipments: [],
    inventoryTrends: [],
    categoryBreakdown: [],
    lowStockInventory: [],
    topSellingProducts: []
  });
  
  const [selectedView, setSelectedView] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [selectedSection, setSelectedSection] = useState<'overview' | 'inventory' | 'orders'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Fetch dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDashboardData();
        setDashboardData(data);
        setLastRefreshed(new Date());
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Function to refresh data
  const refreshData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchDashboardData();
      setDashboardData(data);
      setLastRefreshed(new Date());
    } catch (err) {
      setError('Failed to refresh dashboard data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine trend direction
  const getTrendDirection = (trend: string) => {
    if (trend.startsWith('+')) return 'positive';
    if (trend.startsWith('-')) return 'negative';
    return 'neutral';
  };

  // Mapping for chart colors based on the selected view
  const chartColors = useMemo(() => ({
    products: '#8b5cf6', // Indigo
    revenue: '#22d3ee', // Cyan
    orders: '#f97316', // Orange
    low: '#f43f5e' // Rose
  }), []);

  // Format last refreshed time
  const formattedLastRefreshed = useMemo(() => {
    return lastRefreshed.toLocaleTimeString();
  }, [lastRefreshed]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin">
            <RefreshCw className="h-12 w-12 mx-auto text-indigo-500 mb-4" />
          </div>
          <p className="text-slate-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center">
        <div className="bg-rose-900/20 p-6 rounded-lg flex items-center">
          <AlertTriangle className="h-8 w-8 text-rose-500 mr-4" />
          <div>
            <p className="text-rose-300 font-medium mb-2">{error}</p>
            <button
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-md text-white text-sm transition-colors"
              onClick={refreshData}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header with Navigation */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-slate-400 mt-1">
              Last updated: {formattedLastRefreshed} 
              <button 
                onClick={refreshData}
                className="ml-3 text-indigo-400 hover:text-indigo-300 inline-flex items-center"
              >
                <RefreshCw className="h-3 w-3 mr-1" /> Refresh
              </button>
            </p>
          </div>
          
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <input 
                type="text" 
                placeholder="Search inventory..." 
                className="bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-200"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
            <button className="bg-slate-800 p-2 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors">
              <Filter className="h-5 w-5 text-slate-400" />
            </button>
            <button className="bg-slate-800 p-2 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors">
              <Settings className="h-5 w-5 text-slate-400" />
            </button>
          </div>
        </div>
        
        {/* Section Navigation */}
        <div className="flex overflow-x-auto mb-6 bg-slate-800 p-1 rounded-lg border border-slate-700 no-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart2 },
            { id: 'inventory', label: 'Inventory', icon: Archive },
            { id: 'orders', label: 'Orders', icon: ShoppingCart }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center px-4 py-2 rounded-md mr-2 transition-colors ${
                selectedSection === tab.id 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
              onClick={() => setSelectedSection(tab.id as 'overview' | 'inventory' | 'orders')}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Overview Section */}
        {selectedSection === 'overview' && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                title="Total Products"
                value={dashboardData.totalProducts}
                icon={Package}
                trend={dashboardData.trends.totalProducts}
                trendDirection={getTrendDirection(dashboardData.trends.totalProducts)}
                color="indigo"
              />
              <StatCard
                title="Revenue"
                value={`$${dashboardData.revenue.toLocaleString()}`}
                icon={DollarSign}
                trend={dashboardData.trends.revenue}
                trendDirection={getTrendDirection(dashboardData.trends.revenue)}
                color="emerald"
              />
              <StatCard
                title="Orders"
                value={dashboardData.orders}
                icon={ShoppingCart}
                trend={dashboardData.trends.orders}
                trendDirection={getTrendDirection(dashboardData.trends.orders)}
                color="amber"
              />
              <StatCard
                title="Low Stock Items"
                value={dashboardData.lowStockItems}
                icon={AlertTriangle}
                trend={dashboardData.trends.lowStockItems}
                trendDirection={getTrendDirection(dashboardData.trends.lowStockItems)}
                color="rose"
              />
            </div>
            
            {/* Charts and Info Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Inventory Trend Chart */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Inventory & Revenue Trends</h2>
                  <div className="flex">
                    {['Monthly', 'Weekly', 'Daily'].map((period) => (
                      <button
                        key={period}
                        className={`px-3 py-1 rounded-md text-xs mr-1 transition-colors duration-300 ${
                          selectedView.toLowerCase() === period.toLowerCase() 
                            ? 'bg-indigo-700 text-white' 
                            : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                        }`}
                        onClick={() => setSelectedView(period.toLowerCase() as 'daily' | 'weekly' | 'monthly')}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData.inventoryTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        borderColor: '#334155',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="products" 
                      name="Products" 
                      stroke={chartColors.products} 
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      name="Revenue ($)" 
                      stroke={chartColors.revenue} 
                      strokeWidth={3} 
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Category Breakdown */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
                <h2 className="text-lg font-semibold mb-4 text-white">Category Breakdown</h2>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData.categoryBreakdown}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {dashboardData.categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Percentage']}
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          borderColor: '#334155',
                          color: '#fff'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Alerts and Shipments Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Low Stock Items */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <AlertTriangle className="h-5 w-5 text-rose-400 mr-2" />
                    Low Stock Items
                  </h2>
                  <button className="text-xs text-indigo-400 hover:text-indigo-300">
                    View All
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {dashboardData.lowStockInventory.map((item) => (
                    <InventoryItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
              
              {/* Recent Alerts */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <Clock className="h-5 w-5 text-amber-400 mr-2" />
                    Recent Alerts
                  </h2>
                  <button className="text-xs text-indigo-400 hover:text-indigo-300">
                    View All
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {dashboardData.recentAlerts.map((alert) => (
                    <Alert key={alert.id} alert={alert} />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Inventory Section */}
        {selectedSection === 'inventory' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Top Selling Products */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 md:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Top Selling Products</h2>
                  <button className="text-xs text-indigo-400 hover:text-indigo-300">
                    Export Report
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-slate-400 text-sm border-b border-slate-700">
                        <th className="pb-2">Product</th>
                        <th className="pb-2">Units Sold</th>
                        <th className="pb-2">Revenue</th>
                        <th className="pb-2">In Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.topSellingProducts.map((product) => (
                        <tr key={product.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                          <td className="py-3 text-slate-200">{product.name}</td>
                          <td className="py-3 text-slate-200">{product.sold}</td>
                          <td className="py-3 text-emerald-400">${product.revenue.toLocaleString()}</td>
                          <td className="py-3 text-slate-200">{product.inStock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Category Distribution */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
                <h2 className="text-lg font-semibold mb-4 text-white">Category Distribution</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={dashboardData.categoryBreakdown} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" stroke="#64748b" />
                    <YAxis dataKey="name" type="category" stroke="#64748b" width={100} />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        borderColor: '#334155',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="value" name="Percentage" radius={[0, 4, 4, 0]}>
                      {dashboardData.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Low Stock and Shipments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Low Stock Items (same as in Overview) */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <AlertTriangle className="h-5 w-5 text-rose-400 mr-2" />
                    Low Stock Items
                  </h2>
                  <button className="text-xs text-indigo-400 hover:text-indigo-300">
                    View All
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {dashboardData.lowStockInventory.map((item) => (
                    <InventoryItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
              
              {/* Upcoming Shipments */}
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <Truck className="h-5 w-5 text-emerald-400 mr-2" />
                    Upcoming Shipments
                  </h2>
                  <button className="text-xs text-indigo-400 hover:text-indigo-300">
                    View All
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {dashboardData.upcomingShipments.map((shipment) => (
                    <div key={shipment.id} className="p-3 bg-slate-700/50 rounded-lg mb-2 border border-slate-600 hover:bg-slate-700 transition-all">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-slate-200">{shipment.product}</span>
                        <span className="text-slate-400 text-sm">{shipment.expectedDate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">{shipment.supplier} • {shipment.status}</span>
                        <span className="text-slate-200">Qty: {shipment.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Orders Section */}
        {selectedSection === 'orders' && (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 text-center">
            <Calendar className="h-12 w-12 mx-auto text-indigo-400 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Order Management</h2>
            <p className="text-slate-400 mb-4">Order management section is coming soon in the next update.</p>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white text-sm transition-colors">
              View Orders Overview
            </button>
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

export default Dashboard;