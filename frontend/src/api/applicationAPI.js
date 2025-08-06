import api from './api';

export const submitApplication = async ({ jobId, resume, coverLetter }) => {
  const res = await api.post('/applications', { jobId, resume, coverLetter });
  return res.data;
};

export const getUserApplications = async () => {
  const res = await api.get('/applications/user');
  return res.data;
};
