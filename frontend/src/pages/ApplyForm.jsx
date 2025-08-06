import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ApplyForm = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState('');
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    const checkApplicationStatus = async () => {
      try {
        const { data } = await axios.get('/api/applications/user', { withCredentials: true });
        const match = data.some(app => app.jobId === jobId);
        setAlreadyApplied(match);
      } catch (err) {
        console.error('Error checking application status:', err);
      }
    };

    checkApplicationStatus();
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      alert('Please upload your resume before submitting.');
      return;
    }

    if (alreadyApplied) {
      alert('You have already applied to this job!');
      return;
    }

    const formData = new FormData();
    formData.append('note', note);
    formData.append('resume', resume);

    try {
      setLoading(true);
      await axios.post(`/api/applications/${jobId}/apply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      alert('Application submitted!');
      navigate('/user');
    } catch (error) {
      console.error('Failed to apply:', error.response?.data || error.message);
      alert('Failed to apply: ' + (error.response?.data?.error || 'Something went wrong'));
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-md border border-gray-200">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Apply for This Job</h2>

      {alreadyApplied ? (
        <p className="text-red-600 text-center mb-4">You’ve already submitted an application for this job.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
            <textarea
              placeholder="Write a brief message to the recruiter..."
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
            />
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Your Resume <span className="text-gray-500">(PDF only)</span></label>
            <input
              type="file"
              accept="application/pdf"
              className="w-full border border-gray-300 p-2 rounded-lg"
              onChange={(e) => setResume(e.target.files[0])}
              required
            />
            {resume && <p className="text-green-600 mt-1">📄 Selected: <strong>{resume.name}</strong></p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white text-lg font-semibold ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ApplyForm;
