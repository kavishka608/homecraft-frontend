import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaSignOutAlt, FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    if (token && storedRole) {
      setIsLoggedIn(true);
      setRole(storedRole);
    }
  }, []);

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
    localStorage.removeItem('email');
    setIsLoggedIn(false);
    setRole(null);
    setAccountOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  // Treat CLIENT and HOMEOWNER as same role
  const isClient = role === 'CLIENT' || role === 'HOMEOWNER';
  const isProfessional = role === 'PROFESSIONAL';
  const isAdmin = role === 'ADMIN';

  return (
    <nav className="sticky top-0 z-50 bg-warmgray-50/80 backdrop-blur-md border-b border-warmgray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white text-lg shadow-soft">
              🏠
            </div>
            <span className="text-lg font-bold text-slate-800 hidden sm:block">
              Home<span className="text-brand-600">Craft</span>
            </span>
          </Link>

          {/* Desktop Nav — pill group */}
          <div className="hidden md:flex items-center gap-1 bg-warmgray-100 rounded-full p-1 border border-warmgray-200">
            <Link
              to="/"
              className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-700 hover:bg-white hover:text-brand-700 hover:shadow-soft transition"
            >
              Home
            </Link>
            <Link
              to="/professionals"
              className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-700 hover:bg-white hover:text-brand-700 hover:shadow-soft transition"
            >
              Professionals
            </Link>
            <Link
              to="/projects"
              className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-700 hover:bg-white hover:text-brand-700 hover:shadow-soft transition"
            >
              Projects
            </Link>

            {/* Admin Link */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="px-4 py-1.5 rounded-full text-sm font-semibold text-brand-700 bg-brand-100 hover:bg-brand-200 transition"
              >
                Admin
              </Link>
            )}

            {/* Client Links — Post Project ONLY */}
            {isLoggedIn && isClient && (
              <Link
                to="/post-project"
                className="px-4 py-1.5 rounded-full text-sm font-semibold text-brand-700 bg-brand-100 hover:bg-brand-200 transition"
              >
                + Post Project
              </Link>
            )}

            {/* Professional Links */}
            {isLoggedIn && isProfessional && (
              <>
                <Link
                  to="/portfolio"
                  className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-700 hover:bg-white hover:text-brand-700 hover:shadow-soft transition"
                >
                  Portfolio
                </Link>
                <Link
                  to="/my-bids"
                  className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-700 hover:bg-white hover:text-brand-700 hover:shadow-soft transition"
                >
                  My Bids
                </Link>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">

            {/* Not logged in */}
            {!isLoggedIn && (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-brand-700 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-full bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 shadow-soft transition"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Logged in — avatar + dropdown */}
            {isLoggedIn && (
              <div className="hidden md:flex items-center gap-3">
                {/* Notifications */}
                <button className="relative p-2 rounded-full text-slate-600 hover:bg-warmgray-100 transition">
                  <FaBell className="text-lg" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* Account dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setAccountOpen(!accountOpen)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white border border-warmgray-200 hover:border-brand-300 hover:shadow-soft transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
                      {localStorage.getItem('fullName')?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 hidden lg:block">
                      {localStorage.getItem('fullName')?.split(' ')[0] || 'User'}
                    </span>
                    <FaChevronDown className={`text-xs text-slate-400 transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {accountOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-card border border-warmgray-200 py-2 overflow-hidden">
                      <div className="px-4 py-3 border-b border-warmgray-100">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {localStorage.getItem('fullName') || 'User'}
                        </p>
                        <p className="text-xs text-warmgray-500 capitalize">
                          {role?.toLowerCase() || 'user'}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setAccountOpen(false)}
                        className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition"
                      >
                        My Profile
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setAccountOpen(false)}
                          className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition border-t border-warmgray-100"
                      >
                        <FaSignOutAlt className="text-xs" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-warmgray-100 transition"
            >
              {menuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-warmgray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 space-y-1">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition">Home</Link>
            <Link to="/professionals" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition">Professionals</Link>
            <Link to="/projects" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition">Projects</Link>

            {isAdmin && (
              <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-lg font-semibold text-brand-700 bg-brand-50">
                Admin Dashboard
              </Link>
            )}

            {isLoggedIn && isClient && (
              <Link
                to="/post-project"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 rounded-lg font-semibold text-brand-700 bg-brand-50"
              >
                + Post Project
              </Link>
            )}

            {isLoggedIn && isProfessional && (
              <>
                <Link to="/portfolio" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-slate-700 hover:bg-warmgray-50 transition">Portfolio</Link>
                <Link to="/my-bids" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-slate-700 hover:bg-warmgray-50 transition">My Bids</Link>
              </>
            )}

            {isLoggedIn && (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-slate-700 hover:bg-warmgray-50 transition">My Profile</Link>
                <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition">
                  <FaSignOutAlt className="text-xs" /> Logout
                </button>
              </>
            )}

            {!isLoggedIn && (
              <div className="pt-2 space-y-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-slate-700 hover:bg-warmgray-50 transition">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-lg bg-brand-600 text-white text-center font-semibold">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;