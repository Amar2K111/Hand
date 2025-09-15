import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { adminDb } from '@/lib/firebase-admin'
import { CREDITS_PACKAGE } from '@/lib/constants'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  if (!stripe || !webhookSecret) {
    console.error('Stripe not configured - missing keys or webhook secret')
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 }
    )
  }
  
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('Received webhook event:', event.type)

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    
    // Get user ID from session metadata or customer email
    const userId = session.metadata?.user_id
    const customerEmail = session.customer_details?.email
    
    // Get credits amount from metadata
    const creditsAmount = parseInt(session.metadata?.credits_amount || CREDITS_PACKAGE.amount.toString())
    
    try {
      console.log('Processing checkout.session.completed event')
      console.log('Session ID:', session.id)
      console.log('Payment status:', session.payment_status)
      console.log('Session metadata:', session.metadata)
      
      // Verify the payment was successful
      if (session.payment_status !== 'paid') {
        console.error('Payment not completed for session:', session.id)
        return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
      }
      
      if (!userId && !customerEmail) {
        console.error('No user identifier found in session:', session.id)
        return NextResponse.json({ error: 'No user identifier' }, { status: 400 })
      }

      console.log('Processing payment for session:', session.id)
      console.log('User ID:', userId)
      console.log('Customer email:', customerEmail)
      console.log('Credits to add:', creditsAmount)

      // Find user by ID or email
      if (!userId) {
        console.error('Cannot process payment without user_id in metadata')
        return NextResponse.json({ error: 'User ID required in metadata' }, { status: 400 })
      }

      // Get current user data using Admin SDK
      console.log('Fetching user document for ID:', userId)
      const userDocRef = adminDb.collection('users').doc(userId)
      const userDoc = await userDocRef.get()
      
      if (!userDoc.exists) {
        console.error('User document not found for ID:', userId)
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      
      console.log('User document found, processing payment...')

      const userData = userDoc.data()
      
      if (!userData) {
        console.error('User document exists but has no data for ID:', userId)
        return NextResponse.json({ error: 'User data not found' }, { status: 404 })
      }
      
      // Check if this payment has already been processed (idempotency)
      if (userData.lastPaymentSessionId === session.id) {
        console.log(`Payment ${session.id} already processed for user ${userId}`)
        return NextResponse.json({ received: true, message: 'Payment already processed' })
      }

      const currentCredits = userData.uploadsRemaining || 0
      const newCredits = currentCredits + creditsAmount

      // Update user's credits using Admin SDK
      await userDocRef.update({
        uploadsRemaining: newCredits,
        lastPaymentDate: new Date(),
        lastPaymentSessionId: session.id,
        totalPayments: (userData.totalPayments || 0) + 1
      })

      // Create payment record for tracking using Admin SDK (as subcollection under user)
      await adminDb.collection('users').doc(userId).collection('payments').doc(session.id).set({
        sessionId: session.id,
        amount: session.amount_total,
        currency: session.currency,
        creditsAdded: creditsAmount,
        status: 'completed',
        createdAt: new Date(),
        customerEmail: session.customer_details?.email
      })

      console.log(`Successfully added ${creditsAmount} credits to user ${userId}`)
      console.log(`Previous credits: ${currentCredits}, New total: ${newCredits}`)

      // Log successful payment for audit trail
      console.log('Payment processed successfully:', {
        sessionId: session.id,
        userId: userId,
        creditsAdded: creditsAmount,
        newTotal: newCredits,
        amount: session.amount_total,
        currency: session.currency
      })

    } catch (error) {
      console.error('Error processing payment:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        sessionId: session.id,
        userId: userId,
        creditsAmount: creditsAmount
      })
      return NextResponse.json({ 
        error: 'Failed to process payment',
        details: error instanceof Error ? error.message : 'Unknown error',
        sessionId: session.id,
        userId: userId
      }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}

