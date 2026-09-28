import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  FaTachometerAlt, FaClipboardCheck, FaUsers,
  FaProjectDiagram, FaCog, FaHome,
} from 'react-icons/fa';

const menuItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
  { to: '/admin/approvals', label: 'Approvals', icon: FaClipboardCheck },
  { to: '/admin/users',     label: 'Users',     icon: FaUsers },
  { to: '/admin/projects',  label: 'Projects',  icon: FaProjectDiagram },
  { to: '/admin/settings',  label: 'Settings',  icon: FaCog },
];

const AdminLayout = () => {
  const adminName = localStorage.getItem('fullName') || 'Admin';

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 text-2xl font-bold border-b border-slate-700">
          Home<span className="text-amber-500">Craft</span>
        </div>

        <nav className="flex-1 py-4">
          {menuItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 transition border-l-4 ${
                  isActive
                    ? 'bg-slate-800 text-white border-amber-500'
                    : 'text-slate-300 border-transparent hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-700 p-4">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <FaHome /> Frontend
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-x-hidden">
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-xs">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700">Admin</span>
          </div>
        </div>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;