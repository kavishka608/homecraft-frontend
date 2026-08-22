import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaHandshake, FaStar, FaShieldAlt } from 'react-icons/fa';

const Home = () => {
  const features = [
    {
      icon: FaSearch,
      title: 'Find Professionals',
      description: 'Browse and search for verified construction professionals in your area.'
    },
    {
      icon: FaHandshake,
      title: 'Get Quotes',
      description: 'Receive competitive bids from multiple professionals for your project.'
    },
    {
      icon: FaStar,
      title: 'Quality Assurance',
      description: 'Read reviews and ratings from other homeowners to make informed decisions.'
    },
    {
      icon: FaShieldAlt,
      title: 'Secure Platform',
      description: 'Your transactions and data are protected with industry-standard security.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🏠 Find the Best Construction Professionals
          </h1>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Connect with trusted planners, masons, painters, carpenters, and electricians for your home projects.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/professionals" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
              Browse Professionals
            </Link>
            <Link to="/register" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose HomeCraft?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-2xl mb-4">
                    <Icon />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;