import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    yearsExperience: ''
  });
  const [isProfessional, setIsProfessional] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (role === 'PROFESSIONAL') {
          setIsProfessional(true);
          const response = await axios.get('http://localhost:8080/api/professionals/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProfile(response.data.data);
        } else {
          // For Homeowners/Clients (You'll need a /api/clients/me endpoint later)
          setProfile({
            fullName: localStorage.getItem('fullName') || '',
            email: localStorage.getItem('email') || '',
            phone: '',
            bio: '',
            location: '',
            yearsExperience: ''
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:8080/api/professionals/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage('Failed to update profile.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center text-2xl text-gray-500">Loading Profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
          
          {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email (Read Only)</label>
              <input type="email" value={profile.email} readOnly className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input type="text" name="phone" value={profile.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>

            {isProfessional && (
             <div className="mt-4">
            <button 
             onClick={() => navigate('/portfolio')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
             >
             Manage My Portfolio
            </button>
            </div>
            )}

            {isProfessional && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                  <input type="number" name="yearsExperience" value={profile.yearsExperience} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input type="text" name="location" value={profile.location} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea name="bio" rows="4" value={profile.bio} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg"></textarea>
                </div>
              </>
            )}

            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;