import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaClock, FaCheckCircle, FaTimesCircle, FaPlus,
  FaMapMarkerAlt, FaDollarSign, FaTrash,
  FaHourglassHalf, FaClipboardCheck
} from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const userRole = localStorage.getItem('role') || '';

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      const response = await api.get('/projects/my-projects');
      if (response.data.success) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    setDeleting(id);
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p.id !== id));
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error('Failed to delete project');
    } finally {
      setDeleting(null);
    }
  };

  const renderStatusBadge = (project) => {
    if (project.status === 'CANCELLED') {
      return (
        <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-semibold border border-red-200 whitespace-nowrap">
          <FaTimesCircle /> Rejected by Admin
        </span>
      );
    }
    if (project.status === 'COMPLETED') {
      return (
        <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold border border-purple-200 whitespace-nowrap">
          <FaClipboardCheck /> Completed
        </span>
      );
    }
    if (project.status === 'IN_PROGRESS') {
      return (
        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200 whitespace-nowrap">
          <FaHourglassHalf /> In Progress
        </span>
      );
    }
    if (project.approved === true) {
      return (
        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-200 whitespace-nowrap">
          <FaCheckCircle /> Approved
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold border border-amber-200 whitespace-nowrap">
        <FaClock /> Pending Approval
      </span>
    );
  };

  const getStatusAccent = (project) => {
    if (project.status === 'CANCELLED') return 'border-l-red-500';
    if (project.status === 'COMPLETED') return 'border-l-purple-500';
    if (project.status === 'IN_PROGRESS') return 'border-l-blue-500';
    if (project.approved === true) return 'border-l-green-500';
    return 'border-l-amber-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Projects</h1>
            <p className="text-gray-600 mt-1">
              Manage your posted projects and track their status
            </p>
          </div>
          <Link
            to="/post-project"
            className="inline-flex items-center gap-2 bg-amber-600 text-white px-5 py-2.5 rounded-lg hover:bg-amber-700 transition font-medium shadow"
          >
            <FaPlus /> Post New Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center border border-gray-200">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No projects yet</h2>
            <p className="text-gray-600 mb-6">Post your first project to get started.</p>
            <Link
              to="/post-project"
              className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 font-medium shadow"
            >
              <FaPlus /> Post Your First Project
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`bg-white rounded-2xl shadow hover:shadow-md border border-gray-200 border-l-4 ${getStatusAccent(project)} p-6 transition`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <Link to={`/projects/${project.id}`}>
                      <h2 className="text-xl font-bold text-gray-800 hover:text-amber-600 transition truncate">
                        {project.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 mt-1 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-3">
                      <span className="flex items-center gap-1.5">
                        <FaMapMarkerAlt className="text-amber-500" /> {project.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaDollarSign className="text-amber-500" />
                        {project.budgetMin} – {project.budgetMax}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 shrink-0">
                    {renderStatusBadge(project)}
                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={deleting === project.id}
                      className="inline-flex items-center gap-1 text-gray-400 hover:text-red-600 text-sm font-medium transition disabled:opacity-50"
                    >
                      <FaTrash className="text-xs" />
                      {deleting === project.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;