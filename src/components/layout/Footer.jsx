import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">🏠 HomeCraft</h3>
            <p className="text-gray-400">Connect with trusted construction professionals.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/professionals" className="text-gray-400 hover:text-white">Professionals</Link></li>
              <li><Link to="/projects" className="text-gray-400 hover:text-white">Projects</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">Email: support@homecraft.com</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
          <p>&copy; 2026 HomeCraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;