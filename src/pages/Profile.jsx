import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPhone, FaMapMarkerAlt, FaBriefcase, FaUser, FaEnvelope } from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    fullName: localStorage.getItem('fullName') || '',
    email: localStorage.getItem('email') || '',
    phone: '',
    bio: '',
    location: '',
    yearsExperience: '',
    profilePicture: null 
  });
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [isProfessional, setIsProfessional] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null); 

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (role === 'PROFESSIONAL') {
          setIsProfessional(true);
          const response = await axios.get('http://localhost:8080/api/professionals/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProfile(response.data.data);
        }
        else {
          // For Homeowners: Fill from localStorage
          setProfile({
            fullName: localStorage.getItem('fullName') || '',
            email: localStorage.getItem('email') || '',
            phone: '',
            bio: 'This is your homeowner profile. Update your details here.',
            location: '',
            yearsExperience: '',
            profilePicture: null
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [role, token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (role === 'PROFESSIONAL') {
        // 1. Update profile info first
        await axios.put('http://localhost:8080/api/professionals/profile', profile, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // 2. Upload the picture if a file is selected
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          
          await axios.post('http://localhost:8080/api/professionals/upload-profile-picture', formData, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          
          // Refresh the profile to show the new picture
          const response = await axios.get('http://localhost:8080/api/professionals/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProfile(response.data.data);
        }
      } else {
        localStorage.setItem('fullName', profile.fullName);
        localStorage.setItem('email', profile.email);
      }

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
        <div className="max-w-2xl mx-auto">
          {/* User Header with Role */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="flex items-center gap-6 mb-6">
              <img 
                src={profile.profilePicture || "https://i.pravatar.cc/150?img=11"} 
                alt="Profile" 
                className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{profile.fullName}</h1>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <FaEnvelope className="text-blue-500" /> {profile.email}
                </p>
                <div className="mt-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    role === 'PROFESSIONAL' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {role === 'PROFESSIONAL' ? 'Professional' : 'Homeowner'}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FaPhone className="text-green-500" /> 
                <span>Phone: {profile.phone || 'Not added yet'}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500" /> 
                <span>Location: {profile.location || 'Not added yet'}</span>
              </div>
              {isProfessional && (
                <div className="flex items-center gap-2">
                  <FaBriefcase className="text-orange-500" /> 
                  <span>Experience: {profile.yearsExperience ? `${profile.yearsExperience} years` : 'Not added yet'}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <FaUser className="text-purple-500" /> 
                <span>Status: Active</span>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Edit Details</h2>
            
            {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{message}</div>}

            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-6">
              <label className="cursor-pointer bg-blue-100 text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-blue-200 transition">
                Change Photo
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden"
                />
              </label>
            </div>

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

              {isProfessional && (
                <div className="mt-4 text-center">
                  <button 
                    type="button" 
                    onClick={() => navigate('/portfolio')}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Manage My Portfolio
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;