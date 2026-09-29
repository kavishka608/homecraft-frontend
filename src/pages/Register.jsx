import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaMapMarkerAlt,
  FaBriefcase,
} from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';
import { toastError, toastNetworkError } from '../utils/toast';

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
    location: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ============ Sri Lankan Phone Validation ============
  const validatePhone = (phone) => {
    const cleaned = phone.replace(/[\s-]/g, '');
    const pattern = /^(07\d{8}|\+947\d{8})$/;
    return pattern.test(cleaned);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ===== PHONE — strict input control =====
    if (name === 'phone') {
      // Only allow digits, +, spaces, dashes
      const cleaned = value.replace(/[^\d+\s-]/g, '');
      const digitsOnly = cleaned.replace(/\D/g, '');

      // Max digits: 10 local (07...), 11 for +94 (with country code)
      const startsWithPlus94 = cleaned.startsWith('+94');
      const maxDigits = startsWithPlus94 ? 11 : 10;

      // BLOCK: ignore the keystroke if it exceeds the limit
      if (digitsOnly.length > maxDigits) {
        return;
      }

      setFormData({ ...formData, phone: cleaned });
      if (errors.phone) setErrors({ ...errors, phone: '' });
      return;
    }

    // ===== OTHER FIELDS =====
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const e = {};

    if (!formData.fullName.trim()) e.fullName = 'Please enter your full name.';
    else if (formData.fullName.trim().length < 3)
      e.fullName = 'Name must be at least 3 characters.';

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) e.email = 'Please enter your email.';
    else if (!emailPattern.test(formData.email))
      e.email = 'Enter a valid email address.';

    if (!formData.phone.trim()) e.phone = 'Please enter your phone number.';
    else if (!validatePhone(formData.phone))
      e.phone = 'Enter a valid Sri Lankan number (e.g., 0711234567).';

    if (!formData.password) e.password = 'Please create a password.';
    else if (formData.password.length < 6)
      e.password = 'Password must be at least 6 characters.';

    if (formData.role === 'PROFESSIONAL') {
      if (!formData.professionalType)
        e.professionalType = 'Please select your profession.';
      if (!formData.yearsExperience)
        e.yearsExperience = 'Please enter your experience.';
      if (!formData.location.trim())
        e.location = 'Please enter your location.';
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
      const payload = { ...formData };

      // Remove professional fields if HOMEOWNER
      if (payload.role === 'HOMEOWNER') {
        delete payload.professionalType;
        delete payload.yearsExperience;
        delete payload.bio;
        delete payload.location;
      }

      // Normalize phone and email
      payload.phone = payload.phone.replace(/[\s-]/g, '');
      payload.email = payload.email.trim().toLowerCase();
      payload.fullName = payload.fullName.trim();

      const response = await api.post('/auth/register', payload);

      if (response.data.success) {
        const { token, userId, email, fullName, role } = response.data.data;

        // Auto-login
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('email', email);
        localStorage.setItem('fullName', fullName);
        localStorage.setItem('role', role);

        toast.success('Welcome to HomeCraft! 🎉', { duration: 3000 });

        setTimeout(() => {
          if (role === 'PROFESSIONAL') {
            navigate('/portfolio');
          } else {
            navigate('/projects');
          }
        }, 800);
      }
    } catch (error) {
      console.error('Registration error:', error);

      if (!error.response) {
        toastNetworkError();
      } else {
        const msg = error.response?.data?.message || '';

        if (msg.toLowerCase().includes('already')) {
          toastError('This email is already registered. Try logging in instead.');
        } else if (msg.toLowerCase().includes('valid')) {
          toastError('Please check your details and try again.');
        } else {
          toastError('Registration failed. Please try again.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const phoneDigits = formData.phone.replace(/\D/g, '').length;
  const isPhoneValid = phoneDigits === 10;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-8">Join HomeCraft today</p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.fullName
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-amber-500'
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1.5">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.email
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-amber-500'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
            )}
          </div>

          {/* Phone — Sri Lankan (10 digits max) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
              <span className="text-xs text-gray-400 ml-2">(Sri Lankan)</span>
            </label>
            <div className="relative">
              <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0711234567"
                className={`w-full pl-11 pr-16 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.phone
                    ? 'border-red-300 focus:ring-red-500'
                    : isPhoneValid
                    ? 'border-green-300 focus:ring-green-500'
                    : 'border-gray-300 focus:ring-amber-500'
                }`}
              />
              <span
                className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold ${
                  isPhoneValid
                    ? 'text-green-600'
                    : phoneDigits > 10
                    ? 'text-red-600'
                    : 'text-gray-400'
                }`}
              >
                {phoneDigits}/10
              </span>
            </div>
            {errors.phone ? (
              <p className="text-red-500 text-xs mt-1.5">{errors.phone}</p>
            ) : isPhoneValid ? (
              <p className="text-green-600 text-xs mt-1.5 font-medium">
                ✓ Valid phone number
              </p>
            ) : (
              <p className="text-gray-400 text-xs mt-1.5">
                Format: 07X XXX XXXX ({phoneDigits}/10 digits)
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.password
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-amber-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I am a...
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="HOMEOWNER"
                  checked={formData.role === 'HOMEOWNER'}
                  onChange={handleChange}
                  className="w-4 h-4 accent-amber-600"
                />
                <span className="text-sm text-gray-700">Homeowner</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="PROFESSIONAL"
                  checked={formData.role === 'PROFESSIONAL'}
                  onChange={handleChange}
                  className="w-4 h-4 accent-amber-600"
                />
                <span className="text-sm text-gray-700">Professional</span>
              </label>
            </div>
          </div>

          {/* Professional Fields */}
          {formData.role === 'PROFESSIONAL' && (
            <div className="space-y-4 border-t border-gray-200 pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profession Type
                </label>
                <div className="relative">
                  <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <select
                    name="professionalType"
                    value={formData.professionalType}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 appearance-none transition ${
                      errors.professionalType
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-amber-500'
                    }`}
                  >
                    <option value="">Select Profession</option>
                    <option value="PLANNER">Planner</option>
                    <option value="MASON">Mason</option>
                    <option value="PAINTER">Painter</option>
                    <option value="CARPENTER">Carpenter</option>
                    <option value="ELECTRICIAN">Electrician</option>
                  </select>
                </div>
                {errors.professionalType && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.professionalType}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="yearsExperience"
                  value={formData.yearsExperience}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g. 5"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.yearsExperience
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-amber-500'
                  }`}
                />
                {errors.yearsExperience && (
                  <p className="text-red-500 text-xs mt-1.5">
                    {errors.yearsExperience}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Tell us about your work..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

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
                    placeholder="e.g. Colombo"
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
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-600 font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;