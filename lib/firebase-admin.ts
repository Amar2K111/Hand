import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin SDK
const firebaseAdminConfig = {
  credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}')),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
}

// Initialize the app only if it doesn't exist
const adminApp = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0]

// Get Firestore instance
export const adminDb = getFirestore(adminApp)

export default adminApp
