import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white font-bold">
          Travel App
        </Link>
        <div>
          {session ? (
            <Link href="/profile" className="text-white">
              Profile
            </Link>
          ) : (
            <Link href="/auth/signin" className="text-white">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}