'use client'

import React from 'react'
import { Card } from './Card'
import { Button } from './Button'
import { HandCritique } from '@/hooks/useHandCritique'
import { useLanguage } from '@/contexts/LanguageContext'

interface CritiqueResultsProps {
  critique: HandCritique
  onRetry: () => void
}

export const CritiqueResults: React.FC<CritiqueResultsProps> = ({
  critique,
  onRetry
}) => {
  const { t } = useLanguage()
  // Debug: Log the critique data to see what we're getting
  console.log('Critique data:', critique)
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
    <div className="h-full flex flex-col space-y-3 md:space-y-4">
      {/* Score Section - Bright and Prominent - Sticky */}
      <div className={`p-4 md:p-6 rounded-lg ${getScoreBgColor(critique.score)} border-2 sticky top-0 z-20`}>
        {/* Logo in top left corner - fixed position */}
        <div className="absolute top-2 left-2 z-10">
          <div className="text-xs font-bold bg-neon-blue text-white px-2 py-1 rounded-lg shadow-sm">
            HandRating.com
          </div>
        </div>
        <div className="text-center">
          <div className={`text-5xl md:text-7xl font-black ${getScoreColor(critique.score)} mb-2 drop-shadow-lg`}>
            {critique.score}
          </div>
          <div className="text-lg md:text-xl text-gray-600 mb-2 md:mb-3">{t('dashboard.outOf')}</div>
          <div className={`text-lg md:text-xl font-bold ${getVerdictColor(critique.verdict)} px-2`}>
            {critique.verdict} {critique.verdict.includes('Hand Model Material') || critique.verdict.includes('Fire') || critique.verdict.includes('Slay') ? '✨' : critique.score < 50 ? '🥀' : ''}
          </div>
        </div>
      </div>

       {/* Critique - One Container with Color Theme */}
       <div className="flex-1 overflow-y-auto">
         <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-3 md:p-4 rounded-lg border border-gray-200">
           {/* Analysis */}
           <div className="mb-3 md:mb-4">
             <h3 className="text-sm font-bold text-gray-800 mb-2">{t('dashboard.analysis')}</h3>
             <ul className="space-y-1">
               {(() => {
                 // Clean up the critique text - remove JSON formatting if present
                 let cleanText = critique.critique;
                 
                 // Remove JSON backticks and formatting
                 cleanText = cleanText.replace(/```json\s*/, '').replace(/```\s*$/, '');
                 
                 // Remove JSON object structure more aggressively
                 cleanText = cleanText.replace(/^\s*{\s*"score":\s*\d+,\s*"critique":\s*"/, '');
                 cleanText = cleanText.replace(/^\s*{\s*"critique":\s*"/, '');
                 cleanText = cleanText.replace(/"\s*}\s*$/, '');
                 
                 // Clean up escaped characters
                 cleanText = cleanText.replace(/\\"/g, '"').replace(/\\n/g, ' ');
                 
                 // Remove any remaining JSON artifacts
                 cleanText = cleanText.replace(/^\s*{\s*/, '').replace(/\s*}\s*$/, '');
                 
                 // Split into sentences and create bullet points
                 const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 10);
                 
                 return sentences.slice(0, 8).map((sentence, index) => {
                   // Add bold and colors to important words
                   let formattedSentence = sentence.trim();
                   
                   // Make YES/NO very dark and prominent
                   formattedSentence = formattedSentence
                     .replace(/\b(YES, you can become a hand model|NO, you cannot become a hand model)\b/gi, '<span class="font-black text-black text-base">$1</span>')
                     .replace(/\b(YES|NO)\b/gi, '<span class="font-black text-black text-base">$1</span>')
                     .replace(/\b(hand model|hand modeling|professional|excellent|outstanding|perfect|amazing|beautiful|stunning)\b/gi, '<span class="font-bold text-green-700">$1</span>')
                     .replace(/\b(poor|terrible|awful|bad|horrible|disappointing|weak|inadequate)\b/gi, '<span class="font-bold text-red-600">$1</span>')
                     .replace(/\b(good|decent|average|okay|acceptable|fine|solid)\b/gi, '<span class="font-bold text-blue-600">$1</span>')
                     .replace(/\b(improve|better|enhance|fix|work on|develop|strengthen)\b/gi, '<span class="font-bold text-orange-600">$1</span>')
                     .replace(/\b(score|rating|grade|assessment|evaluation)\b/gi, '<span class="font-bold text-purple-600">$1</span>');
                   
                   return (
                     <li key={index} className="text-sm font-semibold text-gray-800 flex items-start">
                       <span className="text-gray-600 mr-2 font-bold">•</span>
                       <span dangerouslySetInnerHTML={{ __html: formattedSentence + '.' }} />
                     </li>
                   );
                 });
               })()}
             </ul>
           </div>

           {/* Strengths */}
           <div className="mb-3 md:mb-4">
             <h3 className="text-sm font-bold text-green-800 mb-2">{t('dashboard.strengths')}</h3>
             <ul className="space-y-1">
               {critique.strengths && critique.strengths.length > 0 ? (
                 critique.strengths
                   .filter(strength => !strength.toLowerCase().includes('professional consultation'))
                   .map((strength, index) => (
                   <li key={index} className="text-sm font-semibold text-green-800 flex items-start">
                     <span className="text-green-600 mr-2 font-bold">•</span>
                     <span>{strength}</span>
                   </li>
                 ))
               ) : (
                 <li className="text-sm text-gray-500 italic">{t('dashboard.noStrengths')}</li>
               )}
             </ul>
           </div>

           {/* Weaknesses */}
           <div>
             <h3 className="text-sm font-bold text-red-800 mb-2">{t('dashboard.weaknesses')}</h3>
             <ul className="space-y-1">
               {critique.improvements && critique.improvements.length > 0 ? (
                 critique.improvements
                   .filter(weakness => !weakness.toLowerCase().includes('professional consultation'))
                   .map((weakness, index) => (
                   <li key={index} className="text-sm font-semibold text-red-800 flex items-start">
                     <span className="text-red-600 mr-2 font-bold">•</span>
                     <span>{weakness}</span>
                   </li>
                 ))
               ) : (
                 <li className="text-sm text-gray-500 italic">{t('dashboard.noWeaknesses')}</li>
               )}
             </ul>
           </div>
         </div>
       </div>

      {/* Action Button */}
      <div className="pt-2">
        <Button onClick={onRetry} variant="secondary" size="sm" className="w-full touch-manipulation">
          {t('dashboard.tryAnotherPhoto')}
        </Button>
      </div>
    </div>
  )
}



