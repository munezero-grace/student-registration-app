"use client";
import { useState } from 'react';
import Navbar from '../_components/Navbar';
import axios from 'axios';

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dateOfBirth: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const age = calculateAge(new Date(form.dateOfBirth));
    if (age < 10 || age > 20) {
      alert("Age must be between 10 and 20 years.");
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/register', form);
      alert('Registered successfully!');
    } catch (err) {
      console.error(err);
      alert('Registration failed!');
    }
  };

  const calculateAge = (dob) => {
    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg p-6 text-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-center">Create a new account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="border w-full p-2 rounded" name="firstName" placeholder="First Name" onChange={handleChange} required />
          <input className="border w-full p-2 rounded" name="lastName" placeholder="Last Name" onChange={handleChange} required />
          <input className="border w-full p-2 rounded" type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input className="border w-full p-2 rounded" type="date" name="dateOfBirth" onChange={handleChange} required />
          <input className="border w-full p-2 rounded" type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded">Sign Up</button>
        </form>
        <p className="text-center text-sm mt-4">
          Already a member? <a href="/login" className="text-blue-600 font-medium">Sign In</a>
        </p>
      </div>
    </>
  );
}
