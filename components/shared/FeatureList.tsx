'use client'

import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export const FeatureList: React.FC = () => {
  const { t } = useLanguage()
  
  const features = [
    {
      icon: "💀",
      title: t('features.noSugarcoating.title'),
      description: t('features.noSugarcoating.description')
    },
    {
      icon: "🔥",
      title: t('features.expertFeedback.title'),
      description: t('features.expertFeedback.description')
    },
    {
      icon: "📊",
      title: t('features.score.title'),
      description: t('features.score.description')
    },
    {
      icon: "👑",
      title: t('features.verdict.title'),
      description: t('features.verdict.description')
    }
  ]

  return (
    <div className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-dark mb-3 md:mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg md:text-xl text-text-gray px-4">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center space-y-3 md:space-y-4 p-4 md:p-6 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="text-3xl md:text-4xl">{feature.icon}</div>
              <h3 className="text-lg md:text-xl font-bold text-text-dark">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base text-text-gray">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
