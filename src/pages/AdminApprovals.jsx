import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserCheck, FaProjectDiagram } from 'react-icons/fa';

const AdminApprovals = () => {
  const [professionals, setProfessionals] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPendingData();
  }, []);

  const fetchPendingData = async () => {
    try {
      // Fetch Pending Professionals
      const proResponse = await axios.get(
        'http://localhost:8080/api/admin/pending-professionals',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (proResponse.data.success) {
        setProfessionals(proResponse.data.data);
      }

      // Fetch Pending Projects
      const projectResponse = await axios.get(
        'http://localhost:8080/api/admin/pending-projects',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (projectResponse.data.success) {
        setProjects(projectResponse.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePro = async (id) => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfessionals(professionals.filter(p => p.id !== id));
      setMessage('Professional approved!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error approving professional:", error);
    }
  };

  const handleRejectPro = async (id) => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/reject/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfessionals(professionals.filter(p => p.id !== id));
      setMessage('Professional rejected!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error rejecting professional:", error);
    }
  };

  const handleApproveProject = async (id) => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/projects/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects(projects.filter(p => p.id !== id));
      setMessage('Project approved!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error approving project:", error);
    }
  };

  const handleRejectProject = async (id) => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/projects/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects(projects.filter(p => p.id !== id));
      setMessage('Project rejected!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error rejecting project:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Approvals</h1>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}

        {/* Pending Projects */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-blue-600 text-white px-6 py-3 font-bold flex items-center gap-2">
            <FaProjectDiagram /> Pending Project Approvals
          </div>
          {projects.length === 0 ? (
            <p className="text-gray-600 text-center py-6">No pending projects.</p>
          ) : (
            <div className="divide-y divide-gray-200">
              {projects.map((project) => (
                <div key={project.id} className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{project.title}</h3>
                    <p className="text-gray-600 text-sm">{project.description}</p>
                    <div className="flex gap-4 text-sm text-gray-500 mt-2">
                      <span>Location: {project.location}</span>
                      <span>Budget: ${project.budgetMin} - ${project.budgetMax}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveProject(project.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectProject(project.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Professionals */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-orange-500 text-white px-6 py-3 font-bold flex items-center gap-2">
            <FaUserCheck /> Pending Professional Approvals
          </div>
          {professionals.length === 0 ? (
            <p className="text-gray-600 text-center py-6">No pending professionals.</p>
          ) : (
            <div className="divide-y divide-gray-200">
              {professionals.map((pro) => (
                <div key={pro.id} className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{pro.fullName}</h3>
                    <p className="text-gray-600 text-sm">{pro.email}</p>
                    <p className="text-blue-600 text-sm mt-1">{pro.professionalType}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprovePro(pro.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectPro(pro.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      Reject
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

export default AdminApprovals;