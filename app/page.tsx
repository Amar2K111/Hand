'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { ExampleGallery } from '@/components/shared/ExampleGallery'
import { FeatureList } from '@/components/shared/FeatureList'
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
  const { user, loading, isNewUser } = useAuth()
  const router = useRouter()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      if (isNewUser) {
        router.push('/onboarding')
      } else {
        router.push('/dashboard')
      }
    }
  }, [user, loading, isNewUser, router])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't show home page if user is authenticated
  if (user) {
    return null
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-8">
              {/* Main Headline */}
              <div className="space-y-4">
                                 <h1 className="text-5xl md:text-7xl font-bold text-text-dark">
                   {APP_DESCRIPTION}
                 </h1>
                                 <p className="text-xl md:text-2xl text-text-gray max-w-3xl mx-auto">
                   Upload your photos. Get brutally honest AI ratings, expert critiques, and a score out of 100.
                 </p>
              </div>

              {/* CTA Button */}
              <div className="pt-8">
                <Link href="/auth/signup">
                  <Button size="lg" className="text-xl px-12 py-4">
                    Get Started →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Example Gallery */}
        <ExampleGallery />

        {/* Features Section */}
        <FeatureList />

        {/* Bottom CTA */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-text-dark">
                Ready to Face the Truth?
              </h2>
              <p className="text-xl text-text-gray">
                Join thousands of people discovering their hand modeling potential
              </p>
              <Link href="/auth/signup">
                <Button size="lg" className="text-xl px-12 py-4">
                  Get Started →
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
