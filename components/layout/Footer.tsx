'use client'

import React from 'react'
import { APP_NAME } from '@/lib/constants'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-border-color mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="text-lg">👐</div>
            <span className="text-sm font-medium text-text-dark">
              {APP_NAME}
            </span>
          </div>
          <p className="text-text-gray text-xs mb-1">
            Brutally honest hand critiques. No sugarcoating, just the truth.
          </p>
          <div className="text-text-gray text-xs opacity-70">
            © 2024 {APP_NAME}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
