import React, { useEffect, useState } from 'react';
import axios from 'axios';

const statusStyles = {
  pending:   'text-blue-600 font-bold',
  interview: 'text-yellow-700 font-bold',
  rejected:  'text-red-600 font-bold',
  selected:  'text-green-600 font-bold',
};

const BrowseJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await axios.get('/api/applications/me');
        setApplications(data);
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) return <p className="p-6">Loading your applications…</p>;
  if (applications.length === 0)
    return <p className="p-6">You haven’t applied to any jobs yet.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {applications.map((app) => {
        const { _id, status, job, createdAt, note, resumeLink } = app;
        const company = job?.companyId || {};

        return (
          <div
            key={_id}
            className="bg-white border rounded-lg shadow p-6"
          >
            {/* Title and Status */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">{job?.title}</h3>
              <span
                className={`px-3 py-1 rounded text-sm uppercase ${
                  statusStyles[status] || ''
                }`}
              >
                {status}
              </span>
            </div>

            {/* Job & Company Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 mb-6">
              <p>
                <strong>Mode:</strong>{' '}
                {job?.location === 'Remote' ? 'Remote' : job?.location}
              </p>
              <p>
                <strong>Salary:</strong>{' '}
                {job?.salary ? `₹${job.salary}` : 'Not specified'}
              </p>
              <p className="sm:col-span-2">
                <strong>Skills:</strong>{' '}
                {Array.isArray(job?.skills)
                  ? job.skills.join(', ')
                  : 'N/A'}
              </p>
              <p>
                <strong>Company:</strong> {company.name || 'N/A'}
              </p>
              <p>
                <strong>Email:</strong> {company.email || 'N/A'}
              </p>
              <p className="sm:col-span-2">
                <strong>Applied On:</strong>{' '}
                {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Cover Letter */}
            <div className="mb-4">
              <p className="font-semibold mb-2">Cover Letter:</p>
              <p className="whitespace-pre-wrap">
                {note || 'No cover letter provided.'}
              </p>
            </div>

            {/* Resume */}
            <div>
              <p className="font-semibold mb-2">Resume:</p>
              {resumeLink ? (
                <a
                  href={resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Resume
                </a>
              ) : (
                <p>No resume uploaded.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BrowseJobs;
