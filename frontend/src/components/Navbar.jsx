import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.user?.role);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">DevJobs</h1>
      <div className="space-x-4">
        {role === 'user' && (
          <>
            <Link to="/user" className="hover:underline">User Dashboard</Link>
            <Link to="/jobs" className="hover:underline">Browse Jobs</Link>
            <Link to="/applications" className="hover:underline">My Applications</Link>
          </>
        )}
        {role === 'company' && (
          <>
            <Link to="/company" className="hover:underline">Company Dashboard</Link>
          </>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
