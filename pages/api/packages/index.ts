import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const client = await clientPromise
    const db = client.db()

    const { destination, pickup, days } = req.query

    let query: any = {}
    if (destination) {
      query.location = { $regex: destination as string, $options: 'i' }
    }
    if (pickup) {
      query.pickupLocation = { $regex: pickup as string, $options: 'i' }
    }
    if (days) {
      query.tripDays = parseInt(days as string, 10) // Changed from numberOfDays to tripDays
    }

    const packages = await db.collection('packages').find(query).toArray()

    res.status(200).json(packages)
  } catch (error) {
    console.error('Error fetching packages:', error)
    res.status(500).json({ error: 'An error occurred while fetching packages' })
  }
}