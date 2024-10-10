import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]'
import { Session } from 'next-auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions) as Session | null
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const client = await clientPromise
    const db = client.db()

    const userId = new ObjectId(session.user.id)

    const user = await db.collection('users').findOne({ _id: userId })
    if (!user || !user.wishlist) {
      return res.status(200).json([])
    }

    const wishlistItems = await db.collection('packages').find({
      _id: { $in: user.wishlist }
    }).toArray()

    res.status(200).json(wishlistItems)
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    res.status(500).json({ error: 'An error occurred while fetching the wishlist' })
  }
}