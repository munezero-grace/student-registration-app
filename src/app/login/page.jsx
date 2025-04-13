"use client";
import { useState } from 'react';
import Navbar from '../_components/Navbar';
import axios from 'axios';

export default function LoginPage() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', form);
      const token = res.data.token;
      localStorage.setItem('token', token); // 🔐 Store the JWT
      alert('Login successful!');
      // Optionally redirect user here
    } catch (err) {
      console.error(err);
      alert('Invalid email or password');
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg p-6 text-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-center">Login to your account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="border w-full p-2 rounded"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            className="border w-full p-2 rounded"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded">
            Sign In
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          New here? <a href="/register" className="text-blue-600 font-medium">Create an account</a>
        </p>
      </div>
    </>
  );
}
