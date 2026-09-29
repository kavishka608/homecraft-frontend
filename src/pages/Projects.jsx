import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaClock, FaCheckCircle, FaTimesCircle, FaPlus,
  FaMapMarkerAlt, FaDollarSign, FaTrash,
  FaHourglassHalf, FaClipboardCheck, FaGavel, FaTimes, FaEye
} from 'react-icons/fa';
import api from '../services/api';
import ConfirmModal from '../components/common/ConfirmModal';
import {
  toastDeleted,
  toastError,
  toastBidSubmitted,
  toastNetworkError,
} from '../utils/toast';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [bidForm, setBidForm] = useState({
    bidAmount: '',
    estimatedDays: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const role = localStorage.getItem('role') || '';

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  const fetchProjects = async () => {
    try {
      let endpoint = '/projects/my-projects';
      if (role === 'CLIENT' || role === 'HOMEOWNER') endpoint = '/projects/my-projects';
      else if (role === 'PROFESSIONAL') endpoint = '/projects/open';
      else if (role === 'ADMIN') endpoint = '/projects';

      const response = await api.get(endpoint);
      if (response.data.success) setProjects(response.data.data);
      else setProjects([]);
    } catch (error) {
      console.error(error);
      toastNetworkError();
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Ask for confirmation
  const askDelete = (id) => {
    setDeleteConfirm({ open: true, id });
  };

  // Confirm + delete
  const handleDeleteConfirm = async () => {
    const id = deleteConfirm.id;
    setDeleteConfirm({ open: false, id: null });
    setDeleting(id);
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter((p) => p.id !== id));
      toastDeleted('Project');
    } catch (error) {
      toastError('Failed to delete project. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const openBidModal = (project) => {
    setSelectedProject(project);
    setBidForm({ bidAmount: '', estimatedDays: '', message: '' });
    setBidModalOpen(true);
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    if (!bidForm.bidAmount || !bidForm.estimatedDays) {
      toastError('Please fill in both amount and days.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/bids/project/${selectedProject.id}`, {
        bidAmount: Number(bidForm.bidAmount),
        estimatedDays: Number(bidForm.estimatedDays),
        message: bidForm.message,
      });
      toastBidSubmitted();
      setBidModalOpen(false);
      setSelectedProject(null);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message;
      if (msg?.toLowerCase().includes('already')) {
        toastError('You already submitted a bid on this project.');
      } else {
        toastError('Failed to submit bid. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderStatusBadge = (project) => {
    if (project.status === 'CANCELLED') {
      return (
        <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-semibold border border-red-200 whitespace-nowrap">
          <FaTimesCircle /> Rejected
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
          <FaCheckCircle /> Open
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold border border-amber-200 whitespace-nowrap">
        <FaClock /> Pending
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

  const pageTitle =
    role === 'PROFESSIONAL' ? 'Open Projects' :
    role === 'ADMIN' ? 'All Projects' :
    'My Projects';

  const pageSubtitle =
    role === 'PROFESSIONAL' ? 'Browse projects you can bid on' :
    role === 'ADMIN' ? 'Manage all projects on the platform' :
    'Manage your posted projects and track their status';

  const emptyMessage =
    role === 'PROFESSIONAL' ? 'No open projects to bid on yet. Check back soon!' :
    role === 'ADMIN' ? 'No projects on the platform yet.' :
    'Post your first project to get started.';

  const isClient = role === 'CLIENT' || role === 'HOMEOWNER';
  const isProfessional = role === 'PROFESSIONAL';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{pageTitle}</h1>
            <p className="text-gray-600 mt-1">{pageSubtitle}</p>
          </div>
          {isClient && (
            <Link
              to="/post-project"
              className="inline-flex items-center gap-2 bg-amber-600 text-white px-5 py-2.5 rounded-lg hover:bg-amber-700 font-medium shadow"
            >
              <FaPlus /> Post New Project
            </Link>
          )}
        </div>

        {/* List */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center border border-gray-200">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No projects yet</h2>
            <p className="text-gray-600 mb-6">{emptyMessage}</p>
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
                      <h2 className="text-xl font-bold text-gray-800 hover:text-amber-600 transition truncate cursor-pointer">
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
                      {project.projectType && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                          {project.projectType}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 shrink-0">
                    {renderStatusBadge(project)}

                    {isClient && (
                      <>
                        <Link
                          to={`/projects/${project.id}`}
                          className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium shadow transition"
                        >
                          <FaEye className="text-xs" /> View Bids
                        </Link>
                        <button
                          onClick={() => askDelete(project.id)}
                          disabled={deleting === project.id}
                          className="inline-flex items-center gap-1 text-gray-400 hover:text-red-600 text-sm font-medium transition disabled:opacity-50"
                        >
                          <FaTrash className="text-xs" />
                          {deleting === project.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </>
                    )}

                    {isProfessional && project.status === 'OPEN' && project.approved === true && (
                      <button
                        onClick={() => openBidModal(project)}
                        className="inline-flex items-center gap-1.5 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 text-sm font-medium shadow transition"
                      >
                        <FaGavel className="text-xs" /> Place Bid
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.open}
        title="Delete Project?"
        message="This will permanently remove the project and all its bids. This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        confirmColor="red"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ open: false, id: null })}
      />

      {/* Bid Modal */}
      {bidModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setBidModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <FaTimes />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaGavel className="text-amber-600" /> Place Your Bid
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Project: <span className="font-semibold text-gray-700">{selectedProject.title}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Client Budget: ${selectedProject.budgetMin} – ${selectedProject.budgetMax}
              </p>
            </div>

            <form onSubmit={handleSubmitBid} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Bid Amount ($) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={bidForm.bidAmount}
                  onChange={(e) => setBidForm({ ...bidForm, bidAmount: e.target.value })}
                  placeholder="e.g. 5000"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Days to Complete *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={bidForm.estimatedDays}
                  onChange={(e) => setBidForm({ ...bidForm, estimatedDays: e.target.value })}
                  placeholder="e.g. 10"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message to Client
                </label>
                <textarea
                  rows="3"
                  value={bidForm.message}
                  onChange={(e) => setBidForm({ ...bidForm, message: e.target.value })}
                  placeholder="Explain why you're the best fit..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBidModalOpen(false)}
                  className="flex-1 px-5 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-5 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium shadow disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Bid'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;