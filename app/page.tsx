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
import { useLanguage } from '@/contexts/LanguageContext'

export default function HomePage() {
  const { user, loading, isNewUser, skipOnboardingForLanguage } = useAuth()
  const { t, language } = useLanguage()
  const router = useRouter()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      if (isNewUser) {
        // Skip onboarding for French and Spanish users, go directly to dashboard
        if (language === 'fr' || language === 'es') {
          skipOnboardingForLanguage(language)
          router.push('/dashboard')
        } else {
          router.push('/onboarding')
        }
      } else {
        router.push('/dashboard')
      }
    }
  }, [user, loading, isNewUser, language, router, skipOnboardingForLanguage])

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
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-6 md:space-y-8">
              {/* Main Headline */}
              <div className="space-y-3 md:space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-text-dark leading-tight">
                  {t('home.hero.title')}
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-text-gray max-w-3xl mx-auto px-4">
                  {t('home.hero.subtitle')}
                </p>
              </div>

              {/* CTA Button */}
              <div className="pt-6 md:pt-8">
                <Link href="/auth/signup">
                  <Button size="lg" className="text-lg md:text-xl px-8 md:px-12 py-3 md:py-4 w-full max-w-sm mx-auto">
                    {t('home.cta.getStarted')}
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
        <section className="py-12 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-6 md:space-y-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-dark">
                {t('home.features.title')}
              </h2>
              <p className="text-lg md:text-xl text-text-gray px-4">
                {t('home.features.subtitle')}
              </p>
              <Link href="/auth/signup">
                <Button size="lg" className="text-lg md:text-xl px-8 md:px-12 py-3 md:py-4 w-full max-w-sm mx-auto">
                  {t('home.cta.getStarted')}
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
