// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { History } from "../../Svr_fns/saveHistory";
export default async function handler(req, res) {
  try {
    // Ensure user is authenticated
    // if (!req.isAuthenticated() || !req.user) {
    //   return res.status(401).json({ error: "User not authenticated" });
    // }

    // Check for POST request method
    if (req.method === "POST") {
      const userhistory = await History.find();

      // Check if user history exists
      if (!userhistory || userhistory.length === 0) {
        return res.status(404).json({ message: "No history found for this user" });
      }

      // Respond with user history data
      return res.status(200).json({ data: userhistory });
    } else {
      // Handle unsupported HTTP methods
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    // Handle server errors
    console.error("Error fetching user history:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
