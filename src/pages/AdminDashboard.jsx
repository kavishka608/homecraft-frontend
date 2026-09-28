import React, { useEffect, useState } from 'react';
import { FaUsers, FaUserCheck, FaClock, FaProjectDiagram } from 'react-icons/fa';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProfessionals: 0,
    totalClients: 0,
    totalProjects: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch users (proven to work from Users page)
      const usersRes = await api.get('/admin/users').catch(() => ({ data: { data: [] } }));
      const users = usersRes.data?.data || [];

      // Fetch all projects
      const projectsRes = await api.get('/projects').catch(() => ({ data: { data: [] } }));
      const projects = projectsRes.data?.data || [];

      // Fetch pending approvals
      const [pendPros, pendProjs] = await Promise.all([
        api.get('/admin/pending-professionals').catch(() => ({ data: { data: [] } })),
        api.get('/admin/pending-projects').catch(() => ({ data: { data: [] } })),
      ]);

      const pendingPros = pendPros.data?.data?.length || 0;
      const pendingProjs = pendProjs.data?.data?.length || 0;

      const totalProfessionals = users.filter(u => u.role === 'PROFESSIONAL').length;
      const totalClients = users.filter(u => u.role === 'CLIENT' || u.role === 'HOMEOWNER').length;

      setStats({
        totalUsers: users.length,
        totalProfessionals,
        totalClients,
        totalProjects: projects.length,
        pendingApprovals: pendingPros + pendingProjs,
      });
    } catch (error) {
      console.error('Stats fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: FaUsers,
      color: 'bg-blue-600',
      hint: `${stats.totalClients} clients · ${stats.totalProfessionals} pros`,
    },
    {
      label: 'Professionals',
      value: stats.totalProfessionals,
      icon: FaUserCheck,
      color: 'bg-green-600',
      hint: 'Registered professionals',
    },
    {
      label: 'Total Projects',
      value: stats.totalProjects,
      icon: FaProjectDiagram,
      color: 'bg-purple-600',
      hint: 'All projects on platform',
    },
    {
      label: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: FaClock,
      color: 'bg-orange-500',
      hint: 'Needs your review',
    },
  ];

  return (
    <div>
      {/* Top Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4 flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
          <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-xs">
            A
          </div>
          <span className="text-sm font-medium text-gray-700">Admin</span>
        </div>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="bg-white rounded-xl shadow p-12 text-center text-gray-500">
          Loading dashboard...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map(({ label, value, icon: Icon, color, hint }) => (
              <div key={label} className={`${color} text-white rounded-xl shadow p-6`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium opacity-90">{label}</span>
                  <Icon className="text-xl opacity-80" />
                </div>
                <div className="text-4xl font-bold">{value}</div>
                <div className="text-xs opacity-75 mt-2">{hint}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/admin/approvals"
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-500 hover:bg-amber-50 transition"
              >
                <FaClock className="text-3xl text-amber-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-800">Review Approvals</div>
                <div className="text-xs text-gray-500 mt-1">
                  {stats.pendingApprovals} pending
                </div>
              </a>
              <a
                href="/admin/users"
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition"
              >
                <FaUsers className="text-3xl text-blue-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-800">Manage Users</div>
                <div className="text-xs text-gray-500 mt-1">
                  {stats.totalUsers} total
                </div>
              </a>
              <a
                href="/admin/projects"
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 hover:bg-purple-50 transition"
              >
                <FaProjectDiagram className="text-3xl text-purple-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-800">View Projects</div>
                <div className="text-xs text-gray-500 mt-1">
                  {stats.totalProjects} total
                </div>
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;