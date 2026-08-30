import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

const ProfessionalProfile = () => {
  const { id } = useParams();
  const [professional, setProfessional] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [projectId, setProjectId] = useState(''); // <--- NEW: User must enter a Project ID
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch professional
        const proResponse = await axios.get(`http://localhost:8080/api/professionals/${id}`);
        setProfessional(proResponse.data.data);

        // 2. Fetch portfolio
        const portfolioResponse = await axios.get(`http://localhost:8080/api/portfolio/professional/${id}`);
        setPortfolio(portfolioResponse.data.data);

        // 3. Fetch reviews
        const reviewResponse = await axios.get(`http://localhost:8080/api/reviews/professional/${id}`);
        setReviews(reviewResponse.data.data);

      } catch (error) {
        console.error("Error fetching professional:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!projectId) {
        setMessage('Please enter the Project ID you want to review.');
        return;
      }

      // Your backend requires /project/{projectId}
      await axios.post(`http://localhost:8080/api/reviews/project/${projectId}`, reviewForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage('Review submitted successfully!');
      setReviewForm({ rating: 5, comment: '' });
      setProjectId('');
      
      // Refresh reviews
      const reviewResponse = await axios.get(`http://localhost:8080/api/reviews/professional/${id}`);
      setReviews(reviewResponse.data.data);
    } catch (error) {
      setMessage('Failed to submit review. Make sure the project exists and is COMPLETED.');
    }
  };

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

        {/* Reviews Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Reviews & Ratings</h2>
          
          {message && <p className="text-green-600 mb-4">{message}</p>}

          {/* Leave a Review Form */}
          <form onSubmit={handleReviewSubmit} className="mb-8 border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Leave a Review</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Project ID</label>
              <input 
                type="number"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter the ID of a completed project (e.g., 1)"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className={`text-3xl ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
              <textarea 
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Share your experience..."
                required
              ></textarea>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Submit Review
            </button>
          </form>

          {/* Existing Reviews */}
          {reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet. Be the first to leave one!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400">{'★'.repeat(review.rating)}</span>
                    <span className="text-gray-600 text-sm">({review.rating}/5)</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                  <p className="text-gray-500 text-xs mt-2">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent'}</p>
                </div>
              ))}
            </div>
          )}
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