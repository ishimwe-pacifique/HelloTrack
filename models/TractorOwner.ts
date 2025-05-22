import mongoose, { Document, Model, Schema } from 'mongoose';

interface ServiceHistory {
  date: string;
  description: string;
}

interface UpcomingService {
  date: string;
  description: string;
}

interface AssignedTractor {
  partsNeeded?: boolean;
  additionalNotes?: string;
  hours: number;
  serviceHistory: ServiceHistory[];
  upcomingServices: UpcomingService[];
}

interface TractorOwner extends Document {
  name: string;
  phoneNumber: string;
  email: string;
  physicalAddress: string;
  location: string;
  assignedTractor: string;
  newRegistrationNumber: string;
  tractorId: string;
  welcomeEmailStatus: string;

  tractorInfo?: AssignedTractor;
  qrCodeValue?: string;
}

const TractorOwnerSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  physicalAddress: { type: String, required: true },
  location: { type: String, required: true },
  assignedTractor: { type: String, required: true },
  newRegistrationNumber: { type: String, required: true },
  tractorId: { type: String, required: true, unique: true },
  welcomeEmailStatus: { type: String, default: 'Pending' },

  qrCodeValue: { type: String },
  tractorInfo: {
    type: {
      partsNeeded: { type: Boolean, default: false },
      additionalNotes: { type: String,default : '' },
      hours: { type: Number },
      serviceHistory: [
        {
          date: { type: String },
          description: { type: String }, status: { type: String },
        },
      ],
      upcomingServices: [
        {
          date: { type: String },
          description: { type: String }, status: { type: String },
        },
      ],
    },
    required: false,
  },
});

const TractorOwnerModel: Model<TractorOwner> =
  mongoose.models.TractorOwner || mongoose.model<TractorOwner>('TractorOwner', TractorOwnerSchema);

export default TractorOwnerModel;
