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
  const [isDragOver, setIsDragOver] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { uploadAndAnalyze } = useHandCritique()
  const { canUpload, hasAvailableCredits, refetchUploadsData } = useUploads()

  // Enhanced mobile detection
  React.useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isSmallScreen = window.innerWidth <= 768
      
      // More accurate mobile detection
      setIsMobile(isMobileDevice || (isTouchDevice && isSmallScreen))
    }
    
    checkMobile()
    
    // Re-check on resize
    const handleResize = () => {
      checkMobile()
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Note: Critiques are now loaded from Firebase via useUserCritiques hook
  // No need to load from localStorage as it has size limits with base64 images

  const handleUploadClick = () => {
    // Always allow file selection - we'll check uploads when generating
    fileInputRef.current?.click()
  }

  const handleCameraClick = () => {
    // Create camera input for mobile
    const cameraInput = document.createElement('input')
    cameraInput.type = 'file'
    cameraInput.accept = 'image/*'
    cameraInput.capture = 'environment' // Use back camera
    cameraInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        processFile(file)
      }
    }
    cameraInput.click()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    setSelectedFile(file)
    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    // Automatically show split layout after file selection
    setIsUploaded(true)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFile(files[0])
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
            <div className="text-center mb-6 md:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                Hand Rating 👀
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Do you have what it takes to be a hand model? Let's find out.
              </p>
            </div>

            {/* Upload Section */}
            {isUploaded ? (
              /* Split Layout - After Upload - Enhanced Responsive */
              <Card className="mb-8 p-4 sm:p-6 lg:p-8 w-full">
                <div className="flex flex-col lg:flex-row min-h-[500px] lg:h-[650px] gap-4 lg:gap-6">
                  {/* Left Side - Image */}
                  <div className="flex-1 lg:pr-4">
                    <div className="relative h-64 sm:h-80 lg:h-full">
                      <img 
                        src={previewUrl || ''} 
                        alt="Uploaded" 
                        className="w-full h-full object-contain rounded-lg border-2 border-gray-300 bg-gray-50"
                      />
                      <button
                        onClick={handleRemoveFile}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 sm:w-6 sm:h-6 flex items-center justify-center hover:bg-red-600 transition-colors text-lg sm:text-sm touch-manipulation"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  
                  {/* Vertical/Horizontal Line */}
                  <div className="hidden lg:block w-px bg-gray-300"></div>
                  <div className="lg:hidden w-full h-px bg-gray-300"></div>
                  
                  {/* Right Side - Rating Results */}
                  <div className="flex-1 lg:pl-4">
                    {critique ? (
                      <CritiqueResults 
                        critique={critique} 
                        onRetry={handleRemoveFile}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full min-h-[200px]">
                        <div className="text-center">
                          <div className="text-4xl mb-4">📊</div>
                          <p className="text-gray-600 mb-6 text-sm sm:text-base">
                            Ready to get your brutally honest rating?
                          </p>
                          <Button
                            onClick={canUpload() ? handleGenerateResults : () => router.push('/offer')}
                            disabled={isGenerating}
                            size="lg"
                            className="px-6 sm:px-8 py-3 text-sm sm:text-base touch-manipulation"
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
                    {isMobile && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
                        <p className="text-blue-800 text-sm">
                          <span className="font-semibold">📱 Mobile Tips:</span> Choose "Files" to browse your photos, or "Gallery" to take a new photo with your camera. Make sure your hands are well-lit and clearly visible!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {/* Photo Upload Area - Enhanced Mobile */}
                  <div className="w-full max-w-2xl mx-auto">
                    {previewUrl ? (
                      <div className="relative">
                        <img 
                          src={previewUrl || ''} 
                          alt="Preview" 
                          className="w-full h-48 sm:h-64 object-cover rounded-lg border-2 border-gray-300"
                        />
                        <button
                          onClick={handleRemoveFile}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors text-lg touch-manipulation"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div 
                        className={`w-full h-48 sm:h-64 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors touch-manipulation ${
                          isDragOver 
                            ? 'border-blue-400 bg-blue-50' 
                            : 'border-gray-300 bg-gray-100 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                        onClick={handleUploadClick}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <div className="text-center px-4">
                          <div className="text-3xl sm:text-4xl text-gray-400 mb-2">📷</div>
                          <p className="text-gray-500 text-sm sm:text-base mb-1 font-medium">
                            {isDragOver 
                              ? 'Drop your photo here' 
                              : isMobile 
                                ? 'Tap to upload your hand photo' 
                                : 'Click to upload your hand photo'
                            }
                          </p>
                          <p className="text-gray-400 text-xs sm:text-sm">
                            {isDragOver 
                              ? '' 
                              : isMobile 
                                ? 'or use the buttons below' 
                                : 'or drag & drop, or use buttons below'
                            }
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Upload Options */}
                  <div className="w-full max-w-md mx-auto">
                    {isMobile ? (
                      // Mobile: Show options when button is pressed
                      <div className="space-y-3">
                        <Button
                          onClick={handleUploadClick}
                          size="lg"
                          className="w-full text-lg py-4 min-h-[56px] flex items-center justify-center gap-3 touch-manipulation"
                        >
                          <span className="text-xl">📁</span>
                          <span>Files</span>
                        </Button>
                        <Button
                          onClick={handleCameraClick}
                          size="lg"
                          variant="secondary"
                          className="w-full text-lg py-4 min-h-[56px] flex items-center justify-center gap-3 touch-manipulation"
                        >
                          <span className="text-xl">📷</span>
                          <span>Gallery</span>
                        </Button>
                      </div>
                    ) : (
                      // Desktop: Single upload button
                      <Button
                        onClick={handleUploadClick}
                        size="lg"
                        className="w-full text-lg py-4 min-h-[56px] flex items-center justify-center gap-3"
                      >
                        <span className="text-xl">📁</span>
                        <span>Upload Photo</span>
                      </Button>
                    )}
                  </div>
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
