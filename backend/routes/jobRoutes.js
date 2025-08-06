import express from 'express';
import {
  createJob,
  getCompanyJobs,
  getJobApplicants,
  updateJob,
  deleteJob,
  getAllJobs
} from '../controllers/jobController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllJobs);
router.post('/', protect, createJob);
router.get('/company', protect, getCompanyJobs);
router.get('/:id/applicants', protect, getJobApplicants);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);

export default router;
