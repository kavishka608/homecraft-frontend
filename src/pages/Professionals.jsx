import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- ADD THIS
import { FaStar, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import axios from 'axios';

const Professionals = () => {
  const navigate = useNavigate(); // <--- ADD THIS
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/professionals');
        
        // 1. Get the actual data from your backend
        const allPros = response.data.data; 
        
        // 2. ONLY show APPROVED professionals (Admin Approval Workflow)
        const approvedPros = allPros.filter(pro => pro.verificationStatus === 'APPROVED');
        
        setProfessionals(approvedPros);
        
      } catch (err) {
        console.error("Error fetching professionals:", err);
        setError("Could not load from database.");
        setProfessionals([]); // NO dummy data, just an empty array
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center text-2xl text-gray-500">Loading Professionals...</div>;
  }

  // If error or empty list
  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Our Professionals</h1>
        <p className="text-orange-500 mb-4">{error}</p>
        <p className="text-gray-600">Please make sure your backend is running on port 8080.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Our Professionals</h1>
        <p className="text-center text-gray-600 mb-12">Connect with verified experts for your next project.</p>

        {professionals.length === 0 ? (
          <p className="text-center text-gray-600 py-10">No verified professionals available yet. Please check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {professionals.map((pro) => (
              <div 
                key={pro.id} 
                onClick={() => navigate(`/professionals/${pro.id}`)} // <--- ADD THIS onClick
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer"
              >
                <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
                  {/* Use the profilePicture from the backend if it exists */}
                  <img 
                    src={pro.profilePicture || "https://i.pravatar.cc/150?img=11"} 
                    alt={pro.fullName} 
                    className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
                  />
                </div>

                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{pro.fullName}</h3>
                  <p className="text-blue-600 font-semibold mb-2">{pro.professionalType}</p>
                  
                  <div className="flex justify-center items-center space-x-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center">
                      <FaMapMarkerAlt className="mr-1 text-red-500" /> {pro.location || "Unknown"}
                    </span>
                    <span className="flex items-center">
                      <FaStar className="mr-1 text-yellow-400" /> {pro.ratingAverage || "New"} ({pro.totalReviews || 0})
                    </span>
                  </div>

                  <div className="flex justify-center gap-3">
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                      <FaEnvelope /> Contact
                    </button>
                    <button className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
                      <FaPhone /> Call
                    </button>
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

export default Professionals;