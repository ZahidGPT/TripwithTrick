import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]'
import { Session } from 'next-auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const session = await getServerSession(req, res, authOptions) as Session | null
    if (!session || !session.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    try {
      const client = await clientPromise
      const db = client.db()

      const bookings = await db.collection('bookings').aggregate([
        { $match: { userId: new ObjectId(session.user.id) } },
        {
          $lookup: {
            from: 'packages',
            localField: 'packageId',
            foreignField: '_id',
            as: 'package'
          }
        },
        { $unwind: { path: '$package', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            packageId: 1,
            bookingDate: '$createdAt',
            travelers: 1,
            totalAmount: { $multiply: ['$travelers', '$package.price'] },
            package: {
              _id: '$package._id',
              title: '$package.title',
              description: '$package.description',
              location: '$package.location',
              tripDays: '$package.tripDays',
              headerImage: '$package.headerImage',
              price: '$package.price'
            }
          }
        }
      ]).toArray()

      res.status(200).json(bookings)
    } catch (error) {
      console.error('Error fetching user bookings:', error)
      res.status(500).json({ message: 'Error fetching user bookings' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}