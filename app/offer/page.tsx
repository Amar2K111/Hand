'use client'

import React, { useState, Suspense } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProfileIcon } from '@/components/layout/ProfileIcon'
import { useRouter, useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { CREDITS_PACKAGE } from '@/lib/constants'
import { useAuth } from '@/contexts/AuthContext'

function OfferContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
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
      
      <main className="flex-1 py-12 px-4">
        <div className="flex justify-center mb-12">
          <div className="max-w-md w-full relative">
          
          {/* Back Button - Further left of container, higher up */}
          <div className="absolute -left-24 top-8 z-10">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <span className="text-2xl">←</span>
              <span className="font-medium">Back</span>
            </button>
          </div>
          
          {/* Warning Message */}
          {hasWarning && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-yellow-600">⚠️</span>
                <p className="text-yellow-800 text-sm">
                  You have 0 uploads remaining. Purchase more credits to continue.
                </p>
              </div>
            </div>
          )}

          {/* Simple Pricing Container */}
          <Card className="text-center py-12 mb-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="text-6xl">👐</div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Get Your Hand Rating
                </h2>
                <p className="text-gray-600 text-lg">
                  Professional hand modeling assessment
                </p>
              </div>

              {/* Price Display */}
              <div className="text-center">
                <div className="text-5xl font-bold text-neon-blue mb-2">$15</div>
                <p className="text-gray-500">for 25 pictures</p>
                <p className="text-sm text-gray-400">That's only $0.60 per picture!</p>
              </div>

              {/* Features List */}
              <div className="text-left space-y-3">
                <h3 className="font-semibold text-gray-900 text-center mb-4">What You Get:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-3">
                    <span className="text-neon-blue text-lg">•</span>
                    <span className="text-gray-700">Score out of 100 for each picture</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-neon-blue text-lg">•</span>
                    <span className="text-gray-700">Expert feedback and analysis</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-neon-blue text-lg">•</span>
                    <span className="text-gray-700">Improvement tips and suggestions</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-neon-blue text-lg">•</span>
                    <span className="text-gray-700">Hand model potential verdict</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-neon-blue text-lg">•</span>
                    <span className="text-gray-700">Unlimited time to use credits</span>
                  </li>
                </ul>
              </div>

              <Button
                size="lg"
                className="w-full text-lg py-4"
                onClick={handlePayment}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : `Buy for $${CREDITS_PACKAGE.price}`}
              </Button>
            </div>
          </Card>
          </div>
        </div>

        {/* Two Picture Containers - Auto-sized to fit images */}
        <div className="flex justify-center space-x-16 py-8">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src="/images/Capture d'écran 2025-09-10 201913.png" 
              alt="Professional hand modeling example - elegant hand pose" 
              className="max-w-[40rem] max-h-[40rem] object-contain"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src="/images/Capture d'écran 2025-09-10 202026.png" 
              alt="Hand modeling example - jewelry showcase" 
              className="max-w-[40rem] max-h-[40rem] object-contain"
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
