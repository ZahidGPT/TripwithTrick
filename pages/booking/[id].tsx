import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { useSession } from 'next-auth/react'
import { Package } from '../../types'
import { Button } from "@/components/ui/button"
import toast from 'react-hot-toast'
import Image from 'next/image'
import { Calendar, MapPin, Truck, DollarSign } from 'lucide-react'

export default function BookingPage() {
  const [packageDetails, setPackageDetails] = useState<Package | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    travelers: 1
  })
  const router = useRouter()
  const { id } = router.query
  const { data: session } = useSession()

  useEffect(() => {
    if (id) {
      fetchPackageDetails()
    }
  }, [id])

  const fetchPackageDetails = async () => {
    try {
      const response = await fetch(`/api/packages/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch package details')
      }
      const data = await response.json()
      setPackageDetails(data)
    } catch (error) {
      setError('Error fetching package details')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'travelers' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!session || !packageDetails) {
      toast.error('Unable to process booking. Please try again.')
      return
    }

    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          packageId: packageDetails._id,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Booking created successfully!')
        router.push(`/booking/confirmation/${data.bookingId}`)
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to create booking')
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      toast.error('An error occurred while processing the booking')
    }
  }

  if (loading) return <Layout>Loading...</Layout>
  if (error) return <Layout>Error: {error}</Layout>
  if (!packageDetails) return <Layout>Package not found</Layout>

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{packageDetails.title}</h1>
        
        <div className="mb-8 relative h-64 w-full">
          <Image 
            src={packageDetails.headerImage} 
            alt={packageDetails.title} 
            layout="fill" 
            objectFit="cover"
            className="rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Package Details</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="mr-2" />
                <span>{packageDetails.tripDays} days / {packageDetails.tripNights || packageDetails.tripDays - 1} nights</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-2" />
                <span>Price: ₹{packageDetails.price}</span>
              </div>
              <div className="flex items-center">
                <Truck className="mr-2" />
                <span>Pickup: {packageDetails.pickupLocation}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2" />
                <span>Destination: {packageDetails.location}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block mb-2">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block mb-2">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="travelers" className="block mb-2">Number of Travelers</label>
              <input
                type="number"
                id="travelers"
                name="travelers"
                value={formData.travelers}
                onChange={handleInputChange}
                min="1"
                max={packageDetails.totalPeople}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <Button type="submit" className="w-full">
              Book Now
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  )
}