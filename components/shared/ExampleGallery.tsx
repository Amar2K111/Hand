'use client'

import React from 'react'
import { Card } from '../ui/Card'
import { useLanguage } from '@/contexts/LanguageContext'

export const ExampleGallery: React.FC = () => {
  const { t } = useLanguage()
  const examples = [
    {
      id: 1,
      score: 37,
      roast: "Your nails are crying for help",
      verdict: "❌",
      color: "text-neon-red"
    },
    {
      id: 2,
      score: 92,
      roast: "Hand Model Material",
      verdict: "✅",
      color: "text-neon-green"
    },
    {
      id: 3,
      score: 68,
      roast: "Not terrible, but definitely not hand model material",
      verdict: "🤔",
      color: "text-yellow-400"
    }
  ]

  return (
    <div className="py-16">
      <div className="text-center mb-12 px-4">
        <h2 className="text-3xl font-bold text-text-dark mb-4">
          {t('examples.title')}
        </h2>
        <p className="text-xl text-text-gray">
          {t('examples.subtitle')}
        </p>
      </div>

      {/* Two Picture Containers - Enhanced Responsive layout */}
      <div className="flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-12 xl:gap-16 py-8 px-4">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
          <div className="rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <img 
              src="/images/Capture d'écran 2025-09-10 201913.png" 
              alt="Professional hand modeling example - elegant hand pose" 
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>
        </div>
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
          <div className="rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <img 
              src="/images/Capture d'écran 2025-09-10 202026.png" 
              alt="Hand modeling example - jewelry showcase" 
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
