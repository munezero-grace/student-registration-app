import Navbar from "./_components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <section className="bg-gray-100 min-h-screen flex flex-col justify-center items-center px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
          Welcome to the Student Registration System
        </h1>
        <p className="text-lg text-gray-700 max-w-xl mb-6">
          Easily register students, manage user accounts, and streamline the onboarding process.
        </p>
        <div className="flex gap-4">
          <a href="/register" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Register Now
          </a>
          <a href="/login" className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50">
            Login
          </a>
        </div>
      </section>

      <section className="bg-white py-10 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-bold mb-2">1. Register</h3>
            <p className="text-gray-600">Fill in your personal details and create your account.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">2. Login</h3>
            <p className="text-gray-600">Access your account using secure credentials.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">3. Dashboard</h3>
            <p className="text-gray-600">Manage your profile and view your registration number.</p>
          </div>
        </div>
      </section>

      <footer className="text-center py-6 bg-gray-100 text-sm text-gray-500">
        &copy; 2025 Student Registration System. All rights reserved.
      </footer>
    </>
  );
}
