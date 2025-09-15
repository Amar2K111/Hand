'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export const WebhookTester: React.FC = () => {
  const { user } = useAuth()
  const [isTesting, setIsTesting] = useState(false)
  const [testResults, setTestResults] = useState<string[]>([])

  const addResult = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setTestResults(prev => [...prev, `[${timestamp}] ${message}`])
  }

  const testWebhookEndpoint = async () => {
    if (!user) {
      addResult('❌ No user authenticated')
      return
    }

    setIsTesting(true)
    setTestResults([])

    try {
      addResult('🔍 Testing webhook endpoint...')
      
      // Test 1: Check if endpoint exists
      const response = await fetch('/api/webhook/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: true }),
      })

      addResult(`📡 Webhook endpoint response: ${response.status}`)
      
      if (response.status === 400) {
        addResult('✅ Webhook endpoint is accessible (400 expected for invalid signature)')
      } else {
        const data = await response.text()
        addResult(`📄 Response: ${data}`)
      }

      // Test 2: Check environment variables
      addResult('🔧 Checking environment configuration...')
      
      const envCheck = await fetch('/api/debug/env-check', {
        method: 'GET',
      })

      if (envCheck.ok) {
        const envData = await envCheck.json()
        addResult(`🔑 Stripe Secret Key: ${envData.stripeSecret ? '✅ Set' : '❌ Missing'}`)
        addResult(`🔑 Webhook Secret: ${envData.webhookSecret ? '✅ Set' : '❌ Missing'}`)
        addResult(`🔑 Publishable Key: ${envData.publishableKey ? '✅ Set' : '❌ Missing'}`)
      } else {
        addResult('⚠️ Environment check endpoint not available')
      }

    } catch (error) {
      addResult(`❌ Webhook test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsTesting(false)
    }
  }

  const simulateWebhookEvent = async () => {
    if (!user) {
      addResult('❌ No user authenticated')
      return
    }

    setIsTesting(true)
    setTestResults([])

    try {
      addResult('🎭 Simulating webhook event...')
      addResult(`👤 User ID: ${user.uid}`)
      
      // Create a mock webhook event
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: `test_session_${Date.now()}`,
            payment_status: 'paid',
            amount_total: 1500, // $15.00
            currency: 'usd',
            metadata: {
              user_id: user.uid,
              credits_amount: '25'
            },
            customer_details: {
              email: user.email
            }
          }
        }
      }

      addResult('📤 Sending mock webhook event...')
      
      const response = await fetch('/api/debug/simulate-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockEvent),
      })

      const result = await response.json()
      
      if (response.ok) {
        addResult('✅ Mock webhook processed successfully')
        addResult(`📊 Result: ${JSON.stringify(result, null, 2)}`)
      } else {
        addResult(`❌ Mock webhook failed: ${result.error}`)
      }

    } catch (error) {
      addResult(`❌ Simulation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsTesting(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <Card className="p-4 mb-6 border-green-200 bg-green-50">
      <h3 className="text-lg font-semibold text-green-800 mb-4">
        🔗 Webhook Tester
      </h3>
      
      <div className="space-y-4">
        {/* Test Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={testWebhookEndpoint}
            disabled={isTesting}
            variant="secondary"
            size="sm"
          >
            {isTesting ? 'Testing...' : '🔍 Test Webhook Endpoint'}
          </Button>
          
          <Button
            onClick={simulateWebhookEvent}
            disabled={isTesting}
            variant="secondary"
            size="sm"
          >
            {isTesting ? 'Simulating...' : '🎭 Simulate Webhook Event'}
          </Button>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-sm mb-2">Test Results:</h4>
            <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono max-h-40 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index}>{result}</div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded">
          <p><strong>Webhook Testing Instructions:</strong></p>
          <p>1. Click "Test Webhook Endpoint" to check if the webhook is accessible</p>
          <p>2. Click "Simulate Webhook Event" to test credit addition without payment</p>
          <p>3. Check Stripe Dashboard → Developers → Webhooks for real webhook events</p>
          <p>4. Verify webhook URL is set to: <code>/api/webhook/stripe</code></p>
        </div>
      </div>
    </Card>
  )
}
