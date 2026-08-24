import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PortfolioUpload = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  // Fetch My Portfolio on load
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/portfolio/my-portfolio', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Backend wraps data in response.data.data
        setPortfolio(response.data.data);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [token]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    // Create FormData for backend @ModelAttribute
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('projectType', projectType);
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8080/api/portfolio', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setMessage('Portfolio item uploaded successfully!');
      // Add the new item to the list
      setPortfolio([...portfolio, response.data.data]);
      
      // Reset form
      setTitle('');
      setDescription('');
      setProjectType('');
      setFile(null);
    } catch (error) {
      console.error("Error uploading:", error);
      setMessage('Failed to upload. Check if you are logged in as a Professional.');
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8080/api/portfolio/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPortfolio(portfolio.filter(item => item.id !== itemId));
      setMessage('Portfolio item deleted successfully!');
    } catch (error) {
      setMessage('Failed to delete.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center text-2xl text-gray-500">Loading Portfolio...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">My Portfolio</h1>
          
          {message && <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4">{message}</div>}

          {/* Upload Form */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Upload New Project</h2>
            <form onSubmit={handleUpload} encType="multipart/form-data">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                  <select value={projectType} onChange={(e) => setProjectType(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                    <option value="">Select Type</option>
                    <option value="NEW_CONSTRUCTION">New Construction</option>
                    <option value="RENOVATION">Renovation</option>
                    <option value="FINISHING">Finishing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Image</label>
                <input type="file" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
              </div>

              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Upload
              </button>
            </form>
          </div>

          {/* Display Portfolio */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portfolio.length === 0 ? (
              <p className="text-gray-600">No portfolio items yet.</p>
            ) : (
              portfolio.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden relative">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="text-xs text-blue-600 mt-2">{item.projectType}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioUpload;