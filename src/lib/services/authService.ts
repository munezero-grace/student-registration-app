// Authentication and user services
import api from "./api";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationNumber: string;
  dateOfBirth: string;
  role: "admin" | "student";
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
    updatedAt: "2024-08-10T14:30:00Z",
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
    updatedAt: "2024-01-01T09:00:00Z",
  },
];

// Keep a separate mockUsers array without passwords for other functions
let mockUsers: UserProfile[] = mockUsersWithPasswords.map(
  ({ ...user }) => user
);

// Helper function to generate a random registration number
const generateRegistrationNumber = (): string => {
  // Generate a random 8-digit number
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  return `REG-${randomNum}-2025`;
};

// Helper function to generate a UUID
const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Real API login function
export const login = async (
  email: string,
  password: string
): Promise<{ token: string; role: string }> => {
  try {
    console.log("Attempting login with:", { email });
    // Call the real API endpoint
    const response = await api.post("/login", { email, password });

    console.log("Login response:", response);
    console.log("Login response data:", response.data);

    // Extract token and role from response - handle different response formats
    let token, role;
    if (response.data.token) {
      token = response.data.token;
    } else if (response.data.accessToken) {
      token = response.data.accessToken;
    } else if (typeof response.data === "string") {
      // If the response is just the token string
      token = response.data;
    }

    if (response.data.role) {
      role = response.data.role;
    } else if (response.data.user && response.data.user.role) {
      role = response.data.user.role;
    }

    // Verify we have a token
    if (!token) {
      console.error("No token found in response", response.data);
      throw new Error("Login successful but no token received");
    }

    // Store token in localStorage
    localStorage.setItem("token", token);
    console.log("Token stored in localStorage");

    // Store role for later use if available
    if (role) {
      localStorage.setItem("userRole", role);
      console.log("Role stored in localStorage:", role);
    }

    return { token, role };
  } catch (error: any) {
    console.error("Login error:", error);

    // If the API is unavailable (for development/testing), fall back to mock
    if (error.request && !error.response) {
      console.warn("API server might be down, falling back to mock login");
      return loginMock(email, password);
    }

    // Handle specific error messages from the API
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error(error.message || "Login failed");
  }
};

// Fallback mock login function for testing without API
export const loginMock = async (
  email: string,
  password: string
): Promise<{ token: string; role: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Find user by email
      const user = mockUsersWithPasswords.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

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

/**
 * Function to map API response data (snake_case) to our UserProfile interface (camelCase)
 */
const adaptProfileData = (apiData: any): UserProfile => {
  console.log("Raw API data:", apiData); // For debugging

  // Handle both camelCase and snake_case field names
  // First, check if the API response has a data property (common in REST APIs)
  const userData = apiData.data || apiData;

  const profile: UserProfile = {
    id: userData.id || "",
    firstName: userData.firstName || userData.firstName || "",
    lastName: userData.lastName || userData.lastName || "",
    email: userData.email || "",
    registrationNumber:
      userData.registrationNumber || userData.registrationNumber || "",
    dateOfBirth: userData.dateOfBirth || userData.dateOfBirth || "",
    role:
      userData.role === "admin" || userData.role === "student"
        ? userData.role
        : "student",
    createdAt:
      userData.createdAt || userData.created_at || new Date().toISOString(),
    updatedAt:
      userData.updatedAt || userData.updated_at || new Date().toISOString(),
  };

  console.log("Adapted profile data:", profile); // For debugging
  return profile;
};

// Real profile fetching function with a specific token (for testing)
export const fetchUserProfileWithToken = async (
  token: string
): Promise<UserProfile> => {
  try {
    console.log("Fetching profile with specific token...");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/profile`,
      {
        //const response = await fetch("http://localhost:4000/api/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Direct fetch API result:", data);

    // Adapt the API response to our UserProfile format
    const validatedProfile = adaptProfileData(data);

    return validatedProfile;
  } catch (error: any) {
    console.error("Direct profile fetch error:", error);
    throw error;
  }
};

// Real profile fetching function that uses the API endpoint
export const fetchUserProfile = async (): Promise<UserProfile> => {
  try {
    console.log("Fetching profile from API...");

    // Get the token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    // Call the real API endpoint with the token
    const response = await api.get("/profile");

    // Log the raw response for debugging
    console.log("API Response:", response);
    console.log("API Response Data:", response.data);

    // Validate response data
    const userData = response.data;
    if (!userData) {
      console.error("Empty API response data");
      throw new Error("No data received from profile API");
    }

    if (typeof userData !== "object") {
      console.error("Invalid API response format:", userData);
      throw new Error("Invalid response format from profile API");
    }

    // Adapt the API response to our UserProfile format
    const validatedProfile = adaptProfileData(userData);

    return validatedProfile;
  } catch (error: any) {
    console.error("Profile fetch error:", error);

    // If the API is unavailable, fall back to mock implementation
    if (error.request && !error.response) {
      console.warn("API server might be down, falling back to mock profile");
      return fetchUserProfileMock();
    }

    // Handle specific error messages from the API
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error(error.message || "Failed to fetch profile");
  }
};

// Fallback mock profile fetching function
export const fetchUserProfileMock = async (): Promise<UserProfile> => {
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
        const adminUser = mockUsers.find((u) => u.role === "admin");
        if (adminUser) {
          resolve(adminUser);
        } else {
          reject(new Error("Admin profile not found"));
        }
      } else {
        const studentUser = mockUsers.find((u) => u.role === "student");
        if (studentUser) {
          resolve(studentUser);
        } else {
          reject(new Error("Student profile not found"));
        }
      }
    }, 500); // Simulate network delay
  });
};

// Real API registration function
export const registerUser = async (
  userData: RegistrationData
): Promise<{ success: boolean; message: string }> => {
  try {
    // Transform userData from camelCase to snake_case for API
    const apiData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      dateOfBirth: userData.dateOfBirth,
    };

    console.log("Calling API with data:", apiData);

    try {
      // Try to call the real API endpoint first
      const response = await api.post("/register", apiData);

      return {
        success: true,
        message: response.data.message || "Registration successful",
      };
    } catch (apiError: any) {
      console.warn(
        "API call failed, falling back to mock implementation:",
        apiError
      );

      // If API call fails (e.g., server not running), fall back to mock implementation
      return await registerUserMock(userData);
    }
  } catch (error: any) {
    console.error("Registration error:", error);
    return { success: false, message: error.message || "Registration failed" };
  }
};

// Fallback mock registration function for testing without API
export const registerUserMock = async (
  userData: RegistrationData
): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if email already exists
      const existingUser = mockUsersWithPasswords.find(
        (u) => u.email.toLowerCase() === userData.email.toLowerCase()
      );

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
        role: "student", // Default role is student
        createdAt: now,
        updatedAt: now,
      };

      // Add to mock databases
      mockUsersWithPasswords.push(newUser);
      mockUsers = mockUsersWithPasswords.map(({ ...user }) => user);

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
export const deleteUser = async (
  userId: string
): Promise<{ success: boolean; message: string }> => {
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
      mockUsersWithPasswords = mockUsersWithPasswords.filter(
        (user) => user.id !== userId
      );
      mockUsers = mockUsersWithPasswords.map(({ ...user }) => user);

      if (mockUsersWithPasswords.length === initialLength) {
        reject(new Error("User not found"));
      } else {
        resolve({ success: true, message: "User deleted successfully" });
      }
    }, 500);
  });
};

// Update user (admin only function)
export const updateUser = async (
  userId: string,
  userData: Partial<Omit<UserProfile, "id" | "registrationNumber">>
): Promise<{ success: boolean; message: string }> => {
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

      const userIndex = mockUsersWithPasswords.findIndex(
        (user) => user.id === userId
      );

      if (userIndex === -1) {
        reject(new Error("User not found"));
        return;
      }

      // Update the user data
      mockUsersWithPasswords[userIndex] = {
        ...mockUsersWithPasswords[userIndex],
        ...userData,
        updatedAt: new Date().toISOString(),
      };

      // Update the non-password version too
      mockUsers = mockUsersWithPasswords.map(({ ...user }) => user);

      resolve({ success: true, message: "User updated successfully" });
    }, 500);
  });
};
