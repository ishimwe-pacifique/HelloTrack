import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  try {
    // Since we're using JWT tokens, we can't invalidate them server-side
    // without maintaining a blacklist. For now, we'll just return success
    // and let the client handle token removal.

    // In a production environment, you might want to:
    // 1. Add the token to a blacklist in your database
    // 2. Log the logout event
    // 3. Clear any server-side sessions if you're using them

    // Optional: Log the logout event
    console.log("User logged out at:", new Date().toISOString())

    res.status(200).json({
      message: "Logged out successfully",
      success: true,
    })
  } catch (error) {
    console.error("Logout error:", error)
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    })
  }
}