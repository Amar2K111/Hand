import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { APP_NAME } from '@/lib/constants'
import { SettingsModal } from '@/components/ui/SettingsModal'

export const ProfileIcon: React.FC = () => {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const isHomePage = pathname === '/'
  const [showDropdown, setShowDropdown] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Never show profile icon on home page
  if (isHomePage) {
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
      // Redirect to home page after logout
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <>
      {/* Hand Logo - Top Left */}
      <div className="fixed top-4 left-4 z-50">
        <div className="flex items-center space-x-2">
          <div className="text-2xl">👐</div>
          <span className="text-xl font-bold bg-neon-blue text-white px-3 py-1 rounded-lg">
            {APP_NAME}
          </span>
        </div>
      </div>

      {/* Profile Icon - Top Right */}
      {user && (
        <div className="fixed top-4 right-4 z-50" ref={dropdownRef}>
          <div 
            className="w-10 h-10 bg-neon-blue rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors duration-200 text-white font-medium shadow-lg"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : user.displayName ? (
              <span className="text-sm font-semibold">
                {user.displayName.charAt(0).toUpperCase()}
              </span>
            ) : user.email ? (
              <span className="text-sm font-semibold">
                {user.email.charAt(0).toUpperCase()}
              </span>
            ) : (
              <span className="text-sm font-semibold">👤</span>
            )}
          </div>
          
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
                  🏠 Dashboard
                </Link>
                <Link 
                  href="/gallery" 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setShowDropdown(false)}
                >
                  🖼️ Gallery
                </Link>
                <Link 
                  href="/profile" 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setShowDropdown(false)}
                >
                  👤 Profile
                </Link>
                <button
                  onClick={() => {
                    setShowSettings(true)
                    setShowDropdown(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  ⚙️ Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  🚪 Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </>
  )
}
