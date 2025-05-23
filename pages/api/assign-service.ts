// pages/api/tractor-owners/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/db'; // Create a helper function for MongoDB connection
import ServiceRequest from '@/models/ServiceRequest';

// Connect to the database
dbConnect.connect();

// GET: Retrieve all tractor owners
// POST: Add a new tractor owner
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const { id } = req.query;

    switch (method) {
        case 'GET':
            try {
                if (id) {
                    // Fetch a single ServiceRequest by ID with populated references
                    const request = await ServiceRequest.findById(id)
                        .populate('technicianId') // Populate technician details
                        .populate('tractorId') // Populate tractor details
                        .populate('parts.partId'); // Populate part details
                    if (!request) {
                        return res.status(404).json({ success: false, message: 'Service Request not found' });
                    }
                    return res.status(200).json({ success: true, data: request });
                } else {
                    // Fetch all Service Requests with populated references
                    const requests = await ServiceRequest.find({})
                        .populate('technicianId', 'firstName lastName') // Populate technician details
                        // .populate('tractor', 'name tractorInfo tractorId')
                        .populate('parts.partId', 'partName partNumber') // Populate part details
                        .sort({ createdAt: -1 }); // Sort by createdAt in descending order
                    if (!requests) {
                        return res.status(404).json({ success: false, message: 'No Service Requests found' });
                    }
                    return res.status(200).json({ success: true, data: requests });
                }
            } catch (error) {
                return res.status(400).json({ success: false, error });
            }

        case 'POST':
            try {
                console.log(req.body)
                const owner = await ServiceRequest.create(req.body);
                res.status(201).json({ success: true, data: owner });
            } catch (error) {
                res.status(400).json({ success: false, error });
            }
            break;
        case 'PUT':
            try {
                if (id) {
                    const owner = await ServiceRequest.findByIdAndUpdate(id, req.body, { new: true });
                    if (!owner) {
                        return res.status(404).json({ success: false, message: 'Technician not found' });
                    }
                    res.status(200).json({ success: true, data: owner });
                }
                else {
                    return res.status(400).json({ success: false, message: 'Tractor ID is required' });
                }
            } catch (error) {
                res.status(400).json({ success: false, error });
            }
            break;

        case 'DELETE':
            try {
                const deletedOwner = await ServiceRequest.findByIdAndDelete(id);
                if (!deletedOwner) {
                    return res.status(404).json({ success: false, message: 'Technician not found' });
                }
                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false, error });
            }
            break;
        default:
            res.setHeader('Allow', ['GET',"POST", 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
    }
}
