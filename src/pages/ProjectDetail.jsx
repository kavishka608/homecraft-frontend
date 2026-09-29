import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaDollarSign,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHourglassHalf,
  FaClipboardCheck,
} from 'react-icons/fa';
import api from '../services/api';
import ConfirmModal from '../components/common/ConfirmModal';
import {
  toastBidAccepted,
  toastBidRejected,
  toastProjectCompleted,
  toastError,
  toastNetworkError,
} from '../utils/toast';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: null,   // 'accept' | 'reject' | 'complete'
    bidId: null,
    title: '',
    message: '',
    confirmText: '',
    confirmColor: 'amber',
  });

  const role = localStorage.getItem('role') || '';
  const isClient = role === 'CLIENT' || role === 'HOMEOWNER';
  const isAdmin = role === 'ADMIN';

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [id]);

  const fetchData = async () => {
    try {
      const [projRes, bidsRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/bids/project/${id}`).catch(() => ({ data: { data: [] } })),
      ]);

      if (projRes.data.success) setProject(projRes.data.data);
      if (bidsRes.data.success) setBids(bidsRes.data.data);
    } catch (error) {
      console.error(error);
      if (!error.response) {
        toastNetworkError();
      } else {
        toastError('Could not load project details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ==================== ACTIONS ====================

  const askAccept = (bidId) => {
    setConfirmModal({
      open: true,
      type: 'accept',
      bidId,
      title: 'Accept this bid?',
      message:
        'The professional will be notified. All other pending bids will be automatically rejected.',
      confirmText: 'Yes, Accept',
      confirmColor: 'green',
    });
  };

  const askReject = (bidId) => {
    setConfirmModal({
      open: true,
      type: 'reject',
      bidId,
      title: 'Reject this bid?',
      message: 'The professional will be notified that their bid was not selected.',
      confirmText: 'Yes, Reject',
      confirmColor: 'red',
    });
  };

  const askComplete = () => {
    setConfirmModal({
      open: true,
      type: 'complete',
      bidId: null,
      title: 'Mark as completed?',
      message:
        'This will notify the professional and finalize the project. You can leave a review afterward.',
      confirmText: 'Yes, Complete',
      confirmColor: 'green',
    });
  };

  const closeConfirm = () => {
    setConfirmModal({ ...confirmModal, open: false, type: null, bidId: null });
  };

  const handleConfirmAction = async () => {
    const { type, bidId } = confirmModal;
    closeConfirm();

    if (type === 'accept') {
      setProcessing(bidId);
      try {
        await api.put(`/bids/${bidId}/accept`);
        toastBidAccepted();
        fetchData();
      } catch (error) {
        toastError(
          error.response?.data?.message ||
            'Could not accept this bid. Please try again.'
        );
      } finally {
        setProcessing(null);
      }
    } else if (type === 'reject') {
      setProcessing(bidId);
      try {
        await api.put(`/bids/${bidId}/reject`);
        toastBidRejected();
        fetchData();
      } catch (error) {
        toastError(
          error.response?.data?.message ||
            'Could not reject this bid. Please try again.'
        );
      } finally {
        setProcessing(null);
      }
    } else if (type === 'complete') {
      try {
        await api.put(`/projects/${id}/complete`);
        toastProjectCompleted();
        fetchData();
      } catch (error) {
        toastError('Could not complete this project. Please try again.');
      }
    }
  };

  // ==================== BADGES ====================

  const projectStatusBadge = (status, approved) => {
    if (status === 'CANCELLED') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
          Rejected by Admin
        </span>
      );
    }
    if (status === 'COMPLETED') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
          Completed
        </span>
      );
    }
    if (status === 'IN_PROGRESS') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
          In Progress
        </span>
      );
    }
    if (approved === true) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          Open
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
        Pending Approval
      </span>
    );
  };

  const bidStatusBadge = (status) => {
    if (status === 'ACCEPTED')
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          ✓ Accepted
        </span>
      );
    if (status === 'REJECTED')
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
          ✗ Rejected
        </span>
      );
    if (status === 'WITHDRAWN')
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
          Withdrawn
        </span>
      );
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
        Pending
      </span>
    );
  };

  // ==================== LOADING ====================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-lg">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-5xl mb-4">❌</div>
          <p className="text-gray-600 mb-6">Project not found</p>
          <Link
            to="/projects"
            className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const acceptedBid = bids.find((b) => b.status === 'ACCEPTED');

  // ==================== RENDER ====================

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 mb-6 transition font-medium"
        >
          <FaArrowLeft /> Back
        </button>

        {/* ============= PROJECT CARD ============= */}
        <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{project.title}</h1>
            {projectStatusBadge(project.status, project.approved)}
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {project.description}
          </p>

          {/* Info row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2 text-gray-700 bg-gray-50 rounded-lg p-3">
              <FaMapMarkerAlt className="text-amber-600" />
              <span className="text-sm">{project.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 bg-gray-50 rounded-lg p-3">
              <FaDollarSign className="text-amber-600" />
              <span className="text-sm">
                {project.budgetMin} – {project.budgetMax}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 bg-gray-50 rounded-lg p-3">
              <FaClock className="text-amber-600" />
              <span className="text-sm">{project.projectType}</span>
            </div>
          </div>

          {/* Pending admin warning */}
          {project.approved !== true && project.status !== 'CANCELLED' && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-lg flex items-center gap-2 mt-4">
              <FaClock />
              Waiting for admin approval before professionals can bid.
            </div>
          )}

          {/* Complete Project button */}
          {isClient && project.status === 'IN_PROGRESS' && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={askComplete}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 font-medium shadow transition"
              >
                <FaCheckCircle /> Mark as Completed
              </button>
            </div>
          )}
        </div>

        {/* ============= BIDS SECTION ============= */}
        <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaClipboardCheck className="text-amber-600" />
                {isClient || isAdmin ? 'Bids Received' : 'Bids'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {bids.length === 0
                  ? 'No bids yet.'
                  : `${bids.length} bid${bids.length > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          {bids.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-500">
                {isClient
                  ? 'No bids yet. Approved professionals will see your project soon.'
                  : 'No bids on this project yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bids.map((bid) => (
                <div
                  key={bid.id}
                  className={`border rounded-xl p-5 transition ${
                    bid.status === 'ACCEPTED'
                      ? 'border-green-300 bg-green-50/30'
                      : 'border-gray-200 hover:shadow-md'
                  }`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-lg">
                        {bid.professional?.fullName?.charAt(0)?.toUpperCase() || 'P'}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {bid.professional?.fullName || 'Professional'}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1.5">
                          <FaUser className="text-xs" />
                          {bid.professional?.professionalType || 'Professional'}
                        </div>
                      </div>
                    </div>
                    {bidStatusBadge(bid.status)}
                  </div>

                  {/* Bid amount + days */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-amber-50 rounded-lg p-4">
                      <div className="text-xs text-amber-700 uppercase font-semibold tracking-wide mb-1">
                        Bid Amount
                      </div>
                      <div className="text-2xl font-bold text-amber-800">
                        ${bid.bidAmount}
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-xs text-blue-700 uppercase font-semibold tracking-wide mb-1">
                        Estimated Time
                      </div>
                      <div className="text-2xl font-bold text-blue-800 flex items-center gap-2">
                        <FaHourglassHalf className="text-lg" />
                        {bid.estimatedDays} days
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  {bid.message && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">
                        Message from Professional
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {bid.message}
                      </p>
                    </div>
                  )}

                  {/* Contact info (revealed when accepted) */}
                  {bid.status === 'ACCEPTED' && (isClient || isAdmin) && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="text-xs text-green-700 uppercase font-semibold tracking-wide mb-2">
                        ✓ Contact Information
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-green-800">
                        <span className="inline-flex items-center gap-1.5">
                          <FaEnvelope className="text-xs" />
                          {bid.professional?.email || 'N/A'}
                        </span>
                        {bid.professional?.phone && (
                          <span className="inline-flex items-center gap-1.5">
                            <FaPhone className="text-xs" />
                            {bid.professional.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {isClient && bid.status === 'PENDING' && (
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => askAccept(bid.id)}
                        disabled={processing === bid.id}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 font-medium shadow transition disabled:opacity-50"
                      >
                        <FaCheckCircle />
                        {processing === bid.id ? 'Accepting...' : 'Accept Bid'}
                      </button>
                      <button
                        onClick={() => askReject(bid.id)}
                        disabled={processing === bid.id}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-red-600 font-medium shadow transition disabled:opacity-50"
                      >
                        <FaTimesCircle /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ============= ACCEPTED BID SUMMARY ============= */}
        {acceptedBid && isClient && project.status === 'IN_PROGRESS' && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-6">
            <div className="flex items-center gap-3 mb-3">
              <FaCheckCircle className="text-blue-600 text-xl" />
              <h3 className="font-bold text-blue-900">Project In Progress</h3>
            </div>
            <p className="text-sm text-blue-800">
              <strong>{acceptedBid.professional?.fullName}</strong> is working on this
              project for <strong>${acceptedBid.bidAmount}</strong> (
              {acceptedBid.estimatedDays} days).
            </p>
          </div>
        )}
      </div>

      {/* ============= CONFIRM MODAL ============= */}
      <ConfirmModal
        isOpen={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        confirmColor={confirmModal.confirmColor}
        onConfirm={handleConfirmAction}
        onCancel={closeConfirm}
      />
    </div>
  );
};

export default ProjectDetail;