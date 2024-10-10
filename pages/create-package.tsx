import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSession } from "next-auth/react"
import { Package } from '../types'

export default function CreateEditPackagePage() {
  const [packageData, setPackageData] = useState<Partial<Package>>({
    title: '',
    description: '',
    location: '',
    pickupLocation: '',
    pickupTime: '',
    inclusions: [],
    itinerary: [],
    headerImage: '',
    galleryImages: [],
    groupType: 'all',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const { id } = router.query
  const { data: session, status } = useSession()
  const isEditMode = !!id

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/create-package')
    }
  }, [status, router])

  useEffect(() => {
    if (isEditMode && id) {
      fetchPackageData(id as string)
    }
  }, [isEditMode, id])

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
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setPackageData(prev => {
      if (name === 'itinerary') {
        return { ...prev, [name]: value.split('\n') }
      } else if (name === 'inclusions' || name === 'galleryImages') {
        return { ...prev, [name]: value.split(',').map(item => item.trim()) }
      }
      return { ...prev, [name]: value }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const url = isEditMode ? `/api/packages/${id}` : '/api/packages/create'
      const method = isEditMode ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packageData),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isEditMode ? 'update' : 'create'} package`)
      }

      router.push('/package-listing')
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} package:`, error)
      setError(`Failed to ${isEditMode ? 'update' : 'create'} package. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === "loading") return <Layout>Loading...</Layout>
  if (status === "unauthenticated") return <Layout>Access Denied</Layout>

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">{isEditMode ? 'Edit' : 'Create'} Tour Package</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="title" placeholder="Title" value={packageData.title} onChange={handleInputChange} required />
          <Textarea name="description" placeholder="Description" value={packageData.description} onChange={handleInputChange} required />
          <Input name="price" type="number" placeholder="Price (in ₹)" value={packageData.price || ''} onChange={handleInputChange} required />
          <Input name="location" placeholder="Location" value={packageData.location} onChange={handleInputChange} required />
          <Input name="pickupLocation" placeholder="Pickup Location" value={packageData.pickupLocation} onChange={handleInputChange} required />
          <Input name="pickupTime" type="time" placeholder="Pickup Time" value={packageData.pickupTime} onChange={handleInputChange} required />
          <Input name="tripDays" type="number" placeholder="Trip Days" value={packageData.tripDays || ''} onChange={handleInputChange} required />
          <Input name="tripNights" type="number" placeholder="Trip Nights" value={packageData.tripNights || ''} onChange={handleInputChange} required />
          <Textarea name="inclusions" placeholder="Inclusions (comma-separated)" value={packageData.inclusions?.join(', ')} onChange={handleInputChange} required />
          <Textarea name="itinerary" placeholder="Itinerary (one item per line)" value={Array.isArray(packageData.itinerary) ? packageData.itinerary.join('\n') : ''} onChange={handleInputChange} required />
          <Input name="headerImage" placeholder="Header Image URL" value={packageData.headerImage} onChange={handleInputChange} required />
          <Textarea name="galleryImages" placeholder="Gallery Image URLs (comma-separated)" value={packageData.galleryImages?.join(', ')} onChange={handleInputChange} required />
          <Input name="totalPeople" type="number" placeholder="Group Size" value={packageData.totalPeople || ''} onChange={handleInputChange} required />
          <Select
            name="groupType"
            value={packageData.groupType}
            onValueChange={(value) => setPackageData(prev => ({ ...prev, groupType: value as Package['groupType'] }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Group Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="male_only">Male Only</SelectItem>
              <SelectItem value="female_only">Female Only</SelectItem>
              <SelectItem value="couple_only">Couple Only</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : (isEditMode ? 'Update' : 'Create') + ' Package'}
          </Button>
        </form>
      </div>
    </Layout>
  )
}