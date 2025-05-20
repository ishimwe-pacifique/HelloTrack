import { NextApiRequest, NextApiResponse } from "next";
import db from "@/utils/db"; // Replace with your actual database connection
import qrCodes from '@/models/QrCode';

db.connect();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { tractorId, qrCodeValue } = req.body;

        if (!tractorId || !qrCodeValue) {
            console.error("Invalid input:", { tractorId, qrCodeValue });
            return res.status(400).json({ error: "Invalid input data" });
        }
        try {
            console.log(req.body)
            // Create a new record in the database for the QR code
            const newQrCode = await qrCodes.create(
                req.body,
            );

            res.status(201).json({ message: "QR Code saved successfully!", qrCode: newQrCode });
        } catch (error) {
            console.error("Error saving QR Code:", error);
            res.status(500).json({ error: "Failed to save QR Code" });
        }
    } if (req.method === "GET") {
const { tractorId } = req.query; // Destructure tractorId from query
    if (!tractorId) {
      return res.status(400).json({ error: "Tractor ID is required" });
    }
try {
            const qrCode = await qrCodes.find({tractorId: tractorId}).exec(); // Fetch the QR code from the database
            if (!qrCode) {
                return res.status(404).json({ error: "QR Code not found" });
            }

            res.status(200).json({ qrCode });
        } catch (error) {
            console.error("Error fetching QR Code:", error);
            res.status(500).json({ error: "Failed to fetch QR Code" });
        }
    } else {
        res.setHeader("Allow", ["POST", "GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
