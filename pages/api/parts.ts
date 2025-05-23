/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import Part from "@/models/Parts"; // adjust path
import dbConnect from "@/utils/db"; // your mongoose connection

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect.connect();

    const { method, query, body } = req;
    const id = query.id as string | undefined;

    // Validate id if present
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid part ID" });
    }

    try {
        // If no id in query: operate on collection (list or create)
        if (!id) {
            if (method === "GET") {
                // List all parts
                const parts = await Part.find({});
                return res.status(200).json(parts);
            } else if (method === "POST") {
                // Create new part
                const newPart = new Part(body);
                await newPart.save();
                return res.status(201).json(newPart);
            } else {
                res.setHeader("Allow", ["GET", "POST"]);
                return res.status(405).end(`Method ${method} Not Allowed`);
            }
        }

        // If id is present: operate on specific part (get or update)
        if (id) {
            const part = await Part.findById(id);
            if (!part) {
                return res.status(404).json({ message: "Part not found" });
            }

            if (method === "GET") {
                return res.status(200).json(part);
            } else if (method === "PUT") {
                const {
                    partName,
                    partNumber,
                    quantity,
                    unitPrice,
                    remainingQuantity,
                    adjustQuantity,
                    adjustType,
                } = body;

                if (partName !== undefined) part.partName = partName;
                if (partNumber !== undefined) part.partNumber = partNumber;
                if (quantity !== undefined) part.quantity = quantity;
                if (unitPrice !== undefined) part.unitPrice = unitPrice;
                if (remainingQuantity !== undefined) part.remainingQuantity = remainingQuantity;

                if (adjustQuantity && adjustType) {
                    if (adjustType === "reduce") {
                        try {
                            part.reduceQuantity(adjustQuantity);
                        } catch (err: any) {
                            return res.status(400).json({ message: err.message });
                        }
                    } else if (adjustType === "increase") {
                        part.increaseQuantity(adjustQuantity);
                    }
                } else {
                    await part.save();
                }

                await part.save();
                return res.status(200).json(part);
            } else if (method === "DELETE") {
                try {
                    const deletedPart = await Part.findByIdAndDelete(id);

                    if (!deletedPart) {
                        return res.status(404).json({ message: 'Part not found' });
                    }

                    return res.status(200).json({ message: 'Part deleted successfully' });
                } catch (error) {
                    console.error('Delete error:', error);
                    return res.status(500).json({ message: 'Server error' });
                }
            } else {
                res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
                return res.status(405).end(`Method ${method} Not Allowed`);
            }
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}
