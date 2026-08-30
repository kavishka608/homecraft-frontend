import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaFolder, FaLock, FaCog, FaUser, FaShieldAlt, FaHome } from 'react-icons/fa';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:8080/api/admin/pending-professionals');
        
        // If it's wrapped in response.data, use that, otherwise use the array directly
        setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : usersResponse.data.data || []);
        
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter users based on search
  const filteredUsers = users.filter((user) =>
    (user.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get counts
  const pendingCount = users.filter(u => u.verificationStatus === 'PENDING').length;
  const approvedCount = users.filter(u => u.verificationStatus === 'APPROVED').length;

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center text-2xl text-gray-500">Loading Dashboard...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Left Sidebar (LastPass Style) */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          Home<span className="text-red-500">Craft</span>
        </div>
        
        <nav className="flex-1 py-6">
          <div className="w-full flex items-center gap-3 px-6 py-3 text-left text-white bg-gray-700 border-l-4 border-red-500 transition">
            <FaShieldAlt /> Dashboard
          </div>
          <Link to="/admin/approvals" className="block w-full flex items-center gap-3 px-6 py-3 text-left text-gray-300 hover:bg-gray-700 transition">
            <FaLock /> Approvals
          </Link>
          <div className="w-full flex items-center gap-3 px-6 py-3 text-left text-gray-300 hover:bg-gray-700 transition">
            <FaUser /> Users
          </div>
          <div className="w-full flex items-center gap-3 px-6 py-3 text-left text-gray-300 hover:bg-gray-700 transition">
            <FaFolder /> Projects
          </div>
          <div className="w-full flex items-center gap-3 px-6 py-3 text-left text-gray-300 hover:bg-gray-700 transition">
            <FaCog /> Settings
          </div>
          <Link to="/" className="block w-full flex items-center gap-3 px-6 py-3 text-left text-gray-300 hover:bg-gray-700 transition">
            <FaHome /> Frontend
          </Link>
        </nav>

        <div className="p-6 border-t border-gray-700 text-sm text-gray-400">
          Logged in as Admin
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        
        {/* Top Bar with Search (LastPass Style) */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Vault</h1>
          <div className="flex items-center gap-4">
            <div className="relative w-72">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
              <FaUser className="text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">Admin</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg">
            <p className="text-sm opacity-80">Total Users</p>
            <p className="text-3xl font-bold mt-2">{users.length}</p>
          </div>
          <div className="bg-green-600 text-white p-6 rounded-xl shadow-lg">
            <p className="text-sm opacity-80">Active Professionals</p>
            <p className="text-3xl font-bold mt-2">{approvedCount}</p>
          </div>
          <div className="bg-orange-500 text-white p-6 rounded-xl shadow-lg">
            <p className="text-sm opacity-80">Pending Approvals</p>
            <p className="text-3xl font-bold mt-2">{pendingCount}</p>
          </div>
        </div>

        {/* Grid of Cards (LastPass Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center py-10">No users found.</p>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaUser className="text-blue-600 text-xl" />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    user.verificationStatus === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {user.verificationStatus || 'Active'}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg">{user.fullName || 'Unknown'}</h3>
                <p className="text-sm text-gray-500 mb-4">{user.professionalType || 'User'}</p>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;