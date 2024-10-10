import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { packageId } = req.body;

    if (!packageId) {
      return res.status(400).json({ message: "Package ID is required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db();

      const bookings = await db.collection('bookings').aggregate([
        { $match: { packageId: new ObjectId(packageId) } },
        { $group: { _id: null, totalPeopleBooked: { $sum: "$numberOfPeople" } } }
      ]).toArray();

      const totalPeopleBooked = bookings.length > 0 ? bookings[0].totalPeopleBooked : 0;

      return res.status(200).json({ totalPeopleBooked });
    } catch (error) {
      console.error("Error fetching bookings count:", error);
      return res.status(500).json({ message: "Error fetching bookings count" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}