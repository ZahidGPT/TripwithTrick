import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'
import { Session } from 'next-auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req }) as Session | null

  if (!session || !session.user || !session.user.id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const client = await clientPromise
    const db = client.db()

    const userId = new ObjectId(session.user.id)

    console.log('Fetching user profile for userId:', userId)

    const user = await db.collection('users').findOne({ _id: userId })
    
    if (!user) {
      console.log('User not found for userId:', userId)
      return res.status(404).json({ error: 'User not found' })
    }

    console.log('User found:', user)

    const createdPackages = await db.collection('packages').find({ createdBy: session.user.email }).toArray()
    console.log('Created packages:', createdPackages)

    const joinedTrips = await db.collection('trips').find({ participants: userId }).toArray()
    console.log('Joined trips:', joinedTrips)

    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
      },
      createdPackages,
      joinedTrips,
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}