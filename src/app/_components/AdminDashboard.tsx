import React, { useState, useEffect, useCallback } from 'react';
import { Search, Edit, Trash2, X, Check, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import userService from '@/lib/services/userService';
import { useToast } from '../contexts/ToastContext';
import SkeletonLoader from './SkeletonLoader';

interface AdminDashboardProps {
  onAddUser?: () => void;
}

const AdminDashboard = ({ onAddUser }: AdminDashboardProps) => {
  // Get toast functions
  const { showSuccess, showError, showInfo } = useToast();
  
  // State for users data
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0
  });

  // State for search, filters, and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    role: ''
  });

  // Fetch users data from API with useCallback to prevent unnecessary re-renders
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      // Prepare params for API call
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        role: roleFilter,
        sortBy: sortConfig.key === 'name' ? 'firstName' : sortConfig.key,
        sortOrder: sortConfig.direction === 'ascending' ? 'asc' : 'desc'
      };
      
      // Call the API
      const response = await userService.getAll(params);
      
      console.log('User data received:', response);
      
      // If backend supports pagination
      if (response.pagination) {
        setUsers(response.data);
        setPagination({
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages
        });
      } else if (Array.isArray(response)) {
        // If response is a direct array (common in mock data or simple APIs)
        setUsers(response);
        setPagination(prev => ({
          ...prev,
          total: response.length,
          totalPages: Math.ceil(response.length / prev.limit)
        }));
      } else {
        // Fallback for any other response format
        console.warn('Unexpected response format:', response);
        setUsers([]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users. Please try again later.');
      showError('Failed to load users: ' + (err.response?.data?.error || err.message || 'Server error'));
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm, roleFilter, sortConfig, showError]); // Dependencies for useCallback

  // Initial fetch on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // fetchUsers is now stabilized with useCallback
  
  // Re-fetch when search, filter or sort changes (with debounce for search)
  useEffect(() => {
    // Avoid the second useEffect trigger as it's now handled by the fetchUsers dependency
    if (searchTerm !== '' || roleFilter !== '' || sortConfig.key !== 'createdAt') {
      const timer = setTimeout(() => {
        if (pagination.page === 1) {
          // No need to call fetchUsers here since change in dependencies will trigger it
        } else {
          // Reset to page 1 when filter/search changes
          setPagination(prev => ({ ...prev, page: 1 }));
        }
      }, 500); // Debounce search/filter by 500ms
      
      return () => clearTimeout(timer);
    }
  }, [searchTerm, roleFilter, sortConfig, pagination.page]); // Keep this useEffect separate for debouncing

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Sorting function (client-side if server doesn't support it)
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Handle pagination
  const handlePageChange = (pageNumber) => {
    setPagination(prev => ({ ...prev, page: pageNumber }));
  };

  // Handle edit modal
  const openEditModal = (user) => {
    setEditingUser(user);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      role: user.role
    });
    setIsEditModalOpen(true);
  };

  // Handle edit form input changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle user update
  const handleUpdateUser = async () => {
    try {
      // Show loading message
      showInfo(`Updating user information...`);
      
      // Make API call to update user
      await userService.update(editingUser.id, editFormData);
      
      // Update local state
      const updatedUsers = users.map(user => {
        if (user.id === editingUser.id) {
          return { ...user, ...editFormData };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      setIsEditModalOpen(false);
      setEditingUser(null);
      
      // Show success message
      showSuccess(`User ${editFormData.firstName} ${editFormData.lastName} updated successfully`);
      
      // Refresh the list to get latest data
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      
      // Handle different error cases
      if (error.response) {
        if (error.response.status === 404) {
          showError('User not found. They may have been deleted.');
        } else if (error.response.status === 403) {
          showError('Permission denied. You do not have rights to update this user.');
        } else if (error.response.status === 400) {
          showError(`Validation error: ${error.response.data.error || 'Please check the form fields.'}`);
        } else {
          showError(`Error: ${error.response.data.error || 'Failed to update user'}`);
        }
      } else {
        showError('Network error. Please try again later.');
      }
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    try {
      // Show loading toast
      showInfo(`Deleting user ${userToDelete.firstName} ${userToDelete.lastName}...`);
      
      // Make API call to delete user
      await userService.delete(userToDelete.id);
      
      // Close modal
      setShowDeleteModal(false);
      setUserToDelete(null);
      
      // Show success message
      showSuccess(`User ${userToDelete.firstName} ${userToDelete.lastName} deleted successfully`);
      
      // Refresh the list to get latest data
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      
      // Handle error cases
      if (error.response) {
        if (error.response.status === 404) {
          showError('User not found. They may have already been deleted.');
        } else if (error.response.status === 403) {
          showError('Permission denied. You do not have rights to delete this user.');
        } else {
          showError(`Error: ${error.response?.data?.error || 'Failed to delete user'}`);
        }
      } else if (error.request) {
        // Request was made but no response received
        showError('Network error. Server is not responding. Please try again later.');
      } else {
        // Error in setting up the request
        showError('Error preparing request. Please try again later.');
      }
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Show loading indicator
  if (loading && users.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Student Registration System</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={onAddUser}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2"
            >
              <Plus size={18} />
              <span>Add New User</span>
            </button>
          </div>
        </div>
        <SkeletonLoader rows={5} />
      </div>
    );
  }

  // Show error message
  if (error && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => fetchUsers()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Student Registration System</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={onAddUser}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="w-full md:w-1/2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Users</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email or registration number..."
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/4">
            <label htmlFor="roleFilter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Role</label>
            <select
              id="roleFilter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="student">Student</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('name')}
                >
                  <div className="flex items-center gap-1">
                    <span>Name</span>
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'ascending' 
                        ? <ChevronUp size={14} /> 
                        : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('email')}
                >
                  <div className="flex items-center gap-1">
                    <span>Email</span>
                    {sortConfig.key === 'email' && (
                      sortConfig.direction === 'ascending' 
                        ? <ChevronUp size={14} /> 
                        : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('registrationNumber')}
                >
                  <div className="flex items-center gap-1">
                    <span>Registration #</span>
                    {sortConfig.key === 'registrationNumber' && (
                      sortConfig.direction === 'ascending' 
                        ? <ChevronUp size={14} /> 
                        : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('dateOfBirth')}
                >
                  <div className="flex items-center gap-1">
                    <span>Age</span>
                    {sortConfig.key === 'dateOfBirth' && (
                      sortConfig.direction === 'ascending' 
                        ? <ChevronUp size={14} /> 
                        : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('role')}
                >
                  <div className="flex items-center gap-1">
                    <span>Role</span>
                    {sortConfig.key === 'role' && (
                      sortConfig.direction === 'ascending' 
                        ? <ChevronUp size={14} /> 
                        : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('createdAt')}
                >
                  <div className="flex items-center gap-1">
                    <span>Registered On</span>
                    {sortConfig.key === 'createdAt' && (
                      sortConfig.direction === 'ascending' 
                        ? <ChevronUp size={14} /> 
                        : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.registrationNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{calculateAge(user.dateOfBirth)} years</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {user.role === 'admin' ? 'Admin' : 'Student'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button 
                          onClick={() => openEditModal(user)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                          aria-label="Edit user"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(user)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          aria-label="Delete user"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    {loading ? 'Loading users...' : 'No users found matching your search criteria.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {users.length > 0 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                Showing <span className="font-medium">{users.length === 0 ? 0 : 1}</span> to{' '}
                <span className="font-medium">{users.length}</span>{' '}
                of <span className="font-medium">{pagination.total || users.length}</span> results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`px-3 py-1 rounded-md ${
                    pagination.page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(pagination.totalPages || 1, 5) }).map((_, index) => {
                  // Calculate page numbers to display (show current page and neighbors)
                  let pageNum;
                  const totalPages = pagination.totalPages || 1;
                  
                  if (totalPages <= 5) {
                    // If 5 or fewer total pages, show all
                    pageNum = index + 1;
                  } else if (pagination.page <= 3) {
                    // At the beginning
                    pageNum = index + 1;
                  } else if (pagination.page >= totalPages - 2) {
                    // At the end
                    pageNum = totalPages - 4 + index;
                  } else {
                    // In the middle
                    pageNum = pagination.page - 2 + index;
                  }
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded-md ${
                        pagination.page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {pagination.totalPages > 5 && pagination.page < pagination.totalPages - 2 && (
                  <span className="self-center">...</span>
                )}
                {pagination.totalPages > 5 && pagination.page < pagination.totalPages - 2 && (
                  <button
                    onClick={() => handlePageChange(pagination.totalPages)}
                    className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                  >
                    {pagination.totalPages}
                  </button>
                )}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === (pagination.totalPages || 1)}
                  className={`px-3 py-1 rounded-md ${
                    pagination.page === (pagination.totalPages || 1)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit User</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={editFormData.firstName}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={editFormData.lastName}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={editFormData.email}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  id="dateOfBirth"
                  value={editFormData.dateOfBirth}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  id="role"
                  value={editFormData.role}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 border border-transparent rounded-md text-sm font-medium text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete User</h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to delete {userToDelete?.firstName} {userToDelete?.lastName}? This action cannot be undone.
              </p>
            </div>
            <div className="mt-6 flex justify-center space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 border border-transparent rounded-md text-sm font-medium text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading overlay for background operations */}
      {loading && users.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
          <p className="text-sm text-gray-600">Refreshing data...</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;