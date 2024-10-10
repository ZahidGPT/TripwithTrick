import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'
import { WithId, Document } from 'mongodb'

interface User {
  _id: { $oid: string };
  name: string;
  email: string;
  password: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' })
  }

  try {
    console.log('Attempting to connect to MongoDB...')
    const client = await clientPromise
    console.log('Connected to MongoDB successfully')
    const db = client.db() // This will use the database specified in the URI
    
    console.log('Database name:', db.databaseName)

    console.log('Fetching users...')
    const usersCollection = db.collection('users')
    
    console.log('Collection name:', usersCollection.collectionName)

    const users = await usersCollection.find({}).toArray()
    console.log(`Found ${users.length} users`)
    console.log('Raw users data:', JSON.stringify(users.slice(0, 2), null, 2))

    if (users.length > 0) {
      console.log('First user:', JSON.stringify(users[0], null, 2))
    } else {
      console.log('No users found in the collection')
    }

    // Remove sensitive information and handle ObjectId
    const safeUsers = users.map((user: WithId<Document>) => {
      console.log('Processing user:', user)
      return {
        _id: user._id.toString(),
        name: user.name as string,
        email: user.email as string,
      }
    })

    console.log('Safe users:', JSON.stringify(safeUsers.slice(0, 2), null, 2))

    res.status(200).json(safeUsers)
  } catch (error: unknown) {
    console.error('Error in debug/users endpoint:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    res.status(500).json({ error: 'Internal server error', details: errorMessage })
  }
}