import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { connectToDatabase } from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const session = await getServerSession(req, res, authOptions)
  if (!session || !session.user || !session.user.email) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { packageId } = req.body

  if (!packageId) {
    return res.status(400).json({ message: 'Package ID is required' })
  }

  try {
    const db = await connectToDatabase()
    const wishlistCollection = db.collection('wishlists')

    const existingItem = await wishlistCollection.findOne({
      userEmail: session.user.email,
      packageId: new ObjectId(packageId),
    })

    if (existingItem) {
      await wishlistCollection.deleteOne({
        userEmail: session.user.email,
        packageId: new ObjectId(packageId),
      })
      res.status(200).json({ message: 'Package removed from wishlist', isInWishlist: false })
    } else {
      await wishlistCollection.insertOne({
        userEmail: session.user.email,
        packageId: new ObjectId(packageId),
      })
      res.status(200).json({ message: 'Package added to wishlist', isInWishlist: true })
    }
  } catch (error) {
    console.error('Error toggling wishlist item:', error)
    res.status(500).json({ message: 'Error toggling wishlist item' })
  }
}