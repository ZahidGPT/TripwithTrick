import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Sign in the user after successful signup
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        })
        if (result?.error) {
          setError(result.error)
        } else {
          router.push('/')
        }
      } else {
        setError(data.error || 'Failed to sign up')
      }
    } catch (error) {
      console.error('Error signing up:', error)
      setError('An unexpected error occurred')
    }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <Button type="submit" className="w-full">Sign Up</Button>
        </form>
        <div className="mt-4 text-center">
          <p>Already have an account?</p>
          <Link href="/auth/signin" passHref>
            <Button variant="outline" className="w-full mt-2">Sign In</Button>
          </Link>
        </div>
      </div>
    </Layout>
  )
}