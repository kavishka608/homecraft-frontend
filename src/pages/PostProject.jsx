import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    budgetMin: '',
    budgetMax: '',
    projectType: 'NEW_CONSTRUCTION', // NEW_CONSTRUCTION, RENOVATION, FINISHING
    professionalTypeNeeded: 'PLANNER', // PLANNER, MASON, PAINTER, CARPENTER, ELECTRICIAN
    expectedStartDate: '',
    expectedEndDate: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // Send data to backend
      const response = await axios.post('http://localhost:8080/api/projects', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Project posted successfully!');
      // Reset form
      setFormData({
        title: '',
        description: '',
        location: '',
        budgetMin: '',
        budgetMax: '',
        projectType: 'NEW_CONSTRUCTION',
        professionalTypeNeeded: 'PLANNER',
        expectedStartDate: '',
        expectedEndDate: ''
      });

      // Optionally redirect to projects page after 2 seconds
      setTimeout(() => navigate('/projects'), 2000);

    } catch (err) {
      console.error('Error posting project:', err);
      setError('Failed to post project. Please check if you are logged in as a Homeowner.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Post a New Project</h1>
          
          {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{message}</div>}
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., Build a new house extension"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Describe the work you need done..."
                required
              ></textarea>
            </div>

            {/* Location & Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input 
                  type="text" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Colombo"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range ($)</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    name="budgetMin" 
                    value={formData.budgetMin} 
                    onChange={handleChange}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Min"
                    required
                  />
                  <input 
                    type="number" 
                    name="budgetMax" 
                    value={formData.budgetMax} 
                    onChange={handleChange}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Max"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Project Type & Professional Needed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                <select 
                  name="projectType" 
                  value={formData.projectType} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="NEW_CONSTRUCTION">New Construction</option>
                  <option value="RENOVATION">Renovation</option>
                  <option value="FINISHING">Finishing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Professional Needed</label>
                <select 
                  name="professionalTypeNeeded" 
                  value={formData.professionalTypeNeeded} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="PLANNER">Planner</option>
                  <option value="MASON">Mason</option>
                  <option value="PAINTER">Painter</option>
                  <option value="CARPENTER">Carpenter</option>
                  <option value="ELECTRICIAN">Electrician</option>
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Start Date</label>
                <input 
                  type="date" 
                  name="expectedStartDate" 
                  value={formData.expectedStartDate} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected End Date</label>
                <input 
                  type="date" 
                  name="expectedEndDate" 
                  value={formData.expectedEndDate} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Post Project
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostProject;