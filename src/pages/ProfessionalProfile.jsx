import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

const ProfessionalProfile = () => {
  const { id } = useParams();
  const [professional, setProfessional] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch the professional details
        const proResponse = await axios.get(`http://localhost:8080/api/professionals/${id}`);
        setProfessional(proResponse.data.data);

        // 2. Fetch their portfolio (using the public endpoint)
        const portfolioResponse = await axios.get(`http://localhost:8080/api/portfolio/professional/${id}`);
        setPortfolio(portfolioResponse.data.data);
        
      } catch (error) {
        console.error("Error fetching professional:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center text-2xl text-gray-500">Loading Profile...</div>;
  }

  if (!professional) {
    return <div className="min-h-screen flex justify-center items-center text-2xl text-gray-500">Professional not found.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <Link to="/professionals" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-8">
          <FaArrowLeft /> Back to Professionals
        </Link>

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img 
              src={professional.profilePicture || "https://i.pravatar.cc/150?img=11"} 
              alt={professional.fullName} 
              className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
            />
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-1">{professional.fullName}</h1>
              <p className="text-blue-600 font-semibold text-lg mb-2">{professional.professionalType}</p>
              
              <div className="flex flex-col md:flex-row gap-4 text-gray-600">
                <span className="flex items-center justify-center md:justify-start gap-2">
                  <FaMapMarkerAlt className="text-red-500" /> {professional.location}
                </span>
                <span className="flex items-center justify-center md:justify-start gap-2">
                  <FaStar className="text-yellow-400" /> {professional.ratingAverage} ({professional.totalReviews} Reviews)
                </span>
                <span className="flex items-center justify-center md:justify-start gap-2">
                  <FaEnvelope className="text-blue-500" /> {professional.email}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-2">About</h2>
            <p className="text-gray-600">{professional.bio || "This professional hasn't added a bio yet."}</p>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Portfolio & Past Projects</h2>
          
          {portfolio.length === 0 ? (
            <p className="text-gray-600">No portfolio items uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {portfolio.map((item) => (
                <div key={item.id} className="rounded-lg overflow-hidden border border-gray-200">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="text-xs text-blue-600 mt-2">{item.projectType}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;