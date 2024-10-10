import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"
import { compare } from 'bcryptjs'
import { MongoClient } from 'mongodb'

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise as Promise<MongoClient>),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const client = await clientPromise
        const db = (client as MongoClient).db()
        const user = await db.collection('users').findOne({ email: credentials.email })

        if (!user) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: "jwt",
  },
}

export default NextAuth(authOptions)