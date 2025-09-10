'use client'

import React from 'react'

export const FeatureList: React.FC = () => {
  const features = [
    {
      icon: "💀",
      title: "No sugarcoating",
      description: "Only brutal truth."
    },
         {
       icon: "🔥",
       title: "Expert feedback",
       description: "You'll want to share."
     },
    {
      icon: "📊",
      title: "Score out of 100",
      description: "Compete with yourself."
    },
         {
       icon: "👑",
       title: "Hand-model verdict",
       description: "Yes, maybe, or keep your day job."
     }
  ]

  return (
            <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
                      <h2 className="text-3xl font-bold text-text-dark mb-4">
              What You Get
            </h2>
            <p className="text-xl text-text-gray">
              Everything you need to know about your hand modeling potential
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center space-y-4 p-6 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="text-4xl">{feature.icon}</div>
              <h3 className="text-xl font-bold text-text-dark">
                {feature.title}
              </h3>
              <p className="text-text-gray">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
