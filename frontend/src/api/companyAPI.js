import api from './api';

export const getApplicantsForJob = async (jobId) => {
  const res = await api.get(`/jobs/${jobId}/applicants`, {
    withCredentials: true
  });
  return res.data;
};
