'use client'

import React, { useState } from 'react'
import { Card } from './Card'
import { Button } from './Button'
import { HandCritique } from '@/hooks/useHandCritique'
import { GalleryAnalysisModal } from './GalleryAnalysisModal'
import { useLanguage } from '@/contexts/LanguageContext'

interface GalleryCritiqueCardProps {
  critique: HandCritique
  className?: string
}

export const GalleryCritiqueCard: React.FC<GalleryCritiqueCardProps> = ({
  critique,
  className
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { t, language } = useLanguage()
  

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

  const formatDate = (date: Date | string | any) => {
    try {
      let dateObj: Date
      
      // Handle different date formats
      if (date instanceof Date) {
        dateObj = date
      } else if (typeof date === 'string') {
        dateObj = new Date(date)
      } else if (date && typeof date === 'object' && date.seconds) {
        // Handle Firestore timestamp format
        dateObj = new Date(date.seconds * 1000)
      } else {
        // Fallback to current date
        dateObj = new Date()
      }
      
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Recent'
      }
      
      // Use language-specific locale for date formatting
      const locale = language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : 'en-US'
      
      return new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(dateObj)
    } catch (error) {
      console.warn('Error formatting date:', error)
      return 'Recent'
    }
  }

  const handleViewDetails = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <Card className={`overflow-hidden hover:shadow-lg transition-shadow duration-200 ${className}`}>
        {/* Image Section */}
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          {critique.imageUrl ? (
            <img
              src={critique.imageUrl}
              alt="Hand photo"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-sm text-gray-500">{t('gallery.noImage')}</p>
              </div>
            </div>
          )}
          
          {/* Score Badge */}
          <div className="absolute top-2 right-2">
            <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreBgColor(critique.score)} ${getScoreColor(critique.score)}`}>
              {critique.score}/100
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Verdict */}
          <div className="mb-3">
            <h3 className={`text-lg font-bold ${getVerdictColor(critique.verdict)}`}>
              {critique.verdict}
            </h3>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="font-semibold text-green-800">{critique.strengths?.length || 0}</div>
              <div className="text-green-600">{t('gallery.strengths')}</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded">
              <div className="font-semibold text-red-800">{critique.improvements?.length || 0}</div>
              <div className="text-red-600">{t('gallery.areasToImprove')}</div>
            </div>
          </div>

          {/* Date */}
          <div className="text-xs text-gray-500 mb-3">
            {formatDate(critique.createdAt)}
          </div>

          {/* Action Button */}
          <Button
            onClick={handleViewDetails}
            variant="secondary"
            size="sm"
            className="w-full"
          >
            {t('gallery.viewFullAnalysis')}
          </Button>
        </div>
      </Card>

      {/* Modal */}
      <GalleryAnalysisModal
        critique={critique}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}
