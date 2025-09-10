'use client'

import React from 'react'
import { Card } from './Card'
import { ScoreBar } from './ScoreBar'
import { Button } from './Button'
import { HandCritique } from '@/hooks/useHandCritique'

interface CritiqueCardProps {
  critique: HandCritique
  onRetry?: () => void
  className?: string
}

export const CritiqueCard: React.FC<CritiqueCardProps> = ({
  critique,
  onRetry,
  className
}) => {
  return (
    <Card className={cn('max-w-2xl mx-auto', className)}>
      <div className="space-y-8">
        {/* Score Section */}
        <ScoreBar score={critique.score} />

        {/* Analysis Section */}
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold text-neon-red">The Brutal Truth</h3>
          <div className="text-lg text-text-gray italic">
            "{critique.critique}"
          </div>
        </div>

        {/* Strengths Section */}
        {critique.strengths && critique.strengths.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-green-600 text-center">
              ✨ Strengths
            </h3>
            <div className="space-y-3">
              {critique.strengths.map((strength, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg"
                >
                  <span className="text-green-600 text-lg">✨</span>
                  <span className="text-text-dark">{strength}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improvements Section */}
        {critique.improvements && critique.improvements.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-orange-600 text-center">
              💡 Areas to Improve
            </h3>
            <div className="space-y-3">
              {critique.improvements.map((improvement, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg"
                >
                  <span className="text-orange-600 text-lg">💡</span>
                  <span className="text-text-dark">{improvement}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verdict Section */}
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold text-neon-gold">Final Verdict</h3>
                     <div className="text-2xl font-bold text-neon-gold">
             {critique.verdict}
           </div>
        </div>

        {/* Action Buttons */}
        {onRetry && (
          <div className="flex justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={onRetry}
              className="w-full max-w-xs"
            >
              Think you can do better? Upload again →
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
