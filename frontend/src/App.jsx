import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import CompanyDashboard from './pages/CompanyDashboard';
import UserDashboard from './pages/UserDashboard';
import JobList from './pages/JobList';
import ApplyForm from './pages/ApplyForm';
import ViewApplications from './pages/ViewApplications';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<ProtectedRoute />}>
          <Route path="company" element={<CompanyDashboard />} />
          <Route path="user" element={<UserDashboard />} />
          <Route path="jobs" element={<JobList />} />
          <Route path="apply/:id" element={<ApplyForm />} />
          <Route path="applications" element={<ViewApplications />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
