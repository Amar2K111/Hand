'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useUploads } from '@/hooks/useUploads'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CREDITS_PACKAGE } from '@/lib/constants'

export const PaymentDebugger: React.FC = () => {
  const { user } = useAuth()
  const { uploadsData, loading, refetchUploadsData } = useUploads()
  const [isTestingPayment, setIsTestingPayment] = useState(false)
  const [paymentLogs, setPaymentLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setPaymentLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  const testPaymentFlow = async () => {
    if (!user) {
      addLog('❌ No user authenticated')
      return
    }

    setIsTestingPayment(true)
    setPaymentLogs([])
    
    try {
      addLog('🚀 Starting payment flow test...')
      addLog(`👤 User ID: ${user.uid}`)
      addLog(`📧 Email: ${user.email}`)
      addLog(`💰 Current credits: ${uploadsData?.uploadsRemaining || 0}`)

      // Step 1: Create checkout session
      addLog('📝 Creating checkout session...')
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success_url: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/offer`,
          user_id: user.uid,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        addLog(`❌ Checkout session failed: ${data.error}`)
        return
      }

      addLog(`✅ Checkout session created: ${data.sessionId}`)
      addLog('🔗 Redirecting to Stripe checkout...')
      
      // Load Stripe and redirect
      const { loadStripe } = await import('@stripe/stripe-js')
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      
      if (!stripe) {
        addLog('❌ Failed to load Stripe')
        return
      }

      addLog('💳 Use test card: 4242 4242 4242 4242')
      addLog('📅 Use any future date for expiry')
      addLog('🔢 Use any 3-digit CVC')
      
      const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId })

      if (error) {
        addLog(`❌ Stripe redirect failed: ${error.message}`)
      } else {
        addLog('✅ Redirected to Stripe checkout successfully')
      }

    } catch (error) {
      addLog(`❌ Payment test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsTestingPayment(false)
    }
  }

  const checkWebhookStatus = async () => {
    addLog('🔍 Checking webhook configuration...')
    
    // Check if webhook endpoint is accessible
    try {
      const response = await fetch('/api/webhook/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: true }),
      })
      
      if (response.status === 400) {
        addLog('✅ Webhook endpoint is accessible (400 expected for test)')
      } else {
        addLog(`⚠️ Webhook response: ${response.status}`)
      }
    } catch (error) {
      addLog(`❌ Webhook endpoint error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const refreshCredits = async () => {
    addLog('🔄 Refreshing credits...')
    try {
      await refetchUploadsData()
      addLog(`✅ Credits refreshed: ${uploadsData?.uploadsRemaining || 0} remaining`)
    } catch (error) {
      addLog(`❌ Failed to refresh credits: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  if (!user) {
    return null
  }

  return (
    <Card className="p-4 mb-6 border-blue-200 bg-blue-50">
      <h3 className="text-lg font-semibold text-blue-800 mb-4">
        💳 Payment Flow Debugger
      </h3>
      
      <div className="space-y-4">
        {/* Current Status */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">User ID:</span>
            <p className="text-gray-600 break-all text-xs">{user.uid}</p>
          </div>
          <div>
            <span className="font-medium">Current Credits:</span>
            <p className="text-lg font-bold text-blue-600">
              {loading ? '...' : uploadsData?.uploadsRemaining ?? 0}
            </p>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={testPaymentFlow}
            disabled={isTestingPayment}
            variant="secondary"
            size="sm"
          >
            {isTestingPayment ? 'Testing...' : '🧪 Test Payment Flow'}
          </Button>
          
          <Button
            onClick={checkWebhookStatus}
            variant="secondary"
            size="sm"
          >
            🔍 Check Webhook
          </Button>
          
          <Button
            onClick={refreshCredits}
            variant="secondary"
            size="sm"
          >
            🔄 Refresh Credits
          </Button>
        </div>

        {/* Payment Logs */}
        {paymentLogs.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-sm mb-2">Payment Test Logs:</h4>
            <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono max-h-40 overflow-y-auto">
              {paymentLogs.map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </div>
          </div>
        )}

        {/* Environment Check */}
        <div className="text-xs text-gray-600 space-y-1">
          <p><strong>Environment Check:</strong></p>
          <p>• Stripe Publishable Key: {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing'}</p>
          <p>• Credits Package: {CREDITS_PACKAGE.amount} credits for ${CREDITS_PACKAGE.price}</p>
          <p>• Base URL: {process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}</p>
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-600 bg-yellow-50 p-3 rounded">
          <p><strong>Testing Instructions:</strong></p>
          <p>1. Click "Test Payment Flow" to start a test payment</p>
          <p>2. Use test card: <code>4242 4242 4242 4242</code></p>
          <p>3. Complete the payment on Stripe</p>
          <p>4. Check if credits are added after returning to success page</p>
          <p>5. If credits aren't added, check webhook logs in Stripe Dashboard</p>
        </div>
      </div>
    </Card>
  )
}