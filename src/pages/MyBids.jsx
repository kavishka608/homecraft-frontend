import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaDollarSign, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const MyBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/bids/my-bids', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBids(response.data || []);
      } catch (error) {
        console.error("Error fetching my bids:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [token]);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center text-2xl text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bids</h1>
          
          {bids.length === 0 ? (
            <p className="text-center text-gray-600 py-10">You haven't placed any bids yet.</p>
          ) : (
            <div className="space-y-4">
              {bids.map((bid) => (
                <div key={bid.id} className="bg-white rounded-xl shadow-lg p-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{bid.project.title}</h3>
                    <p className="text-gray-600 mb-2">{bid.message}</p>
                    <div className="flex gap-4 text-sm">
                      <p className="text-green-600 font-bold flex items-center gap-1">
                        <FaDollarSign /> ${bid.bidAmount}
                      </p>
                      <p className="text-gray-600 flex items-center gap-1">
                        <FaClock /> {bid.estimatedDays} days
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      bid.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                      bid.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {bid.status}
                    </span>
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

export default MyBids;