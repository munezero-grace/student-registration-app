import React, { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Trash2,
  X,
  ChevronUp,
  ChevronDown,
  Plus,
  Calendar,
  Mail,
  Hash,
  Clock,
  Book,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft
} from "lucide-react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationNumber: string;
  dateOfBirth: string;
  role: string;
  createdAt: string;
  course?: string; // Optional field for student course
  status?: string; // Optional field for student status
}

interface AdminDashboardProps {
  initialUsers?: User[];
  onAddUser?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  initialUsers = [],
  onAddUser,
}) => {
  // State for users data
  const [users, setUsers] = useState<User[]>(
    initialUsers.length > 0
      ? initialUsers
      : [
          {
            id: "5e8f8f8f-f8f8-f8f8-f8f8-f8f8f8f8f8f8",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            registrationNumber: "REG-1001-2025",
            dateOfBirth: "2005-07-15",
            role: "student",
            createdAt: "2025-02-10T08:30:00Z",
            course: "Computer Science",
            status: "Active"
          },
          {
            id: "6a9d9d9d-d9d9-d9d9-d9d9-d9d9d9d9d9d9",
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com",
            registrationNumber: "REG-1002-2025",
            dateOfBirth: "2006-03-22",
            role: "student",
            createdAt: "2025-02-11T09:15:00Z",
            course: "Mathematics",
            status: "Active"
          },
          {
            id: "7c3b3b3b-3b3b-3b3b-3b3b-3b3b3b3b3b3b",
            firstName: "Robert",
            lastName: "Johnson",
            email: "robert.j@example.com",
            registrationNumber: "REG-1003-2025",
            dateOfBirth: "2004-11-30",
            role: "student",
            createdAt: "2025-02-12T10:45:00Z",
            course: "Physics",
            status: "Pending"
          },
          {
            id: "8d2a2a2a-2a2a-2a2a-2a2a-2a2a2a2a2a2a",
            firstName: "Mary",
            lastName: "Williams",
            email: "mary.w@example.com",
            registrationNumber: "REG-1004-2025",
            dateOfBirth: "2007-05-07",
            role: "student",
            createdAt: "2025-02-15T14:20:00Z",
            course: "Biology",
            status: "Active"
          },
          {
            id: "9e1c1c1c-1c1c-1c1c-1c1c-1c1c1c1c1c1c",
            firstName: "Michael",
            lastName: "Brown",
            email: "michael.admin@example.com",
            registrationNumber: "ADM-1001-2025",
            dateOfBirth: "2000-01-01",
            role: "admin",
            createdAt: "2025-01-01T00:00:00Z",
            status: "Active"
          },
        ]
  );

  // State for search, filters, pagination, and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  }>({
    key: "createdAt",
    direction: "descending",
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    role: "",
    course: "",
    status: ""
  });

  // Pagination settings
  const itemsPerPage = 5;

  // In a real app, fetch users from API
  useEffect(() => {
    // API call would go here
    // axios.get('/api/admin/users')
    //   .then(response => setUsers(response.data))
    //   .catch(error => console.error('Error fetching users:', error));
  }, []);

  // Calculate age from date of birth
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Search and filter function
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Sorting function
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting
  const sortedUsers = React.useMemo(() => {
    const sortableUsers = [...filteredUsers];
    sortableUsers.sort((a, b) => {
      // Handle sorting based on name (combine first and last name)
      if (sortConfig.key === "name") {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();

        if (nameA < nameB) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (nameA > nameB) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      }

      // Normal property sorting
      if ((a[sortConfig.key as keyof User] ?? '') < (b[sortConfig.key as keyof User] ?? '')) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if ((a[sortConfig.key as keyof User] ?? '') > (b[sortConfig.key as keyof User] ?? '')) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    return sortableUsers;
  }, [filteredUsers, sortConfig]);

  // Pagination
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  // Handle pagination
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Handle edit modal
  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      role: user.role,
      course: user.course || "",
      status: user.status || ""
    });
    setIsEditModalOpen(true);
  };

  // Handle edit form input changes
  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle user update
  const handleUpdateUser = () => {
    // In a real app, make API call to update user
    // axios.put(`/api/admin/users/${editingUser.id}`, editFormData)
    //   .then(response => {...})
    //   .catch(error => {...})
    if (!editingUser) return;

    // For demo, update locally
    const updatedUsers = users.map((user) => {
      if (user.id === editingUser.id) {
        return { ...user, ...editFormData };
      }
      return user;
    });
    setUsers(updatedUsers);
    setIsEditModalOpen(false);
    setEditingUser(null);
    
    // Update selectedUser if it was the one being edited
    if (selectedUser && selectedUser.id === editingUser.id) {
      const updatedUser = updatedUsers.find(user => user.id === editingUser.id);
      if (updatedUser) {
        setSelectedUser(updatedUser);
      }
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Handle user deletion
  const handleDeleteUser = () => {
    // In a real app, make API call to delete user
    // axios.delete(`/api/admin/users/${userToDelete.id}`)
    //   .then(() => {...})
    //   .catch(error => {...})

    if (!userToDelete) return;

    // For demo, delete locally
    const updatedUsers = users.filter((user) => user.id !== userToDelete.id);
    setUsers(updatedUsers);
    setShowDeleteModal(false);
    setUserToDelete(null);
    
    // If we were showing details for this user, close the details panel
    if (selectedUser && selectedUser.id === userToDelete.id) {
      setSelectedUser(null);
      setShowUserDetails(false);
    }
  };
  
  // Handle row click to show user details
  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status color
  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800";
    
    switch (status.toLowerCase()) {
      case 'active':
        return "bg-green-100 text-green-800";
      case 'inactive':
        return "bg-red-100 text-red-800";
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string | undefined) => {
    if (!status) return <AlertCircle size={16} />;
    
    switch (status.toLowerCase()) {
      case 'active':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'inactive':
        return <XCircle size={16} className="text-red-600" />;
      case 'pending':
        return <AlertCircle size={16} className="text-yellow-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Student Registration System
        </h1>
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

      <div className="flex flex-col lg:flex-row gap-6">
        <div className={`w-full ${showUserDetails ? 'lg:w-2/3' : 'lg:w-full'}`}>
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="w-full md:w-1/2">
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Search Users
                </label>
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
                <label
                  htmlFor="roleFilter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Filter by Role
                </label>
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
                      onClick={() => requestSort("name")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Name</span>
                        {sortConfig.key === "name" &&
                          (sortConfig.direction === "ascending" ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("email")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Email</span>
                        {sortConfig.key === "email" &&
                          (sortConfig.direction === "ascending" ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("registrationNumber")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Registration #</span>
                        {sortConfig.key === "registrationNumber" &&
                          (sortConfig.direction === "ascending" ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("dateOfBirth")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Age</span>
                        {sortConfig.key === "dateOfBirth" &&
                          (sortConfig.direction === "ascending" ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("role")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Role</span>
                        {sortConfig.key === "role" &&
                          (sortConfig.direction === "ascending" ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("createdAt")}
                    >
                      <div className="flex items-center gap-1">
                        <span>Registered On</span>
                        {sortConfig.key === "createdAt" &&
                          (sortConfig.direction === "ascending" ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          ))}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <tr
                        key={user.id}
                        className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                          selectedUser && selectedUser.id === user.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleRowClick(user)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-600 font-medium">
                                  {user.firstName.charAt(0)}
                                  {user.lastName.charAt(0)}
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
                          <div className="text-sm text-gray-900">
                            {user.registrationNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {calculateAge(user.dateOfBirth)} years
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {user.role === "admin" ? "Admin" : "Student"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(user);
                              }}
                              className="text-indigo-600 hover:text-indigo-900 transition-colors"
                              aria-label="Edit user"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteModal(user);
                              }}
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
                      <td
                        colSpan={7}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No users found matching your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {sortedUsers.length > 0 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                    Showing{" "}
                    <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
                    <span className="font-medium">
                      {indexOfLastUser > sortedUsers.length
                        ? sortedUsers.length
                        : indexOfLastUser}
                    </span>{" "}
                    of <span className="font-medium">{sortedUsers.length}</span>{" "}
                    results
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                      }`}
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }).map(
                      (_, index) => {
                        // Show at most 5 page buttons
                        const pageNum = index + 1;
                        return (
                          <button
                            key={index}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-1 rounded-md ${
                              currentPage === pageNum
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                    {totalPages > 5 && <span className="self-center">...</span>}
                    {totalPages > 5 && (
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === totalPages
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                        }`}
                      >
                        {totalPages}
                      </button>
                    )}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Details Panel */}
        {showUserDetails && selectedUser && (
          <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">User Details</h2>
                <button 
                  onClick={() => setShowUserDetails(false)}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft size={18} className="mr-1" />
                  <span className="text-sm">Close</span>
                </button>
              </div>
              
              <div className="flex flex-col items-center mb-6">
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  <span className="text-gray-600 font-bold text-2xl">
                    {selectedUser.firstName.charAt(0)}
                    {selectedUser.lastName.charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <div className="mt-1 flex items-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedUser.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {selectedUser.role === "admin" ? "Admin" : "Student"}
                  </span>
                  
                  {selectedUser.status && (
                    <span
                      className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        selectedUser.status
                      )}`}
                    >
                      <span className="mr-1">{getStatusIcon(selectedUser.status)}</span>
                      {selectedUser.status}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail size={18} className="text-gray-500 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Email Address</p>
                    <p className="text-sm font-medium">{selectedUser.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Hash size={18} className="text-gray-500 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Registration Number</p>
                    <p className="text-sm font-medium">{selectedUser.registrationNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar size={18} className="text-gray-500 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    <p className="text-sm font-medium">
                      {formatDate(selectedUser.dateOfBirth)} ({calculateAge(selectedUser.dateOfBirth)} years)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock size={18} className="text-gray-500 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Registered On</p>
                    <p className="text-sm font-medium">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                </div>
                
                {selectedUser.role === "student" && selectedUser.course && (
                  <div className="flex items-center">
                    <Book size={18} className="text-gray-500 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Course</p>
                      <p className="text-sm font-medium">{selectedUser.course}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => openEditModal(selectedUser)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium flex items-center"
                >
                  <Edit size={16} className="mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(selectedUser)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium flex items-center"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center p-4 z-50">
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
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
              {editFormData.role === "student" && (
                <div>
                  <label
                    htmlFor="course"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Course
                  </label>
                  <input
                    type="text"
                    name="course"
                    id="course"
                    value={editFormData.course}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  value={editFormData.status}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
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
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center p-4 z-50">
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
    </div>
  );
};

export default AdminDashboard;