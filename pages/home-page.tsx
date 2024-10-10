import React, { useState } from 'react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Calendar } from "../components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { CalendarIcon, MapPinIcon, MenuIcon } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">TravelDreams</Link>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
            <MenuIcon className="h-6 w-6" />
          </button>
          <ul className={`md:flex md:space-x-4 ${isMenuOpen ? 'block' : 'hidden'} absolute md:relative top-full left-0 right-0 bg-white md:bg-transparent shadow-md md:shadow-none`}>
            <li><Link href="/" className="block px-4 py-2 text-sm font-medium hover:text-primary">Home</Link></li>
            <li><Link href="/packages" className="block px-4 py-2 text-sm font-medium hover:text-primary">Packages</Link></li>
            <li><Link href="/about" className="block px-4 py-2 text-sm font-medium hover:text-primary">About Us</Link></li>
            <li><Link href="/contact" className="block px-4 py-2 text-sm font-medium hover:text-primary">Contact</Link></li>
          </ul>
        </nav>
      </header>

      <main className="flex-grow pt-16">
        <section className="relative min-h-[calc(100vh-4rem)] bg-cover bg-center flex items-center justify-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"}}>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-8">Discover Your Dream Destination</h1>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <Input id="destination" placeholder="Where are you going?" className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="origin" className="block text-sm font-medium text-gray-700">Origin</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <Input id="origin" placeholder="Where are you leaving from?" className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="dates" className="block text-sm font-medium text-gray-700">Travel Dates</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? date.toDateString() : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <label htmlFor="travelers" className="block text-sm font-medium text-gray-700">Number of Travelers</label>
                  <Select>
                    <SelectTrigger id="travelers" className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Traveler</SelectItem>
                      <SelectItem value="2">2 Travelers</SelectItem>
                      <SelectItem value="3">3 Travelers</SelectItem>
                      <SelectItem value="4">4 Travelers</SelectItem>
                      <SelectItem value="5+">5+ Travelers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="md:col-span-2 w-full" size="lg">
                  Search Packages
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          © 2023 TravelDreams. All rights reserved.
        </div>
      </footer>
    </div>
  )
}