import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LogOut,
  PiggyBank
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navigation: React.FC = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/transactions', icon: CreditCard, label: 'Transactions' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r border-gray-200">
          <div className="flex items-center flex-shrink-0 px-4">
            <PiggyBank className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">FinanceTracker</span>
          </div>
          
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            
            <div className="flex-shrink-0 px-2 pb-4">
              <div className="flex items-center p-2 rounded-md bg-gray-50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors duration-150"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <nav className="flex justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-3 text-xs font-medium transition-colors duration-150 ${
                  isActive
                    ? 'text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="h-5 w-5 mb-1" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Navigation;