'use client'

import React, { useState, useRef } from 'react'
import { Header } from '@/components/layout/Header'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CritiqueResults } from '@/components/ui/CritiqueResults'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { ProfileIcon } from '@/components/layout/ProfileIcon'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useHandCritique, HandCritique } from '@/hooks/useHandCritique'
import { useUploads } from '@/hooks/useUploads'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isUploaded, setIsUploaded] = useState(false)
  const [critique, setCritique] = useState<HandCritique | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const { uploadAndAnalyze } = useHandCritique()
  const { canUpload, hasAvailableCredits, refetchUploadsData } = useUploads()

  // Note: Critiques are now loaded from Firebase via useUserCritiques hook
  // No need to load from localStorage as it has size limits with base64 images

  const handleUploadClick = () => {
    // Always allow file selection - we'll check uploads when generating
    fileInputRef.current?.click()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      // Automatically show split layout after file selection
      setIsUploaded(true)
    }
  }

  const handleGenerateResults = async () => {
    if (!selectedFile) {
      alert('Please select a file first')
      return
    }

    setIsGenerating(true)
    try {
      const result = await uploadAndAnalyze(selectedFile)
      setCritique(result)
      // Save to localStorage so it persists on refresh
      // Ensure date is properly serialized
      const serializedResult = {
        ...result,
        createdAt: result.createdAt.toISOString() // Convert Date to string for JSON serialization
      }
      
      // Note: Critiques are now stored in Firebase, no need for localStorage
      // localStorage has size limits and base64 images are too large
      
      // Refetch uploads data to ensure UI is updated
      await refetchUploadsData()
    } catch (error) {
      console.error('Error generating results:', error)
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('not authenticated')) {
          alert('Please sign in to generate critiques.')
        } else {
          alert('Failed to generate results. Please try again.')
        }
      } else {
        alert('Failed to generate results. Please try again.')
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    setIsUploaded(false)
    setCritique(null)
    // Note: No need to clear localStorage as we're not using it anymore
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Profile Icon - Floating in top right */}
        <ProfileIcon />
        
        <Header />
        <Navbar />
        
        <main className="flex-1 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Page Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Hand Rating 👀
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Do you have what it takes to be a hand model? Let's find out.
              </p>
            </div>

            {/* Upload Section */}
            {isUploaded ? (
              /* Split Layout - After Upload */
              <Card className="mb-8 p-8 w-full">
                  <div className="flex h-[650px]">
                    {/* Left Side - Image */}
                    <div className="flex-1 pr-4">
                      <div className="relative h-full">
                        <img 
                          src={previewUrl || ''} 
                          alt="Uploaded" 
                          className="w-full h-full object-contain rounded-lg border-2 border-gray-300 bg-gray-50"
                        />
                        <button
                          onClick={handleRemoveFile}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors text-sm"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    
                    {/* Vertical Line */}
                    <div className="w-px bg-gray-300"></div>
                    
                    {/* Right Side - Rating Results */}
                    <div className="flex-1 pl-4">
                      {critique ? (
                        <CritiqueResults 
                          critique={critique} 
                          onRetry={handleRemoveFile}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <div className="text-4xl mb-4">📊</div>
                            <p className="text-gray-600 mb-6">
                              Ready to get your brutally honest rating?
                            </p>
                            <Button
                              onClick={canUpload() ? handleGenerateResults : () => router.push('/offer')}
                              disabled={isGenerating}
                              size="lg"
                              className="px-8 py-3"
                            >
                              {isGenerating ? 'Analyzing...' : 'Generate Results'}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
            ) : (
              /* Original Layout - Before Upload */
              <Card className="mb-8 text-center py-12">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="text-6xl">📸</div>
                    <p className="text-text-gray text-lg max-w-2xl mx-auto">
                      Upload a photo and get an honest rating. No sugarcoating.
                    </p>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {/* Photo Upload Area */}
                  <div className="w-full max-w-2xl mx-auto">
                    {previewUrl ? (
                      <div className="relative">
                        <img 
                          src={previewUrl || ''} 
                          alt="Preview" 
                          className="w-full h-64 object-cover rounded-lg border-2 border-gray-300"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl text-gray-400 mb-2">📷</div>
                          <p className="text-gray-500 text-sm">Click below to upload your hand photo</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <Button
                    onClick={handleUploadClick}
                    size="lg"
                    className="w-full max-w-md text-lg py-4"
                  >
                    Choose Photo
                  </Button>
                </div>
              </Card>
            )}



          </div>
        </main>

        

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
