'use client'

import React from 'react'
import { Header } from '@/components/layout/Header'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProfileIcon } from '@/components/layout/ProfileIcon'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { GalleryCritiqueCard } from '@/components/ui/GalleryCritiqueCard'
import { useAuth } from '@/contexts/AuthContext'
import { useUserCritiques } from '@/hooks/useUserCritiques'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function GalleryPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { critiques, loading, error, refreshCritiques } = useUserCritiques()

  const handleUploadClick = () => {
    // Take users to dashboard for upload functionality
    router.push('/dashboard')
  }

  // Check if user has critiques
  const hasCritiques = critiques && critiques.length > 0
  

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Profile Icon - Floating in top right */}
        <ProfileIcon />
        
        <Header />
        <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your Gallery
            </h1>
            <p className="text-xl text-gray-600">
              View and manage your hand modeling portfolio
            </p>
          </div>

          {/* Gallery Content */}
          {loading ? (
            /* Loading State */
            <div className="flex justify-center">
              <Card className="p-6 text-center max-w-md">
                <div className="text-4xl mb-4">⏳</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Your Gallery...</h3>
                <p className="text-gray-500">
                  Fetching your hand critiques
                </p>
              </Card>
            </div>
          ) : error ? (
            /* Error State */
            <div className="flex justify-center">
              <Card className="p-6 text-center max-w-md">
                <div className="text-4xl mb-4">❌</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Error Loading Gallery</h3>
                <p className="text-gray-500 mb-4">
                  {error}
                </p>
                <Button
                  onClick={refreshCritiques}
                  variant="secondary"
                  className="w-full"
                >
                  🔄 Try Again
                </Button>
              </Card>
            </div>
          ) : loading ? (
            <div className="flex justify-center">
              <Card className="p-6 text-center max-w-md">
                <div className="text-4xl mb-4">⏳</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Gallery...</h3>
                <p className="text-gray-500">
                  Fetching your critiques
                </p>
              </Card>
            </div>
          ) : !hasCritiques ? (
            <div className="flex justify-center">
              {/* No Photos Yet Card */}
              <Card className="p-6 text-center border-dashed border-2 border-gray-300 bg-gray-50 max-w-md">
                <div className="text-4xl mb-4">📸</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Photos Yet</h3>
                <p className="text-gray-500 mb-4">
                  Start building your hand modeling portfolio
                </p>
                <Button variant="secondary" className="w-full" onClick={handleUploadClick}>
                  🚀 Upload First Photo
                </Button>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Critiques Gallery - Enhanced Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {critiques.map((critique) => (
                  <GalleryCritiqueCard
                    key={critique.id}
                    critique={critique}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}


