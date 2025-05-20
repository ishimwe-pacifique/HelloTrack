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
  name: string;
  hours: number;
  lastService: string;
  status: string;
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
  tractorDetails?: AssignedTractor;
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
  tractorDetails: {
    type: {
      name: { type: String },
      hours: { type: Number },
      lastService: { type: String },
      status: { type: String },
      serviceHistory: [
        {
          date: { type: String },
          description: { type: String },
        },
      ],
      upcomingServices: [
        {
          date: { type: String },
          description: { type: String },
        },
      ],
    },
    required: false,
  },
});

const TractorOwnerModel: Model<TractorOwner> =
  mongoose.models.TractorOwner || mongoose.model<TractorOwner>('TractorOwner', TractorOwnerSchema);

export default TractorOwnerModel;
