import Job from '../models/Job.js';
import Application from '../models/Application.js';

export const createJob = async (req, res) => {
  if (req.user.role !== 'company') {
    return res.status(403).json({ message: 'Only companies can post jobs' });
  }

  const { title, description, location, salary, skills } = req.body;

  try {
    const job = await Job.create({
      companyId: req.user._id,
      title,
      description,
      location,
      salary,
      skills: Array.isArray(skills)
        ? skills
        : skills.split(',').map(s => s.trim())
    });

    return res.status(201).json(job);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to create job', error: err.message });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('companyId', 'name')
      .sort({ createdAt: -1 });

    const validJobs = jobs.filter(job => job.title && job.description);
    return res.status(200).json(validJobs);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to fetch jobs', error: err.message });
  }
};

export const getCompanyJobs = async (req, res) => {
  if (req.user.role !== 'company') {
    return res
      .status(403)
      .json({ message: 'Only companies can view their jobs' });
  }

  try {
    const jobs = await Job.find({ companyId: req.user._id });
    return res.json(jobs);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to fetch jobs', error: err.message });
  }
};

export const getJobApplicants = async (req, res) => {
  const jobId = req.params.id;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.companyId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to view applicants' });
    }

    const applications = await Application.find({ jobId })
      .populate('userId', 'name email');
    return res.json(applications);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to fetch applicants', error: err.message });
  }
};

export const updateJob = async (req, res) => {
  const jobId = req.params.id;

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.companyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Job.findByIdAndUpdate(jobId, req.body, {
      new: true
    });
    return res.json(updated);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to update job', error: err.message });
  }
};

export const deleteJob = async (req, res) => {
  const jobId = req.params.id;

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.companyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await job.deleteOne();
    return res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to delete job', error: err.message });
  }
};
