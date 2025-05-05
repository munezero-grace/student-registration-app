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

// API login function
export const login = async (
  email: string,
  password: string
): Promise<{ token: string; role: string }> => {
  try {
    console.log("Attempting login with:", { email });
    // Call the API endpoint
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

    // Handle specific error messages from the API
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error(error.message || "Login failed");
  }
};

// Logout function
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

// Profile fetching function with a specific token (for testing)
export const fetchUserProfileWithToken = async (
  token: string
): Promise<UserProfile> => {
  try {
    console.log("Fetching profile with specific token...");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const response = await fetch(
      `${apiUrl}/api/profile`,
      {
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

// Profile fetching function that uses the API endpoint
export const fetchUserProfile = async (): Promise<UserProfile> => {
  try {
    console.log("Fetching profile from API...");

    // Get the token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    // Call the API endpoint with the token
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

    // Handle specific error messages from the API
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error(error.message || "Failed to fetch profile");
  }
};

// API registration function
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

    const response = await api.post("/register", apiData);

    return {
      success: true,
      message: response.data.message || "Registration successful",
    };
  } catch (error: any) {
    console.error("Registration error:", error);
    
    // Handle specific error messages from the API
    if (error.response && error.response.data && error.response.data.message) {
      return { 
        success: false, 
        message: error.response.data.message 
      };
    }
    
    return { 
      success: false, 
      message: error.message || "Registration failed" 
    };
  }
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
