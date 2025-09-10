'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface UploadsData {
  uploadsRemaining: number
  totalUploads: number
}

export const useUploads = () => {
  const { user } = useAuth()
  const [uploadsData, setUploadsData] = useState<UploadsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUploadsData = async () => {
      if (!user) {
        setUploadsData(null)
        setLoading(false)
        return
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          setUploadsData({
            uploadsRemaining: data.uploadsRemaining || 0,
            totalUploads: data.totalUploads || 0
          })
        } else {
          // Set default values if document doesn't exist
          setUploadsData({
            uploadsRemaining: 0,
            totalUploads: 0
          })
        }
      } catch (error) {
        console.error('Error fetching uploads data:', error)
        setUploadsData({
          uploadsRemaining: 0,
          totalUploads: 0
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUploadsData()
  }, [user])

  const decrementUploads = async () => {
    if (!user || !uploadsData) {
      return false
    }

    // Check if user has credits before allowing upload
    if (uploadsData.uploadsRemaining <= 0) {
      console.log('User has no credits remaining')
      return false
    }

    try {
      // Update both total uploads and decrement remaining uploads
      // Only decrement if user has credits
      const newUploadsRemaining = uploadsData.uploadsRemaining - 1
      await updateDoc(doc(db, 'users', user.uid), {
        totalUploads: uploadsData.totalUploads + 1,
        uploadsRemaining: newUploadsRemaining
      })

      // Update local state immediately
      setUploadsData(prev => prev ? {
        ...prev,
        totalUploads: prev.totalUploads + 1,
        uploadsRemaining: newUploadsRemaining
      } : null)

      return true
    } catch (error) {
      console.error('Error updating upload count:', error)
      return false
    }
  }

  const addUploads = async (amount: number) => {
    if (!user) return

    try {
      // Add to current uploadsRemaining (can be negative)
      const newCount = (uploadsData?.uploadsRemaining || 0) + amount
      await setDoc(doc(db, 'users', user.uid), {
        uploadsRemaining: newCount
      }, { merge: true })

      setUploadsData(prev => prev ? {
        ...prev,
        uploadsRemaining: newCount
      } : null)
    } catch (error) {
      console.error('Error adding uploads:', error)
    }
  }

  const canUpload = () => {
    // Only allow uploads if user has available credits
    return uploadsData ? uploadsData.uploadsRemaining > 0 : false
  }

  const hasAvailableCredits = () => {
    return uploadsData ? uploadsData.uploadsRemaining > 0 : false
  }

  const getUploadsUsed = () => {
    return uploadsData ? uploadsData.totalUploads : 0
  }

  const refetchUploadsData = async () => {
    if (!user) return
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        const data = userDoc.data()
        setUploadsData({
          uploadsRemaining: data.uploadsRemaining || 0,
          totalUploads: data.totalUploads || 0
        })
      }
    } catch (error) {
      console.error('Error refetching uploads data:', error)
    }
  }


  return {
    uploadsData,
    loading,
    decrementUploads,
    addUploads,
    canUpload,
    hasAvailableCredits,
    getUploadsUsed,
    refetchUploadsData
  }
}
