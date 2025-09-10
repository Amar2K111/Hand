import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { CREDITS_PACKAGE } from '@/lib/constants'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(request: NextRequest) {
  try {
    console.log('Creating checkout session...')
    console.log('Stripe secret key exists:', !!process.env.STRIPE_SECRET_KEY)
    console.log('Stripe secret key starts with:', process.env.STRIPE_SECRET_KEY?.substring(0, 10))
    console.log('Base URL:', process.env.NEXT_PUBLIC_BASE_URL)
    
    const { success_url, cancel_url } = await request.json()
    console.log('Request body:', { success_url, cancel_url })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Hand Rating Credits',
              description: `${CREDITS_PACKAGE.amount} upload credits for hand rating analysis`,
            },
            unit_amount: CREDITS_PACKAGE.price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: success_url || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${process.env.NEXT_PUBLIC_BASE_URL}/offer`,
      metadata: {
        credits_amount: CREDITS_PACKAGE.amount.toString(),
      },
    })

    console.log('Session created successfully:', session.id)
    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : typeof error
    })
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

