import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  Calculator, 
  RefreshCw, 
  Filter, 
  Settings, 
  ChevronDown,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Search
} from 'lucide-react';

interface SalesData {
  date: string;
  actual: number;
  forecast: number;
}

interface ProductDemand {
  id: string;
  name: string;
  currentDemand: number;
  forecastedDemand: number;
  confidence: number;
  color?: string;
}

const Analytics = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<ProductDemand[]>([]);
  const [forecastPeriod, setForecastPeriod] = useState(3);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Format last refreshed time
  const formattedLastRefreshed = format(lastRefreshed, 'h:mm:ss a');

  // Color palette for charts
  const chartColors = {
    actual: '#8b5cf6', // indigo
    forecast: '#f43f5e', // rose
    confidenceHigh: '#10b981', // emerald
    confidenceMedium: '#f59e0b', // amber
    products: [
      '#8b5cf6', // indigo
      '#22d3ee', // cyan
      '#f97316', // orange
      '#a3e635'  // lime
    ]
  };

  const loadData = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate sales data
      const today = new Date();
      const data: SalesData[] = [];
      
      // Historical data
      for (let i = 11; i >= 0; i--) {
        const date = subMonths(today, i);
        const baseValue = 1000;
        const seasonality = Math.sin((i / 12) * Math.PI * 2) * 200;
        const trend = i * 50;
        const random = Math.random() * 200 - 100;
        
        const actual = Math.max(0, Math.round(baseValue + seasonality + trend + random));
        const forecast = Math.max(0, Math.round(baseValue + seasonality + trend + (Math.random() * 150 - 75)));
        
        data.push({
          date: format(date, 'MMM yyyy'),
          actual,
          forecast,
        });
      }

      // Forecast data
      for (let i = 1; i <= forecastPeriod; i++) {
        const date = addMonths(today, i);
        const baseValue = 1000;
        const seasonality = Math.sin(((12 + i) / 12) * Math.PI * 2) * 200;
        const trend = (12 + i) * 50;
        
        const forecast = Math.max(0, Math.round(baseValue + seasonality + trend));
        
        data.push({
          date: format(date, 'MMM yyyy'),
          actual: 0,
          forecast,
        });
      }

      // Generate product demand data
      const products: ProductDemand[] = [
        {
          id: '1',
          name: 'Laptop Pro X',
          currentDemand: 150,
          forecastedDemand: 180,
          confidence: 0.92,
          color: chartColors.products[0]
        },
        {
          id: '2',
          name: 'Wireless Earbuds',
          currentDemand: 300,
          forecastedDemand: 450,
          confidence: 0.88,
          color: chartColors.products[1]
        },
        {
          id: '3',
          name: 'Smart Watch',
          currentDemand: 200,
          forecastedDemand: 280,
          confidence: 0.85,
          color: chartColors.products[2]
        },
        {
          id: '4',
          name: 'Gaming Console',
          currentDemand: 100,
          forecastedDemand: 130,
          confidence: 0.90,
          color: chartColors.products[3]
        },
      ];

      setSalesData(data);
      setTopProducts(products);
      setLastRefreshed(new Date());
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    loadData();
  }, [forecastPeriod]);

  const refreshData = () => {
    loadData();
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Demand Analytics</h1>
            <p className="text-slate-400 mt-1">
              Last updated: {formattedLastRefreshed} 
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
            <div className="relative flex-grow md:flex-grow-0">
              <input 
                type="text" 
                placeholder="Search products..." 
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

        {/* Forecast Period Selector */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Calculator className="h-5 w-5 text-indigo-400 mr-2" />
              Forecast Settings
            </h2>
            <select
              value={forecastPeriod}
              onChange={(e) => setForecastPeriod(Number(e.target.value))}
              className="bg-slate-700 border border-slate-600 rounded-md px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={3}>3 Months Forecast</option>
              <option value={6}>6 Months Forecast</option>
              <option value={12}>12 Months Forecast</option>
            </select>
          </div>
        </div>

        {/* Main Chart */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Sales Trend & Forecast</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#64748b" />
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
                  dataKey="actual"
                  stroke={chartColors.actual}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Actual Sales"
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke={chartColors.forecast}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Forecasted Sales"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Demand Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Product Demand Forecast */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Product Demand Forecast</h2>
            <div className="space-y-3">
              {topProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-3 bg-slate-700/50 rounded-lg border border-slate-600 hover:bg-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-slate-200">{product.name}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.confidence >= 0.9
                          ? 'bg-emerald-900/30 text-emerald-400'
                          : 'bg-amber-900/30 text-amber-400'
                      }`}
                    >
                      {Math.round(product.confidence * 100)}% confidence
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">Current: {product.currentDemand} units</span>
                    <span className="text-indigo-400">
                      Forecast: {product.forecastedDemand} units
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-slate-400 mb-1">
                    {product.forecastedDemand > product.currentDemand ? (
                      <>
                        <ArrowUp className="h-3 w-3 mr-1 text-rose-400" />
                        <span>Expected increase</span>
                      </>
                    ) : (
                      <>
                        <ArrowDown className="h-3 w-3 mr-1 text-emerald-400" />
                        <span>Expected decrease</span>
                      </>
                    )}
                  </div>
                  <div className="mt-1 h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(product.currentDemand / product.forecastedDemand) * 100}%`,
                        backgroundColor: product.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demand Distribution */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Demand Distribution</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts}>
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
                  <Bar dataKey="currentDemand" name="Current Demand">
                    {topProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || chartColors.products[index % chartColors.products.length]} />
                    ))}
                  </Bar>
                  <Bar dataKey="forecastedDemand" name="Forecasted Demand" fill={chartColors.forecast} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Forecasting Insights */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-white">Forecasting Insights</h2>
          </div>
          <div className="text-slate-300 space-y-3">
            <p>
              The demand forecasting model uses a combination of:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>Historical sales patterns</li>
              <li>Seasonal trends</li>
              <li>Growth factors</li>
              <li>Market indicators</li>
            </ul>
            <p className="pt-2">
              <span className="font-medium">Confidence score</span> indicates the reliability of predictions based on historical accuracy
              and data consistency. Scores above 90% suggest highly reliable forecasts.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800 text-sm text-slate-500 text-center">
          <p>© 2024 Inventory Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;