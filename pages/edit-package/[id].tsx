import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "next-auth/react"

export default function EditPackagePage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [location, setLocation] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [tripDays, setTripDays] = useState('')
  const [tripNights, setTripNights] = useState('')
  const [hotelName, setHotelName] = useState('')
  const [inclusions, setInclusions] = useState('')
  const [itinerary, setItinerary] = useState('')
  const [headerImage, setHeaderImage] = useState('')
  const [galleryImages, setGalleryImages] = useState('')
  const [totalPeople, setTotalPeople] = useState('')
  const [error, setError] = useState('')

  const router = useRouter()
  const { id } = router.query
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated' && id) {
      fetchPackageDetails()
    }
  }, [status, router, id])

  const fetchPackageDetails = async () => {
    try {
      const response = await fetch(`/api/packages/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch package details')
      }
      const data = await response.json()
      setTitle(data.title)
      setDescription(data.description)
      setPrice(data.price.toString())
      setLocation(data.location)
      setPickupLocation(data.pickupLocation)
      setPickupTime(data.pickupTime)
      setTripDays(data.tripDays.toString())
      setTripNights(data.tripNights.toString())
      setHotelName(data.hotelName)
      setInclusions(data.inclusions.join(', '))
      setItinerary(data.itinerary.join('\n'))
      setHeaderImage(data.headerImage)
      setGalleryImages(data.galleryImages.join(', '))
      setTotalPeople(data.totalPeople.toString())
    } catch (error) {
      console.error('Error fetching package details:', error)
      setError('Failed to fetch package details')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session || !session.user) {
      setError('You must be logged in to edit a package')
      return
    }

    const packageData = {
      title,
      description,
      price,
      location,
      pickupLocation,
      pickupTime,
      tripDays,
      tripNights,
      hotelName,
      inclusions: inclusions.split(',').map(item => item.trim()),
      itinerary: itinerary.split('\n').map(item => item.trim()),
      headerImage,
      galleryImages: galleryImages.split(',').map(item => item.trim()),
      totalPeople: parseInt(totalPeople),
    }

    try {
      const response = await fetch(`/api/packages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packageData),
      })

      if (response.ok) {
        router.push('/profile')
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update package')
      }
    } catch (error) {
      console.error('Error updating package:', error)
      setError(error instanceof Error ? error.message : 'Failed to update package. Please try again.')
    }
  }

  if (status === "loading") return <Layout>Loading...</Layout>
  if (status === "unauthenticated") return <Layout>Access Denied</Layout>

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">Edit Tour Package</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          <Input type="number" placeholder="Price (in ₹)" value={price} onChange={(e) => setPrice(e.target.value)} required />
          <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
          <Input placeholder="Pickup Location" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} required />
          <Input type="time" placeholder="Pickup Time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} required />
          <Input type="number" placeholder="Trip Days" value={tripDays} onChange={(e) => setTripDays(e.target.value)} required />
          <Input type="number" placeholder="Trip Nights" value={tripNights} onChange={(e) => setTripNights(e.target.value)} required />
          <Input placeholder="Hotel Name" value={hotelName} onChange={(e) => setHotelName(e.target.value)} required />
          <Textarea placeholder="Inclusions (comma-separated)" value={inclusions} onChange={(e) => setInclusions(e.target.value)} required />
          <Textarea placeholder="Itinerary (one item per line)" value={itinerary} onChange={(e) => setItinerary(e.target.value)} required />
          <Input placeholder="Header Image URL" value={headerImage} onChange={(e) => setHeaderImage(e.target.value)} required />
          <Textarea placeholder="Gallery Image URLs (comma-separated)" value={galleryImages} onChange={(e) => setGalleryImages(e.target.value)} required />
          <Input type="number" placeholder="Total People" value={totalPeople} onChange={(e) => setTotalPeople(e.target.value)} required />
          <Button type="submit" className="w-full">Update Package</Button>
        </form>
      </div>
    </Layout>
  )
}