/**
 * Notification Utilities
 * Provides reusable notification patterns for common actions
 */

import { toast } from "sonner";

/**
 * Success notifications for common actions
 */
export const notify = {
  // CRUD Operations
  created: (itemType: string, itemName?: string) => {
    const message = itemName 
      ? `${itemType} "${itemName}" created successfully`
      : `${itemType} created successfully`;
    toast.success(message);
  },

  updated: (itemType: string, itemName?: string) => {
    const message = itemName 
      ? `${itemType} "${itemName}" updated successfully`
      : `${itemType} updated successfully`;
    toast.success(message);
  },

  deleted: (itemType: string, itemName?: string) => {
    const message = itemName 
      ? `${itemType} "${itemName}" deleted successfully`
      : `${itemType} deleted successfully`;
    toast.success(message);
  },

  // Bulk Operations
  bulkAction: (action: string, count: number, itemType: string) => {
    toast.success(`${action} ${count} ${itemType}${count > 1 ? 's' : ''}`);
  },

  // Export Operations
  exported: (count: number, itemType: string, format: string = 'CSV') => {
    toast.success(`Successfully exported ${count} ${itemType}${count > 1 ? 's' : ''} to ${format}`);
  },

  // Status Changes
  statusChanged: (itemType: string, newStatus: string, count: number = 1) => {
    const message = count > 1
      ? `Updated ${count} ${itemType}s to ${newStatus}`
      : `${itemType} status changed to ${newStatus}`;
    toast.success(message);
  },

  // Approvals
  approved: (itemType: string, itemName?: string) => {
    const message = itemName 
      ? `${itemType} for ${itemName} approved`
      : `${itemType} approved`;
    toast.success(message);
  },

  rejected: (itemType: string, itemName?: string) => {
    const message = itemName 
      ? `${itemType} for ${itemName} rejected`
      : `${itemType} rejected`;
    toast.success(message);
  },

  // Saved States
  saved: (itemType: string = "Changes") => {
    toast.success(`${itemType} saved`);
  },

  savedAsDraft: (itemType: string) => {
    toast.success(`${itemType} saved as draft`);
  },

  // File Operations
  fileUploaded: (fileName: string) => {
    toast.success(`File "${fileName}" uploaded successfully`);
  },

  fileDeleted: (fileName: string) => {
    toast.success(`File "${fileName}" deleted`);
  },
};

/**
 * Error notifications for common scenarios
 */
export const notifyError = {
  generic: (action?: string) => {
    const message = action 
      ? `Failed to ${action}. Please try again.`
      : "An error occurred. Please try again.";
    toast.error(message);
  },

  network: () => {
    toast.error("Network error. Please check your connection and try again.");
  },

  notFound: (itemType: string) => {
    toast.error(`${itemType} not found`);
  },

  unauthorized: () => {
    toast.error("You don't have permission to perform this action");
  },

  validation: (message: string) => {
    toast.error(message);
  },

  timeout: () => {
    toast.error("Request timed out. Please try again.");
  },
};

/**
 * Info notifications
 */
export const notifyInfo = {
  loading: (message: string = "Loading...") => {
    return toast.loading(message);
  },

  info: (message: string) => {
    toast.info(message);
  },

  noData: (itemType: string) => {
    toast.info(`No ${itemType} found`);
  },

  comingSoon: (feature: string) => {
    toast.info(`${feature} coming soon!`);
  },
};

/**
 * Warning notifications
 */
export const notifyWarning = {
  warning: (message: string) => {
    toast.warning(message);
  },

  unsavedChanges: () => {
    toast.warning("You have unsaved changes");
  },

  confirm: (message: string) => {
    toast.warning(message);
  },
};

/**
 * Promise-based notifications for async operations
 */
export const notifyPromise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  }
): void => {
  toast.promise(promise, messages);
};

/**
 * Custom notification with action button
 */
export const notifyWithAction = (
  message: string,
  actionLabel: string,
  onAction: () => void
) => {
  toast(message, {
    action: {
      label: actionLabel,
      onClick: onAction,
    },
  });
};

/**
 * Dismiss a specific toast by ID
 */
export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};

/**
 * Dismiss all toasts
 */
export const dismissAllToasts = () => {
  toast.dismiss();
};
