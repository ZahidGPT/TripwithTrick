import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MenuIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const { data: session } = useSession()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.svg" alt="TravelDreams Logo" width={40} height={40} />
            <span className="text-2xl font-bold text-primary">TravelDreams</span>
          </Link>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
            <MenuIcon className="h-6 w-6" />
          </button>
          <ul className={`md:flex md:space-x-4 ${isMenuOpen ? 'block' : 'hidden'} absolute md:relative top-full left-0 right-0 bg-white md:bg-transparent shadow-md md:shadow-none`}>
            <li><Link href="/" className="block px-4 py-2 text-sm font-medium hover:text-primary">Home</Link></li>
            <li><Link href="/package-listing" className="block px-4 py-2 text-sm font-medium hover:text-primary">Packages</Link></li>
            <li><Link href="/create-package" className="block px-4 py-2 text-sm font-medium hover:text-primary">Create Package</Link></li>
            <li><Link href="/about" className="block px-4 py-2 text-sm font-medium hover:text-primary">About Us</Link></li>
            <li><Link href="/contact" className="block px-4 py-2 text-sm font-medium hover:text-primary">Contact</Link></li>
            {session ? (
              <li><Link href="/profile" className="block px-4 py-2 text-sm font-medium hover:text-primary">Profile</Link></li>
            ) : (
              <li><Link href="/auth/signin" className="block px-4 py-2 text-sm font-medium hover:text-primary">Login</Link></li>
            )}
          </ul>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        {children}
      </main>

      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          © 2023 TravelDreams. All rights reserved.
        </div>
      </footer>
    </div>
  )
}