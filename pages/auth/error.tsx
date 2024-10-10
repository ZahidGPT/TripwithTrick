import { useRouter } from 'next/router'
import Link from 'next/link'

export default function ErrorPage() {
  const router = useRouter()
  const { error } = router.query

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {error === 'CredentialsSignin' && 'Invalid email or password'}
            {error === 'User not found' && 'User not found'}
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div>
            <Link href="/auth/signin" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Try Again
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}