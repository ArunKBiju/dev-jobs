import api from './api';

export const getAllJobs = async () => {
  const res = await api.get('/jobs');
  return res.data;
};

export const createJob = async (jobData) => {
  const res = await api.post('/jobs', jobData);
  return res.data;
};
