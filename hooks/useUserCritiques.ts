'use client'

import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { HandCritique } from './useHandCritique'

export const useUserCritiques = () => {
  const { user } = useAuth()
  const [critiques, setCritiques] = useState<HandCritique[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCritiques = async () => {
      if (!user) {
        setCritiques([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Query critiques from user's subcollection, ordered by creation date (newest first)
        const critiquesRef = collection(db, 'users', user.uid, 'critiques')
        const q = query(
          critiquesRef,
          orderBy('createdAt', 'desc')
        )

        const querySnapshot = await getDocs(q)
        const userCritiques: HandCritique[] = []

        querySnapshot.forEach((doc) => {
          const data = doc.data()
          
          // Handle different date formats from Firestore
          let createdAt: Date
          if (data.createdAt && typeof data.createdAt.toDate === 'function') {
            // Firestore Timestamp
            createdAt = data.createdAt.toDate()
          } else if (data.createdAt instanceof Date) {
            // Already a Date object
            createdAt = data.createdAt
          } else if (data.createdAt && typeof data.createdAt === 'string') {
            // String date
            createdAt = new Date(data.createdAt)
          } else {
            // Fallback to current date
            createdAt = new Date()
          }
          
          userCritiques.push({
            id: doc.id,
            userId: data.userId,
            imageUrl: data.imageUrl,
            score: data.score,
            critique: data.critique,
            strengths: data.strengths,
            improvements: data.improvements,
            verdict: data.verdict,
            createdAt: createdAt
          })
        })

        setCritiques(userCritiques)
        console.log(`Loaded ${userCritiques.length} critiques from database`)
      } catch (err) {
        console.error('Error fetching critiques from database:', err)
        
        // Fallback: try to load from localStorage
        try {
          // First try to load all critiques from the new array format
          const allCritiques = localStorage.getItem('allCritiques')
          if (allCritiques) {
            const parsedCritiques = JSON.parse(allCritiques)
            const critiquesWithDates = parsedCritiques.map((critique: any) => ({
              ...critique,
              createdAt: critique.createdAt && typeof critique.createdAt === 'string' 
                ? new Date(critique.createdAt) 
                : new Date()
            }))
            setCritiques(critiquesWithDates)
            console.log(`Loaded ${critiquesWithDates.length} critiques from localStorage array`)
          } else {
            // Fallback to single critique for backward compatibility
            const savedCritique = localStorage.getItem('handCritique')
            if (savedCritique) {
              const parsedCritique = JSON.parse(savedCritique)
              // Convert string date back to Date object
              if (parsedCritique.createdAt && typeof parsedCritique.createdAt === 'string') {
                parsedCritique.createdAt = new Date(parsedCritique.createdAt)
              }
              setCritiques([parsedCritique])
              console.log('Loaded single critique from localStorage as fallback')
            } else {
              setCritiques([])
            }
          }
          setError(null) // Clear error since we have fallback data
        } catch (localError) {
          console.error('Error loading from localStorage:', localError)
          setError('Failed to load critiques')
          setCritiques([])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCritiques()
  }, [user])

  const refreshCritiques = async () => {
    if (!user) return

    try {
      setError(null)
      const critiquesRef = collection(db, 'users', user.uid, 'critiques')
      const q = query(
        critiquesRef,
        orderBy('createdAt', 'desc')
      )

      const querySnapshot = await getDocs(q)
      const userCritiques: HandCritique[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        
        // Handle different date formats from Firestore
        let createdAt: Date
        if (data.createdAt && typeof data.createdAt.toDate === 'function') {
          // Firestore Timestamp
          createdAt = data.createdAt.toDate()
        } else if (data.createdAt instanceof Date) {
          // Already a Date object
          createdAt = data.createdAt
        } else if (data.createdAt && typeof data.createdAt === 'string') {
          // String date
          createdAt = new Date(data.createdAt)
        } else {
          // Fallback to current date
          createdAt = new Date()
        }
        
        userCritiques.push({
          id: doc.id,
          userId: data.userId,
          imageUrl: data.imageUrl,
          score: data.score,
          critique: data.critique,
          strengths: data.strengths,
          improvements: data.improvements,
          verdict: data.verdict,
          createdAt: createdAt
        })
      })

      setCritiques(userCritiques)
      console.log(`Refreshed ${userCritiques.length} critiques from database`)
    } catch (err) {
      console.error('Error refreshing critiques from database:', err)
      
      // Fallback: try to load from localStorage
      try {
        // First try to load all critiques from the new array format
        const allCritiques = localStorage.getItem('allCritiques')
        if (allCritiques) {
          const parsedCritiques = JSON.parse(allCritiques)
          const critiquesWithDates = parsedCritiques.map((critique: any) => ({
            ...critique,
            createdAt: critique.createdAt && typeof critique.createdAt === 'string' 
              ? new Date(critique.createdAt) 
              : new Date()
          }))
          setCritiques(critiquesWithDates)
          console.log(`Refreshed ${critiquesWithDates.length} critiques from localStorage array`)
        } else {
          // Fallback to single critique for backward compatibility
          const savedCritique = localStorage.getItem('handCritique')
          if (savedCritique) {
            const parsedCritique = JSON.parse(savedCritique)
            // Convert string date back to Date object
            if (parsedCritique.createdAt && typeof parsedCritique.createdAt === 'string') {
              parsedCritique.createdAt = new Date(parsedCritique.createdAt)
            }
            setCritiques([parsedCritique])
            console.log('Refreshed single critique from localStorage as fallback')
          } else {
            setCritiques([])
          }
        }
        setError(null) // Clear error since we have fallback data
      } catch (localError) {
        console.error('Error loading from localStorage during refresh:', localError)
        setError('Failed to refresh critiques')
      }
    }
  }

  return {
    critiques,
    loading,
    error,
    refreshCritiques
  }
}
