'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useUploads } from '@/hooks/useUploads'
import { convertFileToBase64 } from '@/lib/gemini'
import { doc, setDoc, collection, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useToast } from '@/components/ui/Toast'

export interface HandCritique {
  id: string
  userId: string
  imageUrl: string
  score: number
  critique: string
  strengths: string[]
  improvements: string[]
  verdict: string
  createdAt: Date
}

export const useHandCritique = () => {
  const { user } = useAuth()
  const { decrementUploads, uploadsData } = useUploads()
  const { addToast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [currentCritique, setCurrentCritique] = useState<HandCritique | null>(null)

  const uploadAndAnalyze = async (file: File): Promise<HandCritique> => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Check if user has credits before proceeding - be extra strict
    console.log('About to check credits in uploadAndAnalyze')
    console.log('Current uploadsData:', uploadsData)
    console.log('Current uploadsRemaining:', uploadsData?.uploadsRemaining)
    
    // Double check credits before calling decrementUploads
    if (!uploadsData || uploadsData.uploadsRemaining <= 0) {
      console.log('No credits available, throwing error immediately')
      addToast('No credits remaining! Redirecting to offer page.', 'error')
      throw new Error('No credits remaining. Please purchase more credits to continue.')
    }
    
    const hasCredits = await decrementUploads()
    console.log('decrementUploads returned:', hasCredits)
    if (!hasCredits) {
      console.log('No credits remaining, throwing error')
      throw new Error('No credits remaining. Please purchase more credits to continue.')
    }

    console.log('Credits check passed, proceeding with analysis')

    setIsUploading(true)

    try {
      // Convert image to base64
      const imageBase64 = await convertFileToBase64(file)

      // Generate critique using server-side API with user's cloud-stored language
      const userLanguage = user.language || 'en'
      
      const response = await fetch('/api/generate-critique', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64,
          language: userLanguage
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate critique')
      }

      const critiqueData = await response.json()

      // Create critique object
      const critique: HandCritique = {
        id: `temp-${Date.now()}`, // Temporary ID for display
        userId: user.uid, // Keep for interface compatibility, but not needed in subcollection
        imageUrl: `data:image/jpeg;base64,${imageBase64}`, // Store as data URL for Firebase
        score: critiqueData.score,
        critique: critiqueData.critique,
        strengths: critiqueData.strengths,
        improvements: critiqueData.improvements,
        verdict: critiqueData.verdict,
        createdAt: new Date()
      }

      // Try to save to Firestore (with fallback if it fails)
      let savedCritique = critique
      try {
        // Save critique as a subcollection under the user document
        const docRef = await addDoc(collection(db, 'users', user.uid, 'critiques'), critique)
        savedCritique = {
          ...critique,
          id: docRef.id
        }
        console.log('Critique saved to user subcollection successfully')
      } catch (dbError) {
        console.warn('Failed to save critique to database, but continuing:', dbError)
        // Continue with the critique even if database save fails
      }

      // Credits were already decremented at the beginning of the function

      setCurrentCritique(critique)
      return critique

    } catch (error) {
      console.error('Error uploading and analyzing:', error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  const resetCritique = () => {
    setCurrentCritique(null)
  }

  return {
    uploadAndAnalyze,
    isUploading,
    currentCritique,
    resetCritique
  }
}



