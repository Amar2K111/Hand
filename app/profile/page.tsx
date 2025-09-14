'use client'

import React, { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ProfilePage() {
  const { user, logout, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || ''
  })

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || ''
      })
    }
  }, [user])

  // Early return if user is not available
  if (!user) {
    return null
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement profile update logic
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      displayName: user?.displayName || '',
      email: user?.email || ''
    })
    setIsEditing(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }


  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <Navbar />
      
      <main className="flex-1 py-8 md:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Header with Back Button */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <Button
                onClick={() => router.push('/dashboard')}
                variant="secondary"
                size="sm"
                className="flex items-center space-x-2"
              >
                ← <span className="hidden sm:inline">{t('profile.backToDashboard')}</span>
              </Button>
              <div className="flex-1"></div>
            </div>
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                {t('profile.title')}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 px-4">
                {t('profile.subtitle')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="p-4 md:p-6 text-center">
                {/* Profile Avatar */}
                <div className="mb-6">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-neon-blue rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {user.displayName || 'User'}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {user.email}
                  </p>
                  {user.provider && (
                    <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {user.provider === 'google' ? 'Google Account' : 'Email Account'}
                    </span>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push('/gallery')}
                    variant="secondary"
                    className="w-full"
                  >
                    {t('profile.viewGallery')}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Settings Section */}
            <div className="lg:col-span-2">
              <Card className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {t('profile.accountInfo')}
                  </h3>
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="secondary"
                      size="sm"
                    >
                      {t('profile.editProfile')}
                    </Button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      label={t('profile.displayName')}
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      placeholder={t('profile.displayNamePlaceholder')}
                    />
                    <Input
                      label={t('profile.email')}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t('profile.emailPlaceholder')}
                      type="email"
                      disabled
                    />
                    
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        {isLoading ? t('profile.saving') : t('profile.saveChanges')}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="secondary"
                        className="flex-1"
                      >
                        {t('profile.cancel')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('profile.displayName')}
                      </label>
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {user.displayName || t('profile.notSet')}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('profile.email')}
                      </label>
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {user.email}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('profile.accountType')}
                      </label>
                      <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                        {user.provider === 'google' ? t('profile.googleAccount') : t('profile.emailPassword')}
                      </p>
                    </div>
                  </div>
                )}
              </Card>

              {/* Uploads Section */}
              <Card className="p-4 md:p-6 mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {t('profile.uploadCredits')}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{t('profile.uploadsRemaining')}</h4>
                      <p className="text-sm text-gray-600">{t('profile.uploadsRemainingDesc')}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">
                        {loading ? '...' : user?.uploadsRemaining ?? 0}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{t('profile.totalUploads')}</h4>
                      <p className="text-sm text-gray-600">{t('profile.totalUploadsDesc')}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {loading ? '...' : user?.totalUploads || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>


              {/* Danger Zone */}
              <Card className="p-4 md:p-6 mt-6 border-red-200 bg-red-50">
                <h3 className="text-xl font-semibold text-red-900 mb-4">
                  {t('profile.dangerZone')}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-100 rounded-lg">
                    <div>
                      <h4 className="font-medium text-red-900">{t('profile.deleteAccount')}</h4>
                      <p className="text-sm text-red-700">{t('profile.deleteAccountDesc')}</p>
                    </div>
                    <Button variant="secondary" size="sm" className="text-red-700 border-red-300 hover:bg-red-200">
                      {t('profile.delete')}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-red-100 rounded-lg">
                    <div>
                      <h4 className="font-medium text-red-900">{t('profile.signOut')}</h4>
                      <p className="text-sm text-red-700">{t('profile.signOutDesc')}</p>
                    </div>
                    <Button 
                      onClick={handleLogout}
                      variant="secondary" 
                      size="sm" 
                      className="text-red-700 border-red-300 hover:bg-red-200"
                    >
                      {t('profile.signOutButton')}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
