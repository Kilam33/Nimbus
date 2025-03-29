import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Plus, 
  FolderTree, 
  Edit2, 
  Trash2, 
  Search, 
  RefreshCw,
  Download,
  Printer,
  ChevronDown,
  MoreVertical,
  X,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import CategoryModal from './CategoryModal';

interface Category {
  id: string;
  name: string;
  description?: string;
  item_count: number;
  created_at?: string;
  updated_at?: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [sortConfig, setSortConfig] = useState<{
    key: 'name' | 'item_count' | 'updated_at';
    direction: 'asc' | 'desc';
  }>({ key: 'name', direction: 'asc' });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/categories');
      
      if (!response.ok) {
        throw new Error('Failed to load categories');
      }
      
      const data = await response.json();
      setCategories(data.data);
      setLastRefreshed(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...categories];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description && 
          category.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );}
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortConfig.key === 'item_count') {
        return sortConfig.direction === 'asc' 
          ? a.item_count - b.item_count 
          : b.item_count - a.item_count;
      } else if (sortConfig.key === 'updated_at') {
        const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
        const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
        return sortConfig.direction === 'asc' 
          ? dateA - dateB 
          : dateB - dateA;
      } else {
        // Default to name sorting
        return sortConfig.direction === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
    });
    
    setFilteredCategories(result);
  }, [categories, searchTerm, sortConfig]);

  const handleAddCategory = async (categoryData: { name: string; description?: string }) => {
    try {
      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add category');
      }
      
      fetchCategories();
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add category');
    }
  };

  const handleUpdateCategory = async (id: string, categoryData: { name: string; description?: string }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update category');
      }
      
      fetchCategories();
      setEditingCategory(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? Products in this category will become uncategorized.')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  const requestSort = (key: 'name' | 'item_count' | 'updated_at') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="h-3 w-3 ml-1" /> : 
      <ArrowDown className="h-3 w-3 ml-1" />;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const exportCategories = () => {
    alert('Export functionality would generate a CSV or PDF report');
  };

  if (loading) {
    return (
      <div className="bg-slate-900 min-h-screen text-white p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 mx-auto animate-spin text-indigo-400" />
          <p className="mt-2 text-slate-400">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900 min-h-screen text-white p-4 md:p-6 flex items-center justify-center">
        <div className="bg-rose-900/20 p-6 rounded-lg flex items-center">
          <AlertTriangle className="h-8 w-8 text-rose-500 mr-4" />
          <div>
            <p className="text-rose-300 font-medium mb-2">{error}</p>
            <button
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-md text-white text-sm transition-colors"
              onClick={fetchCategories}
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
        <CategoryModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCategory(null);
          }}
          category={editingCategory}
          onSave={(categoryData) => {
            if (editingCategory) {
              handleUpdateCategory(editingCategory.id, categoryData);
            } else {
              handleAddCategory(categoryData);
            }
          }}
        />

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Product Categories</h1>
            <p className="text-slate-400 mt-1">
              Last updated: {lastRefreshed.toLocaleTimeString()} 
              <button 
                onClick={fetchCategories}
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
                setEditingCategory(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white text-sm flex items-center transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </button>
            <button 
              onClick={exportCategories}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">Sort By</label>
              <select
                value={sortConfig.key}
                onChange={(e) => requestSort(e.target.value as 'name' | 'item_count' | 'updated_at')}
                className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="item_count">Item Count</option>
                <option value="updated_at">Last Updated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.length === 0 ? (
            <div className="col-span-full bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
              <p className="text-slate-400">No categories found matching your criteria</p>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div
                key={category.id}
                className="bg-slate-800 rounded-lg border border-slate-700 hover:border-indigo-500 transition-colors duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 bg-slate-700 rounded-md flex items-center justify-center">
                        <FolderTree className="h-6 w-6 text-indigo-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-white">
                          {category.name}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {category.item_count} items
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          setEditingCategory(category);
                          setIsModalOpen(true);
                        }}
                        className="text-indigo-400 hover:text-indigo-300 p-1"
                        title="Edit"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-rose-400 hover:text-rose-300 p-1"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  {category.description && (
                    <div className="mt-4">
                      <p className="text-sm text-slate-400 line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
                    <span className="text-xs text-slate-500">
                      Last updated: {formatDate(category.updated_at)}
                    </span>
                    <button className="text-slate-400 hover:text-slate-300">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800 text-sm text-slate-500 text-center">
          <p>© 2024 Inventory Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Categories;