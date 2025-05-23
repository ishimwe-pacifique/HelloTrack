import { Schema, model, Document } from "mongoose";

interface IPart extends Document {
  partName: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
  remainingQuantity: number; // To track how much is left
  reduceQuantity: (amount: number) => void; // Method to reduce quantity
  increaseQuantity: (amount: number) => void; // Method to increase quantity
}

const PartSchema = new Schema<IPart>(
  {
    partName: {
      type: String,
      required: true,
    },
    partNumber: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    remainingQuantity: {
      type: Number,
      required: true,
      default: function () {
        return this.quantity;
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Method to reduce quantity
PartSchema.methods.reduceQuantity = function (amount: number): void {
  if (this.remainingQuantity - amount < 0) {
    throw new Error("Insufficient parts in inventory.");
  }
  this.remainingQuantity -= amount;
  this.save();
};

// Method to increase quantity
PartSchema.methods.increaseQuantity = function (amount: number): void {
  this.remainingQuantity += amount;
  this.save();
};

// Model creation
const Part = model<IPart>("Part", PartSchema);

export default Part;
