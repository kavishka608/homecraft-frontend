import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // For mobile
  const [accountOpen, setAccountOpen] = useState(false); // For dropdown

  const navigate = useNavigate();
  const dropdownRef = useRef(null); // To detect clicks outside

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    if (token && storedRole) {
      setIsLoggedIn(true);
      setRole(storedRole);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <span className="text-2xl font-bold text-blue-600">🏠</span>
            <span className="text-xl font-bold text-gray-800 hidden sm:block">HomeCraft</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/professionals" className="text-gray-700 hover:text-blue-600">Professionals</Link>
            <Link to="/projects" className="text-gray-700 hover:text-blue-600">Projects</Link>
            
            {/* Admin Links */}
            {role === 'ADMIN' && (
              <>
                <Link to="/admin/dashboard" className="text-orange-600 font-bold hover:text-orange-700">Admin</Link>
              </>
            )}

            {/* Homeowner Links */}
            {isLoggedIn && role === 'HOMEOWNER' && (
              <>
                <Link to="/post-project" className="text-blue-600 font-bold hover:text-blue-700">+ Post Project</Link>
                <Link to="/my-projects" className="text-gray-700 hover:text-blue-600">My Projects</Link>
              </>
            )}

            {/* Professional Links */}
            {isLoggedIn && role === 'PROFESSIONAL' && (
              <>
                <Link to="/portfolio" className="text-gray-700 hover:text-blue-600">Portfolio</Link>
                <Link to="/my-bids" className="text-gray-700 hover:text-blue-600">My Bids</Link>
              </>
            )}

            {/* Auth Buttons */}
            {!isLoggedIn && (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Register</Link>
              </>
            )}
          </div>

          {/* Logged In User Menu (Desktop) */}
          {isLoggedIn && (
            <div className="hidden md:flex items-center space-x-4">
              {/* Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {localStorage.getItem('fullName')?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 hidden lg:block">
                    {localStorage.getItem('fullName')?.split(' ')[0] || 'User'}
                  </span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4">
          <div className="container mx-auto px-4 space-y-2">
            <Link to="/" className="block text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/professionals" className="block text-gray-700 hover:text-blue-600">Professionals</Link>
            <Link to="/projects" className="block text-gray-700 hover:text-blue-600">Projects</Link>
            
            {role === 'ADMIN' && (
              <Link to="/admin/dashboard" className="block text-orange-600 font-bold">Admin</Link>
            )}

            {isLoggedIn && role === 'HOMEOWNER' && (
              <>
                <Link to="/post-project" className="block text-blue-600 font-bold">+ Post Project</Link>
                <Link to="/my-projects" className="block text-gray-700">My Projects</Link>
              </>
            )}

            {isLoggedIn && role === 'PROFESSIONAL' && (
              <>
                <Link to="/portfolio" className="block text-gray-700">Portfolio</Link>
                <Link to="/my-bids" className="block text-gray-700">My Bids</Link>
              </>
            )}

            {isLoggedIn && (
              <>
                <Link to="/profile" className="block text-gray-700">My Profile</Link>
                <button onClick={handleLogout} className="block text-red-600 font-bold">Logout</button>
              </>
            )}

            {!isLoggedIn && (
              <>
                <Link to="/login" className="block text-gray-700">Login</Link>
                <Link to="/register" className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-center">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;