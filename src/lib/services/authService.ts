// Mock authentication and user services
// In production, replace these functions with actual API calls

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationNumber: string;
  dateOfBirth: string;
  role: 'admin' | 'student';
  createdAt: string;
  updatedAt: string;
}

// Interface for registration that includes password
export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
}

// Mock database with passwords (in a real app, passwords would be hashed)
interface UserWithPassword extends UserProfile {
  password: string;
}

let mockUsersWithPasswords: UserWithPassword[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@university.edu",
    password: "password123", // In a real app, this would be hashed
    registrationNumber: "REG-78945612-2025",
    dateOfBirth: "2005-09-15",
    role: "student",
    createdAt: "2024-08-10T14:30:00Z",
    updatedAt: "2024-08-10T14:30:00Z"
  },
  {
    id: "663f9510-f39c-52d5-b817-557766550111",
    firstName: "Admin",
    lastName: "User",
    email: "admin@university.edu",
    password: "admin123", // In a real app, this would be hashed
    registrationNumber: "ADM-12345678-2025",
    dateOfBirth: "1990-01-01",
    role: "admin",
    createdAt: "2024-01-01T09:00:00Z",
    updatedAt: "2024-01-01T09:00:00Z"
  }
];

// Keep a separate mockUsers array without passwords for other functions
let mockUsers: UserProfile[] = mockUsersWithPasswords.map(({...user}) => user);

// Helper function to generate a random registration number
const generateRegistrationNumber = (): string => {
  // Generate a random 8-digit number
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  return `REG-${randomNum}-2025`;
};

// Helper function to generate a UUID
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Simulated login function
export const login = async (email: string, password: string): Promise<{ token: string; role: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Find user by email
      const user = mockUsersWithPasswords.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      // In a real application, you would hash and compare passwords
      if (user) {
        if (user.password === password) {
          // Return a mock JWT token along with user role
          localStorage.setItem("userRole", user.role);
          resolve({ token: `mock-${user.role}-jwt-token`, role: user.role });
        } else {
          reject(new Error("Invalid password"));
        }
      } else {
        reject(new Error("Email not found"));
      }
    }, 500); // Simulate network delay
  });
};

// Simulated logout function
export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
};

// Simulated profile fetching function
export const fetchUserProfile = async (): Promise<UserProfile> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("userRole");
      
      if (!token) {
        reject(new Error("Not authenticated"));
        return;
      }
      
      // Find the right profile based on role
      if (role === "admin") {
        const adminUser = mockUsers.find(u => u.role === "admin");
        if (adminUser) {
          resolve(adminUser);
        } else {
          reject(new Error("Admin profile not found"));
        }
      } else {
        const studentUser = mockUsers.find(u => u.role === "student");
        if (studentUser) {
          resolve(studentUser);
        } else {
          reject(new Error("Student profile not found"));
        }
      }
    }, 500); // Simulate network delay
  });
};

// Simulated registration function
export const registerUser = async (userData: RegistrationData): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if email already exists
      const existingUser = mockUsersWithPasswords.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
      
      if (existingUser) {
        reject(new Error("Email already registered"));
        return;
      }
      
      // Create new user with generated id and registration number
      const now = new Date().toISOString();
      const newUser: UserWithPassword = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        dateOfBirth: userData.dateOfBirth,
        id: generateUUID(),
        registrationNumber: generateRegistrationNumber(),
        role: 'student', // Default role is student
        createdAt: now,
        updatedAt: now
      };
      
      // Add to mock databases
      mockUsersWithPasswords.push(newUser);
      mockUsers = mockUsersWithPasswords.map(({...user}) => user);
      
      // In a real app, this would persist to a database
      resolve({ success: true, message: "Registration successful" });
    }, 800); // Simulate network delay
  });
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

// Get current user role
export const getUserRole = (): string | null => {
  return localStorage.getItem("userRole");
};

// Check if user has admin role
export const isAdmin = (): boolean => {
  return localStorage.getItem("userRole") === "admin";
};

// Get all users (admin only function)
export const getAllUsers = async (): Promise<UserProfile[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("userRole");
      
      if (!token) {
        reject(new Error("Not authenticated"));
        return;
      }
      
      if (role !== "admin") {
        reject(new Error("Unauthorized: Admin access required"));
        return;
      }
      
      resolve([...mockUsers]);
    }, 500);
  });
};

// Delete user (admin only function)
export const deleteUser = async (userId: string): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("userRole");
      
      if (!token) {
        reject(new Error("Not authenticated"));
        return;
      }
      
      if (role !== "admin") {
        reject(new Error("Unauthorized: Admin access required"));
        return;
      }
      
      const initialLength = mockUsersWithPasswords.length;
      mockUsersWithPasswords = mockUsersWithPasswords.filter(user => user.id !== userId);
      mockUsers = mockUsersWithPasswords.map(({...user}) => user);
      
      if (mockUsersWithPasswords.length === initialLength) {
        reject(new Error("User not found"));
      } else {
        resolve({ success: true, message: "User deleted successfully" });
      }
    }, 500);
  });
};

// Update user (admin only function)
export const updateUser = async (userId: string, userData: Partial<Omit<UserProfile, 'id' | 'registrationNumber'>>): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("userRole");
      
      if (!token) {
        reject(new Error("Not authenticated"));
        return;
      }
      
      if (role !== "admin") {
        reject(new Error("Unauthorized: Admin access required"));
        return;
      }
      
      const userIndex = mockUsersWithPasswords.findIndex(user => user.id === userId);
      
      if (userIndex === -1) {
        reject(new Error("User not found"));
        return;
      }
      
      // Update the user data
      mockUsersWithPasswords[userIndex] = {
        ...mockUsersWithPasswords[userIndex],
        ...userData,
        updatedAt: new Date().toISOString()
      };
      
      // Update the non-password version too
      mockUsers = mockUsersWithPasswords.map(({...user}) => user);
      
      resolve({ success: true, message: "User updated successfully" });
    }, 500);
  });
};
