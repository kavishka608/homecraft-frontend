import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaPlus, FaCheckCircle, FaClock } from 'react-icons/fa';

const HomeownerDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/projects/my-projects', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProjects(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching my projects:", error);
        setError("Could not load your projects. Check if you are logged in as a Homeowner.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center text-2xl text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Projects</h1>
            <Link to="/post-project" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
              <FaPlus className="inline mr-2" />Post New Project
            </Link>
          </div>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

          {projects.length === 0 ? (
            <p className="text-center text-gray-600 py-10">You haven't posted any projects yet.</p>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-white rounded-xl shadow-lg p-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{project.title}</h3>
                    <p className="text-gray-600 mb-2">{project.description}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>Location: {project.location}</span>
                      <span>Budget: ${project.budgetMin} - ${project.budgetMax}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                      {project.status}
                    </span>
                    <div className="flex items-center gap-1 text-sm">
                      {project.approved ? (
                        <span className="flex items-center gap-1 text-green-600"><FaCheckCircle /> Approved</span>
                      ) : (
                        <span className="flex items-center gap-1 text-orange-500"><FaClock /> Pending Admin Approval</span>
                      )}
                    </div>
                    <button 
                      onClick={() => handleDelete(project.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeownerDashboard;