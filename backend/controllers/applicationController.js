import Application from '../models/Application.js';
import Job from '../models/Job.js';

export const applyToJob = async (req, res) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ message: 'Only users can apply to jobs' });
  }

  const { note } = req.body;
  const { jobId } = req.params;
  const resumeLink = req.file ? `/uploads/resumes/${req.file.filename}` : '';

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const existing = await Application.findOne({ userId: req.user._id, jobId });
    if (existing) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    const application = await Application.create({
      userId: req.user._id,
      jobId,
      note,
      resumeLink,
      status: 'pending'
    });

    return res.status(201).json(application);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to apply', error: err.message });
  }
};

export const getUserApplications = async (req, res) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ message: 'Only users can view their applications' });
  }

  try {
    const applications = await Application
      .find({ userId: req.user._id })
      .populate({
        path: 'jobId',
        populate: {
          path: 'companyId',
          model: 'User',
          select: 'name email'
        },
        select: 'title companyId location salary skills'
      });

    const formatted = applications.map(app => ({
      ...app.toObject(),
      job: app.jobId
    }));

    return res.json(formatted);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch applications', error: err.message });
  }
};

export const getApplicantsForJob = async (req, res) => {
  if (req.user.role !== 'company') {
    return res.status(403).json({ message: 'Only companies can view applicants' });
  }

  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.companyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view applicants' });
    }

    const applicants = await Application
      .find({ jobId })
      .populate('userId', 'name email');

    return res.json(applicants);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch applicants', error: err.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  if (req.user.role !== 'company') {
    return res.status(403).json({ message: 'Only companies can update application status' });
  }

  try {
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const job = await Job.findById(application.jobId);
    if (job.companyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    return res.json({ message: 'Status updated', application });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
};
