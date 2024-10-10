import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import clientPromise from '../../../lib/mongodb'
import { MongoClient } from 'mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, email, password } = req.body
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const hashedPassword = await bcrypt.hash(password, 10) // Use await for async operation

    const client: MongoClient = await clientPromise
    const db = client.db()

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // Insert new user
    const result = await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
    })

    console.log('New user created:', { name, email, _id: result.insertedId })

    res.status(201).json({ message: 'User created successfully', userId: result.insertedId })
  } catch (error) {
    console.error('Error in signup:', error) // Log the error for debugging
    res.status(500).json({ error: 'Internal server error' })
  }
}