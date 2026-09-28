import React, { useEffect, useState } from 'react';
import { FaSearch, FaUser, FaUserShield, FaUserTie, FaEnvelope } from 'react-icons/fa';
import api from '../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line
  }, [search, filterRole, users]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      if (response.data.success) setUsers(response.data.data);
    } catch (error) {
      console.warn('Users endpoint not available yet:', error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...users];
    if (filterRole !== 'ALL') {
      result = result.filter(u => u.role === filterRole);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(u =>
        u.fullName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  };

  const getRoleBadge = (role) => {
    if (role === 'ADMIN') {
      return (
        <span className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
          <FaUserShield className="text-xs" /> Admin
        </span>
      );
    }
    if (role === 'PROFESSIONAL') {
      return (
        <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
          <FaUserTie className="text-xs" /> Professional
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
        <FaUser className="text-xs" /> Client
      </span>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Users</h1>
        <p className="text-gray-500 mt-1">Manage all platform users</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="ALL">All Roles</option>
          <option value="CLIENT">Clients</option>
          <option value="PROFESSIONAL">Professionals</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading users...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-4">👥</div>
            <p className="text-gray-500">
              {users.length === 0
                ? 'No users found. The /api/admin/users endpoint is not implemented yet.'
                : 'No users match your search.'}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
                        {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <span className="font-medium text-gray-800">{user.fullName || 'Unnamed'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    <span className="inline-flex items-center gap-1.5">
                      <FaEnvelope className="text-gray-400 text-xs" /> {user.email}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;