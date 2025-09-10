import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    
    // Here you would typically:
    // 1. Verify the payment was successful
    // 2. Add credits to the user's account in your database
    // 3. Send confirmation email
    
    console.log('Payment successful for session:', session.id)
    console.log('Credits to add:', session.metadata?.credits_amount)
    
    // For now, we'll handle credit allocation on the frontend
    // In a production app, you'd want to store this in a database
  }

  return NextResponse.json({ received: true })
}

