// pages/api/tractor-owners/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/db'; // Create a helper function for MongoDB connection
import TractorOwner from '@/models/TractorOwner';

// Connect to the database
dbConnect.connect();

// GET: Retrieve all tractor owners
// POST: Add a new tractor owner
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const { id, tractorId } = req.query;

    switch (method) {
        case 'GET':
            try {
                if (id) {
                    // Fetch a single tractor owner by ID
                    const owner = await TractorOwner.findById(id);
                    if (!owner) {
                        return res.status(404).json({ success: false, message: 'Tractor owner not found' });
                    }
                    return res.status(200).json({ success: true, data: owner });
                } else if (tractorId) {
                    // Fetch a single tractor owner by tractorId
                    const owner = await TractorOwner.findOne({ tractorId: tractorId });
                    if (!owner) {
                        return res.status(404).json({ success: false, message: 'Tractor owner not found' });
                    }
                    return res.status(200).json({ success: true, data: owner });
                }

                else {
                    // Fetch all tractor owners if no ID is provided
                    const owners = await TractorOwner.find({});
                    return res.status(200).json({ success: true, data: owners });
                }
            } catch (error) {
                res.status(400).json({ success: false, error: error });
            }
            break;

        case 'POST':
            try {
                console.log(req.body)
                const owner = await TractorOwner.create(req.body);
                res.status(201).json({ success: true, data: owner });
            } catch (error) {
                res.status(400).json({ success: false, error });
            }
            break;
        case 'PUT':
            try {
                console.log(id)
                const owner = await TractorOwner.findByIdAndUpdate(id, req.body, { new: true });
                if (!owner) {
                    return res.status(404).json({ success: false, message: 'Tractor owner not found' });
                }
                res.status(200).json({ success: true, data: owner });
            } catch (error) {
                res.status(400).json({ success: false, error });
            }
            break;

        case 'DELETE':
            try {
                const deletedOwner = await TractorOwner.findByIdAndDelete(id);
                if (!deletedOwner) {
                    return res.status(404).json({ success: false, message: 'Tractor owner not found' });
                }
                res.status(200).json({ success: true, data: {} });
            } catch (error) {
                res.status(400).json({ success: false, error });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
    }
}
