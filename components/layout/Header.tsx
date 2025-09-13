'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { APP_NAME } from '@/lib/constants'
import LanguageToggle from '@/components/ui/LanguageToggle'

export const Header: React.FC = () => {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const isAuthPage = pathname.startsWith('/auth/')
  const { user } = useAuth()
  const { t } = useLanguage()

  // Show header on homepage and auth pages
  if (!isHomePage && !isAuthPage) {
    return null
  }

  return (
    <header className="bg-white border-b border-border-color sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-1 md:space-x-2">
            <div className="text-xl md:text-2xl">👐</div>
            <span className="text-lg md:text-xl font-bold bg-neon-blue text-white px-2 md:px-3 py-1 rounded-lg">
              {APP_NAME}
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
          </nav>

          {/* Auth Buttons and Language Toggle */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Language Toggle */}
            <LanguageToggle />
            
            {isHomePage ? (
              // Homepage navigation
              user ? (
                // Sign In button for logged in users (instead of profile icon)
                <Link href="/auth/signin">
                  <button className="bg-neon-blue hover:bg-blue-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-colors duration-200 text-sm md:text-base">
                    {t('nav.signin')}
                  </button>
                </Link>
              ) : (
                // Auth Buttons for non-logged in users
                <>
                  <Link href="/auth/signin">
                    <button className="text-text-gray hover:text-text-dark transition-colors duration-200 text-sm md:text-base hidden sm:block">
                      {t('nav.signin')}
                    </button>
                  </Link>
                  <Link href="/auth/signup">
                    <button className="bg-neon-blue hover:bg-blue-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-colors duration-200 text-sm md:text-base">
                      {t('nav.signup')}
                    </button>
                  </Link>
                </>
              )
            ) : (
              // Auth page navigation - show back to home link
              <Link href="/">
                <button className="text-text-gray hover:text-text-dark transition-colors duration-200 text-sm md:text-base">
                  ← <span className="hidden sm:inline">{t('nav.backToHome')}</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
