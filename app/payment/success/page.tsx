'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useUploads } from '@/hooks/useUploads'
import { CREDITS_PACKAGE } from '@/lib/constants'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { addUploads } = useUploads()
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasProcessedPayment = useRef(false)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    
    if (sessionId && user && !hasProcessedPayment.current) {
      hasProcessedPayment.current = true
      
      // Simulate processing the payment
      setTimeout(async () => {
        try {
          // Add credits to user's account using useUploads hook
          await addUploads(CREDITS_PACKAGE.amount)
          setIsProcessing(false)
        } catch (err) {
          setError('Failed to process payment. Please contact support.')
          setIsProcessing(false)
        }
      }, 2000)
    } else if (!sessionId) {
      setError('No payment session found.')
      setIsProcessing(false)
    }
  }, [searchParams, user, addUploads])

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="text-center py-12 px-8 max-w-md">
          <div className="space-y-6">
            <div className="text-6xl">⏳</div>
            <h2 className="text-2xl font-bold text-gray-900">
              Processing Your Payment
            </h2>
            <p className="text-gray-600">
              Please wait while we confirm your purchase and add your credits...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-blue mx-auto"></div>
          </div>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="text-center py-12 px-8 max-w-md">
          <div className="space-y-6">
            <div className="text-6xl">❌</div>
            <h2 className="text-2xl font-bold text-red-600">
              Payment Error
            </h2>
            <p className="text-gray-600">
              {error}
            </p>
            <Button
              onClick={() => router.push('/offer')}
              className="w-full"
            >
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="text-center py-12 px-8 max-w-md">
        <div className="space-y-6">
          <div className="text-6xl">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900">
            Payment Successful!
          </h2>
          <p className="text-gray-600">
            Your payment has been processed successfully. You now have{' '}
            <span className="font-bold text-neon-blue">{CREDITS_PACKAGE.amount} upload credits</span>!
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              ✅ {CREDITS_PACKAGE.amount} credits added to your account
            </p>
          </div>
          <div className="space-y-3">
            <Button
              onClick={() => router.push('/dashboard')}
              className="w-full"
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={() => router.push('/upload')}
              variant="secondary"
              className="w-full"
            >
              Start Uploading
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}



