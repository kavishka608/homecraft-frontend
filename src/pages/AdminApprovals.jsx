import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminApprovals = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingProfessionals = async () => {
      try {
        // Fetch all professionals from the backend
        const response = await axios.get('http://localhost:8080/api/admin/pending-professionals');
        
        // Keep only those with PENDING status
        const pending = response.data.filter(pro => pro.verificationStatus === 'PENDING');
        setProfessionals(pending);
      } catch (error) {
        console.error("Error fetching professionals:", error);
        setProfessionals([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchPendingProfessionals();
  }, []);

  const handleApprove = async (professionalId) => {
    try {
      await axios.put(`http://localhost:8080/api/admin/approve/${professionalId}`);
      alert("Professional approved!");
      // Refresh the list
      const response = await axios.get('http://localhost:8080/api/admin/pending-professionals');
      setProfessionals(response.data.filter(pro => pro.verificationStatus === 'PENDING'));
    } catch (error) {
      alert("Failed to approve. Check backend connection.");
    }
  };

  const handleReject = async (professionalId) => {
    try {
      await axios.put(`http://localhost:8080/api/admin/reject/${professionalId}`);
      alert("Professional rejected!");
      // Refresh the list
      const response = await axios.get('http://localhost:8080/api/admin/pending-professionals');
      setProfessionals(response.data.filter(pro => pro.verificationStatus === 'PENDING'));
    } catch (error) {
      alert("Failed to reject. Check backend connection.");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center text-2xl text-gray-500">Loading Approvals...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Pending Professional Approvals</h1>

        {professionals.length === 0 ? (
          <p className="text-gray-600 text-center py-10">No pending approvals. All caught up!</p>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Profession</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {professionals.map((pro) => (
                  <tr key={pro.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{pro.fullName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{pro.email}</td>
                    <td className="px-6 py-4 text-sm text-blue-600">{pro.professionalType}</td>
                    <td className="px-6 py-4 text-sm">
                      <button 
                        onClick={() => handleApprove(pro.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(pro.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApprovals;