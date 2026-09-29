import React from 'react';
import { FaExclamationTriangle, FaCheck, FaTimes } from 'react-icons/fa';

const ConfirmModal = ({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'red', // 'red' | 'amber' | 'green' | 'blue'
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const colorClasses = {
    red: 'bg-red-600 hover:bg-red-700',
    amber: 'bg-amber-600 hover:bg-amber-700',
    green: 'bg-green-600 hover:bg-green-700',
    blue: 'bg-blue-600 hover:bg-blue-700',
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
            confirmColor === 'red'
              ? 'bg-red-100'
              : confirmColor === 'amber'
              ? 'bg-amber-100'
              : 'bg-green-100'
          }`}
        >
          <FaExclamationTriangle
            className={`text-2xl ${
              confirmColor === 'red'
                ? 'text-red-600'
                : confirmColor === 'amber'
                ? 'text-amber-600'
                : 'text-green-600'
            }`}
          />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-gray-600 text-center text-sm mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
          >
            <FaTimes className="text-sm" />
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-white rounded-lg font-medium shadow transition ${colorClasses[confirmColor]}`}
          >
            <FaCheck className="text-sm" />
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;