'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Toast type definitions
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
  removeToast: (id: string) => void;
}

// Create the context with a default value
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Custom hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Props for the ToastProvider component
interface ToastProviderProps {
  children: ReactNode;
}

// Toast Provider component
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Generate a unique ID for each toast
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Add a new toast
  const addToast = (message: string, type: ToastType) => {
    const id = generateId();
    const toast = { id, message, type };
    setToasts((prevToasts) => [...prevToasts, toast]);

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);

    return id;
  };

  // Remove a toast by ID
  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  // Convenience methods for different toast types
  const showSuccess = (message: string) => addToast(message, 'success');
  const showError = (message: string) => addToast(message, 'error');
  const showInfo = (message: string) => addToast(message, 'info');
  const showWarning = (message: string) => addToast(message, 'warning');

  // The context value
  const contextValue: ToastContextType = {
    toasts,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    removeToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Toast container - fixed position at the top-right */}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`px-4 py-3 rounded-md shadow-md flex justify-between items-center min-w-[300px] animate-fade-in ${
                toast.type === 'success'
                  ? 'bg-green-100 text-green-800 border-l-4 border-green-500'
                  : toast.type === 'error'
                  ? 'bg-red-100 text-red-800 border-l-4 border-red-500'
                  : toast.type === 'warning'
                  ? 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500'
                  : 'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
              }`}
            >
              <p className="text-sm font-medium">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-3 text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export default ToastContext;
