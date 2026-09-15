import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
    fetchBids();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      if (response.data.success) setProject(response.data.data);
    } catch (error) {
      toast.error('Project not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      const response = await api.get(`/bids/project/${id}`);
      if (response.data.success) setBids(response.data.data);
    } catch (error) {
      // silent
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!project) return <div className="text-center py-10">Project not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <p className="text-gray-700 mb-4">{project.description}</p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>📍 Location: {project.location}</div>
        <div>💰 Budget: ${project.budgetMin} - ${project.budgetMax}</div>
        <div>📋 Type: {project.projectType}</div>
        <div>🔧 Status: {project.status}</div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Bids ({bids.length})</h2>
      {bids.length === 0 ? (
        <p className="text-gray-500">No bids yet.</p>
      ) : (
        <div className="space-y-3">
          {bids.map((bid) => (
            <div key={bid.id} className="bg-white p-4 rounded shadow">
              <p className="font-semibold">{bid.professional?.fullName}</p>
              <p>Amount: ${bid.bidAmount}</p>
              <p>Days: {bid.estimatedDays}</p>
              <p>Status: {bid.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;