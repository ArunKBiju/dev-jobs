import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobs, postJob } from '../redux/jobSlice';
import API from '../api/api';

const CompanyDashboard = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    salary: '',
    skills: ''
  });

  const [locationOption, setLocationOption] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [currentJobsPage, setCurrentJobsPage] = useState(1);
  const jobsPerPage = 5;

  const [applicantsByJob, setApplicantsByJob] = useState({});
  const [applicantsPageByJob, setApplicantsPageByJob] = useState({});
  const appsPerPage = 5;

  const [expandedJobId, setExpandedJobId] = useState(null);

  const { user } = useSelector(state => state.auth);
  const { jobs } = useSelector(state => state.jobs);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!locationOption || (locationOption === 'custom' && !customLocation.trim())) {
      return alert('Please select “Remote” or enter a Location');
    }

    const jobData = {
      title: form.title,
      description: form.description,
      location: locationOption === 'remote' ? 'Remote' : customLocation.trim(),
      salary: form.salary,
      skills: form.skills.split(',').map(s => s.trim())
    };

    try {
      if (editingId) {
        await API.put(`/jobs/${editingId}`, jobData);
      } else {
        await dispatch(postJob(jobData));
      }
      setForm({ title: '', description: '', salary: '', skills: '' });
      setLocationOption('');
      setCustomLocation('');
      setEditingId(null);
      setCurrentJobsPage(1);
      dispatch(fetchJobs());
    } catch {
      alert('Failed to save job');
    }
  };

  const handleEdit = job => {
    setForm({
      title: job.title,
      description: job.description,
      salary: job.salary,
      skills: job.skills.join(', ')
    });

    if (job.location === 'Remote') {
      setLocationOption('remote');
      setCustomLocation('');
    } else {
      setLocationOption('custom');
      setCustomLocation(job.location);
    }

    setEditingId(job._id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await API.delete(`/jobs/${id}`);
      const newTotal = Math.ceil((jobs.length - 1) / jobsPerPage);
      if (currentJobsPage > newTotal) setCurrentJobsPage(newTotal);
      dispatch(fetchJobs());
    } catch {
      alert('Failed to delete job');
    }
  };

  const toggleApplicants = async jobId => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
      return;
    }
    if (!applicantsByJob[jobId]) {
      try {
        const { data } = await API.get(`/applications/company/${jobId}`);
        setApplicantsByJob(prev => ({ ...prev, [jobId]: data }));
        setApplicantsPageByJob(prev => ({ ...prev, [jobId]: 1 }));
      } catch {
        alert('Failed to load applicants');
        return;
      }
    }
    setExpandedJobId(jobId);
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await API.patch(`/applications/status/${applicationId}`, { status: newStatus });
      setApplicantsByJob(prev => ({
        ...prev,
        [expandedJobId]: prev[expandedJobId].map(app =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      }));
    } catch {
      alert('Failed to update status');
    }
  };

  const validJobs = jobs.filter(job => job.title && job.description);

  const totalJobsPages = Math.ceil(validJobs.length / jobsPerPage);
  const jobsStart = (currentJobsPage - 1) * jobsPerPage;
  const jobsToDisplay = validJobs.slice(jobsStart, jobsStart + jobsPerPage);

  const handleJobsPageChange = page => {
    if (page < 1 || page > totalJobsPages) return;
    setCurrentJobsPage(page);
  };

  const handleAppsPageChange = (jobId, page) => {
    const totalAppsPages = Math.ceil((applicantsByJob[jobId]?.length || 0) / appsPerPage);
    if (page < 1 || page > totalAppsPages) return;
    setApplicantsPageByJob(prev => ({ ...prev, [jobId]: page }));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
        Welcome {user?.name}
      </h2>

      {/* Job Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-r from-white to-gray-100 p-6 rounded-xl shadow-lg mb-8 space-y-4 border"
      >
        <h3 className="text-xl font-semibold text-gray-800">
          {editingId ? 'Edit Job' : 'Post New Job'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Job Title"
            className="input-field"
            required
          />
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="input-field"
            required
          />

          {/* Location */}
          <div>
            <label className="font-medium block mb-1">Location</label>
            <div className="flex space-x-4 mb-2">
              <button
                type="button"
                className={`px-4 py-2 rounded border ${
                  locationOption === 'remote' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-800'
                }`}
                onClick={() => setLocationOption('remote')}
              >
                Remote
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded border ${
                  locationOption === 'custom' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-800'
                }`}
                onClick={() => setLocationOption('custom')}
              >
                Enter Location
              </button>
            </div>
            {locationOption === 'custom' && (
              <input
                type="text"
                className="w-full border p-2 rounded"
                placeholder="Enter Location"
                value={customLocation}
                onChange={e => setCustomLocation(e.target.value)}
                required
              />
            )}
          </div>

          <input
            name="salary"
            value={form.salary}
            onChange={handleChange}
            placeholder="Salary"
            className="input-field"
          />
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="Skills (comma separated)"
            className="input-field col-span-2"
          />
        </div>

        <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded shadow transition-all duration-300">
          {editingId ? 'Update Job' : 'Post Job'}
        </button>
      </form>

      {/* Posted Jobs */}
      <h3 className="text-2xl font-bold mb-4">Posted Jobs</h3>
      {jobsToDisplay.map(job => {
        const apps = applicantsByJob[job._id] || [];
        const appsCount = apps.length;
        const currentAppPage = applicantsPageByJob[job._id] || 1;
        const totalAppsPages = Math.ceil(appsCount / appsPerPage);
        const appsStart = (currentAppPage - 1) * appsPerPage;
        const appsToShow = apps.slice(appsStart, appsStart + appsPerPage);

        return (
          <div
            key={job._id}
            className="bg-white p-5 mb-6 rounded-xl shadow-md border transition-transform hover:scale-[1.01]"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-800">{job.title}</h4>
                <p className="mt-1 text-gray-700">{job.description}</p>
                <p className="mt-2 text-sm text-gray-600">
                  {job.location} | ₹{job.salary}
                </p>
                <p className="text-xs text-gray-500">Skills: {job.skills.join(', ')}</p>
              </div>
              <div className="flex gap-3 text-sm font-medium">
                <button onClick={() => handleEdit(job)} className="text-blue-600 hover:underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(job._id)} className="text-red-600 hover:underline">
                  Delete
                </button>
                <button onClick={() => toggleApplicants(job._id)} className="text-indigo-600 hover:underline">
                  {expandedJobId === job._id ? 'Hide Applicants' : `View Applicants (${appsCount})`}
                </button>
              </div>
            </div>

            {expandedJobId === job._id && (
              <div className="mt-4 bg-gray-50 rounded-lg p-4 border">
                <h5 className="font-semibold mb-3 text-gray-800">
                  Applicants ({appsCount})
                </h5>

                {appsCount > 0 ? (
                  <>
                    {appsToShow.map(app => (
                      <div key={app._id} className="border-b border-gray-200 py-2 text-sm">
                        <p>
                          <span className="font-medium">Name:</span> {app.userId.name}
                        </p>
                        <p>
                          <span className="font-medium">Email:</span> {app.userId.email}
                        </p>
                        <p>
                          <span className="font-medium">Note:</span> {app.note || '—'}
                        </p>
                        <p>
                          <span className="font-medium">Applied on:</span>{' '}
                          {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                        <p className="mt-1 flex items-center gap-2">
                          <span className="font-medium">Status:</span>
                          <select
                            value={app.status}
                            onChange={e => handleStatusChange(app._id, e.target.value)}
                            className="border rounded px-2 py-1 text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="interview">Interview</option>
                            <option value="selected">Selected</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </p>
                        {app.resumeLink && (
                          <a
                            href={
                              app.resumeLink.startsWith('http')
                                ? app.resumeLink
                                : `http://localhost:5000${app.resumeLink}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline mt-1 block"
                          >
                            View Resume
                          </a>
                        )}
                      </div>
                    ))}

                    {/* Applicants Pagination */}
                    {totalAppsPages > 1 && (
                      <div className="mt-3 flex justify-center gap-2">
                        <button
                          onClick={() => handleAppsPageChange(job._id, currentAppPage - 1)}
                          disabled={currentAppPage === 1}
                          className="px-2 py-1 border rounded disabled:opacity-50"
                        >
                          Prev
                        </button>
                        {[...Array(totalAppsPages)].map((_, idx) => (
                          <button
                            key={idx + 1}
                            onClick={() => handleAppsPageChange(job._id, idx + 1)}
                            className={`px-2 py-1 border rounded ${
                              idx + 1 === currentAppPage ? 'bg-indigo-600 text-white' : ''
                            }`}
                          >
                            {idx + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => handleAppsPageChange(job._id, currentAppPage + 1)}
                          disabled={currentAppPage === totalAppsPages}
                          className="px-2 py-1 border rounded disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500">No applicants yet.</p>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Jobs Pagination */}
      {totalJobsPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => handleJobsPageChange(currentJobsPage - 1)}
            disabled={currentJobsPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalJobsPages)].map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => handleJobsPageChange(idx + 1)}
              className={`px-3 py-1 border rounded ${
                idx + 1 === currentJobsPage ? 'bg-green-500 text-white' : ''
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => handleJobsPageChange(currentJobsPage + 1)}
            disabled={currentJobsPage === totalJobsPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;
