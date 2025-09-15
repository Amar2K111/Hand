import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientAuthProvider from '@/components/providers/ClientAuthProvider'
import { ToastProvider } from '@/components/ui/Toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hand - Would a modeling agency hire your hands?',
  description: 'Upload your photos. Get brutally honest AI ratings, savage critiques, and a score out of 100.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-light-bg text-text-dark min-h-screen`} suppressHydrationWarning={true}>
        <ClientAuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ClientAuthProvider>
      </body>
    </html>
  )
}
