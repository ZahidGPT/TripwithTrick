import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { useSession } from 'next-auth/react'

interface BookingConfirmation {
  _id: string
  packageId: string
  packageTitle: string
  travelers: number
  createdAt: string
}

export default function BookingConfirmationPage() {
  const [bookingDetails, setBookingDetails] = useState<BookingConfirmation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const { id } = router.query
  const { data: session } = useSession()

  useEffect(() => {
    if (id && session) {
      fetchBookingDetails()
    }
  }, [id, session])

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`/api/bookings/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch booking details')
      }
      const data = await response.json()
      setBookingDetails(data)
    } catch (error) {
      setError('Error fetching booking details')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Layout>Loading...</Layout>
  if (error) return <Layout>Error: {error}</Layout>
  if (!bookingDetails) return <Layout>Booking not found</Layout>

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Booking Confirmation</h1>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <p className="mb-2"><strong>Booking ID:</strong> {bookingDetails._id}</p>
          <p className="mb-2"><strong>Package:</strong> {bookingDetails.packageTitle}</p>
          <p className="mb-2"><strong>Number of Travelers:</strong> {bookingDetails.travelers}</p>
          <p className="mb-2"><strong>Booking Date:</strong> {new Date(bookingDetails.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </Layout>
  )
}