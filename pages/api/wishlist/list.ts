import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { connectToDatabase } from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session || !session.user || !session.user.email) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const db = await connectToDatabase()
    const wishlistItems = await db.collection('wishlists')
      .aggregate([
        { $match: { userEmail: session.user.email } },
        { $lookup: {
            from: 'packages',
            localField: 'packageId',
            foreignField: '_id',
            as: 'packageDetails'
          }
        },
        { $unwind: '$packageDetails' },
        { $replaceRoot: { newRoot: '$packageDetails' } }
      ])
      .toArray()

    res.status(200).json(wishlistItems)
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    res.status(500).json({ message: 'Error fetching wishlist' })
  }
}