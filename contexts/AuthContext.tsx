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
        // Check if user has completed onboarding from cloud database
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (!userDoc.exists()) {
            setIsNewUser(true)
            setOnboardingData(null)
            // Set user with default values when document doesn't exist
            setUser({
              ...user,
              totalUploads: 0
            } as User & UserData)
          } else {
            // Check if onboarding is completed from cloud data
            const userData = userDoc.data()
            setIsNewUser(!userData?.onboardingCompleted)
            setOnboardingData(userData?.onboardingData || null)
            
            // Check if totalUploads field is missing and add it if needed (only for new users)
            if (userData?.totalUploads === undefined) {
              try {
                await setDoc(doc(db, 'users', user.uid), {
                  totalUploads: 0
                }, { merge: true })
                
                // Update userData with the new field
                userData.totalUploads = 0
                console.log('Added default totalUploads field for new user')
              } catch (error) {
                console.error('Error adding missing totalUploads field:', error)
              }
            }
            
            // Check if uploadsRemaining field is missing and add it if needed
            if (userData?.uploadsRemaining === undefined) {
              try {
                await setDoc(doc(db, 'users', user.uid), {
                  uploadsRemaining: 0
                }, { merge: true })
                
                // Update userData with the new field
                userData.uploadsRemaining = 0
                console.log('Added default uploadsRemaining field for user')
              } catch (error) {
                console.error('Error adding missing uploadsRemaining field:', error)
              }
            }
            
            // Merge Firebase Auth user with Firestore user data
            const mergedUser = {
              ...user,
              ...userData,
              totalUploads: userData?.totalUploads || 0,
              uploadsRemaining: userData?.uploadsRemaining || 0
            } as User & UserData
            
            setUser(mergedUser)
          }
        } catch (error) {
          console.error('Error checking user document:', error)
          setIsNewUser(true)
          setOnboardingData(null)
          // Set user with default values on error (only for new users)
          setUser({
            ...user,
            totalUploads: 0,
            uploadsRemaining: 0
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
      const result = await signInWithEmailAndPassword(auth, email, password)
      // Check if user has completed onboarding from cloud database
      const userDoc = await getDoc(doc(db, 'users', result.user.uid))
      if (!userDoc.exists()) {
        setIsNewUser(true)
        setOnboardingData(null)
      } else {
        const userData = userDoc.data()
        setIsNewUser(!userData.onboardingCompleted)
        setOnboardingData(userData.onboardingData || null)
        
        // Check if totalUploads field is missing and add it if needed
        if (userData?.totalUploads === undefined) {
          try {
            await setDoc(doc(db, 'users', result.user.uid), {
              totalUploads: 0
            }, { merge: true })
          } catch (error) {
            console.error('Error adding missing totalUploads field during sign in:', error)
          }
        }
        
        // Check if uploadsRemaining field is missing and add it if needed
        if (userData?.uploadsRemaining === undefined) {
          try {
            await setDoc(doc(db, 'users', result.user.uid), {
              uploadsRemaining: 0
            }, { merge: true })
          } catch (error) {
            console.error('Error adding missing uploadsRemaining field during sign in:', error)
          }
        }
      }
    } catch (error) {
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      // Create user document
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        createdAt: new Date(),
        onboardingCompleted: false,
        onboardingData: null,
        totalUploads: 0,
        uploadsRemaining: 0
      })
      setIsNewUser(true)
      setOnboardingData(null)
    } catch (error) {
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      // Check if user has completed onboarding from cloud database
      const userDoc = await getDoc(doc(db, 'users', result.user.uid))
      if (!userDoc.exists()) {
        // Create user document for new Google users
        await setDoc(doc(db, 'users', result.user.uid), {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          createdAt: new Date(),
          onboardingCompleted: false,
          provider: 'google',
          onboardingData: null,
          totalUploads: 0,
          uploadsRemaining: 0
        })
        setIsNewUser(true)
        setOnboardingData(null)
      } else {
        const userData = userDoc.data()
        setIsNewUser(!userData.onboardingCompleted)
        setOnboardingData(userData.onboardingData || null)
        
        // Check if totalUploads field is missing and add it if needed
        if (userData?.totalUploads === undefined) {
          try {
            await setDoc(doc(db, 'users', result.user.uid), {
              totalUploads: 0
            }, { merge: true })
          } catch (error) {
            console.error('Error adding missing totalUploads field during Google sign in:', error)
          }
        }
      }
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
    updateTotalUploads
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

