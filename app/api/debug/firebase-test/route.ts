import { NextResponse } from 'next/server'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET() {
  try {
    console.log('Testing Firebase connection...')
    
    // Test 1: Try to read a document
    const testDocRef = doc(db, 'test', 'connection')
    console.log('Created document reference')
    
    // Test 2: Try to read the document (should fail if permissions are wrong)
    const testDoc = await getDoc(testDocRef)
    console.log('Read document result:', testDoc.exists())
    
    // Test 3: Try to write a document
    await setDoc(testDocRef, {
      timestamp: new Date(),
      test: 'Firebase connection test'
    })
    console.log('Successfully wrote to Firestore')
    
    return NextResponse.json({
      success: true,
      message: 'Firebase connection working',
      canRead: testDoc.exists(),
      canWrite: true
    })
    
  } catch (error) {
    console.error('Firebase test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
