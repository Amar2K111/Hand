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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-dark mb-4">
            See What You're Getting Into 👀
          </h2>
                     <p className="text-xl text-text-gray">
             Real examples of our brutally honest feedback
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {examples.map((example) => (
            <Card key={example.id} className="relative overflow-hidden">
              {/* Placeholder for hand image */}
              <div className="w-full h-48 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-6xl">👐</div>
              </div>

              {/* Score Overlay */}
              <div className="text-center space-y-3">
                                 <div className={`text-4xl font-bold ${example.color}`}>
                   {example.score}/100
                 </div>
                <div className="text-2xl">
                  {example.verdict}
                </div>
                               <div className="text-text-gray italic text-sm">
                 "{example.roast}"
               </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
