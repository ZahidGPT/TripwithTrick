import Layout from '@/components/Layout'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, MapPinIcon, MenuIcon, UserIcon, StarIcon, UsersIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Package } from '../types'
import { useRouter } from 'next/router'

export default function PackageDetailsPage() {
  const [packageData, setPackageData] = useState<Package | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (id) {
      fetchPackageData(id as string)
    }
  }, [id])

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

  if (loading) return <Layout>Loading...</Layout>
  if (error) return <Layout>Error: {error}</Layout>
  if (!packageData) return <Layout>No package data found</Layout>

  return (
    <Layout>
      <div className="mb-8">
        <Image
          src={packageData.headerImage}
          alt={packageData.title}
          width={1200}
          height={400}
          className="w-full h-[400px] object-cover rounded-lg"
        />
      </div>

      <main className="flex-grow container mx-auto px-4 py-8">
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
                    <span>{packageData.tripDays} days</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <UserIcon className="w-5 h-5 mr-2" />
                    <span>Min. {packageData.totalPeople} travelers</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <UsersIcon className="w-5 h-5 mr-2" />
                    <span>Group Size: {packageData.totalPeople}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MenuIcon className="w-5 h-5 mr-2" />
                    <span>Group Type: {packageData.groupType ? packageData.groupType.replace('_', ' ').charAt(0).toUpperCase() + packageData.groupType.replace('_', ' ').slice(1) : 'Not specified'}</span>
                  </div>
                  <Button className="w-full">Book Now</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          © 2023 TravelDreams. All rights reserved.
        </div>
      </footer>
    </Layout>
  )
}