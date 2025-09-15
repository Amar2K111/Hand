'use client'

import React, { useState, useRef } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CritiqueResults } from '@/components/ui/CritiqueResults'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useHandCritique, HandCritique } from '@/hooks/useHandCritique'
import { useUploads } from '@/hooks/useUploads'
import { useLanguage } from '@/contexts/LanguageContext'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { t } = useLanguage()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isUploaded, setIsUploaded] = useState(false)
  const [critique, setCritique] = useState<HandCritique | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const { uploadAndAnalyze } = useHandCritique()
  const { canUpload, hasAvailableCredits, refetchUploadsData, uploadsData, loading } = useUploads()


  // Note: Critiques are now loaded from Firebase via useUserCritiques hook
  // No need to load from localStorage as it has size limits with base64 images

  const handleUploadClick = () => {
    // Use the same file input for both mobile and desktop
    // On mobile, this will show native options (camera, gallery, files)
    // On desktop, this will show file picker
    fileInputRef.current?.click()
  }

  const handleCameraClick = () => {
    // Open camera directly
    cameraInputRef.current?.click()
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
      alert(t('dashboard.invalidFileError'))
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert(t('dashboard.fileSizeError'))
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
      alert(t('dashboard.pleaseSelectFile'))
      return
    }

    // Check if user has credits before proceeding
    // Don't proceed if still loading or if no credits available
    if (loading || !uploadsData || uploadsData.uploadsRemaining <= 0) {
      router.push('/offer')
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
          alert(t('dashboard.signinRequired'))
        } else if (error.message.includes('No credits remaining')) {
          // Redirect to offer page instead of showing error
          router.push('/offer')
        } else {
          alert(t('dashboard.generationFailed'))
        }
      } else {
        alert(t('dashboard.generationFailed'))
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
        
        <Header />
        
        <main className="flex-1 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Page Header */}
            <div className="text-center mb-6 md:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                {t('dashboard.title')}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                {t('dashboard.subtitle')}
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
                          <div className="text-4xl mb-4">{(!loading && uploadsData && uploadsData.uploadsRemaining > 0) ? '📊' : '💳'}</div>
                          <p className="text-gray-600 mb-6 text-sm sm:text-base">
                            {(!loading && uploadsData && uploadsData.uploadsRemaining > 0) ? t('dashboard.readyForRating') : 'You need more credits to analyze your hand'}
                          </p>
                          <Button
                            onClick={(!loading && uploadsData && uploadsData.uploadsRemaining > 0) ? handleGenerateResults : () => router.push('/offer')}
                            disabled={isGenerating}
                            size="lg"
                            className="px-6 sm:px-8 py-3 text-sm sm:text-base touch-manipulation"
                          >
                            {isGenerating ? t('dashboard.analyzing') : ((!loading && uploadsData && uploadsData.uploadsRemaining > 0) ? t('dashboard.generateResults') : 'Buy Credits')}
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
                      {t('dashboard.uploadDescription')}
                    </p>
                  </div>

                  {/* Hidden File Inputs */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
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
                              ? t('dashboard.dropPhoto')
                              : t('dashboard.clickToUpload')
                            }
                          </p>
                          <p className="text-gray-400 text-xs sm:text-sm">
                            {isDragOver 
                              ? '' 
                              : t('dashboard.dragDropOption')
                            }
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile Take Picture Button - Only visible on mobile, positioned between upload area and upload button */}
                  <div className="w-full max-w-md mx-auto block md:hidden mb-4">
                    <Button
                      onClick={handleCameraClick}
                      variant="secondary"
                      size="lg"
                      className="w-full text-lg py-4 min-h-[56px] flex items-center justify-center gap-3 touch-manipulation"
                    >
                      <span className="text-xl">📸</span>
                      <span>{t('upload.takePicture')}</span>
                    </Button>
                  </div>

                  {/* Upload Options */}
                  <div className="w-full max-w-md mx-auto">
                    {/* Single Upload Button - Same for both mobile and desktop */}
                    <Button
                      onClick={handleUploadClick}
                      size="lg"
                      className="w-full text-lg py-4 min-h-[56px] flex items-center justify-center gap-3 touch-manipulation"
                    >
                      <span className="text-xl">📁</span>
                      <span>{t('dashboard.uploadPhoto')}</span>
                    </Button>
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
