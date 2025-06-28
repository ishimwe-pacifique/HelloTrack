import mongoose, { Schema, type Document } from "mongoose"

interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  phone: string
  profilePicture: string[]
  password?: string
  permissions: string[]
  role: string
  agreeTerms: boolean
  createdAt?: Date
  updatedAt?: Date
}

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    profilePicture: { type: [String], default: [] },
    password: { type: String, required: true },
    permissions: { type: [String], default: [] },
    role: { type: String, required: true },
    agreeTerms: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  },
)

const UserModel = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default UserModel