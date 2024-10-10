import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { Button } from "@/components/ui/button"

export default function BookingSuccessPage() {
  const router = useRouter()
  const { bookingId } = router.query

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Booking Successful!</h1>
        <p className="mb-4">Your booking (ID: {bookingId}) has been confirmed.</p>
        <p className="mb-8">Thank you for choosing our service.</p>
        <Button onClick={() => router.push('/')}>Return to Home</Button>
      </div>
    </Layout>
  )
}