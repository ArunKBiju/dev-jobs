import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserApplications } from '../redux/applicationSlice';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { applications, loading } = useSelector(state => state.applications);

  useEffect(() => {
    dispatch(fetchUserApplications());
  }, [dispatch]);

  const pendingCount = applications.filter(app => app.status === 'pending').length;
  const interviewCount = applications.filter(app => app.status === 'interview').length;
  const acceptedCount = applications.filter(app => app.status === 'accepted' || app.status === 'selected').length;
  const rejectedCount = applications.filter(app => app.status === 'rejected').length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name || 'User'} 👋</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded shadow">
          <p className="text-sm">Pending Applications</p>
          <h3 className="text-xl font-bold">{pendingCount}</h3>
        </div>
        <div className="bg-blue-100 text-blue-800 p-4 rounded shadow">
          <p className="text-sm">Interviews Incoming</p>
          <h3 className="text-xl font-bold">{interviewCount}</h3>
        </div>
        <div className="bg-green-100 text-green-800 p-4 rounded shadow">
          <p className="text-sm">Accepted Applications</p>
          <h3 className="text-xl font-bold">{acceptedCount}</h3>
        </div>
        <div className="bg-red-100 text-red-800 p-4 rounded shadow">
          <p className="text-sm">Rejected Applications</p>
          <h3 className="text-xl font-bold">{rejectedCount}</h3>
        </div>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Recent Applications</h3>
        <Link
          to="/applications"
          className="text-blue-600 hover:underline text-sm"
        >
          View All
        </Link>
      </div>

      {loading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p>No applications submitted yet.</p>
      ) : (
        applications
          .slice(0, 3)
          .map(app => (
            <div key={app._id} className="bg-white p-4 rounded shadow mb-3">
              <h3 className="text-lg font-semibold">{app.job?.title}</h3>
              <p className="text-sm">{app.job?.location}</p>
              <p className="text-sm text-gray-500">
                Company: {app.job?.companyId?.name || 'N/A'}
              </p>
              <p className="text-sm">
                Status:{' '}
                <span className="font-semibold capitalize">{app.status}</span>
              </p>
            </div>
          ))
      )}
    </div>
  );
};

export default UserDashboard;
