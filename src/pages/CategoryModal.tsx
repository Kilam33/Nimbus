import React from 'react';
import { X, FolderTree, Info } from 'lucide-react';

interface Category {
  id?: string;
  name: string;
  description?: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  onSave: (categoryData: { name: string; description?: string }) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ 
  isOpen, 
  onClose, 
  category,
  onSave 
}) => {
  const [formData, setFormData] = React.useState({
    name: '',
    description: ''
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Update form data when category prop changes
  React.useEffect(() => {
    setFormData({
      name: category?.name || '',
      description: category?.description || ''
    });
    setErrors({});
  }, [category]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.name.length > 50) newErrors.name = 'Name must be 50 characters or less';
    if (formData.description && formData.description.length > 200) 
      newErrors.description = 'Description must be 200 characters or less';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onSave({
      name: formData.name,
      description: formData.description || undefined
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">
              {category?.id ? 'Edit Category' : 'Add New Category'}
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
                <FolderTree className="h-4 w-4 mr-2" />
                Category Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full px-3 py-2 bg-slate-700 border ${errors.name ? 'border-rose-500' : 'border-slate-600'} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="Enter category name"
                maxLength={50}
              />
              {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name}</p>}
            </div>
            
            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-400 mb-1 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className={`w-full px-3 py-2 bg-slate-700 border ${errors.description ? 'border-rose-500' : 'border-slate-600'} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                rows={3}
                placeholder="Enter category description"
                maxLength={200}
              />
              {errors.description && <p className="mt-1 text-xs text-rose-400">{errors.description}</p>}
              <p className="text-xs text-slate-500 mt-1 text-right">
                {formData.description.length}/200 characters
              </p>
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
                {category?.id ? 'Update Category' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;