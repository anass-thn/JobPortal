import React, { useState } from 'react';
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
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const DashboardLayout = ({ children, userType = 'employer' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } fixed lg:static h-screen z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#00A7F3] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JP</span>
              </div>
              <span className="font-bold text-lg text-gray-900">JobPortal</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b border-gray-200">
            <div className={`flex items-center ${sidebarOpen ? 'gap-3' : 'justify-center'}`}>
              <div className="w-10 h-10 bg-[#00A7F3] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
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

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center ${sidebarOpen ? 'gap-3' : 'justify-center'} px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-[#00A7F3] text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-gray-600'}`} />
                {sidebarOpen && (
                  <span className={`font-medium ${active ? 'text-white' : 'text-gray-700'}`}>
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          {sidebarOpen ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 lg:ml-0 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 lg:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  {menuItems.find((item) => isActive(item.path))?.name || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-500 mt-1 hidden sm:block">
                  Welcome back, {getUserName()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Notification or Settings can go here */}
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;

