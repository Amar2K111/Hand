'use client'

import React, { useState, Suspense } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProfileIcon } from '@/components/layout/ProfileIcon'
import { useRouter, useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { CREDITS_PACKAGE } from '@/lib/constants'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

function OfferContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { t } = useLanguage()
  const hasWarning = searchParams.get('warning') === 'no-uploads'
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    setIsLoading(true)
    
    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success_url: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/offer`,
        }),
      })

      const { sessionId } = await response.json()

      if (!sessionId) {
        throw new Error('Failed to create checkout session')
      }

      // Load Stripe and redirect to checkout
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      
      if (!stripe) {
        throw new Error('Failed to load Stripe')
      }

      const { error } = await stripe.redirectToCheckout({ sessionId })

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Profile Icon - Floating in top right */}
      <ProfileIcon />
      
      <main className="flex-1 py-8 md:py-12 px-4">
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="max-w-md w-full relative">
          
          {/* Back Button - Responsive positioning */}
          <div className="absolute -left-16 md:-left-24 top-4 md:top-8 z-10">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-1 md:space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <span className="text-xl md:text-2xl">←</span>
              <span className="font-medium text-sm md:text-base">{t('offer.back')}</span>
            </button>
          </div>
          
          {/* Warning Message */}
          {hasWarning && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-yellow-600">{t('offer.warningTitle')}</span>
                <p className="text-yellow-800 text-sm">
                  {t('offer.warningMessage')}
                </p>
              </div>
            </div>
          )}

          {/* Simple Pricing Container */}
          <Card className="text-center py-8 md:py-12 mb-6 md:mb-8">
            <div className="space-y-4 md:space-y-6">
              <div className="space-y-3 md:space-y-4">
                <div className="text-4xl md:text-6xl">👐</div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {t('offer.title')}
                </h2>
                <p className="text-gray-600 text-base md:text-lg px-4">
                  {t('offer.subtitle')}
                </p>
              </div>

              {/* Price Display */}
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-neon-blue mb-2">$15</div>
                <p className="text-gray-500 text-sm md:text-base">{t('offer.price')}</p>
                <p className="text-xs md:text-sm text-gray-400">{t('offer.perPicture')}</p>
              </div>

              {/* Features List */}
              <div className="text-left space-y-3">
                <h3 className="font-semibold text-gray-900 text-center mb-4">{t('offer.whatYouGet')}</h3>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 text-lg">✓</span>
                    <span className="text-gray-700">{t('offer.scoreOutOf')}</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 text-lg">✓</span>
                    <span className="text-gray-700">{t('offer.expertFeedback')}</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 text-lg">✓</span>
                    <span className="text-gray-700">{t('offer.improvementTips')}</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 text-lg">✓</span>
                    <span className="text-gray-700">{t('offer.verdict')}</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-500 text-lg">✓</span>
                    <span className="text-gray-700">{t('offer.unlimitedTime')}</span>
                  </li>
                </ul>
              </div>

              <Button
                size="lg"
                className="w-full text-base md:text-lg py-3 md:py-4"
                onClick={handlePayment}
                disabled={isLoading}
              >
                {isLoading ? t('offer.processing') : `${t('offer.buyFor')}${CREDITS_PACKAGE.price}`}
              </Button>
            </div>
          </Card>
          </div>
        </div>

        {/* Two Picture Containers - Responsive layout */}
        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16 py-6 md:py-8 px-4">
          <div className="rounded-lg overflow-hidden shadow-lg max-w-full">
            <img 
              src="/images/Capture d'écran 2025-09-10 201913.png" 
              alt="Professional hand modeling example - elegant hand pose" 
              className="w-full max-w-[20rem] md:max-w-[25rem] lg:max-w-[30rem] h-auto object-contain mx-auto"
              loading="lazy"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg max-w-full">
            <img 
              src="/images/Capture d'écran 2025-09-10 202026.png" 
              alt="Hand modeling example - jewelry showcase" 
              className="w-full max-w-[20rem] md:max-w-[25rem] lg:max-w-[30rem] h-auto object-contain mx-auto"
              loading="lazy"
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default function OfferPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OfferContent />
    </Suspense>
  )
}
