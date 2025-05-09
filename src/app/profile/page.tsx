"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../_components/Navbar";
import {
  UserProfile,
  fetchUserProfile,
  fetchUserProfileWithToken,
  isAuthenticated,
} from "@/lib/services/authService";
import toast from "react-hot-toast";
import { getSession } from "next-auth/react";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to save the test token to localStorage
  const saveTestToken = () => {
    const curlToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVkODVhNTRhLTgwMzctNDBmOS05NDlhLTlmNjJkZmQyZmQ3MCIsImVtYWlsIjoiY2xhdWRpbmVAZ21haWwuY29tIiwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3NDQ5NzkzNTMsImV4cCI6MTc0NTA2NTc1M30.HkLsjGv3fNcHOnIfMzZuUjaT3US0E2T-NfPbnUuQuYA";
    localStorage.setItem("token", curlToken);
    localStorage.setItem("userRole", "student");
    toast.success("Test token saved to localStorage");
    window.location.reload();
  };

  // Function to directly test the API with a specific token
  const testWithCurlToken = async () => {
    const curlToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVkODVhNTRhLTgwMzctNDBmOS05NDlhLTlmNjJkZmQyZmQ3MCIsImVtYWlsIjoiY2xhdWRpbmVAZ21haWwuY29tIiwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3NDQ5NzkzNTMsImV4cCI6MTc0NTA2NTc1M30.HkLsjGv3fNcHOnIfMzZuUjaT3US0E2T-NfPbnUuQuYA";

    try {
      setLoading(true);
      setError(null);

      console.log("Testing API with curl token...");

      // Use our helper function to fetch the profile with the specific token
      const userData = await fetchUserProfileWithToken(curlToken);

      console.log("Profile data from test token:", userData);
      setProfile(userData);
      setLoading(false);
      toast.success("Profile loaded with test token");
    } catch (error: any) {
      console.error("Direct API test error:", error);
      setError(`Direct API test failed: ${error.message}`);
      setLoading(false);
      toast.error(`Test failed: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const session = await getSession();

        if (session?.user) {
          // Handle Google OAuth user
          const fullName = session.user.name || "";
          const [firstName, lastName] = fullName.split(" ");

          const userData = {
            id: "google-user-id", // Placeholder ID for Google users
            firstName: firstName || "Unknown",
            lastName: lastName || "",
            email: session.user.email || "Unknown",
            dateOfBirth: "N/A", // Google OAuth doesn't provide DOB
            role: "student" as "student", // Default role for Google users to match type
            registrationNumber: "N/A", // Not available for Google users
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          setProfile(userData);
          toast.success("Profile loaded successfully");
        } else {
          // Handle email/password login
          const userData = await fetchUserProfile();
          setProfile(userData);
          toast.success("Profile loaded successfully");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to fetch profile data.");
        toast.error("Failed to fetch profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="animate-pulse flex flex-col items-center p-8">
                <div className="rounded-full bg-gray-300 h-32 w-32 mb-4"></div>
                <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-8"></div>
                <div className="space-y-3 w-full max-w-md">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
                <div className="mt-8 flex space-x-4 justify-center">
                  <button
                    onClick={testWithCurlToken}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Test With Sample Token
                  </button>
                  <button
                    onClick={saveTestToken}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Save Test Token
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Error Loading Profile
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Try Again
                </button>
                <button
                  onClick={testWithCurlToken}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Test With Sample Token
                </button>
                <button
                  onClick={saveTestToken}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Save Test Token
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (profile) {
    // Format dates for display
    const formattedDOB = new Date(profile.dateOfBirth).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    const formattedJoinDate = new Date(profile.createdAt).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    // Calculate age
    const birthDate = new Date(profile.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-5 sm:px-6 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="relative h-24 w-24 md:mr-6 mb-4 md:mb-0">
                      <div className="h-24 w-24 rounded-full bg-white bg-opacity-30 flex items-center justify-center text-3xl font-bold text-white">
                        {profile?.firstName && profile?.lastName ? (
                          <>
                            {profile.firstName.charAt(0)}
                            {profile.lastName.charAt(0)}
                          </>
                        ) : (
                          "U"
                        )}
                      </div>
                    </div>
                    <div className="text-center md:text-left">
                      <h1 className="text-2xl font-bold">
                        {profile?.firstName || ""} {profile?.lastName || ""}
                      </h1>
                      <p className="mt-1 max-w-2xl text-sm text-blue-100">
                        {profile?.registrationNumber ||
                          "No registration number"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-200 text-blue-800">
                      {profile?.role
                        ? profile.role.charAt(0).toUpperCase() +
                          profile.role.slice(1)
                        : "User"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Content */}
              <div className="border-t border-gray-200 px-4 py-6 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Full Name
                    </div>
                    <div className="mt-1 text-sm text-gray-900">
                      {profile?.firstName || "N/A"} {profile?.lastName || ""}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Email Address
                    </div>
                    <div className="mt-1 text-sm text-gray-900">
                      {profile?.email || "N/A"}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Registration Number
                    </div>
                    <div className="mt-1 text-sm text-gray-900">
                      {profile?.registrationNumber || "N/A"}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      User Role
                    </div>
                    <div className="mt-1 text-sm text-gray-900 capitalize">
                      {profile?.role || "N/A"}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Date of Birth
                    </div>
                    <div className="mt-1 text-sm text-gray-900">
                      {profile?.dateOfBirth ? (
                        <>
                          {formattedDOB}{" "}
                          <span className="text-gray-500">
                            ({age} years old)
                          </span>
                        </>
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Joined On
                    </div>
                    <div className="mt-1 text-sm text-gray-900">
                      {profile?.createdAt ? formattedJoinDate : "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Section */}
              <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Edit Profile
                  </button>
                  {profile?.role === "admin" && (
                    <button
                      onClick={() => router.push("/admin")}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Admin Dashboard
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Fallback in case profile is still null after loading (shouldn't happen ideally)
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Profile Found
            </h2>
            <p className="text-gray-600 mb-4">
              Unable to load profile information.
            </p>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => router.push("/login")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Login
              </button>
              <button
                onClick={testWithCurlToken}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Test With Sample Token
              </button>
              <button
                onClick={saveTestToken}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Save Test Token
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
