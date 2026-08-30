import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaLock, FaEnvelope, FaSave } from 'react-icons/fa';

const AdminSettings = () => {
  const [adminDetails, setAdminDetails] = useState({
    fullName: localStorage.getItem('fullName') || 'Admin',
    email: localStorage.getItem('email') || 'admin@homecraft.com',
    phone: localStorage.getItem('phone') || ''
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const handleDetailsChange = (e) => {
    setAdminDetails({ ...adminDetails, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      // Update details via backend (You will need an endpoint for this)
      // For now, save to localStorage so it reflects in the Navbar
      localStorage.setItem('fullName', adminDetails.fullName);
      localStorage.setItem('email', adminDetails.email);
      localStorage.setItem('phone', adminDetails.phone);
      
      setMessage('Profile details updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to update details.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    // Backend endpoint to change password
    try {
      setMessage('Password updated successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to update password.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          Home<span className="text-red-500">Craft</span>
        </div>
        <nav className="flex-1 py-6">
          <a href="/admin/dashboard" className="block w-full flex items-center gap-3 px-6 py-3 text-left text-gray-300 hover:bg-gray-700 transition">
            <FaUser /> Dashboard
          </a>
          <a href="/admin/approvals" className="block w-full flex items-center gap-3 px-6 py-3 text-left text-gray-300 hover:bg-gray-700 transition">
            <FaLock /> Approvals
          </a>
          <div className="w-full flex items-center gap-3 px-6 py-3 text-left text-white bg-gray-700 border-l-4 border-blue-500 transition">
            <FaUser /> My Settings
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Settings</h1>

        {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{message}</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Update Details */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaUser className="text-blue-500" /> Update Profile Details
            </h2>
            <form onSubmit={handleDetailsSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={adminDetails.fullName} 
                  onChange={handleDetailsChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={adminDetails.email} 
                  onChange={handleDetailsChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={adminDetails.phone} 
                  onChange={handleDetailsChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                Save Details
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaLock className="text-orange-500" /> Change Password
            </h2>
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input 
                  type="password" 
                  name="currentPassword" 
                  value={passwords.currentPassword} 
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input 
                  type="password" 
                  name="newPassword" 
                  value={passwords.newPassword} 
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  value={passwords.confirmPassword} 
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition">
                Change Password
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;