import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface Booking {
  _id: string
  packageId: string
  bookingDate: string
  travelers: number
  totalAmount: number
  package?: {
    _id: string
    title: string
    description: string
    location: string
    tripDays: number
    headerImage: string
    price: number
  }
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      fetchBookings()
    } else {
      router.push('/auth/signin')
    }
  }, [session])

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings/user-bookings')
      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }
      const data = await response.json()
      setBookings(data)
    } catch (error) {
      setError('Error fetching bookings')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Layout>Loading...</Layout>
  if (error) return <Layout>Error: {error}</Layout>

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Booked Trips</h1>
        {bookings.length === 0 ? (
          <p>You haven't booked any trips yet.</p>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white shadow-lg rounded-lg overflow-hidden flex">
                <div className="p-6 flex-1">
                  <h2 className="text-xl font-semibold mb-2">{booking.package?.title || 'Unknown Package'}</h2>
                  <p><strong>Booking ID:</strong> {booking._id}</p>
                  <div className="flex items-center mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Booked on: {new Date(booking.bookingDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <Users className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Travelers: {booking.travelers}</span>
                  </div>
                  <p className="text-lg font-bold mb-2">Total Amount: ₹{booking.totalAmount}</p>
                </div>
                {booking.package && (
                  <div className="w-1/2 p-6 border-l">
                    <div className="relative h-40 mb-4">
                      <Image 
                        src={booking.package.headerImage} 
                        alt={booking.package.title} 
                        layout="fill" 
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{booking.package.title}</h3>
                    <div className="flex items-center mb-2">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{booking.package.location}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{booking.package.tripDays} days</span>
                    </div>
                    <p className="text-gray-600 mb-4">{booking.package.description.substring(0, 100)}...</p>
                    <Link href={`/package/${booking.package._id}`} passHref>
                      <Button className="w-full">View Package Details</Button>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}