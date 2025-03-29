import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, Filter, ArrowUpDown, 
  AlertTriangle, RefreshCw, Download, Printer, 
  Package, Tag, Info, X, ChevronDown, MoreVertical,
  ArrowUp, ArrowDown
} from 'lucide-react';
import ProductModal from './ProductModal';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category_id: string;
  category?: string;
  sku?: string;
  low_stock_threshold?: number;
  last_updated?: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'asc' | 'desc' }>({
    key: 'name',
    direction: 'asc'
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      if (categoryFilter) queryParams.append('category', categoryFilter);
      queryParams.append('sort', sortConfig.key);
      queryParams.append('order', sortConfig.direction);
  
      const response = await fetch(`http://localhost:5000/api/products?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      
      const processedProducts = data.data.map((product: any) => ({
        ...product,
        price: Number(product.price),
        quantity: Number(product.quantity),
        low_stock_threshold: Number(product.low_stock_threshold) || 10,
        last_updated: product.last_updated || new Date().toISOString()
      }));
      
      setProducts(processedProducts);
      setLastRefreshed(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Handle product creation/update
  const handleSaveProduct = async (productData: Omit<Product, 'id'> & { id?: string }) => {
    try {
      const url = productData.id 
        ? `http://localhost:5000/api/products/${productData.id}`
        : 'http://localhost:5000/api/products';
      
      const method = productData.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...productData,
          low_stock_threshold: productData.low_stock_threshold || 10
        }),
      });
      
      if (!response.ok) {
        throw new Error(productData.id ? 'Failed to update product' : 'Failed to create product');
      }
      
      await fetchProducts();
      setIsModalOpen(false);
      setSelectedProduct(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  // Handle sorting
  const handleSort = (column: keyof Product) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === column) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    setSortConfig({ key: column, direction });
  };

  // Get sort icon for column
  const getSortIcon = (column: keyof Product) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="h-3 w-3 ml-1" /> : 
      <ArrowDown className="h-3 w-3 ml-1" />;
  };

  // Filter products based on search, category, and low stock
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === '' || product.category_id === categoryFilter;
    
    const matchesLowStock = !showLowStockOnly || 
      (product.quantity <= (product.low_stock_threshold || 10));
    
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  // Initial data loading
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [sortConfig]);

  return (
    <div className="bg-slate-900 min-h-screen text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(undefined);
          }}
          product={selectedProduct}
          categories={categories}
          onSave={handleSaveProduct}
        />

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Product Inventory</h1>
            <p className="text-slate-400 mt-1">
              Last updated: {new Date(lastRefreshed).toLocaleTimeString()} 
              <button 
                onClick={fetchProducts}
                disabled={loading}
                className={`ml-3 ${loading ? 'text-slate-500' : 'text-indigo-400 hover:text-indigo-300'} inline-flex items-center`}
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} /> 
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </p>
          </div>
          
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <button 
              onClick={() => {
                setSelectedProduct(undefined);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white text-sm flex items-center transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </button>
            <button 
              onClick={() => exportProducts()}
              className="p-2 bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors"
              title="Export"
            >
              <Download className="h-5 w-5 text-slate-400" />
            </button>
            <button 
              onClick={() => window.print()}
              className="p-2 bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors"
              title="Print"
            >
              <Printer className="h-5 w-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            {/* Category Filter */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Low Stock Toggle */}
            <div className="flex items-end">
              <label className="inline-flex items-center mt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLowStockOnly}
                  onChange={() => setShowLowStockOnly(!showLowStockOnly)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                <span className="ml-3 text-sm text-slate-300">Show Low Stock Only</span>
              </label>
            </div>

            {/* Sort Dropdown */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">Sort By</label>
              <select
                value={sortConfig.key}
                onChange={(e) => handleSort(e.target.value as keyof Product)}
                className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="quantity">Quantity</option>
                <option value="last_updated">Last Updated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-800">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-300"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Product
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    SKU
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-300"
                    onClick={() => handleSort('quantity')}
                  >
                    <div className="flex items-center">
                      Stock
                      {getSortIcon('quantity')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-300"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center">
                      Price
                      {getSortIcon('price')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-800 divide-y divide-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-slate-400">
                      <RefreshCw className="h-6 w-6 mx-auto animate-spin" />
                      <p className="mt-2">Loading products...</p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-rose-400">
                      <AlertTriangle className="h-6 w-6 mx-auto" />
                      <p className="mt-2">{error}</p>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-slate-400">
                      No products found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-slate-700 rounded-md flex items-center justify-center">
                            <Package className="h-5 w-5 text-indigo-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{product.name}</div>
                            <div className="text-sm text-slate-400 line-clamp-1">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">{product.sku || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-24 mr-3">
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                              <span>Stock</span>
                              <span>{product.quantity}</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  product.quantity <= (product.low_stock_threshold || 10) ? 'bg-rose-500' : 
                                  product.quantity <= (product.low_stock_threshold || 10) * 2 ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{
                                  width: `${Math.min(
                                    (product.quantity / ((product.low_stock_threshold || 10) * 3)) * 100, 
                                    100
                                  )}%`
                                }}
                              ></div>
                            </div>
                          </div>
                          {product.quantity <= (product.low_stock_threshold || 10) && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-rose-900/30 text-rose-400">
                              Low Stock
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-emerald-400">
                          ${product.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">
                          {categories.find(c => c.id === product.category_id)?.name || 'Uncategorized'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsModalOpen(true);
                            }}
                            className="text-indigo-400 hover:text-indigo-300 p-1"
                            title="Edit"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-rose-400 hover:text-rose-300 p-1"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                          <button className="text-slate-400 hover:text-slate-300 p-1">
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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

// Mock export function
const exportProducts = () => {
  alert('Export functionality would generate a CSV or PDF report');
};

export default Products;