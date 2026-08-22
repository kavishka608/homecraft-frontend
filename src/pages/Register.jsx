import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: 'HOMEOWNER',
    professionalType: '',
    yearsExperience: '',
    bio: '',
    location: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If user is a HOMEOWNER, remove the professional fields so they are null in backend
    const payload = { ...formData };
    if (payload.role === 'HOMEOWNER') {
      delete payload.professionalType;
      delete payload.yearsExperience;
      delete payload.bio;
      delete payload.location;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', payload);
      console.log('Success:', response.data);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Error registering:', error);
      alert('Registration failed. Check console for details.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Create Account</h2>
        <p className="text-center text-gray-500 mb-8">Join HomeCraft today</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="John Doe" required />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="you@example.com" required />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="+94 123 456 789" required />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Create a strong password" required />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="role" value="HOMEOWNER" checked={formData.role === 'HOMEOWNER'} onChange={handleChange} className="mr-2" />
                Homeowner
              </label>
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="role" value="PROFESSIONAL" checked={formData.role === 'PROFESSIONAL'} onChange={handleChange} className="mr-2" />
                Professional
              </label>
            </div>
          </div>

          {/* Show these fields ONLY when Professional is selected */}
          {formData.role === 'PROFESSIONAL' && (
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="professionalType" className="block text-sm font-medium text-gray-700 mb-2">Profession Type</label>
                <select id="professionalType" name="professionalType" value={formData.professionalType} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                  <option value="">Select Profession</option>
                  <option value="MASON">Mason</option>
                  <option value="ELECTRICIAN">Electrician</option>
                  <option value="PAINTER">Painter</option>
                  <option value="CARPENTER">Carpenter</option>
                  <option value="PLANNER">Plumber</option>
                </select>
              </div>

              <div>
                <label htmlFor="yearsExperience" className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                <input type="number" id="yearsExperience" name="yearsExperience" value={formData.yearsExperience} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g. 5" required />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Tell us about your work..." required></textarea>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g. Colombo" required />
              </div>
            </div>
          )}

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
            Register
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;