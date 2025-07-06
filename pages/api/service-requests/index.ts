// pages/api/service-requests/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/db';
import ServiceRequest from '@/models/ServiceRequest';

// Connect to the database
dbConnect.connect();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const { id } = req.query;

    switch (method) {
        case 'GET':
            try {
                if (id) {
                    const request = await ServiceRequest.findById(id)
                        .populate('technicianId', 'firstName lastName')
                        .populate('tractor', 'name tractorId')
                        .populate('parts.partId', 'partName partNumber');
                    
                    if (!request) {
                        return res.status(404).json({ 
                            success: false, 
                            message: 'Service Request not found' 
                        });
                    }
                    return res.status(200).json({ success: true, data: request });
                } else {
                    const requests = await ServiceRequest.find({})
                        .populate('technicianId', 'firstName lastName')
                        .populate('tractor', 'name tractorId')
                        .populate('parts.partId', 'partName partNumber')
                        .sort({ createdAt: -1 });
                    
                    return res.status(200).json({ success: true, data: requests });
                }
            } catch (error) {
                console.error('Error fetching service requests:', error);
                return res.status(400).json({ 
                    success: false, 
                    error: error instanceof Error ? error.message : 'An unknown error occurred' 
                });
            }

        case 'POST':
            try {
                console.log('Creating service request with data:', req.body);
                
                // Validate required fields
                const { technicianId, tractor } = req.body;
                
                if (!technicianId) {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'technicianId is required' 
                    });
                }
                
                if (!tractor) {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'tractor is required' 
                    });
                }

                const serviceRequest = await ServiceRequest.create(req.body);
                
                // Populate the created request for the response
                const populatedRequest = await ServiceRequest.findById(serviceRequest._id)
                    .populate('technicianId', 'firstName lastName')
                    .populate('tractor', 'name tractorId');
                
                console.log('Service request created successfully:', populatedRequest);
                
                res.status(201).json({ 
                    success: true, 
                    data: populatedRequest 
                });
            } catch (error) {
                console.error('Error creating service request:', error);
                res.status(400).json({ 
                    success: false, 
                    error: error instanceof Error ? error.message : 'An unknown error occurred',
                    details: error
                });
            }
            break;

        case 'PUT':
            try {
                if (id) {
                    console.log('Updating service request:', id);
                    const updatedRequest = await ServiceRequest.findByIdAndUpdate(
                        id, 
                        req.body, 
                        { new: true, runValidators: true }
                    ).populate('technicianId', 'firstName lastName')
                     .populate('tractor', 'name tractorId');
                    
                    if (!updatedRequest) {
                        return res.status(404).json({ 
                            success: false, 
                            message: 'Service Request not found' 
                        });
                    }
                    
                    res.status(200).json({ success: true, data: updatedRequest });
                } else {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Service Request ID is required' 
                    });
                }
            } catch (error) {
                console.error('Error updating service request:', error);
                res.status(400).json({ 
                    success: false, 
                    error: error instanceof Error ? error.message : 'An unknown error occurred' 
                });
            }
            break;

        case 'DELETE':
            try {
                if (!id) {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Service Request ID is required' 
                    });
                }
                
                const deletedRequest = await ServiceRequest.findByIdAndDelete(id);
                
                if (!deletedRequest) {
                    return res.status(404).json({ 
                        success: false, 
                        message: 'Service Request not found' 
                    });
                }
                
                res.status(200).json({ 
                    success: true, 
                    data: {}, 
                    message: 'Service Request deleted successfully' 
                });
            } catch (error) {
                console.error('Error deleting service request:', error);
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