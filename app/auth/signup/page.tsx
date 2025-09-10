'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { APP_NAME } from '@/lib/constants'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const { signUp, signInWithGoogle, user, isNewUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && isNewUser) {
      router.push('/onboarding')
    }
  }, [user, isNewUser, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    const newErrors: Record<string, string> = {}
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsLoading(true)
    setErrors({})

    try {
      await signUp(formData.email, formData.password)
      // Keep loading state true until navigation happens
      // Navigation will be handled by useEffect
    } catch (error: any) {
      setIsLoading(false) // Only reset loading on error
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ email: 'An account with this email already exists' })
      } else if (error.code === 'auth/invalid-email') {
        setErrors({ email: 'Invalid email address' })
      } else if (error.code === 'auth/weak-password') {
        setErrors({ password: 'Password is too weak' })
      } else {
        setErrors({ general: 'An error occurred. Please try again.' })
      }
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setErrors({})

    try {
      await signInWithGoogle()
      // Keep loading state true until navigation happens
      // Navigation will be handled by useEffect
    } catch (error: any) {
      setIsGoogleLoading(false) // Only reset loading on error
      if (error.code === 'auth/popup-closed-by-user') {
        setErrors({ general: 'Sign-up was cancelled' })
      } else if (error.code === 'auth/popup-blocked') {
        setErrors({ general: 'Pop-up was blocked. Please allow pop-ups for this site.' })
      } else {
        setErrors({ general: 'Google sign-up failed. Please try again.' })
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <Card className="p-8">
            <div className="text-center mb-4">
                             <h1 className="text-3xl font-bold text-text-dark">
                 Hand 👐
               </h1>
              <p className="text-text-gray mt-2">
                Get your honest hand rating.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="text-red-500 text-sm text-center">
                  {errors.general}
                </div>
              )}

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                error={errors.email}
                disabled={isGoogleLoading}
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                error={errors.password}
                disabled={isGoogleLoading}
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                error={errors.confirmPassword}
                disabled={isGoogleLoading}
              />

                             <Button
                 type="submit"
                 className="w-full"
                 size="lg"
                 disabled={isLoading}
               >
                 {isLoading ? 'Signing Up...' : 'Create Account'}
               </Button>
             </form>

             {/* Divider */}
             <div className="relative my-6">
               <div className="absolute inset-0 flex items-center">
                 <div className="w-full border-t border-border-color" />
               </div>
               <div className="relative flex justify-center text-sm">
                 <span className="px-2 bg-card-bg text-text-gray">Or continue with</span>
               </div>
             </div>

             {/* Google Sign Up */}
             <Button
               type="button"
               variant="secondary"
               className="w-full flex items-center justify-center space-x-2"
               size="lg"
               disabled={isLoading || isGoogleLoading}
               onClick={handleGoogleSignIn}
             >
               {isGoogleLoading ? (
                 <>
                   <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                     <circle cx="12" cy="12" r="10" stroke="#4285F4" strokeWidth="2" fill="none" strokeDasharray="31.416" strokeDashoffset="31.416">
                       <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                       <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                     </circle>
                   </svg>
                   <span>Signing Up...</span>
                 </>
               ) : (
                 <>
                   <svg className="w-5 h-5" viewBox="0 0 24 24">
                     <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                     <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                     <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                     <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                   </svg>
                   <span>Sign up with Google</span>
                 </>
               )}
             </Button>

            <div className="mt-6 text-center">
                          <p className="text-text-gray">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-neon-blue hover:underline">
                Sign in
              </Link>
            </p>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
