import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Home, MessageSquare, Settings, LogOut, BarChart2 } from 'lucide-react';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { title: 'Home', path: '/home', icon: <Home className="w-5 h-5" /> },
    { title: 'Feedback', path: '/feedback', icon: <MessageSquare className="w-5 h-5" /> },
    { title: 'Admin Dashboard', path: '/admin', icon: <BarChart2 className="w-5 h-5" /> },
    { title: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-200 rounded-md"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 p-4">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Items */}
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md"
                >
                  {item.icon}
                  <span>{item.title}</span>
                </button>
              ))}

              {/* Logout Button */}
              <button
                onClick={() => {
                  navigate('/login');
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md text-red-500"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </>
      )}
    </>
  );
};