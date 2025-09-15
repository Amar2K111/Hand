'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { APP_NAME } from '@/lib/constants'
import LanguageToggle from '@/components/ui/LanguageToggle'
import { SettingsModal } from '@/components/ui/SettingsModal'

export const Header: React.FC = () => {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const isAuthPage = pathname.startsWith('/auth/')
  const isDashboardPage = pathname.startsWith('/dashboard') || pathname.startsWith('/gallery') || pathname.startsWith('/profile') || pathname.startsWith('/critique')
  const isOnboardingPage = pathname.startsWith('/onboarding')
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Show header on homepage, auth pages, dashboard-related pages, and onboarding
  if (!isHomePage && !isAuthPage && !isDashboardPage && !isOnboardingPage) {
    return null
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setShowDropdown(false)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <>
      <header className="bg-white border-b border-border-color sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            {/* Logo */}
            <div className="flex items-center space-x-1 md:space-x-2">
              <div className="text-xl md:text-2xl">👐</div>
            <span className="text-lg md:text-xl font-bold text-text-dark">
              {APP_NAME}
            </span>
            </div>


          {/* Right side - Auth buttons, language toggle, mobile menu */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Language Toggle - Hidden on onboarding and dashboard pages */}
            {!isOnboardingPage && !isDashboardPage && (
              <div className="mr-2 md:mr-4">
                <LanguageToggle />
              </div>
            )}
              
            {isHomePage ? (
              // Homepage navigation - show sign in button
              user ? (
                // If user is logged in, redirect to dashboard
                <Link href="/dashboard">
                  <button className="bg-neon-blue hover:bg-blue-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-colors duration-200 text-sm md:text-base">
                    {t('nav.dashboard')}
                  </button>
                </Link>
              ) : (
                // Auth Button for non-logged in users
                <Link href="/auth/signup">
                  <button className="bg-neon-blue hover:bg-blue-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-colors duration-200 text-sm md:text-base">
                    {t('nav.signup')}
                  </button>
                </Link>
              )
            ) : isAuthPage ? (
                // Auth page navigation - show back to home link
                <Link href="/">
                  <button className="text-text-gray hover:text-text-dark transition-colors duration-200 text-sm md:text-base">
                    ← <span className="hidden sm:inline">{t('nav.backToHome')}</span>
                  </button>
                </Link>
              ) : isDashboardPage ? (
                // Dashboard pages - show profile button with full dropdown on both desktop and mobile
                <>
                  {user && (
                    <div className="relative" ref={dropdownRef}>
                      <button 
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="w-8 h-8 bg-neon-blue rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200 text-white font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </button>
                      
                      {showDropdown && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-200">
                          {/* User Info Section */}
                          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                            <div className="text-sm font-medium text-gray-900">
                              {user.displayName || 'User'}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {user.email}
                            </div>
                          </div>
                          
                          {/* Menu Items */}
                          <div className="py-1">
                            <Link 
                              href="/dashboard" 
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                              onClick={() => setShowDropdown(false)}
                            >
                              {t('profile.dashboard')}
                            </Link>
                            <Link 
                              href="/gallery" 
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                              onClick={() => setShowDropdown(false)}
                            >
                              {t('profile.gallery')}
                            </Link>
                            <Link 
                              href="/profile" 
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                              onClick={() => setShowDropdown(false)}
                            >
                              {t('profile.profile')}
                            </Link>
                            <button
                              onClick={() => {
                                setShowSettings(true)
                                setShowDropdown(false)
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                            >
                              {t('profile.settings')}
                            </button>
                            <button
                              onClick={handleLogout}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                            >
                              {t('profile.logout')}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : isOnboardingPage ? (
                // Onboarding pages - show profile button with logout-only dropdown
                <>
                  {user && (
                    <div className="relative" ref={dropdownRef}>
                      <button 
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="w-8 h-8 bg-neon-blue rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200 text-white font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </button>
                      
                      {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-200">
                          {/* User Info Section */}
                          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                            <div className="text-sm font-medium text-gray-900">
                              {user.displayName || 'User'}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {user.email}
                            </div>
                          </div>
                          
                          {/* Logout Only */}
                          <div className="py-1">
                            <button
                              onClick={handleLogout}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                            >
                              {t('profile.logout')}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>

        </div>
      </header>
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </>
  )
}
