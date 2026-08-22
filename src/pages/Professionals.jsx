import React from 'react';
import { FaStar, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

const Professionals = () => {
  // Dummy data (We will replace this with data from your backend later!)
  const professionals = [
    {
      id: 1,
      name: "John Silva",
      profession: "Master Mason",
      location: "Colombo",
      rating: 4.8,
      reviews: 120,
      image: "https://i.pravatar.cc/150?img=11" // Placeholder image
    },
    {
      id: 2,
      name: "Sarah Fernando",
      profession: "Electrician",
      location: "Kandy",
      rating: 4.9,
      reviews: 85,
      image: "https://i.pravatar.cc/150?img=5"
    },
    {
      id: 3,
      name: "David Perera",
      profession: "Carpenter",
      location: "Galle",
      rating: 4.6,
      reviews: 64,
      image: "https://i.pravatar.cc/150?img=12"
    },
    {
      id: 4,
      name: "Michael Johnson",
      profession: "Plumber",
      location: "Negombo",
      rating: 4.7,
      reviews: 98,
      image: "https://i.pravatar.cc/150?img=3"
    },
    {
      id: 5,
      name: "Emily Wickram",
      profession: "Painter",
      location: "Colombo",
      rating: 4.5,
      reviews: 50,
      image: "https://i.pravatar.cc/150?img=9"
    },
    {
      id: 6,
      name: "Ravi Kumar",
      profession: "Architect",
      location: "Kandy",
      rating: 5.0,
      reviews: 150,
      image: "https://i.pravatar.cc/150?img=13"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Our Professionals</h1>
        <p className="text-center text-gray-600 mb-12">Connect with verified experts for your next project.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {professionals.map((pro) => (
            <div key={pro.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden">
              {/* Profile Image */}
              <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
                <img 
                  src={pro.image} 
                  alt={pro.name} 
                  className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
                />
              </div>

              {/* Info */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{pro.name}</h3>
                <p className="text-blue-600 font-semibold mb-2">{pro.profession}</p>
                
                <div className="flex justify-center items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center">
                    <FaMapMarkerAlt className="mr-1 text-red-500" /> {pro.location}
                  </span>
                  <span className="flex items-center">
                    <FaStar className="mr-1 text-yellow-400" /> {pro.rating} ({pro.reviews})
                  </span>
                </div>

                {/* Actions */}
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
      </div>
    </div>
  );
};

export default Professionals;