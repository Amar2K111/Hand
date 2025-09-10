'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={inputId}
          className={cn(
            "block text-sm font-medium",
            props.disabled ? "text-gray-400 cursor-not-allowed" : "text-text-dark cursor-pointer"
          )}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full px-4 py-3 bg-white border border-border-color rounded-lg text-text-dark placeholder-text-gray focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent transition-all duration-200',
          error && 'border-neon-red focus:ring-neon-red',
          props.disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'cursor-text',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-neon-red">{error}</p>
      )}
    </div>
  )
}
