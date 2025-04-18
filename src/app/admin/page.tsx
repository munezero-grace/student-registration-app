"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../_components/Navbar';
import AdminDashboard from '../_components/AdminDashboard';
import { isAdmin, isAuthenticated } from '@/lib/services/authService';
import { useToast } from '../contexts/ToastContext';

export default function AdminPage() {
  const router = useRouter();
  const { showError } = useToast();
  
  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!isAuthenticated()) {
      showError('Please login to access this page');
      router.push('/login');
      return;
    }
    
    if (!isAdmin()) {
      showError('You do not have permission to access this page');
      router.push('/profile');
      return;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddUser = () => {
    router.push('/register');
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-blue-800 text-white">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
            <nav className="space-y-4">
              <a href="/admin" className="block px-4 py-2 rounded-md bg-blue-900 hover:bg-blue-700">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                  Dashboard
                </div>
              </a>
              <a href="/profile" className="block px-4 py-2 rounded-md hover:bg-blue-700">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  My Profile
                </div>
              </a>
              <button 
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('userRole');
                  router.push('/login');
                }}
                className="block w-full text-left px-4 py-2 rounded-md hover:bg-blue-700"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  Logout
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <AdminDashboard onAddUser={handleAddUser} />
        </div>
      </div>
    </>
  );
}