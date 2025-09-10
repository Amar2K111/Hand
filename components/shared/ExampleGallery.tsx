'use client'

import React from 'react'
import { Card } from '../ui/Card'

export const ExampleGallery: React.FC = () => {
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
          See What You're Getting Into 👀
        </h2>
        <p className="text-xl text-text-gray">
          Real examples of our brutally honest feedback
        </p>
      </div>

      {/* Two Picture Containers - Auto-sized to fit images */}
      <div className="flex justify-center space-x-16 py-8">
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img 
            src="/images/Capture d'écran 2025-09-10 201913.png" 
            alt="Professional hand modeling example - elegant hand pose" 
            className="max-w-[40rem] max-h-[40rem] object-contain"
          />
        </div>
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img 
            src="/images/Capture d'écran 2025-09-10 202026.png" 
            alt="Hand modeling example - jewelry showcase" 
            className="max-w-[40rem] max-h-[40rem] object-contain"
          />
        </div>
      </div>
    </div>
  )
}
