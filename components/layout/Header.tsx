'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { APP_NAME } from '@/lib/constants'

export const Header: React.FC = () => {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const { user } = useAuth()

  // Only show header on homepage
  if (!isHomePage) {
    return null
  }

  return (
    <header className="bg-white border-b border-border-color sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl">👐</div>
            <span className="text-xl font-bold bg-neon-blue text-white px-3 py-1 rounded-lg">
              {APP_NAME}
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              // Sign In button for logged in users (instead of profile icon)
              <Link href="/auth/signin">
                <button className="bg-neon-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                  Sign In
                </button>
              </Link>
            ) : (
              // Auth Buttons for non-logged in users
              <>
                <Link href="/auth/signin">
                  <button className="text-text-gray hover:text-text-dark transition-colors duration-200">
                    Sign In
                  </button>
                </Link>
                <Link href="/auth/signup">
                  <button className="bg-neon-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
