import toast from 'react-hot-toast';

// ============ SUCCESS ============
export const toastSuccess = (message, title = 'Success!') =>
  toast.success(message, { duration: 3000, icon: '✅' });

export const toastCreated = (item = 'Item') =>
  toast.success(`${item} created successfully!`, { duration: 3000, icon: '🎉' });

export const toastUpdated = (item = 'Item') =>
  toast.success(`${item} updated successfully!`, { duration: 3000, icon: '✏️' });

export const toastDeleted = (item = 'Item') =>
  toast.success(`${item} deleted successfully!`, { duration: 3000, icon: '🗑️' });

// ============ ERROR ============
export const toastError = (message) =>
  toast.error(message || 'Something went wrong. Please try again.', {
    duration: 4000,
    icon: '⚠️',
  });

export const toastNetworkError = () =>
  toast.error('Network problem. Please check your internet connection.', {
    duration: 4000,
    icon: '📡',
  });

export const toastAuthError = () =>
  toast.error('Your session has expired. Please log in again.', {
    duration: 4000,
    icon: '🔒',
  });

// ============ INFO ============
export const toastInfo = (message) =>
  toast(message, { duration: 3000, icon: 'ℹ️' });

export const toastLoading = (message = 'Loading...') =>
  toast.loading(message);

export const dismissToast = (id) => toast.dismiss(id);

// ============ SPECIFIC MESSAGES ============
export const toastBidSubmitted = () =>
  toast.success('Your bid was submitted! The client will review it soon.', {
    duration: 4000,
    icon: '🎯',
  });

export const toastBidAccepted = () =>
  toast.success('Bid accepted! The professional has been notified.', {
    duration: 4000,
    icon: '🤝',
  });

export const toastBidRejected = () =>
  toast.success('Bid rejected. The professional has been notified.', {
    duration: 3000,
    icon: '📭',
  });

export const toastProjectApproved = () =>
  toast.success('Project approved! Professionals can now see it.', {
    duration: 4000,
    icon: '✅',
  });

export const toastProjectRejected = () =>
  toast.success('Project rejected. The client has been notified.', {
    duration: 3000,
    icon: '🚫',
  });

export const toastProjectCompleted = () =>
  toast.success('Project marked as completed!', {
    duration: 4000,
    icon: '🎉',
  });

export const toastNotLoggedIn = () =>
  toast.error('Please log in to continue.', {
    duration: 3000,
    icon: '🔑',
  });

export const toastAccessDenied = () =>
  toast.error("You don't have permission to do that.", {
    duration: 3000,
    icon: '🚫',
  });