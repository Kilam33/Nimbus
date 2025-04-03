import { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Bell,
  Box,
  CheckCircle,
  ChevronRight,
  Clock,
  Database,
  Gift,
  Globe,
  Lock,
  LogIn,
  Mail,
  Package,
  RefreshCw,
  Shield,
  Truck,
  UserPlus,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const HeroPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      setShowLoginModal(false);
      navigate('/dashboard');
      toast.success('Logged in successfully');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
      toast.error(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await register(name, email, password, company);
      setShowSignupModal(false);
      navigate('/dashboard');
      toast.success('Account created successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
      toast.error(err.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-400">NIMBUS</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#features" className="text-slate-300 hover:text-white px-3 py-2 text-sm">Features</a>
              <a href="#benefits" className="text-slate-300 hover:text-white px-3 py-2 text-sm">Benefits</a>
              <a href="#pricing" className="text-slate-300 hover:text-white px-3 py-2 text-sm">Pricing</a>
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-slate-300 hover:text-white px-3 py-2 text-sm flex items-center"
              >
                <LogIn className="h-4 w-4 mr-1" />
                Sign In
              </button>
              <button
                onClick={() => setShowSignupModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm flex items-center"
              >
                Get Started <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-800/30 via-slate-900 to-slate-900"></div>

        {/* Hero content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Smart Inventory Management for Modern Business
              </h1>
              <p className="mt-6 text-xl text-slate-300">
                NIMBUS streamlines your inventory operations with real-time analytics,
                intelligent forecasting, and automated reordering to keep your business flowing smoothly.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowSignupModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium text-base flex items-center justify-center"
                >
                  Start Free Trial <ChevronRight className="h-5 w-5 ml-1" />
                </button>
                <a
                  href="#demo"
                  className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-md font-medium text-base border border-slate-700 flex items-center justify-center"
                >
                  Watch Demo
                </a>
              </div>
              <div className="mt-8 flex items-center">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs">TS</div>
                  <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs">AR</div>
                  <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs">JL</div>
                </div>
                <p className="ml-4 text-sm text-slate-400">
                  Trusted by 2,500+ supply chain professionals
                </p>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="bg-slate-800/80 rounded-lg border border-slate-700 shadow-xl backdrop-blur-sm overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-700 p-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-rose-500"></div>
                    <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                    <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                  </div>
                  <div className="text-xs text-slate-400">Nimbus Dashboard</div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-slate-400">Products</h3>
                      <p className="text-2xl font-bold text-white">1,254</p>
                      <div className="flex items-center text-xs text-emerald-400 mt-2">
                        <ArrowRight className="h-3 w-3 mr-1" />
                        <span>24 low stock</span>
                      </div>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-slate-400">Orders</h3>
                      <p className="text-2xl font-bold text-white">358</p>
                      <div className="flex items-center text-xs text-amber-400 mt-2">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>18 pending</span>
                      </div>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-slate-400">Revenue</h3>
                      <p className="text-2xl font-bold text-white">$52.4k</p>
                      <div className="flex items-center text-xs text-emerald-400 mt-2">
                        <ArrowRight className="h-3 w-3 mr-1 rotate-45" />
                        <span>↑ 12.5%</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-700/30 p-4 rounded-lg mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-medium text-white">Stock Forecast</h3>
                      <span className="text-xs text-slate-400">Next 30 days</span>
                    </div>
                    <div className="h-32 flex items-end space-x-2">
                      {[40, 65, 52, 78, 45, 86, 68, 91, 74, 86, 95, 60].map((height, i) => (
                        <div key={i} className="flex-1">
                          <div
                            className="bg-indigo-500/70 rounded-t"
                            style={{ height: `${height}%` }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-700/30 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-medium text-white">Recent Activity</h3>
                      <span className="text-xs text-slate-400">View all</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 mr-3">
                          <Package className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-300">New shipment received</p>
                          <p className="text-xs text-slate-500">10 min ago</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 mr-3">
                          <Bell className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-300">Low stock alert: Product #L246</p>
                          <p className="text-xs text-slate-500">25 min ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -right-16 -top-10 bg-indigo-600/20 p-4 rounded-lg border border-indigo-500/40 backdrop-blur-sm">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-indigo-400 mr-2" />
                  <span className="text-sm text-indigo-200">Auto-order placed</span>
                </div>
              </div>
              <div className="absolute -left-10 bottom-16 bg-emerald-600/20 p-3 rounded-lg border border-emerald-500/40 backdrop-blur-sm">
                <div className="flex items-center">
                  <Truck className="h-4 w-4 text-emerald-400 mr-2" />
                  <span className="text-xs text-emerald-200">4 shipments en route</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-slate-800/50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Powerful Features for Modern Inventory Management</h2>
            <p className="mt-4 text-xl text-slate-400 max-w-3xl mx-auto">
              Everything you need to streamline your supply chain and optimize stock levels.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-indigo-500/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-indigo-600/20 flex items-center justify-center mb-4">
                <Box className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Inventory Tracking</h3>
              <p className="text-slate-400">
                Monitor stock levels across all locations with instant updates when items are received or sold.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-indigo-500/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-indigo-600/20 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Forecasting</h3>
              <p className="text-slate-400">
                Predict future demand with machine learning models that analyze historical sales data and market trends.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-indigo-500/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-indigo-600/20 flex items-center justify-center mb-4">
                <RefreshCw className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Automated Reordering</h3>
              <p className="text-slate-400">
                Set dynamic reorder points and let NIMBUS automatically create purchase orders when stock runs low.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-indigo-500/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-indigo-600/20 flex items-center justify-center mb-4">
                <Truck className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Supplier Management</h3>
              <p className="text-slate-400">
                Track supplier performance, lead times, and reliability metrics to optimize your supply chain.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-indigo-500/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-indigo-600/20 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-channel Integration</h3>
              <p className="text-slate-400">
                Synchronize inventory across e-commerce platforms, retail locations, and warehouses in real-time.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-indigo-500/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-indigo-600/20 flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Notifications</h3>
              <p className="text-slate-400">
                Receive alerts for low stock, delayed shipments, and unusual demand patterns before they become problems.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div id="benefits" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Why Supply Chain Professionals Choose NIMBUS</h2>
            <p className="mt-4 text-xl text-slate-400 max-w-3xl mx-auto">
              Transform your inventory operations and gain a competitive edge.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="space-y-12">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-600/20 flex items-center justify-center">
                      <Database className="h-5 w-5 text-indigo-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Reduce Stock Obsolescence by 32%</h3>
                    <p className="text-slate-400">
                      Our forecasting models help prevent overstocking and identify slow-moving inventory before it becomes a liability.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-600/20 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-indigo-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Save 15+ Hours Per Week</h3>
                    <p className="text-slate-400">
                      Automate routine tasks like reordering, stock counting, and report generation to free up your team for strategic work.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-600/20 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-indigo-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Decrease Stockouts by 78%</h3>
                    <p className="text-slate-400">
                      Dynamic safety stock calculations and predictive analytics ensure you never miss a sale due to inventory shortages.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Customer Success Story</h3>
                <blockquote className="text-slate-300 mb-6">
                  "NIMBUS transformed our operations. We've reduced carrying costs by 27% while improving order fulfillment rates to 99.8%. The forecasting tools have been a game-changer for our seasonal business."
                </blockquote>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-indigo-600/20 flex items-center justify-center text-lg font-bold text-indigo-400">
                    JD
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Jamie Davidson</p>
                    <p className="text-sm text-slate-400">Supply Chain Director, GreenTech Solutions</p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-indigo-400">27%</p>
                      <p className="text-sm text-slate-400">Cost Reduction</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-indigo-400">99.8%</p>
                      <p className="text-sm text-slate-400">Fulfillment Rate</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-indigo-400">3x</p>
                      <p className="text-sm text-slate-400">ROI</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-900/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold">Ready to Optimize Your Inventory Management?</h2>
                <p className="mt-4 text-lg text-indigo-200">
                  Join thousands of businesses that are saving time, reducing costs, and increasing efficiency with NIMBUS.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setShowSignupModal(true)}
                    className="bg-white text-indigo-700 hover:bg-indigo-100 px-6 py-3 rounded-md font-medium text-base flex items-center justify-center"
                  >
                    Start Free Trial <ChevronRight className="h-5 w-5 ml-1" />
                  </button>
                  <button className="bg-indigo-800 bg-opacity-50 hover:bg-opacity-70 text-white px-6 py-3 rounded-md font-medium text-base border border-indigo-600 flex items-center justify-center">
                    Schedule Demo
                  </button>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="bg-indigo-800/50 rounded-lg p-6 backdrop-blur-sm border border-indigo-700/50">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-indigo-700/50 p-4 rounded-lg">
                      <p className="text-4xl font-bold">14</p>
                      <p className="text-sm text-indigo-200">Day Free Trial</p>
                    </div>
                    <div className="bg-indigo-700/50 p-4 rounded-lg">
                      <p className="text-4xl font-bold">24/7</p>
                      <p className="text-sm text-indigo-200">Support</p>
                    </div>
                    <div className="bg-indigo-700/50 p-4 rounded-lg">
                      <p className="text-4xl font-bold">1hr</p>
                      <p className="text-sm text-indigo-200">Setup Time</p>
                    </div>
                    <div className="bg-indigo-700/50 p-4 rounded-lg">
                      <p className="text-4xl font-bold">$0</p>
                      <p className="text-sm text-indigo-200">Implementation Fee</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Sign In to NIMBUS</h2>
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 text-red-200 rounded-md text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md font-medium flex items-center justify-center"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5 mr-2" />
                      Sign In
                    </>
                  )}
                </button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-400">
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      setShowLoginModal(false);
                      setShowSignupModal(true);
                    }}
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    Create an account
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowSignupModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Create Your NIMBUS Account</h2>
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 text-red-200 rounded-md text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSignup}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="signup-email" className="block text-sm font-medium text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="signup-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="signup-password" className="block text-sm font-medium text-slate-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="signup-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md font-medium flex items-center justify-center"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5 mr-2" />
                      Create Account
                    </>
                  )}
                </button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-400">
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      setShowSignupModal(false);
                      setShowLoginModal(true);
                    }}
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Section */}
      <div id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-xl text-slate-400 max-w-3xl mx-auto">
              Choose the plan that's right for your business. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold">Starter</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="ml-1 text-slate-400">/month</span>
                </div>
                <p className="mt-2 text-slate-400">For small businesses getting started with inventory management.</p>
              </div>
              <div className="px-6 pb-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-indigo-400 mr-2" />
                    <span>Up to 1,000 products</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-indigo-400 mr-2" />
                    <span>Basic forecasting</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-indigo-400 mr-2" />
                    <span>2 user accounts</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-indigo-400 mr-2" />
                    <span>Email support</span>
                  </li>
                </ul>
                <button
                  onClick={() => setShowSignupModal(true)}
                  className="mt-6 w-full bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-md font-medium"
                >
                  Start Free Trial
                </button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-slate-800 rounded-lg border border-indigo-500 overflow-hidden transform scale-105 shadow-lg">
              <div className="bg-indigo-600 py-2 text-center text-sm font-medium">
                Most Popular
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold">Professional</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="ml-1 text-slate-400">/month</span>
                </div>
                <p className="mt-2 text-slate-400">For growing businesses with complex inventory needs.</p>
              </div>
              <div className="px-6 pb-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-indigo-400 mr-2" />
                    <span>Up to 10,000 products</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-indigo-400 mr-2" />
                    <span>Advanced AI forecasting</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-indigo-400 mr-2" />
                    <span>5 user accounts</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-indigo-400 mr-2" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-indigo-400 mr-2" />
                    <span>Automated reordering</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-indigo-400 mr-2" />
                    <span>Multi-location support</span>
                  </li>
                </ul>
                <button
                  onClick={() => setShowSignupModal(true)}
                  className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md font-medium"
                >
                  Start Free Trial
                </button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold">Enterprise</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">$249</span>
                  <span className="ml-1 text-slate-400">/month</span>
                </div>
                <p className="mt-2 text-slate-400">For large businesses with advanced supply chain needs.</p>
              </div>
              <div className="px-6 pb-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-indigo-400 mr-2" />
                    <span>Unlimited products</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-indigo-400 mr-2" />
                    <span>Enterprise-grade forecasting</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-indigo-400 mr-2" />
                    <span>Unlimited user accounts</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-indigo-400 mr-2" />
                    <span>24/7 dedicated support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-indigo-400 mr-2" />
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-indigo-400 mr-2" />
                    <span>Advanced reporting</span>
                  </li>
                </ul>
                <button
                  onClick={() => setShowSignupModal(true)}
                  className="mt-6 w-full bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-md font-medium"
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-slate-400">
              Need a custom solution? <a href="#" className="text-indigo-400 hover:text-indigo-300">Contact our sales team</a> for a tailored quote.
            </p>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div id="demo" className="py-24 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">See NIMBUS in Action</h2>
            <p className="mt-4 text-xl text-slate-400 max-w-3xl mx-auto">
              Watch how NIMBUS can transform your inventory management process.
            </p>
          </div>

          <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-slate-700 flex items-center justify-center">
              <div className="text-center">
                <div className="h-20 w-20 rounded-full bg-indigo-600/80 flex items-center justify-center mx-auto mb-6">
                  <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-lg font-medium">Watch the Demo Video</p>
                <p className="text-sm text-slate-400 mt-2">Learn how NIMBUS can help your business</p>
              </div>
            </div>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4">Webinar: Inventory Optimization</h3>
              <p className="text-slate-400 mb-4">Learn advanced techniques for reducing costs while maintaining optimal stock levels.</p>
              <a href="#" className="text-indigo-400 hover:text-indigo-300 flex items-center">
                Watch Now <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </div>
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4">Tutorial: Getting Started</h3>
              <p className="text-slate-400 mb-4">A step-by-step guide to setting up your NIMBUS account and importing your first products.</p>
              <a href="#" className="text-indigo-400 hover:text-indigo-300 flex items-center">
                Watch Now <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </div>
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4">Case Study: GreenTech Solutions</h3>
              <p className="text-slate-400 mb-4">See how GreenTech reduced costs by 27% with NIMBUS inventory management.</p>
              <a href="#" className="text-indigo-400 hover:text-indigo-300 flex items-center">
                Watch Now <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <span className="text-2xl font-bold text-indigo-400">NIMBUS</span>
              <p className="mt-4 text-sm text-slate-400">
                Modern inventory management for forward-thinking businesses.
              </p>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Product</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">Features</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">Pricing</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">Integrations</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">Updates</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">Documentation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">Guides</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">API Reference</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">About</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white text-sm">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800">
            <p className="text-sm text-slate-400 text-center">
              &copy; {new Date().getFullYear()} NIMBUS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HeroPage;