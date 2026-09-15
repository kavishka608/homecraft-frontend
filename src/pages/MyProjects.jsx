import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaCheckCircle, FaTimesCircle, FaPlus } from 'react-icons/fa';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p.id !== id));
      toast.success('Project deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  // ✅ CLEAN STATUS BADGE LOGIC
  const renderStatusBadge = (project) => {
    // Case 1: Approved & OPEN
    if (project.approved === true && project.status === 'OPEN') {
      return (
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
          <FaCheckCircle /> Approved
        </span>
      );
    }

    // Case 2: Rejected / Cancelled
    if (project.status === 'CANCELLED') {
      return (
        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
          <FaTimesCircle /> Rejected by Admin
        </span>
      );
    }

    // Case 3: In Progress
    if (project.status === 'IN_PROGRESS') {
      return (
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          In Progress
        </span>
      );
    }

    // Case 4: Completed
    if (project.status === 'COMPLETED') {
      return (
        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
          Completed
        </span>
      );
    }

    // Case 5: Pending approval
    return (
      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
        <FaClock /> Pending Admin Approval
      </span>
    );
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Projects</h1>
        {user?.role === 'CLIENT' && (
          <Link
            to="/post-project"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FaPlus /> Post New Project
          </Link>
        )}
      </div>

      {/* Empty State */}
      {projects.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <p className="text-gray-500 text-lg mb-4">
            You haven't posted any projects yet.
          </p>
          <Link
            to="/post-project"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Post Your First Project
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link to={`/projects/${project.id}`}>
                    <h2 className="text-xl font-bold text-gray-800 hover:text-blue-600">
                      {project.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 mt-1">{project.description}</p>
                  <div className="flex gap-4 text-sm text-gray-500 mt-3">
                    <span>📍 {project.location}</span>
                    <span>💰 ${project.budgetMin} - ${project.budgetMax}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {renderStatusBadge(project)}
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProjects;