'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useUploads } from '@/hooks/useUploads'
import { generateHandCritique, convertFileToBase64 } from '@/lib/gemini'
import { doc, setDoc, collection, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

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
  const { language } = useLanguage()
  const { decrementUploads } = useUploads()
  const [isUploading, setIsUploading] = useState(false)
  const [currentCritique, setCurrentCritique] = useState<HandCritique | null>(null)

  const uploadAndAnalyze = async (file: File): Promise<HandCritique> => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Check if user has credits before proceeding
    const hasCredits = await decrementUploads()
    if (!hasCredits) {
      throw new Error('No credits remaining. Please purchase more credits to continue.')
    }

    setIsUploading(true)

    try {
      // Convert image to base64
      const imageBase64 = await convertFileToBase64(file)

      // Generate critique using Gemini with current language
      const critiqueData = await generateHandCritique(imageBase64, language)

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



