import Layout from '@/components/Layout'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, MapPinIcon, MenuIcon, UsersIcon, HeartIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link' // Add this import
import { Package } from '../../types'
import { useRouter } from 'next/router'
import { useSession } from "next-auth/react"

export default function PackageDetailsPage() {
  const [packageData, setPackageData] = useState<Package | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isInWishlist, setIsInWishlist] = useState(false)
  const router = useRouter()
  const { id } = router.query
  const { data: session } = useSession()

  useEffect(() => {
    if (id) {
      fetchPackageData(id as string)
      checkWishlistStatus(id as string)
    }
  }, [id, session])

  const fetchPackageData = async (packageId: string) => {
    try {
      const response = await fetch(`/api/packages/${packageId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch package details')
      }
      const data = await response.json()
      setPackageData(data)
    } catch (error) {
      console.error('Error fetching package data:', error)
      setError('Failed to fetch package data')
    } finally {
      setLoading(false)
    }
  }

  const checkWishlistStatus = async (packageId: string) => {
    if (!session) return

    try {
      const response = await fetch(`/api/wishlist/check?packageId=${packageId}`)
      if (response.ok) {
        const { isInWishlist } = await response.json()
        setIsInWishlist(isInWishlist)
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error)
    }
  }

  const handleWishlistToggle = async () => {
    if (!session) {
      alert('Please log in to manage your wishlist')
      return
    }
    try {
      const response = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: packageData?._id }),
      })
      if (response.ok) {
        const { isInWishlist } = await response.json()
        setIsInWishlist(isInWishlist)
      } else {
        throw new Error('Failed to toggle wishlist')
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
    }
  }

  if (loading) return <Layout>Loading...</Layout>
  if (error) return <Layout>Error: {error}</Layout>
  if (!packageData) return <Layout>No package data found</Layout>

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Image
            src={packageData.headerImage}
            alt={packageData.title}
            width={1200}
            height={400}
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{packageData.title}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <MapPinIcon className="w-5 h-5 mr-2" />
              <span>{packageData.location}</span>
            </div>
            <p className="text-gray-700 mb-6">{packageData.description}</p>

            <Tabs defaultValue="itinerary" className="mb-8">
              <TabsList>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
              </TabsList>
              <TabsContent value="itinerary">
                <ul className="space-y-4">
                  {packageData.itinerary.map((item, index) => (
                    <li key={index} className="flex">
                      <span className="font-bold mr-4">Day {index + 1}:</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="inclusions">
                <ul className="list-disc list-inside">
                  {packageData.inclusions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Gallery</h2>
              <div className="grid grid-cols-2 gap-4">
                {packageData.galleryImages.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    width={400}
                    height={300}
                    className="rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Book This Package</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Price:</span>
                    <span className="text-2xl font-bold text-primary">₹{packageData.price}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    <span>{packageData.tripDays} days / {packageData.tripNights} nights</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <UsersIcon className="w-5 h-5 mr-2" />
                    <span>Group Size: {packageData.totalPeople}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MenuIcon className="w-5 h-5 mr-2" />
                    <span>Group Type: {packageData.groupType ? packageData.groupType.replace('_', ' ').charAt(0).toUpperCase() + packageData.groupType.replace('_', ' ').slice(1) : 'Not specified'}</span>
                  </div>
                  <Link href={`/booking/${packageData._id}`} passHref>
                    <Button className="w-full mb-2">Book Now</Button>
                  </Link>
                  <Button 
                    className="w-full" 
                    variant="outline" 
                    onClick={handleWishlistToggle}
                  >
                    <HeartIcon className={`w-4 h-4 mr-2 ${isInWishlist ? 'text-red-500 fill-red-500' : ''}`} />
                    {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}