// src/components/Navbar.tsx
import React, { useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Package2,
  Bell,
  Cloud,
  User,
  LogOut,
  Settings,
  Search,
  BarChart3,
  Boxes,
  Truck,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  AlertTriangle
} from 'lucide-react';

interface ProfileDropdownItemProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}

interface NotificationProps {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  time: string;
  isRead: boolean;
}

interface SearchResultProps {
  id: string;
  type: 'product' | 'order' | 'supplier';
  title: string;
  subtitle: string;
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // State management
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultProps[]>([]);
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  // Toggle functions
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
    if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle logout
  const handleLogout = () => {
    setIsProfileDropdownOpen(false);
    logout();
    navigate('/');
  };

  // Mock data fetching effects
  useEffect(() => {
    if (user) {
      // Simulate fetching notifications
      const mockNotifications: NotificationProps[] = [
        {
          id: '1',
          title: 'Low Stock Alert',
          message: '5 products are below minimum stock levels',
          type: 'warning',
          time: '10 min ago',
          isRead: false
        },
        {
          id: '2',
          title: 'Order Received',
          message: 'Order #ORD-2023-03-15 has been received',
          type: 'info',
          time: '1 hour ago',
          isRead: false
        },
        {
          id: '3',
          title: 'Supplier Update',
          message: 'Acme Inc. updated their product catalog',
          type: 'info',
          time: '2 hours ago',
          isRead: true
        }
      ];

      setNotifications(mockNotifications);
      setUnreadNotificationsCount(mockNotifications.filter(n => !n.isRead).length);

      // Simulate fetching system alerts
      setLowStockCount(5);
      setPendingOrdersCount(3);
    }
  }, [user]);

  // Mock search functionality
  useEffect(() => {
    if (user && searchQuery.length > 2) {
      // Simulate API search results
      const mockResults: SearchResultProps[] = [
        {
          id: 'p1',
          type: 'product',
          title: 'Widget A',
          subtitle: 'SKU: WA-1234 | Stock: 23'
        },
        {
          id: 'p2',
          type: 'product',
          title: 'Widget B',
          subtitle: 'SKU: WB-5678 | Stock: 45'
        },
        {
          id: 'o1',
          type: 'order',
          title: 'Order #ORD-2023-05',
          subtitle: 'Status: Pending | Supplier: Acme Inc.'
        },
        {
          id: 's1',
          type: 'supplier',
          title: 'Acme Inc.',
          subtitle: 'Last order: 5 days ago'
        }
      ];

      setSearchResults(mockResults);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, user]);

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    setUnreadNotificationsCount(0);
  };

  // Handle navigation
  const navigateTo = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  // Search result icon mapping
  const getSearchResultIcon = (type: string) => {
    switch (type) {
      case 'product': return <Boxes className="h-4 w-4 text-indigo-400" />;
      case 'order': return <ShoppingCart className="h-4 w-4 text-green-400" />;
      case 'supplier': return <Truck className="h-4 w-4 text-orange-400" />;
      default: return null;
    }
  };

  // Notification icon mapping
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-5 w-5 text-amber-400" />;
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-400" />;
      case 'info': return <Bell className="h-5 w-5 text-blue-400" />;
      default: return <Bell className="h-5 w-5 text-indigo-400" />;
    }
  };

  return (
    <nav className="relative w-full bg-slate-900 shadow-lg border-b border-slate-700 z-50">
      <div className="w-full">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          {/* Left section - Logo and Mobile Menu Toggle */}
          <div className="flex items-center">
            <button
              className="mr-2 md:hidden"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-slate-400" />
              ) : (
                <Menu className="h-6 w-6 text-slate-400" />
              )}
            </button>

            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <Cloud className="h-8 w-8 text-indigo-400" />
              <span className="ml-3 text-xl font-bold text-white tracking-tight">
                NIMBUS
              </span>
            </div>
          </div>

          {/* Right section - Only show if authenticated */}
          {user ? (
            <div className="ml-auto flex items-center space-x-4">
              {/* Global Search */}
              <div className="relative">
                <button
                  className="p-1 rounded-full hover:bg-slate-800 transition-colors"
                  onClick={toggleSearch}
                  aria-label="Search"
                >
                  <Search className="h-6 w-6 text-slate-400 hover:text-indigo-400" />
                </button>

                {/* Search Dropdown */}
                {isSearchOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-slate-800 rounded-lg shadow-2xl z-20 overflow-hidden border border-slate-700">
                    <div className="p-3">
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 pl-3 pr-10 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Search products, orders, suppliers..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          autoFocus
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <Search className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>

                      {searchResults.length > 0 && (
                        <div className="mt-3 max-h-80 overflow-y-auto">
                          {searchResults.map((result) => (
                            <div
                              key={result.id}
                              className="flex items-center px-3 py-2 hover:bg-slate-700 rounded-md cursor-pointer"
                            >
                              {getSearchResultIcon(result.type)}
                              <div className="ml-3">
                                <div className="text-sm font-medium text-white">{result.title}</div>
                                <div className="text-xs text-slate-400">{result.subtitle}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {searchQuery.length > 2 && searchResults.length === 0 && (
                        <div className="py-3 text-center text-sm text-slate-400">
                          No results found for "{searchQuery}"
                        </div>
                      )}

                      {searchQuery.length > 0 && searchQuery.length <= 2 && (
                        <div className="py-3 text-center text-xs text-slate-400">
                          Type at least 3 characters to search
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  className="p-1 rounded-full hover:bg-slate-800 transition-colors"
                  onClick={toggleNotifications}
                  aria-label="Notifications"
                >
                  <Bell className="h-6 w-6 text-slate-400 hover:text-indigo-400" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-indigo-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold animate-pulse">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-20 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-700 flex justify-between items-center">
                      <h3 className="text-sm font-medium text-white">Notifications</h3>
                      {unreadNotificationsCount > 0 && (
                        <button
                          className="text-xs text-indigo-400 hover:text-indigo-300"
                          onClick={markAllAsRead}
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 border-b border-slate-700 hover:bg-slate-700 cursor-pointer ${!notification.isRead ? 'bg-slate-700/40' : ''}`}
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mt-0.5">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="ml-3 flex-1">
                                <div className="text-sm font-medium text-white flex justify-between">
                                  <span>{notification.title}</span>
                                  <span className="text-xs text-slate-400">{notification.time}</span>
                                </div>
                                <div className="mt-1 text-xs text-slate-300">
                                  {notification.message}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-6 text-center text-sm text-slate-400">
                          No notifications
                        </div>
                      )}
                    </div>

                    <div className="px-4 py-2 border-t border-slate-700">
                      <button className="w-full text-xs text-indigo-400 hover:text-indigo-300 py-1">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center focus:outline-none rounded-full hover:bg-slate-800 p-1 transition-colors"
                  aria-label="User profile"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400 ml-1" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-20 overflow-hidden">
                    <div className="py-3 px-4 border-b border-slate-700">
                      <div className="text-sm font-medium text-white">{user.name}</div>
                      <div className="text-xs text-slate-400">{user.email}</div>
                      <div className="text-xs text-indigo-400 mt-1">{user.role}</div>
                    </div>

                    <div className="py-1">
                      <ProfileDropdownItem
                        icon={<User className="h-5 w-5 mr-3 text-indigo-400" />}
                        label="Profile"
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          navigate('/dashboard/profile');
                        }}
                      />
                      <ProfileDropdownItem
                        icon={<Settings className="h-5 w-5 mr-3 text-indigo-400" />}
                        label="Settings"
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          navigate('/dashboard/settings');
                        }}
                      />
                      <div className="border-t border-slate-700 my-1"></div>
                      <ProfileDropdownItem
                        icon={<LogOut className="h-5 w-5 mr-3 text-red-400" />}
                        label="Logout"
                        className="text-red-400 hover:bg-red-900/20"
                        onClick={handleLogout}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Login button if not authenticated */
            <div className="ml-auto">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {user && isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-b border-slate-700">
          <div className="py-2 px-4">
            <MobileMenuItem
              icon={<Boxes />}
              label="Products"
              alert={lowStockCount > 0}
              alertCount={lowStockCount}
              onClick={() => navigateTo('/products')}
            />
            <MobileMenuItem
              icon={<ShoppingCart />}
              label="Orders"
              alert={pendingOrdersCount > 0}
              alertCount={pendingOrdersCount}
              onClick={() => navigateTo('/orders')}
            />
            <MobileMenuItem
              icon={<Truck />}
              label="Suppliers"
              onClick={() => navigateTo('/suppliers')}
            />
            <MobileMenuItem
              icon={<BarChart3 />}
              label="Analytics"
              onClick={() => navigateTo('/analytics')}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

// Profile Dropdown Item Component
const ProfileDropdownItem: React.FC<ProfileDropdownItemProps> = ({
  icon,
  label,
  onClick,
  className = ''
}) => (
  <button
    className={`w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 flex items-center ${className}`}
    onClick={onClick}
  >
    {icon}
    {label}
  </button>
);

// Mobile Menu Item Component
interface MobileMenuItemProps {
  icon: ReactNode;
  label: string;
  alert?: boolean;
  alertCount?: number;
  onClick?: () => void;
}

const MobileMenuItem: React.FC<MobileMenuItemProps> = ({
  icon,
  label,
  alert = false,
  alertCount = 0,
  onClick
}) => (
  <button
    className="relative w-full flex items-center py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors px-2"
    onClick={onClick}
  >
    <span className="mr-3">{icon}</span>
    <span>{label}</span>
    {alert && (
      <span className="ml-auto bg-indigo-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
        {alertCount}
      </span>
    )}
  </button>
);

export default Navbar;