import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Users, 
  Building2, 
  Menu, 
  X, 
  LogOut,
  User,
  Settings,
  BarChart3,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const DashboardLayout = ({ children, userType = 'employer' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Handle window resize and set initial state
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false); // Always closed on mobile
      } else {
        setSidebarOpen(true); // Open by default on desktop
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Employer menu items
  const employerMenuItems = [
    {
      name: 'Dashboard',
      path: '/employer/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Post Job',
      path: '/post-job',
      icon: Briefcase,
    },
    {
      name: 'Manage Jobs',
      path: '/manage-jobs',
      icon: FileText,
    },
    {
      name: 'Applications',
      path: '/applicants',
      icon: Users,
    },
    {
      name: 'Company Profile',
      path: '/company-profile',
      icon: Building2,
    },
    {
      name: 'Analytics',
      path: '/employer/analytics',
      icon: BarChart3,
    },
  ];

  // Job Seeker menu items
  const jobSeekerMenuItems = [
    {
      name: 'Find Jobs',
      path: '/find-jobs',
      icon: Briefcase,
    },
    {
      name: 'Saved Jobs',
      path: '/saved-jobs',
      icon: FileText,
    },
    {
      name: 'My Applications',
      path: '/my-applications',
      icon: Users,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User,
    },
  ];

  const menuItems = userType === 'employer' ? employerMenuItems : jobSeekerMenuItems;

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getUserName = () => {
    if (!user) return 'User';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'User';
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return (user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase();
  };

  // Determine sidebar width based on state and screen size
  const getSidebarWidth = () => {
    if (isMobile) {
      return 'w-64'; // Full width when open on mobile
    }
    return sidebarOpen ? 'w-64' : 'w-20'; // Desktop: 64 when open, 20 when collapsed
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 transition-all duration-300 ${getSidebarWidth()} fixed top-0 left-0 h-screen z-40 flex flex-col overflow-hidden ${
          isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-9 h-9 bg-gradient-to-br from-[#00A7F3] to-[#0090d6] rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">JP</span>
            </div>
            {sidebarOpen && (
              <span className="font-bold text-lg text-gray-900">JobPortal</span>
            )}
          </div>
          {!isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center"
              aria-label="Toggle sidebar"
            >
              <ChevronLeft className={`w-4 h-4 text-gray-500 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
            </button>
          )}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => isMobile && setSidebarOpen(false)}
                className={`group flex items-center ${
                  sidebarOpen ? 'gap-3' : 'justify-center'
                } px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-[#00A7F3] text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                title={!sidebarOpen ? item.name : ''}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-gray-500 group-hover:text-[#00A7F3]'}`} />
                {sidebarOpen && (
                  <span className={`font-medium text-sm ${active ? 'text-white' : 'text-gray-700'} truncate`}>
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer - User Profile & Logout */}
        <div className="border-t border-gray-200 flex-shrink-0 bg-gray-50">
          {/* User Profile Section */}
          {user && (
            <div className="p-3 border-b border-gray-200">
              <div className={`flex items-center ${sidebarOpen ? 'gap-3' : 'justify-center'}`}>
                <div className="w-9 h-9 bg-gradient-to-br from-[#00A7F3] to-[#0090d6] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 text-sm shadow-sm">
                  {getUserInitials()}
                </div>
                {sidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{getUserName()}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.userType}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Logout Button */}
          <div className="p-3">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${
                sidebarOpen ? 'gap-3 justify-start' : 'justify-center'
              } px-3 py-2.5 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group`}
              title={!sidebarOpen ? 'Logout' : ''}
            >
              <LogOut className="w-5 h-5 flex-shrink-0 text-gray-500 group-hover:text-red-600" />
              {sidebarOpen && (
                <span className="font-medium text-sm">Logout</span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div 
        className={`flex-1 min-w-0 flex flex-col overflow-hidden transition-all duration-300 ${
          isMobile ? 'ml-0' : (sidebarOpen ? 'ml-64' : 'ml-20')
        }`}
      >
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 flex-shrink-0">
          <div className="px-4 lg:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  {menuItems.find((item) => isActive(item.path))?.name || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5 hidden sm:block">
                   Here's what hapened today with your jobs and applications, {getUserName()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
