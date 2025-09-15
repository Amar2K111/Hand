import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
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
    
    try {
      // Verify the payment was successful
      if (session.payment_status !== 'paid') {
        console.error('Payment not completed for session:', session.id)
        return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
      }

      // Get user ID from session metadata or customer email
      const userId = session.metadata?.user_id
      const customerEmail = session.customer_details?.email
      
      if (!userId && !customerEmail) {
        console.error('No user identifier found in session:', session.id)
        return NextResponse.json({ error: 'No user identifier' }, { status: 400 })
      }

      // Get credits amount from metadata
      const creditsAmount = parseInt(session.metadata?.credits_amount || CREDITS_PACKAGE.amount.toString())
      
      console.log('Processing payment for session:', session.id)
      console.log('User ID:', userId)
      console.log('Customer email:', customerEmail)
      console.log('Credits to add:', creditsAmount)

      // Find user by ID or email
      let userDocRef
      if (userId) {
        userDocRef = doc(db, 'users', userId)
      } else {
        // If no user ID, we need to find user by email
        // This is a fallback - ideally you should always pass user_id in metadata
        console.warn('No user_id in metadata, using email lookup as fallback')
        // For now, we'll log this and return an error since we can't easily query by email
        console.error('Cannot process payment without user_id in metadata')
        return NextResponse.json({ error: 'User ID required in metadata' }, { status: 400 })
      }

      // Get current user data
      const userDoc = await getDoc(userDocRef)
      
      if (!userDoc.exists()) {
        console.error('User document not found for ID:', userId)
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const userData = userDoc.data()
      
      // Check if this payment has already been processed (idempotency)
      if (userData.lastPaymentSessionId === session.id) {
        console.log(`Payment ${session.id} already processed for user ${userId}`)
        return NextResponse.json({ received: true, message: 'Payment already processed' })
      }

      const currentCredits = userData.uploadsRemaining || 0
      const newCredits = currentCredits + creditsAmount

      // Update user's credits
      await updateDoc(userDocRef, {
        uploadsRemaining: newCredits,
        lastPaymentDate: new Date(),
        lastPaymentSessionId: session.id,
        totalPayments: (userData.totalPayments || 0) + 1
      })

      // Create payment record for tracking
      await setDoc(doc(db, 'payments', session.id), {
        userId: userId,
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
      return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}

