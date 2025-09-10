'use client'

import React from 'react'
import { Card } from './Card'
import { Button } from './Button'
import { HandCritique } from '@/hooks/useHandCritique'

interface GalleryAnalysisModalProps {
  critique: HandCritique
  isOpen: boolean
  onClose: () => void
}

export const GalleryAnalysisModal: React.FC<GalleryAnalysisModalProps> = ({
  critique,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200'
    if (score >= 60) return 'bg-yellow-50 border-yellow-200'
    if (score >= 40) return 'bg-orange-50 border-orange-200'
    return 'bg-red-50 border-red-200'
  }

  const getVerdictColor = (verdict: string) => {
    if (verdict.includes('Hand Model Material') || verdict.includes('Fire') || verdict.includes('Slay')) return 'text-green-600'
    if (verdict.includes('Good Potential')) return 'text-blue-600'
    if (verdict.includes('Mid')) return 'text-yellow-600'
    if (verdict.includes('Eww!') || verdict.includes('Chopped!') || verdict.includes('Nah Fam') || verdict.includes('Absolutely Not') || verdict.includes('Trash')) return 'text-red-600'
    return 'text-red-600'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header with Close Button */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Full Analysis</h2>
          <Button
            onClick={onClose}
            variant="secondary"
            size="sm"
            className="!p-2"
          >
            ✕
          </Button>
        </div>

        {/* Content - Similar to Dashboard Layout */}
        <div className="flex h-[calc(90vh-80px)]">
          {/* Left Side - Image */}
          <div className="w-1/2 p-4 border-r">
            <div className="h-full flex items-center justify-center">
              {critique.imageUrl ? (
                <img
                  src={critique.imageUrl}
                  alt="Hand photo"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📷</div>
                    <p className="text-gray-500">No image available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Analysis Results */}
          <div className="w-1/2 p-4 overflow-y-auto">
            <div className="h-full flex flex-col space-y-4">
              {/* Score Section - Similar to Dashboard */}
              <div className={`p-6 rounded-lg ${getScoreBgColor(critique.score)} border-2`}>
                <div className="text-center">
                  <div className={`text-6xl font-black ${getScoreColor(critique.score)} mb-2 drop-shadow-lg`}>
                    {critique.score}
                  </div>
                  <div className="text-lg text-gray-600 mb-3">out of 100</div>
                  <div className={`text-xl font-bold ${getVerdictColor(critique.verdict)}`}>
                    {critique.verdict} {critique.verdict.includes('Hand Model Material') || critique.verdict.includes('Fire') || critique.verdict.includes('Slay') ? '✨' : critique.score < 50 ? '🥀' : ''}
                  </div>
                </div>
              </div>

              {/* Analysis Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200">
                  {/* Analysis */}
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-gray-800 mb-2">📝 Analysis</h3>
                    <div className="text-sm text-gray-800">
                      {critique.critique}
                    </div>
                  </div>

                  {/* Strengths */}
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-green-800 mb-2">✨ Strengths</h3>
                    <ul className="space-y-1">
                      {critique.strengths && critique.strengths.length > 0 ? (
                        critique.strengths.map((strength, index) => (
                          <li key={index} className="text-sm font-semibold text-green-800 flex items-start">
                            <span className="text-green-600 mr-2 font-bold">•</span>
                            <span>{strength}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-gray-500 italic">No strengths identified</li>
                      )}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div>
                    <h3 className="text-sm font-bold text-red-800 mb-2">⚠️ Weaknesses</h3>
                    <ul className="space-y-1">
                      {critique.improvements && critique.improvements.length > 0 ? (
                        critique.improvements.map((weakness, index) => (
                          <li key={index} className="text-sm font-semibold text-red-800 flex items-start">
                            <span className="text-red-600 mr-2 font-bold">•</span>
                            <span>{weakness}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-gray-500 italic">No weaknesses identified</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}





