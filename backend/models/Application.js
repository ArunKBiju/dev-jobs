import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  note: { type: String, default: '' },
  resumeLink: { type: String, default: '' },
  locationPreference: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'interview', 'selected', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

export default mongoose.model('Application', applicationSchema);
