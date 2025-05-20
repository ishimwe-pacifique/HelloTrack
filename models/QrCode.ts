import mongoose, { Document, Model, Schema } from 'mongoose';

interface QRCode extends Document {
  tractorId: string;
  qrCodeValue: string;
}

const QRCodeSchema: Schema = new mongoose.Schema({
  qrCodeValue: { type: String, required: true },
  tractorId: { type: String, required: true },
},);

const QRCodeModel: Model<QRCode> =
  mongoose.models.QRCode || mongoose.model<QRCode>('QRCode', QRCodeSchema);

export default QRCodeModel;
