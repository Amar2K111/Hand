'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPopup } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from '@/lib/firebase'

interface UserData {
  email: string
  displayName?: string
  photoURL?: string
  createdAt: Date
  onboardingCompleted: boolean
  onboardingData?: any
  provider?: string
  totalUploads?: number
  uploadsRemaining?: number
  language?: 'en' | 'es' | 'fr'
}

interface AuthContextType {
  user: (User & UserData) | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  markOnboardingCompleted: () => Promise<void>
  saveOnboardingProgress: (data: any) => Promise<void>
  isNewUser: boolean
  onboardingData: any
  updateTotalUploads: (newTotal: number) => Promise<void>
  skipOnboardingForLanguage: (language: string) => Promise<void>
  updateUserLanguage: (language: 'en' | 'es' | 'fr') => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(User & UserData) | null>(null)
  const [loading, setLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)
  const [onboardingData, setOnboardingData] = useState<any>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (!userDoc.exists()) {
            // Create user document for new users
            await setDoc(doc(db, 'users', user.uid), {
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              createdAt: new Date(),
              onboardingCompleted: false,
              provider: user.providerData[0]?.providerId || 'email',
              onboardingData: null,
              totalUploads: 0,
              uploadsRemaining: 0,
              language: 'en'
            })
            
            setIsNewUser(true)
            setOnboardingData(null)
            setUser({
              ...user,
              totalUploads: 0,
              uploadsRemaining: 0,
              language: 'en'
            } as User & UserData)
          } else {
            const userData = userDoc.data()
            setIsNewUser(!userData?.onboardingCompleted)
            setOnboardingData(userData?.onboardingData || null)
            
            // Merge Firebase Auth user with Firestore user data
            const mergedUser = {
              ...user,
              ...userData,
              totalUploads: userData?.totalUploads || 0,
              uploadsRemaining: userData?.uploadsRemaining || 0,
              language: userData?.language || 'en'
            } as User & UserData
            
            setUser(mergedUser)
          }
        } catch (error) {
          console.error('Error checking user document:', error)
          setIsNewUser(true)
          setOnboardingData(null)
          setUser({
            ...user,
            totalUploads: 0,
            uploadsRemaining: 0,
            language: 'en'
          } as User & UserData)
        }
      } else {
        setUser(null)
        setIsNewUser(false)
        setOnboardingData(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      // User data will be loaded by onAuthStateChanged listener
    } catch (error) {
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      // User document will be created by onAuthStateChanged listener
    } catch (error) {
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      // User data will be loaded by onAuthStateChanged listener
    } catch (error) {
      throw error
    }
  }

  const saveOnboardingProgress = async (data: any) => {
    if (!user) return
    
    try {
      await setDoc(doc(db, 'users', user.uid), {
        onboardingData: data,
        onboardingCompleted: false // Keep as false until all questions are answered
      }, { merge: true })
      setOnboardingData(data)
    } catch (error) {
      console.error('Error saving onboarding progress:', error)
      throw error
    }
  }

  const markOnboardingCompleted = async () => {
    if (!user) return
    
    try {
      await setDoc(doc(db, 'users', user.uid), {
        onboardingCompleted: true
      }, { merge: true })
      setIsNewUser(false)
    } catch (error) {
      console.error('Error marking onboarding as completed:', error)
      throw error
    }
  }


  const updateTotalUploads = async (newTotal: number) => {
    if (!user) return
    
    try {
      await setDoc(doc(db, 'users', user.uid), {
        totalUploads: newTotal
      }, { merge: true })
      
      // Update local user state
      setUser(prev => prev ? { ...prev, totalUploads: newTotal } : null)
    } catch (error) {
      console.error('Error updating total uploads:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      // Redirect to home page after logout
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    } catch (error) {
      throw error
    }
  }

  const skipOnboardingForLanguage = async (language: string) => {
    if (!user) return
    
    // Skip onboarding for French and Spanish users
    if (language === 'fr' || language === 'es') {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          onboardingCompleted: true
        }, { merge: true })
        setIsNewUser(false)
      } catch (error) {
        console.error('Error skipping onboarding for language:', error)
        throw error
      }
    }
  }

  const updateUserLanguage = async (language: 'en' | 'es' | 'fr') => {
    if (!user) return
    
    try {
      await setDoc(doc(db, 'users', user.uid), {
        language: language
      }, { merge: true })
      
      // Update local user state
      setUser(prev => prev ? { ...prev, language: language } : null)
    } catch (error) {
      console.error('Error updating user language:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    markOnboardingCompleted,
    saveOnboardingProgress,
    isNewUser,
    onboardingData,
    updateTotalUploads,
    skipOnboardingForLanguage,
    updateUserLanguage
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

