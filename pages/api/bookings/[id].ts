import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const session = await getServerSession(req, res, authOptions)
    if (!session || !session.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { id } = req.query

    if (!id) {
      return res.status(400).json({ message: 'Booking ID is required' })
    }

    try {
      const client = await clientPromise
      const db = client.db()

      const booking = await db.collection('bookings').findOne({ _id: new ObjectId(id as string) })

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' })
      }

      if (booking.userId.toString() !== session.user.id) {
        return res.status(403).json({ message: 'Forbidden' })
      }

      const packageDetails = await db.collection('packages').findOne({ _id: new ObjectId(booking.packageId) })

      const bookingConfirmation = {
        _id: booking._id,
        packageId: booking.packageId,
        packageTitle: packageDetails ? packageDetails.title : 'Unknown Package',
        travelers: booking.travelers,
        createdAt: booking.createdAt
      }

      res.status(200).json(bookingConfirmation)
    } catch (error) {
      console.error('Error fetching booking:', error)
      res.status(500).json({ message: 'Error fetching booking' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}