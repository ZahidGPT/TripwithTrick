import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' })
  }

  try {
    console.log('Attempting to connect to MongoDB...')
    const client = await clientPromise
    console.log('Connected to MongoDB successfully')
    res.status(200).json({ message: 'MongoDB connection successful' })
  } catch (error: unknown) {
    console.error('Error connecting to MongoDB:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    res.status(500).json({ error: 'MongoDB connection failed', details: errorMessage })
  }
}