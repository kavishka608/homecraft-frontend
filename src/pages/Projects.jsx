import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaDollarSign, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/projects');
        
        // 1. Get the data. Your backend wraps it, so we use response.data.data
        const allProjects = response.data.data || []; 
        
        // 2. ONLY show projects that are APPROVED by Admin!
        const approvedProjects = allProjects.filter(proj => proj.approved === true);
        
        // 3. Set the state
        setProjects(approvedProjects);
        
      } catch (err) {
        console.error("Detailed error:", err.response ? err.response.data : err.message); // Logs the actual error!
        setError("Could not load projects from database. Please make sure your backend is running on port 8080.");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center text-2xl text-gray-500">Loading Projects...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Ongoing & Completed Projects</h1>
        <p className="text-center text-gray-600 mb-12">Browse through our latest construction work.</p>

        {error && <p className="text-center text-orange-500 mb-4">{error}</p>}

        {projects.length === 0 ? (
          <p className="text-center text-gray-600 py-10">No approved projects available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden">
                <div className="h-48 relative">
                  {/* Default image if no imageUrl in entity */}
                  <img 
                    src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt={project.title} 
                    className="w-full h-full object-cover"
                  />
                  <span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${
                    project.status === 'COMPLETED' ? 'bg-green-500 text-white' : 
                    project.status === 'IN_PROGRESS' ? 'bg-blue-500 text-white' : 
                    project.status === 'OPEN' ? 'bg-yellow-500 text-white' : 
                    'bg-gray-500 text-white'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                  
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-center gap-2 text-sm">
                      <FaMapMarkerAlt className="text-red-500" /> {project.location}
                    </p>
                    <p className="flex items-center gap-2 text-sm">
                      <FaDollarSign className="text-green-600" /> 
                      Budget: ${project.budgetMin} - ${project.budgetMax}
                    </p>
                    {project.expectedStartDate && (
                      <p className="flex items-center gap-2 text-sm">
                        <FaCalendarAlt className="text-blue-500" /> 
                        Start: {project.expectedStartDate}
                      </p>
                    )}
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

export default Projects;