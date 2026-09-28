import React, { useEffect, useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import api from '../services/api';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line
  }, [search, filterStatus, projects]);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      if (response.data.success) setProjects(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...projects];
    if (filterStatus !== 'ALL') {
      result = result.filter(p => p.status === filterStatus);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  };

  const statusBadge = (status, approved) => {
    if (status === 'CANCELLED') {
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Rejected</span>;
    }
    if (status === 'COMPLETED') {
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">Completed</span>;
    }
    if (status === 'IN_PROGRESS') {
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">In Progress</span>;
    }
    if (approved === true) {
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Open</span>;
    }
    return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Pending</span>;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Projects</h1>
        <p className="text-gray-500 mt-1">Every project on the platform</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="ALL">All Status</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading projects...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-500">No projects found.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Budget</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{p.title}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className="inline-flex items-center gap-1.5">
                      <FaMapMarkerAlt className="text-amber-500 text-xs" /> {p.location}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className="inline-flex items-center gap-1.5">
                      <FaDollarSign className="text-amber-500 text-xs" />
                      {p.budgetMin} – {p.budgetMax}
                    </span>
                  </td>
                  <td className="px-6 py-4">{statusBadge(p.status, p.approved)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminProjects;