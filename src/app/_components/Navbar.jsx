export default function Navbar() {
    return (
      <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
        <h1 className="text-xl font-bold">Student Portal</h1>
        <div className="space-x-4">
          <a href="/register" className="hover:underline">Register</a>
          <a href="/login" className="hover:underline">Login</a>
        </div>
      </nav>
    );
  }
  