import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const client = await clientPromise
      const db = client.db()

      const packageData = await db.collection('packages').findOne({ _id: new ObjectId(id as string) })

      if (!packageData) {
        return res.status(404).json({ message: 'Package not found' })
      }

      res.status(200).json(packageData)
    } catch (error) {
      console.error('Error fetching package:', error)
      res.status(500).json({ message: 'Error fetching package' })
    }
  } else if (req.method === 'PUT') {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    try {
      const client = await clientPromise
      const db = client.db()

      const updatedPackage = req.body
      delete updatedPackage._id // Remove _id from the update object

      const result = await db.collection('packages').updateOne(
        { _id: new ObjectId(id as string) },
        { $set: updatedPackage }
      )

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Package not found' })
      }

      res.status(200).json({ message: 'Package updated successfully' })
    } catch (error) {
      console.error('Error updating package:', error)
      res.status(500).json({ message: 'Error updating package' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}