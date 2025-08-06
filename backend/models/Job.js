import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, required: true },
    skills: [{ type: String }]
  },
  { timestamps: true }
);

export default mongoose.model('Job', jobSchema);
