import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClipboardList,
  FaBriefcase,
} from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';
import { toastError, toastNetworkError } from '../utils/toast';

const PostProject = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    projectType: 'NEW_CONSTRUCTION',
    professionalTypeNeeded: 'PLANNER',
    expectedStartDate: '',
    expectedEndDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const e = {};

    if (!formData.title.trim()) {
      e.title = 'Please enter a project title.';
    } else if (formData.title.trim().length < 5) {
      e.title = 'Title must be at least 5 characters.';
    }

    if (!formData.description.trim()) {
      e.description = 'Please describe your project.';
    } else if (formData.description.trim().length < 20) {
      e.description = 'Description must be at least 20 characters.';
    }

    if (!formData.location.trim()) {
      e.location = 'Please enter a location.';
    }

    if (!formData.expectedStartDate) {
      e.expectedStartDate = 'Please select a start date.';
    }

    if (!formData.expectedEndDate) {
      e.expectedEndDate = 'Please select an end date.';
    }

    if (
      formData.expectedStartDate &&
      formData.expectedEndDate &&
      new Date(formData.expectedStartDate) >= new Date(formData.expectedEndDate)
    ) {
      e.expectedEndDate = 'End date must be after the start date.';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toastError('Please fix the errors in the form.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        projectType: formData.projectType,
        professionalTypeNeeded: formData.professionalTypeNeeded,
        expectedStartDate: formData.expectedStartDate,
        expectedEndDate: formData.expectedEndDate,
        // Budget removed from UI — sending defaults
        budgetMin: 0,
        budgetMax: 0,
      };

      const response = await api.post('/projects', payload);

      if (response.data.success) {
        toast.success('Project posted! Waiting for admin approval. 🎉', {
          duration: 4000,
        });

        // Reset form
        setFormData({
          title: '',
          description: '',
          location: '',
          projectType: 'NEW_CONSTRUCTION',
          professionalTypeNeeded: 'PLANNER',
          expectedStartDate: '',
          expectedEndDate: '',
        });

        setTimeout(() => navigate('/projects'), 900);
      }
    } catch (error) {
      console.error('Post project error:', error);

      if (!error.response) {
        toastNetworkError();
      } else {
        const msg = error.response?.data?.message || '';
        if (msg.toLowerCase().includes('client')) {
          toastError('Only clients can post projects.');
        } else {
          toastError(msg || 'Could not post project. Please try again.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Post a New Project
          </h1>
          <p className="text-gray-500 mb-8">
            Tell us what you need and receive bids from professionals.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Build a new hotel"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.title
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-amber-500'
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1.5">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe what you want to build, renovate, or finish..."
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none transition ${
                  errors.description
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-amber-500'
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Negombo"
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.location
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-amber-500'
                  }`}
                />
              </div>
              {errors.location && (
                <p className="text-red-500 text-xs mt-1.5">{errors.location}</p>
              )}
            </div>

            {/* Project Type + Professional Needed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type
                </label>
                <div className="relative">
                  <FaClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm z-10" />
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none bg-white"
                  >
                    <option value="NEW_CONSTRUCTION">New Construction</option>
                    <option value="RENOVATION">Renovation</option>
                    <option value="FINISHING">Finishing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Needed
                </label>
                <div className="relative">
                  <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm z-10" />
                  <select
                    name="professionalTypeNeeded"
                    value={formData.professionalTypeNeeded}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none bg-white"
                  >
                    <option value="PLANNER">Planner</option>
                    <option value="MASON">Mason</option>
                    <option value="PAINTER">Painter</option>
                    <option value="CARPENTER">Carpenter</option>
                    <option value="ELECTRICIAN">Electrician</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Start Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm z-10" />
                  <input
                    type="date"
                    name="expectedStartDate"
                    value={formData.expectedStartDate}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                      errors.expectedStartDate
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-amber-500'
                    }`}
                  />
                </div>
                {errors.expectedStartDate && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.expectedStartDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected End Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm z-10" />
                  <input
                    type="date"
                    name="expectedEndDate"
                    value={formData.expectedEndDate}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                      errors.expectedEndDate
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-amber-500'
                    }`}
                  />
                </div>
                {errors.expectedEndDate && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.expectedEndDate}
                  </p>
                )}
              </div>
            </div>

            {/* Info box */}
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-lg">
              💡 After you post, an admin will review your project. Once approved,
              professionals can submit bids.
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Posting...' : 'Post Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostProject;