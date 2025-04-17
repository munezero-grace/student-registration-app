import Link from "next/link";
import Navbar from "./_components/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <Navbar />

      <main className="flex-grow flex flex-col justify-between">
        {/* Hero Section */}
        <section className="pt-5 pb-2 bg-gradient-to-b from-blue-50 to-white w-full">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-9 mt-14 text-blue-800">
              Student Registration Made Simple
            </h1>
            <p className="text-lg text-gray-700 mb-9 max-w-2xl mx-auto">
              A streamlined platform for managing student registrations and
              profiles.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="pt-1 pb-2 bg-white w-full">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-3 text-gray-800">
              How It Works
            </h2>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-full  text-blue-600 mb-2">
                    <span className="text-lg font-bold">1</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    Register
                  </h3>
                  <p className="text-sm text-gray-600">
                    Create your account with a secure password.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-blue-100 text-blue-600 mb-2">
                    <span className="text-lg font-bold">2</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    Login
                  </h3>
                  <p className="text-sm text-gray-600">
                    Access your personalized dashboard.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-blue-100 text-blue-600 mb-2">
                    <span className="text-lg font-bold">3</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    Manage
                  </h3>
                  <p className="text-sm text-gray-600">
                    Update your profile and track your progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pt-0 pb-25  w-full">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-blue-800 mb-2">
              Ready to Get Started?
            </h2>
            <p className="text-base text-gray-700 mb-3 max-w-xl mx-auto">
              Join our student registration system today.
            </p>
            <div className="flex justify-center">
              <Link
                href="/register"
                className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition duration-300 shadow-md text-base"
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Essential Footer */}
      <footer className="bg-white text-gray-600 py-3 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center space-x-3 text-xs">
            <span>&copy; 2025 Student Registry.</span>
            <span>|</span>
            <span className="text-blue-600">Privacy Policy</span>
            <span>|</span>
            <span className="text-blue-600">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
