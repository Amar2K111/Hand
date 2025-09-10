'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface CreditCounterProps {
  credits: number
  className?: string
}

export const CreditCounter: React.FC<CreditCounterProps> = ({
  credits,
  className
}) => {
  const hasCredits = credits > 0

  return (
    <div className={cn(
      'flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-200',
      hasCredits 
        ? 'border-neon-green bg-green-900 bg-opacity-20' 
        : 'border-neon-red bg-red-900 bg-opacity-20',
      className
    )}>
      <div className={cn(
        'text-2xl',
        hasCredits ? 'text-neon-green' : 'text-neon-red'
      )}>
        {hasCredits ? '✅' : '❌'}
      </div>
      
      <div className="flex-1">
        <div className={cn(
          'text-lg font-bold',
          hasCredits ? 'text-neon-green' : 'text-neon-red'
        )}>
          {hasCredits ? `Credits Left: ${credits}` : 'Credits Left: 0'}
        </div>
        
        <div className="text-sm text-text-gray">
          {hasCredits 
            ? 'Ready for your next hand roast!' 
            : 'Unlock 50 critiques to continue'
          }
        </div>
      </div>
    </div>
  )
}
