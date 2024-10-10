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

  const { packageId } = req.query

  if (!packageId || typeof packageId !== 'string') {
    return res.status(400).json({ message: 'Package ID is required' })
  }

  try {
    const db = await connectToDatabase()
    const wishlistItem = await db.collection('wishlists').findOne({
      userEmail: session.user.email,
      packageId: new ObjectId(packageId),
    })

    res.status(200).json({ isInWishlist: !!wishlistItem })
  } catch (error) {
    console.error('Error checking wishlist status:', error)
    res.status(500).json({ message: 'Error checking wishlist status' })
  }
}