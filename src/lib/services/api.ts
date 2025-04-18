import axios from "axios";

// Create an axios instance with default config
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  // baseURL: 'http://localhost:4000/api',
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});
// Add a request interceptor to include JWT token if available
api.interceptors.request.use(
  (config) => {
    // Check if we're in the browser and if token exists
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        // Make sure we're using the correct Authorization header format
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Added token to request:", config.url);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("userRole");
          window.location.href = "/login";
        }
      } else if (error.response.status === 403) {
        // Forbidden - user doesn't have permission
        console.error("Access forbidden");
        if (typeof window !== "undefined") {
          window.location.href = "/unauthorized";
        }
      }
      // Log the response error
      console.error("API Error Response:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // The request was made but no response was received
      // Could be a CORS issue, network problem, or server is down
      console.error("No response received:", error.request);

      // Create a custom error message for network issues
      error.message =
        "Unable to connect to the server. Please check your internet connection or try again later.";
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
