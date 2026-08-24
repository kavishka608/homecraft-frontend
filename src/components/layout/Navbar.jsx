import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check localStorage when component loads
  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      setRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    setIsLoggedIn(false);
    setRole(null);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">🏠</span>
            <span className="text-xl font-bold text-gray-800">HomeCraft</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/professionals" className="text-gray-700 hover:text-blue-600">Professionals</Link>
            <Link to="/projects" className="text-gray-700 hover:text-blue-600">Projects</Link>
            
            {/* Show Dashboard only if role is ADMIN */}
            {role === 'ADMIN' && (
              <Link to="/admin/dashboard" className="text-orange-600 font-bold hover:text-orange-700">
                Admin Dashboard
              </Link>
            )}

            {/* Show Login if not logged in */}
            {!isLoggedIn && (
              <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
            )}

            {/* Show Register only if not logged in */}
            {!isLoggedIn && (
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Register
              </Link>
            )}

            {isLoggedIn && (
            <Link to="/profile" className="text-gray-700 hover:text-blue-600">My Profile</Link>
            )}

            {/* Show Logout if logged in */}
            {isLoggedIn && (
              <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;