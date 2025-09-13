import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientAuthProvider from '@/components/providers/ClientAuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hand - Would a modeling agency hire your hands?',
  description: 'Upload your photos. Get brutally honest AI ratings, savage critiques, and a score out of 100.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
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
          {children}
        </ClientAuthProvider>
      </body>
    </html>
  )
}
