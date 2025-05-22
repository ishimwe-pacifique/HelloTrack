import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITechnician extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  specialty?: string;
  experienceYears?: number;
  certifications?: string[];
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const TechnicianSchema: Schema<ITechnician> = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    specialty: { type: String, default: '' },
    experienceYears: { type: Number, default: 0 },
    certifications: { type: [String], default: [] },
    status: { type: String, default: 'active' },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Avoid recompilation errors in development with Next.js hot reload
const Technician: Model<ITechnician> = mongoose.models.Technician || mongoose.model<ITechnician>('Technician', TechnicianSchema);

export default Technician;
