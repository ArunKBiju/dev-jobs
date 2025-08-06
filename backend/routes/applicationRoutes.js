import express from 'express';
import {
  applyToJob,
  getUserApplications,
  getApplicantsForJob,
  updateApplicationStatus
} from '../controllers/applicationController.js';
import protect from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/:jobId/apply', protect, upload.single('resume'), applyToJob);
router.get('/user', protect, getUserApplications);
router.get('/company/:jobId', protect, getApplicantsForJob);
router.patch('/status/:applicationId', protect, updateApplicationStatus);

export default router;
