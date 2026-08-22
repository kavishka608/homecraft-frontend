import React from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "Modern Villa Renovation",
      location: "Colombo",
      budget: "$25,000",
      date: "2026-08-10",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      status: "In Progress"
    },
    {
      id: 2,
      title: "Commercial Office Build",
      location: "Kandy",
      budget: "$80,000",
      date: "2026-07-22",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      status: "Completed"
    },
    {
      id: 3,
      title: "Coastal Home Construction",
      location: "Galle",
      budget: "$45,000",
      date: "2026-09-01",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      status: "Pending"
    },
    {
      id: 4,
      title: "Eco-Friendly House Project",
      location: "Negombo",
      budget: "$35,000",
      date: "2026-08-20",
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      status: "In Progress"
    },
    {
      id: 5,
      title: "Industrial Warehouse",
      location: "Kurunegala",
      budget: "$120,000",
      date: "2026-06-15",
      image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      status: "Completed"
    },
    {
      id: 6,
      title: "Restaurant Interior Fit-out",
      location: "Colombo",
      budget: "$18,000",
      date: "2026-09-10",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      status: "Pending"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Ongoing & Completed Projects</h1>
        <p className="text-center text-gray-600 mb-12">Browse through our latest construction work.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden">
              <div className="h-48 relative">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${
                  project.status === 'Completed' ? 'bg-green-500 text-white' : 
                  project.status === 'In Progress' ? 'bg-blue-500 text-white' : 
                  'bg-yellow-500 text-white'
                }`}>
                  {project.status}
                </span>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                <div className="space-y-2 text-gray-600">
                  <p className="flex items-center gap-2 text-sm">
                    <FaMapMarkerAlt className="text-red-500" /> {project.location}
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <FaDollarSign className="text-green-600" /> Budget: {project.budget}
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <FaCalendarAlt className="text-blue-500" /> Start Date: {project.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;