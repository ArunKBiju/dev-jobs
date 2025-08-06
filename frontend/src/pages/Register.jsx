import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(register(form)).unwrap();
      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Register</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="input border p-2 w-full"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="input border p-2 w-full"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="input border p-2 w-full"
          required
        />
        <select
          name="role"
          onChange={handleChange}
          className="input border p-2 w-full"
          required
        >
          <option value="user">User</option>
          <option value="company">Company</option>
        </select>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        <p className="text-sm text-center">
          Already a user?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
