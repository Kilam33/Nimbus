import React from 'react';
import { X, Package, Tag, Info, DollarSign, Hash, AlertTriangle } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: {
    id?: string;
    name: string;
    description: string;
    price: number | string;
    quantity: number | string;
    category_id: string;
    sku?: string;
    low_stock_threshold?: number | string;
  };
  categories: {id: string, name: string}[];
  onSave: (product: {
    id?: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    category_id: string;
    sku?: string;
    low_stock_threshold?: number;
  }) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ 
  isOpen, 
  onClose, 
  product, 
  categories,
  onSave 
}) => {
  const [formData, setFormData] = React.useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    quantity: product?.quantity?.toString() || '',
    category_id: product?.category_id || '',
    sku: product?.sku || '',
    low_stock_threshold: product?.low_stock_threshold?.toString() || '10'
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) 
      newErrors.price = 'Price must be a positive number';
    if (!formData.quantity) newErrors.quantity = 'Quantity is required';
    if (isNaN(Number(formData.quantity)) || Number(formData.quantity) < 0) 
      newErrors.quantity = 'Quantity must be 0 or more';
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    if (formData.sku && !/^[a-zA-Z0-9-]+$/.test(formData.sku)) 
      newErrors.sku = 'SKU can only contain letters, numbers, and hyphens';
    if (isNaN(Number(formData.low_stock_threshold)) || Number(formData.low_stock_threshold) < 0) 
      newErrors.low_stock_threshold = 'Threshold must be 0 or more';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onSave({
      ...(product?.id && { id: product.id }),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      category_id: formData.category_id,
      sku: formData.sku || undefined,
      low_stock_threshold: parseInt(formData.low_stock_threshold)
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setFormData({...formData, price: value});
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]*$/.test(value)) {
      setFormData({...formData, quantity: value});
    }
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]*$/.test(value)) {
      setFormData({...formData, low_stock_threshold: value});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">
              {product?.id ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Product Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full px-3 py-2 bg-slate-700 border ${errors.name ? 'border-rose-500' : 'border-slate-600'} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="Enter product name"
              />
              {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name}</p>}
            </div>
            
            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
                placeholder="Enter product description"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  SKU (Optional)
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  className={`w-full px-3 py-2 bg-slate-700 border ${errors.sku ? 'border-rose-500' : 'border-slate-600'} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="e.g. PROD-001"
                />
                {errors.sku && <p className="mt-1 text-xs text-rose-400">{errors.sku}</p>}
              </div>
              
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Category
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  className={`w-full px-3 py-2 bg-slate-700 border ${errors.category_id ? 'border-rose-500' : 'border-slate-600'} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && <p className="mt-1 text-xs text-rose-400">{errors.category_id}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Price
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={handlePriceChange}
                  className={`w-full px-3 py-2 bg-slate-700 border ${errors.price ? 'border-rose-500' : 'border-slate-600'} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="0.00"
                  inputMode="decimal"
                />
                {errors.price && <p className="mt-1 text-xs text-rose-400">{errors.price}</p>}
              </div>
              
              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center">
                  <Hash className="h-4 w-4 mr-2" />
                  Quantity
                </label>
                <input
                  type="text"
                  value={formData.quantity}
                  onChange={handleQuantityChange}
                  className={`w-full px-3 py-2 bg-slate-700 border ${errors.quantity ? 'border-rose-500' : 'border-slate-600'} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="0"
                  inputMode="numeric"
                />
                {errors.quantity && <p className="mt-1 text-xs text-rose-400">{errors.quantity}</p>}
              </div>
              
              {/* Low Stock Threshold */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Low Stock Alert
                </label>
                <input
                  type="text"
                  value={formData.low_stock_threshold}
                  onChange={handleThresholdChange}
                  className={`w-full px-3 py-2 bg-slate-700 border ${errors.low_stock_threshold ? 'border-rose-500' : 'border-slate-600'} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="10"
                  inputMode="numeric"
                />
                {errors.low_stock_threshold && <p className="mt-1 text-xs text-rose-400">{errors.low_stock_threshold}</p>}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-600 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                {product?.id ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;