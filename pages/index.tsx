import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPinIcon } from 'lucide-react'

export default function HomePage() {
  const [destination, setDestination] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/package-listing?destination=${encodeURIComponent(destination)}&pickup=${encodeURIComponent(pickupLocation)}`)
  }

  return (
    <Layout>
      <section className="relative min-h-[calc(100vh-4rem)] bg-cover bg-center flex items-center justify-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-8">Discover Your Dream Destination</h1>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input 
                    id="destination" 
                    placeholder="Where are you going?" 
                    className="pl-10" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="pickup" className="block text-sm font-medium text-gray-700">Pickup Location</label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input 
                    id="pickup" 
                    placeholder="Where are you leaving from?" 
                    className="pl-10" 
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <Button type="submit" className="w-full" size="lg">Search Packages</Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  )
}