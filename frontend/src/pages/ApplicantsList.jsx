import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getApplicantsForJob } from '../api/companyAPI';

const ApplicantsList = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const data = await getApplicantsForJob(jobId);
        setApplicants(data);
      } catch (err) {
        console.error('Error fetching applicants:', err);
      }
    };

    fetchApplicants();
  }, [jobId]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Applicants</h2>
      {applicants.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        <ul className="space-y-4">
          {applicants.map((app) => (
            <li key={app._id} className="border p-4 rounded shadow bg-white">
              <p><strong>Name:</strong> {app.userId?.name}</p>
              <p><strong>Email:</strong> {app.userId?.email}</p>
              <p><strong>Note:</strong> {app.note || '—'}</p>

              <p className="text-sm text-gray-600">
                <strong>Applied on:</strong>{' '}
                {new Date(app.createdAt).toLocaleDateString()}
              </p>

              {app.resumeLink && (
                <p>
                  <strong>Resume:</strong>{' '}
                  <a
                    href={app.resumeLink}
                    className="text-blue-500 underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Resume
                  </a>
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApplicantsList;
