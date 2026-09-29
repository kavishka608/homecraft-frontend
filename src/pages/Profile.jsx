import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FaPhone, FaMapMarkerAlt, FaBriefcase, FaUser,
  FaEnvelope, FaShieldAlt, FaCalendarAlt, FaCamera,
  FaPencilAlt, FaKey, FaTimes
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    fullName: localStorage.getItem('fullName') || '',
    email: localStorage.getItem('email') || '',
    phone: '',
    bio: '',
    location: '',
    yearsExperience: '',
    profilePicture: null,
  });

  const [role] = useState(localStorage.getItem('role') || '');
  const [isProfessional, setIsProfessional] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [file, setFile] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (role === 'PROFESSIONAL') {
          setIsProfessional(true);
          const response = await axios.get('http://localhost:8080/api/professionals/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.success) setProfile(response.data.data);
        } else if (role === 'ADMIN') {
          setIsAdmin(true);
          setProfile({
            fullName: localStorage.getItem('fullName') || 'Admin',
            email: localStorage.getItem('email') || '',
            phone: '',
            bio: '',
            location: '',
            yearsExperience: '',
            profilePicture: null,
          });
        } else {
          setProfile({
            fullName: localStorage.getItem('fullName') || '',
            email: localStorage.getItem('email') || '',
            phone: '',
            bio: '',
            location: '',
            yearsExperience: '',
            profilePicture: null,
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
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
    if (e && e.preventDefault) e.preventDefault();
    try {
      if (role === 'PROFESSIONAL') {
        await axios.put('http://localhost:8080/api/professionals/profile', profile, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          await axios.post(
            'http://localhost:8080/api/professionals/upload-profile-picture',
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
            }
          );
          const response = await axios.get('http://localhost:8080/api/professionals/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.success) setProfile(response.data.data);
          setFile(null);
        }
      } else {
        localStorage.setItem('fullName', profile.fullName);
        localStorage.setItem('email', profile.email);
      }

      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const formatDate = (dateStr) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const displayRole = (r) => {
    if (r === 'CLIENT' || r === 'HOMEOWNER') return 'Client';
    if (r === 'PROFESSIONAL') return 'Professional';
    if (r === 'ADMIN') return 'Admin';
    return r || 'User';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-lg">Loading Profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            <p className="text-gray-600 mt-1">
              Manage your account settings and personal information
            </p>
          </div>
          <button
            onClick={() => toast('Password change coming soon', { icon: '🔐' })}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-amber-600 text-amber-700 rounded-lg hover:bg-amber-50 transition font-medium"
          >
            <FaKey className="text-sm" /> Change Password
          </button>
        </div>

        {/* 4 Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow border border-gray-200">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold tracking-wider uppercase mb-3">
              <FaUser className="text-amber-600" /> Username
            </div>
            <div className="text-base font-bold text-gray-800 truncate">
              {profile.email?.split('@')[0] || 'user'}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow border border-gray-200">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold tracking-wider uppercase mb-3">
              <FaEnvelope className="text-amber-600" /> Email
            </div>
            <div className="text-sm font-bold text-gray-800 truncate">
              {profile.email || 'N/A'}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow border border-gray-200">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold tracking-wider uppercase mb-3">
              <FaShieldAlt className="text-amber-600" /> Role
            </div>
            <span className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wide">
              {displayRole(role)}
            </span>
          </div>

          <div className="bg-white rounded-xl p-5 shadow border border-gray-200">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold tracking-wider uppercase mb-3">
              <FaCalendarAlt className="text-amber-600" /> Member Since
            </div>
            <div className="text-base font-bold text-gray-800">
              {formatDate(profile.createdAt)}
            </div>
          </div>
        </div>

        {/* Personal Details Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Personal Details</h2>
              <p className="text-gray-600 text-sm mt-1">
                Update your personal information below
              </p>
            </div>

            {editing ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-medium"
                >
                  <FaTimes className="text-sm" /> Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium shadow"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-50 border border-amber-600 text-amber-700 rounded-lg hover:bg-amber-100 font-medium"
              >
                <FaPencilAlt className="text-sm" /> Edit Profile
              </button>
            )}
          </div>

          {/* Profile Picture (Professionals only) */}
          {isProfessional && (
            <div className="flex items-center gap-5 mb-8 pb-8 border-b border-gray-200">
              <img
                src={profile.profilePicture || 'https://i.pravatar.cc/150?img=11'}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-4 border-amber-100"
              />
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-100 text-sm font-medium">
                <FaCamera className="text-xs" />
                {file ? file.name : 'Change Photo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="text-gray-400 text-xs" /> Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName || ''}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100 disabled:text-gray-600"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="text-gray-400 text-xs" /> Email (Read only)
                </label>
                <input
                  type="email"
                  value={profile.email || ''}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FaPhone className="text-gray-400 text-xs" /> Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone || ''}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Add your phone number"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100 disabled:text-gray-600"
                />
              </div>

              {isProfessional && (
                <>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <FaMapMarkerAlt className="text-gray-400 text-xs" /> Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={profile.location || ''}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <FaBriefcase className="text-gray-400 text-xs" /> Years of Experience
                    </label>
                    <input
                      type="number"
                      name="yearsExperience"
                      value={profile.yearsExperience || ''}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100 disabled:text-gray-600"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      📝 Bio
                    </label>
                    <textarea
                      name="bio"
                      rows="4"
                      value={profile.bio || ''}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none disabled:bg-gray-100 disabled:text-gray-600"
                    />
                  </div>
                </>
              )}

              {!isProfessional && !isAdmin && (
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FaMapMarkerAlt className="text-gray-400 text-xs" /> Address
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={profile.location || ''}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="Enter your address"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100 disabled:text-gray-600"
                  />
                </div>
              )}
            </div>

            {isProfessional && (
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <button
                  type="button"
                  onClick={() => navigate('/portfolio')}
                  className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 font-medium shadow"
                >
                  Manage My Portfolio
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>  
  );
};

export default Profile;