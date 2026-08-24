import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeProfessionals, setActiveProfessionals] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [projects, setProjects] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get all users from backend
        const usersResponse = await axios.get('http://localhost:8080/api/admin/pending-professionals'); // For demo, we'll use this endpoint to get some data
        // In the future you will have a /api/admin/users endpoint. For now, let's count manually.
        
        // Note: The following counts are examples. You will need to add specific backend endpoints to get exact numbers.
        // But we can at least show real professionals.
        const allProfessionals = usersResponse.data;
        const pending = allProfessionals.filter(p => p.verificationStatus === 'PENDING').length;
        const active = allProfessionals.filter(p => p.verificationStatus === 'APPROVED').length;

        setPendingApprovals(pending);
        setActiveProfessionals(active);
        setUsers(allProfessionals); // Show real professionals in the table
        setTotalUsers(allProfessionals.length);

        // Fetch projects count (if you have an endpoint for it)
        // const projectsResponse = await axios.get('http://localhost:8080/api/projects');
        // setProjects(projectsResponse.data.length);

      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center text-2xl text-gray-500">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-gray-900 text-white py-6 px-8">
        <h1 className="text-3xl font-bold">Admin Control Center</h1>
        <p className="text-gray-400 mt-2">Manage HomeCraft professionals, projects, and users.</p>
      </div>

      <div className="container mx-auto px-8 py-10">
        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Link to="/admin/approvals" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 text-2xl mb-4">
              ⏳
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Pending Approvals</h3>
            <p className="text-gray-600 mt-2">Approve or reject new professional registrations.</p>
          </Link>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-2xl mb-4">
              👷
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Manage Professionals</h3>
            <p className="text-gray-600 mt-2">View and manage all active professionals.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-2xl mb-4">
              📊
            </div>
            <h3 className="text-xl font-semibold text-gray-800">System Stats</h3>
            <p className="text-gray-600 mt-2">Monitor overall platform health and usage.</p>
          </div>
        </div>

        {/* Real Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg">
            <p className="text-sm opacity-80">Total Users</p>
            <p className="text-3xl font-bold mt-2">{totalUsers}</p>
          </div>
          <div className="bg-green-600 text-white p-6 rounded-xl shadow-lg">
            <p className="text-sm opacity-80">Active Professionals</p>
            <p className="text-3xl font-bold mt-2">{activeProfessionals}</p>
          </div>
          <div className="bg-orange-500 text-white p-6 rounded-xl shadow-lg">
            <p className="text-sm opacity-80">Pending Approvals</p>
            <p className="text-3xl font-bold mt-2">{pendingApprovals}</p>
          </div>
          <div className="bg-purple-600 text-white p-6 rounded-xl shadow-lg">
            <p className="text-sm opacity-80">Total Projects</p>
            <p className="text-3xl font-bold mt-2">{projects}</p>
          </div>
        </div>

        {/* Real Recent Registrations Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <h2 className="text-xl font-bold text-gray-800 p-6 border-b border-gray-100">Recent Registrations</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No users found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100">
                    <td className="px-6 py-4 text-sm text-gray-900">{user.fullName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-blue-600">{user.role || user.userRole || 'PROFESSIONAL'}</td>
                    <td className="px-6 py-4 text-sm text-green-600">
                      {user.verificationStatus === 'APPROVED' ? 'Active' : 'Pending'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;