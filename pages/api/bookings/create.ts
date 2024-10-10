import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { connectToDatabase } from '../../../lib/mongodb'  // Change this line
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
		const bookingsCollection = db.collection('bookings')

		const bookingData = {
			...req.body,
			userId: new ObjectId(session.user.id),
			packageId: new ObjectId(req.body.packageId),
			createdAt: new Date(),
		}

		const result = await bookingsCollection.insertOne(bookingData)

		res.status(201).json({ message: 'Booking created successfully', bookingId: result.insertedId })
	} catch (error) {
		console.error('Error creating booking:', error)
		res.status(500).json({ message: 'Error creating booking' })
	}
}