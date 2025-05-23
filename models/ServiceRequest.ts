/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, model, models } from 'mongoose';

const CounterSchema = new Schema({
    name: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 },
});
const Counter = models.Counter || model('Counter', CounterSchema);


const ServiceRequestSchema = new Schema(
    {
        slug: {
            type: String,
            unique: true,
            required: true,
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high','urgent'], // Adjust priorities as needed
            default: 'medium',
        },
        technicianId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Technician',
            required: true,
        },
        requestId: {
            type: String,
        },
        tractor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TractorOwner',
            required: true,
        },
        maintenanceTask: {
            type: String,
            required: false,
        },
        commonProblem: {
            type: String,
            required: false,
        },
        parts: [
            {
                partId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Part', 
                },
                quantity: {
                    type: Number,
                    min: 1,
                },
            },
        ],
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'completed'],
            default: 'pending',
        },
        assignedAt: {
            type: Date,
            default: Date.now,
        },
        completedAt: {
            type: Date,
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

ServiceRequestSchema.pre('validate', async function (next) {
    if (this.isNew && !this.slug) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { name: 'serviceRequest' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );

            const seqNumber = counter.seq.toString().padStart(3, '0'); // e.g., '002'
            this.slug = `SR-${seqNumber}`;
            next();
        } catch (error: any) {
            next(error);
        }
    } else {
        next();
    }
});


const ServiceRequest = models.ServiceRequest || model('ServiceRequest', ServiceRequestSchema);

export default ServiceRequest;
