import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const client = await clientPromise
    const db = client.db()

    const { bookingId, amount } = req.body

    // Here you would integrate with your payment provider (PayPal or Razorpay)
    // For now, we'll just create a payment record in the database

    const payment = {
      bookingId: new ObjectId(bookingId),
      amount,
      status: 'pending',
      createdAt: new Date()
    }

    const result = await db.collection('payments').insertOne(payment)

    res.status(201).json({ paymentId: result.insertedId })
  } catch (error) {
    console.error('Error creating payment:', error)
    res.status(500).json({ error: 'An error occurred while creating the payment' })
  }
}