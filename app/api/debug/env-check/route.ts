import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envCheck = {
      stripeSecret: !!process.env.STRIPE_SECRET_KEY,
      webhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      publishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      baseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
      firebase: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      gemini: !!process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    }

    return NextResponse.json(envCheck)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check environment variables' },
      { status: 500 }
    )
  }
}
