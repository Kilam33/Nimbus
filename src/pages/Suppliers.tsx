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
  User,
  ArrowUp,
  ArrowDown,
  Plus,
  Settings,
  Truck,
  Package,
  Star,
  PhoneCall,
  Mail,
  MapPin,
  Calendar,
  AlertTriangle,
  BarChart,
  Archive,
  Edit,
  Trash
} from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';

interface Supplier {
  id: number;
  name: string;
  code: string;
  status: 'active' | 'inactive' | 'on-hold' | 'new';
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  reliabilityScore: number;
  avgLeadTime: number;
  lastOrderDate: string;
  productsSupplied: number;
  onTimeDeliveryRate: number;
  productsDetails: {
    id: number;
    name: string;
    sku: string;
    category: string;
    lastOrderedDate: string;
    avgPrice: number;
    inStock: boolean;
  }[];
  performanceHistory: {
    month: string;
    onTimeRate: number;
    qualityRate: number;
    responseTime: number;
  }[];
}

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [reliabilityFilter, setReliabilityFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' }>({
    key: 'name',
    direction: 'ascending'
  });
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    avgLeadTime: 0
  });

  // Simulate API call
  useEffect(() => {
    const fetchSuppliers = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockSuppliers: Supplier[] = [
        {
          id: 1,
          name: 'TechComponents Inc.',
          code: 'SUP-2024-001',
          status: 'active',
          contactPerson: 'Sarah Johnson',
          email: 'sarah.j@techcomponents.com',
          phone: '+1 (555) 123-4567',
          address: '123 Tech Blvd, San Francisco, CA 94107',
          reliabilityScore: 4.8,
          avgLeadTime: 3,
          lastOrderDate: '2024-03-20T14:30:00',
          productsSupplied: 12,
          onTimeDeliveryRate: 97,
          productsDetails: [
            { id: 101, name: 'CPU Processor X7', sku: 'CPU-X7-001', category: 'Electronics', lastOrderedDate: '2024-03-15', avgPrice: 289.99, inStock: true },
            { id: 102, name: 'GPU Card Pro', sku: 'GPU-PRO-002', category: 'Electronics', lastOrderedDate: '2024-03-10', avgPrice: 499.99, inStock: true },
            { id: 103, name: 'Motherboard Elite', sku: 'MB-ELT-003', category: 'Electronics', lastOrderedDate: '2024-02-25', avgPrice: 179.99, inStock: false }
          ],
          performanceHistory: [
            { month: 'Jan', onTimeRate: 98, qualityRate: 95, responseTime: 2 },
            { month: 'Feb', onTimeRate: 97, qualityRate: 96, responseTime: 1 },
            { month: 'Mar', onTimeRate: 99, qualityRate: 98, responseTime: 1 }
          ]
        },
        {
          id: 2,
          name: 'Global Office Supplies',
          code: 'SUP-2024-002',
          status: 'active',
          contactPerson: 'Michael Chen',
          email: 'm.chen@globalsupplies.com',
          phone: '+1 (555) 234-5678',
          address: '456 Office Pkwy, Chicago, IL 60601',
          reliabilityScore: 4.2,
          avgLeadTime: 5,
          lastOrderDate: '2024-03-18T09:15:00',
          productsSupplied: 28,
          onTimeDeliveryRate: 88,
          productsDetails: [
            { id: 201, name: 'Premium Paper Ream', sku: 'PPR-001', category: 'Office Supplies', lastOrderedDate: '2024-03-18', avgPrice: 12.99, inStock: true },
            { id: 202, name: 'Ergonomic Desk Chair', sku: 'DC-ERG-002', category: 'Furniture', lastOrderedDate: '2024-02-28', avgPrice: 249.99, inStock: true }
          ],
          performanceHistory: [
            { month: 'Jan', onTimeRate: 85, qualityRate: 90, responseTime: 3 },
            { month: 'Feb', onTimeRate: 90, qualityRate: 92, responseTime: 4 },
            { month: 'Mar', onTimeRate: 88, qualityRate: 95, responseTime: 3 }
          ]
        },
        {
          id: 3,
          name: 'QuickShip Logistics',
          code: 'SUP-2024-003',
          status: 'on-hold',
          contactPerson: 'David Rodriguez',
          email: 'd.rodriguez@quickship.com',
          phone: '+1 (555) 345-6789',
          address: '789 Shipping Lane, Miami, FL 33101',
          reliabilityScore: 3.5,
          avgLeadTime: 7,
          lastOrderDate: '2024-03-05T11:45:00',
          productsSupplied: 8,
          onTimeDeliveryRate: 75,
          productsDetails: [
            { id: 301, name: 'Shipping Box (Large)', sku: 'SBL-001', category: 'Packaging', lastOrderedDate: '2024-03-05', avgPrice: 3.99, inStock: true },
            { id: 302, name: 'Shipping Label Printer', sku: 'SLP-002', category: 'Equipment', lastOrderedDate: '2024-02-10', avgPrice: 129.99, inStock: false }
          ],
          performanceHistory: [
            { month: 'Jan', onTimeRate: 82, qualityRate: 85, responseTime: 5 },
            { month: 'Feb', onTimeRate: 78, qualityRate: 80, responseTime: 6 },
            { month: 'Mar', onTimeRate: 75, qualityRate: 82, responseTime: 4 }
          ]
        },
        {
          id: 4,
          name: 'Innovate Manufacturing',
          code: 'SUP-2024-004',
          status: 'new',
          contactPerson: 'Jennifer Lee',
          email: 'j.lee@innovatemfg.com',
          phone: '+1 (555) 456-7890',
          address: '101 Factory Dr, Detroit, MI 48202',
          reliabilityScore: 4.0,
          avgLeadTime: 10,
          lastOrderDate: '2024-03-25T16:00:00',
          productsSupplied: 5,
          onTimeDeliveryRate: 95,
          productsDetails: [
            { id: 401, name: 'Custom Plastic Casing', sku: 'CPC-001', category: 'Manufacturing', lastOrderedDate: '2024-03-25', avgPrice: 8.50, inStock: true },
            { id: 402, name: 'Aluminum Brackets', sku: 'AB-002', category: 'Manufacturing', lastOrderedDate: '2024-03-25', avgPrice: 6.75, inStock: true }
          ],
          performanceHistory: [
            { month: 'Feb', onTimeRate: 92, qualityRate: 88, responseTime: 4 },
            { month: 'Mar', onTimeRate: 95, qualityRate: 90, responseTime: 3 }
          ]
        },
        {
          id: 5,
          name: 'Digital Solutions Ltd',
          code: 'SUP-2024-005',
          status: 'inactive',
          contactPerson: 'Robert Kim',
          email: 'r.kim@digitalsolutions.com',
          phone: '+1 (555) 567-8901',
          address: '222 Tech Park, Austin, TX 78701',
          reliabilityScore: 3.2,
          avgLeadTime: 14,
          lastOrderDate: '2024-02-10T10:30:00',
          productsSupplied: 3,
          onTimeDeliveryRate: 68,
          productsDetails: [
            { id: 501, name: 'Network Switch', sku: 'NS-001', category: 'Networking', lastOrderedDate: '2024-02-10', avgPrice: 159.99, inStock: false }
          ],
          performanceHistory: [
            { month: 'Jan', onTimeRate: 75, qualityRate: 70, responseTime: 8 },
            { month: 'Feb', onTimeRate: 68, qualityRate: 72, responseTime: 7 }
          ]
        }
      ];

      setSuppliers(mockSuppliers);
      setFilteredSuppliers(mockSuppliers);
      setIsLoading(false);
      setLastRefreshed(new Date());
    };

    fetchSuppliers();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...suppliers];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.productsDetails.some(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(supplier => supplier.status === statusFilter);
    }

    // Apply reliability filter
    if (reliabilityFilter !== 'all') {
      switch (reliabilityFilter) {
        case 'high':
          result = result.filter(supplier => supplier.reliabilityScore >= 4.5);
          break;
        case 'medium':
          result = result.filter(supplier => supplier.reliabilityScore >= 3.5 && supplier.reliabilityScore < 4.5);
          break;
        case 'low':
          result = result.filter(supplier => supplier.reliabilityScore < 3.5);
          break;
      }
    }

    // Apply sorting - Fixed type safety issue
    result.sort((a, b) => {
      const key = sortConfig.key as keyof Supplier;
      if (a[key] < b[key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setFilteredSuppliers(result);
  }, [suppliers, searchTerm, statusFilter, reliabilityFilter, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-rose-400" />;
      case 'on-hold':
        return <Clock className="h-4 w-4 text-amber-400" />;
      case 'new':
        return <Star className="h-4 w-4 text-indigo-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-900/30 text-emerald-400';
      case 'inactive':
        return 'bg-rose-900/30 text-rose-400';
      case 'on-hold':
        return 'bg-amber-900/30 text-amber-400';
      case 'new':
        return 'bg-indigo-900/30 text-indigo-400';
      default:
        return 'bg-slate-900/30 text-slate-400';
    }
  };

  const getReliabilityColor = (score: number) => {
    if (score >= 4.5) return 'text-emerald-400';
    if (score >= 3.5) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getLeadTimeIndicator = (days: number) => {
    if (days <= 3) return 'bg-emerald-400';
    if (days <= 7) return 'bg-amber-400';
    return 'bg-rose-400';
  };

  const refreshData = () => {
    // In a real app, this would refetch from the API
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLastRefreshed(new Date());
    }, 800);
  };

  const exportSuppliers = () => {
    // In a real app, this would generate a CSV or PDF
    alert('Export functionality would be implemented here');
  };

  const printSuppliers = () => {
    // In a real app, this would open print dialog
    alert('Print functionality would be implemented here');
  };

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ?
      <ArrowUp className="h-3 w-3 ml-1" /> :
      <ArrowDown className="h-3 w-3 ml-1" />;
  };

  const getDaysSinceLastOrder = (dateString: string) => {
    const lastOrderDate = parseISO(dateString);
    return differenceInDays(new Date(), lastOrderDate);
  };

  const handleAddSupplier = () => {
    // In a real app, this would send a POST request to API
    setShowAddModal(false);
    alert('In a real application, this would add the new supplier to the database');
    
    // Reset form
    setNewSupplier({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      avgLeadTime: 0
    });
  };

  const handleEditSupplier = () => {
    // In a real app, this would send a PUT request to API
    setEditingSupplier(null);
    alert('In a real application, this would update the supplier in the database');
  };

  const renderAddSupplierModal = () => {
    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-2xl">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Add New Supplier</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full hover:bg-slate-700"
              >
                <XCircle className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Supplier Name *</label>
                <input
                  type="text"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                  className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter supplier name"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Contact Person *</label>
                <input
                  type="text"
                  value={newSupplier.contactPerson}
                  onChange={(e) => setNewSupplier({...newSupplier, contactPerson: e.target.value})}
                  className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter contact person"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Email *</label>
                <input
                  type="email"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                  className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Phone</label>
                <input
                  type="text"
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                  className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-400 mb-1">Address</label>
                <input
                  type="text"
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                  className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter address"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Average Lead Time (days) *</label>
                <input
                  type="number"
                  value={newSupplier.avgLeadTime}
                  onChange={(e) => setNewSupplier({...newSupplier, avgLeadTime: parseInt(e.target.value) || 0})}
                  className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter lead time in days"
                  min="1"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSupplier}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white transition-colors"
                disabled={!newSupplier.name || !newSupplier.contactPerson || !newSupplier.email || newSupplier.avgLeadTime <= 0}
              >
                Add Supplier
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEditSupplierModal = () => {
    if (!editingSupplier) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-2xl">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Edit Supplier</h2>
              <button
                onClick={() => setEditingSupplier(null)}
                className="p-1 rounded-full hover:bg-slate-700"
              >
                <XCircle className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            
            {/* Form fields would be pre-populated with editingSupplier data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Supplier Name</label>
                <input
                  type="text"
                  defaultValue={editingSupplier.name}
                  className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Status</label>
                <select
                  defaultValue={editingSupplier.status}
                  className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on-hold">On Hold</option>
                  <option value="new">New</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Contact Person</label>
                <input
                  type="text"
                  defaultValue={editingSupplier.contactPerson}
                  className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={editingSupplier.email}
                  className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Phone</label>
                <input
                  type="text"
                  defaultValue={editingSupplier.phone}
                  className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Average Lead Time (days)</label>
                <input
                  type="number"
                  defaultValue={editingSupplier.avgLeadTime}
                  className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  min="1"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-400 mb-1">Address</label>
                <input
                  type="text"
                  defaultValue={editingSupplier.address}
                  className="w-full py-2 px-3 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setEditingSupplier(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSupplier}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Supplier Management</h1>
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
            <button 
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white text-sm flex items-center transition-colors"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Supplier
            </button>
            <button
              onClick={exportSuppliers}
              className="p-2 bg-slate-800 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors"
              title="Export"
            >
              <Download className="h-5 w-5 text-slate-400" />
            </button>
            <button
              onClick={printSuppliers}
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
                  placeholder="Search suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">Status</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-slate-400" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on-hold">On Hold</option>
                  <option value="new">New</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Reliability Filter */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">Reliability</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Star className="h-4 w-4 text-slate-400" />
                </div>
                <select
                  value={reliabilityFilter}
                  onChange={(e) => setReliabilityFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Ratings</option>
                  <option value="high">High (4.5+)</option>
                  <option value="medium">Medium (3.5-4.4)</option>
                  <option value="low">Low (&lt;3.5)</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Suppliers Table */}
          <div className="xl:col-span-2">
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700">
                  <thead className="bg-slate-800">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-slate-400 tracking-wider">
                        <button
                          className="flex items-center font-medium text-white"
                          onClick={() => requestSort('name')}
                        >
                          Supplier
                          {getSortIcon('name')}
                        </button>
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-slate-400 tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-slate-400 tracking-wider">
                        <button
                          className="flex items-center font-medium text-white"
                          onClick={() => requestSort('reliabilityScore')}
                        >
                          Reliability
                          {getSortIcon('reliabilityScore')}
                        </button>
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-slate-400 tracking-wider">
                        <button
                          className="flex items-center font-medium text-white"
                          onClick={() => requestSort('avgLeadTime')}
                        >
                          Lead Time
                          {getSortIcon('avgLeadTime')}
                        </button>
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-slate-400 tracking-wider">
                        <button
                          className="flex items-center font-medium text-white"
                          onClick={() => requestSort('lastOrderDate')}
                        >
                          Last Order
                          {getSortIcon('lastOrderDate')}
                        </button>
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-sm font-medium text-slate-400 tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-slate-800 divide-y divide-slate-700">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                          <div className="flex flex-col items-center">
                            <RefreshCw className="h-8 w-8 animate-spin mb-3" />
                            <p>Loading suppliers...</p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredSuppliers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                          <div className="flex flex-col items-center">
                            <Search className="h-8 w-8 mb-3 text-slate-500" />
                            <p>No suppliers found matching your filters.</p>
                            <button
                              onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('all');
                                setReliabilityFilter('all');
                              }}
                              className="mt-2 text-indigo-400 hover:text-indigo-300"
                            >
                              Clear filters
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredSuppliers.map((supplier) => (
                        <tr 
                          key={supplier.id}
                          className={`hover:bg-slate-700 cursor-pointer transition-colors ${selectedSupplier?.id === supplier.id ? 'bg-slate-700' : ''}`}
                          onClick={() => setSelectedSupplier(supplier)}
                        >
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 rounded-md bg-slate-700 flex items-center justify-center">
                                {supplier.name.charAt(0)}
                              </div>
                              <div className="ml-3">
                                <p className="font-medium text-white">{supplier.name}</p>
                                <p className="text-xs text-slate-400">{supplier.code}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(supplier.status)}`}>
                              {getStatusIcon(supplier.status)}
                              <span className="ml-1 capitalize">{supplier.status}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className={`font-medium ${getReliabilityColor(supplier.reliabilityScore)}`}>
                              {supplier.reliabilityScore.toFixed(1)}
                            </div>
                            <p className="text-xs text-slate-400">{supplier.onTimeDeliveryRate}% On-time</p>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center">
                              <div className={`h-2 w-2 rounded-full ${getLeadTimeIndicator(supplier.avgLeadTime)} mr-2`}></div>
                              <span>{supplier.avgLeadTime} days</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div>{formatDate(supplier.lastOrderDate)}</div>
                            <p className="text-xs text-slate-400">
                              {getDaysSinceLastOrder(supplier.lastOrderDate)} days ago
                            </p>
                          </td>
                          <td className="px-4 py-3 text-right text-sm">
                            <div className="flex justify-end">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingSupplier(supplier);
                                }}
                                className="text-slate-400 hover:text-indigo-400 mr-3"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm('Are you sure you want to archive this supplier?')) {
                                    // In a real app, this would send a request to API
                                    alert('Supplier would be archived in a real application');
                                  }
                                }}
                                className="text-slate-400 hover:text-rose-400"
                              >
                                <Archive className="h-4 w-4" />
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
          </div>

          {/* Supplier Details */}
          <div className="xl:col-span-1">
            {selectedSupplier ? (
              <div className="bg-slate-800 rounded-lg border border-slate-700 h-full">
                <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-white">{selectedSupplier.name}</h2>
                  <div className="flex">
                    <button
                      onClick={() => setEditingSupplier(selectedSupplier)}
                      className="p-1 rounded-full hover:bg-slate-700 mr-1"
                      title="Edit Supplier"
                    >
                      <Edit className="h-4 w-4 text-slate-400" />
                    </button>
                    <button
                      onClick={() => setSelectedSupplier(null)}
                      className="p-1 rounded-full hover:bg-slate-700"
                      title="Close"
                    >
                      <XCircle className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-6">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(selectedSupplier.status)}`}>
                      {getStatusIcon(selectedSupplier.status)}
                      <span className="ml-1 capitalize">{selectedSupplier.status}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-medium text-slate-400 mb-2">Contact Information</h3>
                  <div className="mb-4 space-y-2">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-slate-400 mt-0.5 mr-2" />
                      <p className="text-sm text-white">{selectedSupplier.address}</p>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-slate-400 mr-2" />
                      <p className="text-sm text-white">{selectedSupplier.email}</p>
                    </div>
                    <div className="flex items-center">
                      <PhoneCall className="h-4 w-4 text-slate-400 mr-2" />
                      <p className="text-sm text-white">{selectedSupplier.phone}</p>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-slate-400 mr-2" />
                      <p className="text-sm text-white">{selectedSupplier.contactPerson}</p>
                    </div>
                  </div>

                  <h3 className="text-sm font-medium text-slate-400 mb-2">Performance Metrics</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-700 rounded-md p-3">
                      <div className="text-xs text-slate-400 mb-1">Reliability Score</div>
                      <div className={`text-lg font-bold ${getReliabilityColor(selectedSupplier.reliabilityScore)}`}>
                        {selectedSupplier.reliabilityScore.toFixed(1)}
                      </div>
                    </div>
                    <div className="bg-slate-700 rounded-md p-3">
                      <div className="text-xs text-slate-400 mb-1">On-Time Delivery</div>
                      <div className="text-lg font-bold text-white">
                        {selectedSupplier.onTimeDeliveryRate}%
                      </div>
                    </div>
                    <div className="bg-slate-700 rounded-md p-3">
                      <div className="text-xs text-slate-400 mb-1">Lead Time</div>
                      <div className="text-lg font-bold text-white">
                        {selectedSupplier.avgLeadTime} days
                      </div>
                    </div>
                    <div className="bg-slate-700 rounded-md p-3">
                      <div className="text-xs text-slate-400 mb-1">Products</div>
                      <div className="text-lg font-bold text-white">
                        {selectedSupplier.productsSupplied}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-sm font-medium text-slate-400 mb-2">Products Supplied</h3>
                  <div className="mb-4 overflow-y-auto max-h-48">
                    {selectedSupplier.productsDetails.map(product => (
                      <div key={product.id} className="mb-2 p-3 bg-slate-700 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-white">{product.name}</div>
                            <div className="text-xs text-slate-400">SKU: {product.sku}</div>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs ${product.inStock ? 'bg-emerald-900/30 text-emerald-400' : 'bg-rose-900/30 text-rose-400'}`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-slate-400">
                          <div>Category: {product.category}</div>
                          <div>Avg. Price: ${product.avgPrice.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-sm font-medium text-slate-400 mb-2">Performance History</h3>
                  <div className="bg-slate-700 rounded-md p-3 mb-4">
                    <div className="flex h-40 items-end space-x-2">
                      {selectedSupplier.performanceHistory.map((data, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div className="w-full flex justify-center mb-1">
                            <div
                              className="w-full bg-indigo-600 rounded-t"
                              style={{ height: `${data.onTimeRate}px`, maxHeight: '100px' }}
                            ></div>
                          </div>
                          <div className="text-xs text-slate-400">{data.month}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-400">
                      <div>On-time Delivery Rate</div>
                      <div>Last 3 Months</div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        // In a real app, this would direct to orders page with this supplier selected
                        alert('This would navigate to orders page filtered by this supplier');
                      }}
                      className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white text-sm flex items-center justify-center transition-colors"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      View Orders
                    </button>
                    <button
                      onClick={() => {
                        // In a real app, this would open a form to create new order
                        alert('This would open create order form pre-populated with this supplier');
                      }}
                      className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-white text-sm flex items-center justify-center transition-colors"
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Create Order
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800 rounded-lg border border-slate-700 h-full flex flex-col items-center justify-center p-6 text-center">
                <Truck className="h-12 w-12 text-slate-600 mb-3" />
                <h3 className="text-lg font-medium text-white mb-2">No Supplier Selected</h3>
                <p className="text-slate-400 mb-4">Select a supplier from the list to view detailed information and manage orders.</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white text-sm flex items-center transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Supplier
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {renderAddSupplierModal()}
      {renderEditSupplierModal()}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-slate-800 text-sm text-slate-500 text-center">
          <p>© {new Date().getFullYear()} Nimbus Inventory System. All rights reserved.</p>
        </div>
      </div>
  );
};


export default Suppliers;