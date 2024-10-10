import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User, Package, MapPin, Calendar, DollarSign, LogOut, Edit, Trash2, UsersIcon, MenuIcon, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface ProfileData {
  user: {
    name: string;
    email: string;
  };
  createdPackages: {
    _id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    tripDays: number;
    headerImage: string;
  }[];
}

interface WishlistItem {
  _id: string
  title: string
  description: string
  price: number
  location: string
  tripDays: number
  headerImage: string
  totalPeople: number
  groupType?: 'all' | 'male_only' | 'female_only' | 'couple_only'
}

export default function Profile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchProfileData()
      fetchWishlist()
    }
  }, [status, router])

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Profile data:', data)
      setProfileData(data)
    } catch (error) {
      console.error('Error fetching profile data:', error)
      setError('Failed to fetch profile data')
    } finally {
      setLoading(false)
    }
  }

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist/list')
      if (response.ok) {
        const data = await response.json()
        setWishlist(data)
      } else {
        throw new Error('Failed to fetch wishlist')
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      setError('Failed to fetch wishlist')
    }
  }

  const handleRemoveFromWishlist = async (packageId: string) => {
    try {
      const response = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ packageId }),
      })

      if (response.ok) {
        // Refresh the wishlist after removing the item
        fetchWishlist()
      } else {
        throw new Error('Failed to remove from wishlist')
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      setError('Failed to remove from wishlist')
    }
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  const handleDeletePackage = async (packageId: string) => {
    if (window.confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/packages/${packageId}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          // Refresh the profile data to reflect the deletion
          fetchProfileData()
        } else {
          throw new Error('Failed to delete package')
        }
      } catch (error) {
        console.error('Error deleting package:', error)
        setError('Failed to delete package. Please try again.')
      }
    }
  }

  if (status === 'loading' || !profileData) {
    return <Layout>Loading...</Layout>
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">User Profile</h1>
          <Button onClick={handleLogout} className="flex items-center">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <User className="w-8 h-8 mr-4 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">{profileData?.user.name}</h2>
              <p className="text-gray-600">{profileData?.user.email}</p>
            </div>
          </div>
          <Link href="/my-bookings">
            <Button className="mt-4">View My Booked Trips</Button>
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Created Packages</h2>
          {profileData.createdPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profileData.createdPackages.map((pkg) => (
                <div key={pkg._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <div className="relative h-48">
                    <Image 
                      src={pkg.headerImage || '/placeholder-image.jpg'} 
                      alt={pkg.title} 
                      layout="fill" 
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
                    <p className="text-gray-600 mb-4">{pkg.description.substring(0, 100)}...</p>
                    <div className="flex items-center mb-2">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{pkg.location}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{pkg.tripDays} days</span>
                    </div>
                    <div className="flex items-center mb-4">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                      <span>₹{pkg.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <Link href={`/package/${pkg._id}`} passHref>
                        <Button className="flex-1 mr-2">View Details</Button>
                      </Link>
                      <Link href={`/create-package?id=${pkg._id}`} passHref>
                        <Button variant="outline" className="flex items-center justify-center">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        className="flex items-center justify-center ml-2" 
                        onClick={() => handleDeletePackage(pkg._id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No packages created yet.</p>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Wishlist</h2>
          {wishlist.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <Card key={item._id} className="relative">
                  <div className="relative h-48">
                    <Image 
                      src={item.headerImage || '/placeholder-image.jpg'} 
                      alt={item.title} 
                      layout="fill" 
                      objectFit="cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <div className="flex items-center mb-2">
                      <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                      <span className="text-sm">{item.location}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                      <span className="text-sm">{item.tripDays} days</span>
                    </div>
                    <div className="flex items-center mb-4">
                      <DollarSign className="w-4 h-4 mr-1 text-gray-500" />
                      <span className="text-sm">₹{item.price}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Link href={`/package/${item._id}`} passHref>
                        <Button className="flex-1 mr-2">View Details</Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        className="flex items-center justify-center" 
                        onClick={() => handleRemoveFromWishlist(item._id)}
                      >
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>Your wishlist is empty.</p>
          )}
        </div>
      </div>
    </Layout>
  )
}