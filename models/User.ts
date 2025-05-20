import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    profilePicture: { type: [String] },
    password: { type: String, required: true },
    permissions: { type: [String], default: [] },
    role: { type: String, enum: ['user', 'admin','owner','technician','hub-lead'], default: 'user' },
    agreeTerms: { type: Boolean, default: false },
    resetToken: { type: String, default: '' },
    resetTokenExpiration: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
