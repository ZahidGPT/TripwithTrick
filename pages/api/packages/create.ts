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
  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const db = await connectToDatabase()
    const packagesCollection = db.collection('packages')

    const packageData = {
      ...req.body,
      createdBy: new ObjectId(session.user.id),
      createdAt: new Date(),
    }

    const result = await packagesCollection.insertOne(packageData)

    res.status(201).json({ message: 'Package created successfully', packageId: result.insertedId })
  } catch (error) {
    console.error('Error creating package:', error)
    res.status(500).json({ message: 'Error creating package' })
  }
}