import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { Button } from "@/components/ui/button"

export default function PaymentPage() {
  const router = useRouter()
  const { bookingId } = router.query
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (bookingId) {
      // Fetch booking details if needed
      setLoading(false)
    }
  }, [bookingId])

  const handlePayPal = () => {
    // Implement PayPal payment logic
    console.log('Processing PayPal payment')
  }

  const handleRazorpay = () => {
    // Implement Razorpay payment logic
    console.log('Processing Razorpay payment')
  }

  if (loading) return <Layout>Loading...</Layout>
  if (error) return <Layout>Error: {error}</Layout>

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Complete Your Payment</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Choose a Payment Method</h2>
          <div className="space-y-4">
            <Button onClick={handlePayPal} className="w-full">
              Pay with PayPal
            </Button>
            <Button onClick={handleRazorpay} className="w-full">
              Pay with Razorpay
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}