// pages/api/technicians/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/db';
import Technician from '@/models/Technician';

// Connect to the database
dbConnect.connect();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const { id } = req.query;

    switch (method) {
        case 'GET':
            try {
                if (id) {
                    // Fetch a single Technician by ID
                    const technician = await Technician.findById(id);
                    if (!technician) {
                        return res.status(404).json({ success: false, message: 'Technician not found' });
                    }
                    return res.status(200).json({ success: true, data: technician });
                } else {
                    // Fetch all technicians if no ID is provided
                    const technicians = await Technician.find({});
                    return res.status(200).json({ success: true, data: technicians });
                }
            } catch (error) {
                console.error('Error fetching technicians:', error);
                res.status(400).json({ 
                    success: false, 
                    error: error instanceof Error ? error.message : 'An unknown error occurred' 
                });
            }
            break;

        case 'POST':
            try {
                console.log('Creating technician with data:', req.body);
                const technician = await Technician.create(req.body);
                res.status(201).json({ success: true, data: technician });
            } catch (error) {
                console.error('Error creating technician:', error);
                res.status(400).json({ 
                    success: false, 
                    error: error instanceof Error ? error.message : 'An unknown error occurred' 
                });
            }
            break;

        case 'PUT':
            try {
                if (!id) {
                    return res.status(400).json({ success: false, message: 'Technician ID is required' });
                }
                
                const technician = await Technician.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
                if (!technician) {
                    return res.status(404).json({ success: false, message: 'Technician not found' });
                }
                res.status(200).json({ success: true, data: technician });
            } catch (error) {
                console.error('Error updating technician:', error);
                res.status(400).json({ 
                    success: false, 
                    error: error instanceof Error ? error.message : 'An unknown error occurred' 
                });
            }
            break;

        case 'DELETE':
            try {
                if (!id) {
                    return res.status(400).json({ success: false, message: 'Technician ID is required' });
                }
                
                const deletedTechnician = await Technician.findByIdAndDelete(id);
                if (!deletedTechnician) {
                    return res.status(404).json({ success: false, message: 'Technician not found' });
                }
                res.status(200).json({ success: true, data: {}, message: 'Technician deleted successfully' });
            } catch (error) {
                console.error('Error deleting technician:', error);
                res.status(400).json({ 
                    success: false, 
                    error: error instanceof Error ? error.message : 'An unknown error occurred' 
                });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
    }
}