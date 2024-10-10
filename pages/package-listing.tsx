import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { MapPin, Calendar, DollarSign, UsersIcon, MenuIcon } from 'lucide-react'
import { Package } from '../types' // Add this import
import { Card, CardContent } from "@/components/ui/card"

// Remove the Package interface from here since it's now in types/index.ts

export default function PackageListingPage() {
  const router = useRouter()
  const { destination, pickup } = router.query
  const [packages, setPackages] = useState<Package[]>([])
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filter states
  const [filterDestination, setFilterDestination] = useState(destination as string || '')
  const [filterPickup, setFilterPickup] = useState(pickup as string || '')
  const [filterPeople, setFilterPeople] = useState('')
  const [filterBudget, setFilterBudget] = useState('')
  const [filterTripDays, setFilterTripDays] = useState('')
  const [filterGroupType, setFilterGroupType] = useState('all') // Updated initial value

  const [maxPrice, setMaxPrice] = useState(10000)
  const [maxTripDays, setMaxTripDays] = useState(30)

  useEffect(() => {
    fetchPackages()
  }, [destination, pickup])

  useEffect(() => {
    applyFilters()
  }, [packages, filterDestination, filterPickup, filterPeople, filterBudget, filterTripDays, filterGroupType])

  const fetchPackages = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...(destination && { destination: destination as string }),
        ...(pickup && { pickup: pickup as string }),
      });
      const response = await fetch(`/api/packages?${queryParams}`)
      if (!response.ok) {
        throw new Error('Failed to fetch packages')
      }
      const data: Package[] = await response.json()
      setPackages(data)

      // Calculate max price and max trip days
      const prices = data.map(pkg => pkg.price).filter(price => price > 0)
      const tripDays = data.map(pkg => pkg.tripDays).filter(days => days > 0)
      
      const maxPackagePrice = prices.length > 0 ? Math.max(...prices) : 10000
      const maxPackageTripDays = tripDays.length > 0 ? Math.max(...tripDays) : 30
      
      setMaxPrice(maxPackagePrice)
      setMaxTripDays(maxPackageTripDays)
      
      // Set initial filter values to max values
      setFilterBudget(maxPackagePrice.toString())
      setFilterTripDays(maxPackageTripDays.toString())

      // Apply filters after setting initial values
      applyFilters()
    } catch (error) {
      setError('Error fetching packages')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = packages
    if (filterDestination) {
      filtered = filtered.filter(pkg => pkg.location.toLowerCase().includes(filterDestination.toLowerCase()))
    }
    if (filterPickup) {
      filtered = filtered.filter(pkg => pkg.pickupLocation.toLowerCase().includes(filterPickup.toLowerCase()))
    }
    if (filterPeople) {
      filtered = filtered.filter(pkg => pkg.totalPeople >= parseInt(filterPeople))
    }
    if (filterBudget) {
      filtered = filtered.filter(pkg => pkg.price <= parseInt(filterBudget))
    }
    if (filterTripDays) {
      filtered = filtered.filter(pkg => pkg.tripDays <= parseInt(filterTripDays))
    }
    // Updated group type filter logic
    if (filterGroupType !== 'all') {
      if (filterGroupType === 'mixed') {
        filtered = filtered.filter(pkg => pkg.groupType === 'all' || !pkg.groupType)
      } else {
        filtered = filtered.filter(pkg => pkg.groupType === filterGroupType)
      }
    }
    setFilteredPackages(filtered)
  }

  if (loading) {
    return <Layout>Loading...</Layout>
  }

  if (error) {
    return <Layout>Error: {error}</Layout>
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Available Packages</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters */}
          <div className="w-full md:w-1/4">
            <div className="bg-white shadow-md rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                  <Input 
                    placeholder="Destination" 
                    value={filterDestination} 
                    onChange={(e) => setFilterDestination(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                  <Input 
                    placeholder="Pickup Location" 
                    value={filterPickup} 
                    onChange={(e) => setFilterPickup(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of People</label>
                  <Select onValueChange={setFilterPeople} value={filterPeople}>
                    <SelectTrigger>
                      <SelectValue placeholder="Number of People" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}+ People</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Budget: ₹{filterBudget}</label>
                  <Slider
                    min={0}
                    max={maxPrice}
                    step={100}
                    value={[parseInt(filterBudget) || 0]}
                    onValueChange={(value) => {
                      setFilterBudget(value[0].toString())
                      applyFilters()
                    }}
                    className="reversed-slider"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trip Days: {filterTripDays}</label>
                  <Slider
                    min={1}
                    max={maxTripDays}
                    step={1}
                    value={[parseInt(filterTripDays) || 1]}
                    onValueChange={(value) => {
                      setFilterTripDays(value[0].toString())
                      applyFilters()
                    }}
                    className="reversed-slider"
                  />
                </div>
                {/* Updated Group Type filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group Type</label>
                  <Select onValueChange={setFilterGroupType} value={filterGroupType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Group Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Group Types</SelectItem>
                      <SelectItem value="mixed">Mixed Group</SelectItem>
                      <SelectItem value="male_only">Male Only</SelectItem>
                      <SelectItem value="female_only">Female Only</SelectItem>
                      <SelectItem value="couple_only">Couple Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={applyFilters} className="w-full mt-4">Apply Filters</Button>
            </div>
          </div>

          {/* Package Listing */}
          <div className="w-full md:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPackages.map((pkg) => (
                <Card key={pkg._id} className="overflow-hidden">
                  <Image
                    src={pkg.headerImage}
                    alt={pkg.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-4">
                    <h2 className="text-xl font-bold mb-2">{pkg.title}</h2>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{pkg.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{pkg.tripDays} days</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <UsersIcon className="w-4 h-4 mr-1" />
                      <span>Group Size: {pkg.totalPeople}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MenuIcon className="w-4 h-4 mr-1" />
                      <span>Group Type: {pkg.groupType ? pkg.groupType.replace('_', ' ').charAt(0).toUpperCase() + pkg.groupType.replace('_', ' ').slice(1) : 'Not specified'}</span>
                    </div>
                    <div className="text-2xl font-bold text-primary mb-4">₹{pkg.price}</div>
                    <Link href={`/package/${pkg._id}`}>
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .reversed-slider [data-orientation="horizontal"] {
          height: 8px;
          background-color: #e5e7eb;
          border-radius: 9999px;
        }
        .reversed-slider [data-orientation="horizontal"] [data-orientation="horizontal"] {
          height: 100%;
          background-color: #3b82f6;
          border-radius: 9999px;
        }
        .reversed-slider [role="slider"] {
          width: 20px;
          height: 20px;
          background-color: white;
          border: 2px solid #3b82f6;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </Layout>
  )
}