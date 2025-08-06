import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../redux/jobSlice';
import { Link } from 'react-router-dom';

const JobList = () => {
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.jobs);
  const [selectedJob, setSelectedJob] = useState(null);

  const [titleSearch, setTitleSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [skillsSearch, setSkillsSearch] = useState('');

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleApplyClick = (job) => {
    setSelectedJob(job);
  };

  const closeModal = () => {
    setSelectedJob(null);
  };

  const matchesFilters = (job) => {
    const titleMatch = job.title?.toLowerCase().includes(titleSearch.toLowerCase());
    const locationMatch = job.location?.toLowerCase().includes(locationSearch.toLowerCase());

    const skillsMatch = skillsSearch.trim()
      ? skillsSearch
          .toLowerCase()
          .split(',')
          .map((s) => s.trim())
          .every((searchSkill) =>
            job.skills?.map((skill) => skill.toLowerCase()).includes(searchSkill)
          )
      : true;

    return titleMatch && locationMatch && skillsMatch;
  };

  const filteredJobs = jobs.filter(matchesFilters);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Available Jobs</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title"
          className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={titleSearch}
          onChange={(e) => setTitleSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by location"
          className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={locationSearch}
          onChange={(e) => setLocationSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by skills (comma separated)"
          className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={skillsSearch}
          onChange={(e) => setSkillsSearch(e.target.value)}
        />
      </div>

      {loading && <p>Loading jobs...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid gap-4">
        {filteredJobs.length === 0 && <p className="text-gray-500">No jobs match your filters.</p>}

        {filteredJobs.map((job) => (
          <div key={job._id} className="border p-4 rounded shadow bg-white">
            <h3 className="text-xl font-bold">{job.title}</h3>
            <p className="text-sm text-gray-700 mb-2">{job.description}</p>
            <p className="text-gray-600 mb-2">Location: {job.location || 'N/A'}</p>
            <p className="text-gray-600 mb-2">Salary: {job.salary || 'N/A'}</p>
            <p className="text-gray-600 mb-4">Posted by: {job.companyId?.name || 'Unknown'}</p>
            <button
              onClick={() => handleApplyClick(job)}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        ))}
      </div>

      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-2">{selectedJob.title}</h2>
            <p className="text-gray-700 mb-2">{selectedJob.description}</p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Location:</span> {selectedJob.location || 'N/A'}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Salary:</span> {selectedJob.salary || 'N/A'}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              <span className="font-semibold">Company:</span> {selectedJob.companyId?.name || 'Unknown'}
            </p>

            {selectedJob.skills?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-sm text-gray-800 px-3 py-1 rounded-full"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Link
              to={`/apply/${selectedJob._id}`}
              className="block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center"
            >
              Proceed to Application
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobList;
