import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaPlus,
  FaMapMarkerAlt,
  FaDollarSign,
  FaTrash,
  FaHourglassHalf,
  FaClipboardCheck
} from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

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
    if (!window.confirm('Are you sure you want to delete this project?')) return;

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

  // ============================================================
  // ✅ THE KEY FIX: Check STATUS FIRST, then APPROVED flag
  // ============================================================
  const renderStatusBadge = (project) => {
    // 1. CANCELLED / Rejected by Admin → RED
    if (project.status === 'CANCELLED') {
      return (
        <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-semibold border border-red-200 whitespace-nowrap">
          <FaTimesCircle /> Rejected by Admin
        </span>
      );
    }

    // 2. COMPLETED → PURPLE
    if (project.status === 'COMPLETED') {
      return (
        <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold border border-purple-200 whitespace-nowrap">
          <FaClipboardCheck /> Completed
        </span>
      );
    }

    // 3. IN_PROGRESS → BLUE
    if (project.status === 'IN_PROGRESS') {
      return (
        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200 whitespace-nowrap">
          <FaHourglassHalf /> In Progress
        </span>
      );
    }

    // 4. Approved & OPEN → GREEN
    if (project.approved === true) {
      return (
        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-200 whitespace-nowrap">
          <FaCheckCircle /> Approved
        </span>
      );
    }

    // 5. Everything else → PENDING (amber)
    return (
      <span className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-semibold border border-brand-200 whitespace-nowrap">
        <FaClock /> Pending Approval
      </span>
    );
  };

  // Helper: status dot color for the project card accent
  const getStatusAccent = (project) => {
    if (project.status === 'CANCELLED') return 'border-l-red-500';
    if (project.status === 'COMPLETED') return 'border-l-purple-500';
    if (project.status === 'IN_PROGRESS') return 'border-l-blue-500';
    if (project.approved === true) return 'border-l-green-500';
    return 'border-l-brand-500';
  };

  // ============ LOADING ============
  if (loading) {
    return (
      <div className="min-h-screen bg-warmgray-50 flex items-center justify-center">
        <div className="text-warmgray-500 text-lg">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warmgray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* ===== HEADER ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">My Projects</h1>
            <p className="text-warmgray-600 mt-1">
              Manage your posted projects and track their status
            </p>
          </div>
          <Link
            to="/post-project"
            className="inline-flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-lg hover:bg-brand-700 transition font-medium shadow-soft"
          >
            <FaPlus /> Post New Project
          </Link>
        </div>

        {/* ===== STATS SUMMARY (Optional but nice) ===== */}
        {projects.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-soft border border-warmgray-200">
              <div className="text-xs text-warmgray-500 uppercase font-semibold tracking-wide">
                Total
              </div>
              <div className="text-2xl font-bold text-slate-800 mt-1">
                {projects.length}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-soft border border-warmgray-200">
              <div className="text-xs text-brand-600 uppercase font-semibold tracking-wide">
                Pending
              </div>
              <div className="text-2xl font-bold text-slate-800 mt-1">
                {projects.filter(p => p.approved !== true && p.status !== 'CANCELLED').length}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-soft border border-warmgray-200">
              <div className="text-xs text-green-600 uppercase font-semibold tracking-wide">
                Approved
              </div>
              <div className="text-2xl font-bold text-slate-800 mt-1">
                {projects.filter(p => p.approved === true && p.status === 'OPEN').length}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-soft border border-warmgray-200">
              <div className="text-xs text-red-600 uppercase font-semibold tracking-wide">
                Rejected
              </div>
              <div className="text-2xl font-bold text-slate-800 mt-1">
                {projects.filter(p => p.status === 'CANCELLED').length}
              </div>
            </div>
          </div>
        )}

        {/* ===== EMPTY STATE ===== */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card border border-warmgray-200 p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              No projects yet
            </h2>
            <p className="text-warmgray-600 mb-6">
              Post your first project to get started with HomeCraft.
            </p>
            <Link
              to="/post-project"
              className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700 font-medium shadow-soft"
            >
              <FaPlus /> Post Your First Project
            </Link>
          </div>
        ) : (
          /* ===== PROJECT LIST ===== */
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`bg-white rounded-2xl shadow-soft hover:shadow-card border border-warmgray-200 border-l-4 ${getStatusAccent(project)} p-6 transition`}
              >
                <div className="flex justify-between items-start gap-4">

                  {/* Left: Project info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/projects/${project.id}`}>
                      <h2 className="text-xl font-bold text-slate-800 hover:text-brand-600 transition truncate">
                        {project.title}
                      </h2>
                    </Link>
                    <p className="text-warmgray-600 mt-1 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-warmgray-500 mt-3">
                      <span className="flex items-center gap-1.5">
                        <FaMapMarkerAlt className="text-brand-500" />
                        {project.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaDollarSign className="text-brand-500" />
                        {project.budgetMin} – {project.budgetMax}
                      </span>
                      {project.projectType && (
                        <span className="text-xs bg-warmgray-100 text-warmgray-600 px-2 py-0.5 rounded-full font-medium">
                          {project.projectType}
                        </span>
                      )}
                    </div>

                    {/* Rejection reason hint (only for cancelled) */}
                    {project.status === 'CANCELLED' && (
                      <div className="mt-3 bg-red-50 border border-red-100 text-red-700 text-xs px-3 py-2 rounded-lg inline-flex items-center gap-2">
                        <FaTimesCircle />
                        This project was reviewed and rejected by an administrator.
                      </div>
                    )}

                    {/* Pending hint (only for pending) */}
                    {project.approved !== true && project.status !== 'CANCELLED' && (
                      <div className="mt-3 bg-brand-50 border border-brand-100 text-brand-700 text-xs px-3 py-2 rounded-lg inline-flex items-center gap-2">
                        <FaClock />
                        Waiting for admin approval before professionals can bid.
                      </div>
                    )}
                  </div>

                  {/* Right: Badge + actions */}
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    {renderStatusBadge(project)}

                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={deleting === project.id}
                      className="inline-flex items-center gap-1 text-warmgray-400 hover:text-red-600 text-sm font-medium transition disabled:opacity-50"
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