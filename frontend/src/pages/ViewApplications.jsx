import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserApplications } from '../redux/applicationSlice';

const statusStyles = {
  pending:   'text-blue-600 font-bold',
  interview: 'text-yellow-700 font-bold',
  rejected:  'text-red-600 font-bold',
  selected:  'text-green-600 font-bold',
};

const ViewApplications = () => {
  const dispatch = useDispatch();
  const { applications, loading, error } = useSelector(
    (state) => state.applications
  );

  useEffect(() => {
    dispatch(fetchUserApplications());
  }, [dispatch]);

  if (loading)
    return <p className="text-center mt-4">Loading applications...</p>;
  if (error)
    return <p className="text-center mt-4 text-red-500">{error}</p>;
  if (applications.length === 0)
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Applications</h2>
        <p>No applications submitted yet.</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Your Applications</h2>
      {applications.map((app) => {
        const { _id, job, status, note, resumeLink, createdAt } = app;
        const company = job?.companyId || {};

        const resolvedLink = resumeLink?.startsWith('http')
          ? resumeLink
          : `http://localhost:5000${resumeLink}`;

        return (
          <div
            key={_id}
            className="border p-4 rounded bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold">{job?.title}</h3>
              <span
                className={`px-3 py-1 rounded text-sm uppercase ${
                  statusStyles[status] || ''
                }`}
              >
                {status}
              </span>
            </div>
            <p className="text-gray-600 mb-2">{company.name || 'N/A'}</p>
            <p className="text-sm">
              <strong>Mode:</strong>{' '}
              {job?.location === 'Remote' ? 'Remote' : job?.location}
            </p>
            <p className="text-sm">
              <strong>Salary:</strong> ₹{job?.salary}
            </p>
            <p className="text-sm mb-2">
              <strong>Skills:</strong>{' '}
              {Array.isArray(job?.skills) ? job.skills.join(', ') : 'N/A'}
            </p>
            <p className="text-sm">
              <strong>Applied On:</strong>{' '}
              {new Date(createdAt).toLocaleDateString()}
            </p>
            <p className="mt-2">
              <strong>Cover Letter:</strong> {note || '—'}
            </p>
            <p>
              <strong>Resume:</strong>{' '}
              {resumeLink ? (
                <a
                  href={resolvedLink}
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Resume
                </a>
              ) : (
                '—'
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ViewApplications;
