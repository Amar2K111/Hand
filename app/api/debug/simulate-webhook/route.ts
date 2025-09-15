import { NextRequest, NextResponse } from 'next/server'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function POST(request: NextRequest) {
  try {
    const mockEvent = await request.json()
    
    if (mockEvent.type !== 'checkout.session.completed') {
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 })
    }

    const session = mockEvent.data.object
    const userId = session.metadata?.user_id
    const creditsAmount = parseInt(session.metadata?.credits_amount || '25')

    if (!userId) {
      return NextResponse.json({ error: 'No user ID in metadata' }, { status: 400 })
    }

    // Get current user data
    const userDocRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userDocRef)
    
    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userData = userDoc.data()
    const currentCredits = userData.uploadsRemaining || 0
    const newCredits = currentCredits + creditsAmount

    // Update user's credits
    await updateDoc(userDocRef, {
      uploadsRemaining: newCredits,
      lastPaymentDate: new Date(),
      lastPaymentSessionId: session.id,
      totalPayments: (userData.totalPayments || 0) + 1
    })

    return NextResponse.json({
      success: true,
      message: 'Mock webhook processed successfully',
      userId,
      creditsAdded: creditsAmount,
      previousCredits: currentCredits,
      newCredits,
      sessionId: session.id
    })

  } catch (error) {
    console.error('Error simulating webhook:', error)
    return NextResponse.json(
      { error: 'Failed to simulate webhook' },
      { status: 500 }
    )
  }
}
