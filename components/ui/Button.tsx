'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseClasses = 'font-bold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg'
  
  const variants = {
    primary: 'bg-neon-blue hover:bg-blue-500 text-white focus:ring-neon-blue shadow-lg hover:shadow-xl',
    secondary: 'bg-card-bg hover:bg-gray-700 text-text-dark border border-gray-600 focus:ring-gray-500',
    danger: 'bg-neon-red hover:bg-red-600 text-white focus:ring-neon-red shadow-lg hover:shadow-xl',
    success: 'bg-neon-green hover:bg-green-600 text-white focus:ring-neon-green shadow-lg hover:shadow-xl'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
