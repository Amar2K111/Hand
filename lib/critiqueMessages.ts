// Critique messages for different score ranges
export const CRITIQUE_MESSAGES = {
  // Scores 0-10 (Very Poor)
  veryPoor: [
    "Ugly ahh 🥀",
    "Chopped 🥀",
    "Trash 🥀",
    "Nah bruh 🥀",
    "Cursed 🥀",
    "Crusty 🥀",
    "Disgusting 🥀",
    "Horrible 🥀",
    "Awful 🥀",
    "Terrible 🥀"
  ],
  
  // Scores 11-20 (Poor)
  poor: [
    "Nah 🥀",
    "Ugly 🥀",
    "Poor 🥀",
    "Below average 🥀",
    "Needs work 🥀",
    "Not good 🥀",
    "Bad shape 🥀",
    "Rough 🥀",
    "Not pretty 🥀",
    "Weak 🥀"
  ],
  
  // Scores 21-30 (Below Average)
  belowAverage: [
    "Getting there 🥀",
    "Better but nah 🥀",
    "Almost there 🥀",
    "Approaching average 🥀",
    "Getting closer 🥀",
    "Below average 🥀"
  ],
  
  // Scores 31-40 (Below Average+)
  belowAveragePlus: [
    "Near average 🥀",
    "Mid 🥀",
    "Average 🥀",
    "Average but nah 🥀",
    "Right at average 🥀",
    "Meeting standards 🥀",
    "Exactly baseline 🥀",
    "Average quality 🥀",
    "Meeting requirements 🥀",
    "Standard level 🥀"
  ],
  
  // Scores 41-50 (Average)
  average: [
    "Right on target",
    "Meeting expectations",
    "At acceptable level",
    "Baseline quality",
    "Standard quality",
    "Meeting basic needs",
    "Average but solid",
    "Meeting minimum standards",
    "Standard quality"
  ],
  
  // Scores 51-60 (Above Average)
  aboveAverage: [
    "Slightly above average",
    "Better than expected",
    "Above baseline",
    "Above standard",
    "Surpassing minimum",
    "Good quality",
    "Above par",
    "Exceeding expectations",
    "Better than average",
    "Above baseline"
  ],
  
  // Scores 61-70 (Good)
  good: [
    "Good overall",
    "Solid quality",
    "Well above average",
    "Good quality",
    "Exceeding standards",
    "Strong quality",
    "Good but room to grow",
    "Well done",
    "Good results",
    "Solid quality"
  ],
  
  // Scores 71-80 (Very Good)
  veryGood: [
    "Very good",
    "Excellent quality",
    "Well above standard",
    "Very good quality",
    "Outstanding results",
    "Very good but not perfect",
    "Excellent",
    "Very strong quality",
    "Well executed",
    "Very good overall"
  ],
  
  // Scores 81-90 (Excellent)
  excellent: [
    "Excellent",
    "Outstanding quality",
    "Exceptional quality",
    "Excellent results",
    "Outstanding",
    "Exceptional",
    "Excellent but not perfect",
    "Outstanding quality",
    "Exceptional",
    "Excellent quality"
  ],
  
  // Scores 91-100 (Perfect/Exceptional)
  perfect: [
    "Perfect",
    "Exceptional quality",
    "Outstanding quality",
    "Perfect quality",
    "Exceptional results",
    "Outstanding",
    "Perfect quality",
    "Exceptional quality",
    "Outstanding quality",
    "Perfect results"
  ]
}

// Multilingual critique messages
export const MULTILINGUAL_CRITIQUE_MESSAGES = {
  en: CRITIQUE_MESSAGES,
  es: {
    // Scores 0-10 (Very Poor)
    veryPoor: [
      "Feo",
      "Malo",
      "Pobre",
      "No",
      "Terrible"
    ],
    
    // Scores 11-20 (Poor)
    poor: [
      "No",
      "Feo",
      "Pobre",
      "Mal",
      "Débil"
    ],
    
    // Scores 21-30 (Below Average)
    belowAverage: [
      "Regular",
      "Medio",
      "Bajo",
      "Mejor",
      "Casi"
    ],
    
    // Scores 31-40 (Below Average+)
    belowAveragePlus: [
      "Medio",
      "Regular",
      "Promedio",
      "Bien",
      "Normal"
    ],
    
    // Scores 41-50 (Average)
    average: [
      "Bien",
      "Normal",
      "Promedio",
      "Regular",
      "Bueno"
    ],
    
    // Scores 51-60 (Above Average)
    aboveAverage: [
      "Bueno",
      "Mejor",
      "Bien",
      "Sólido",
      "Fuerte"
    ],
    
    // Scores 61-70 (Good)
    good: [
      "Bueno",
      "Sólido",
      "Fuerte",
      "Bien",
      "Mejor"
    ],
    
    // Scores 71-80 (Very Good)
    veryGood: [
      "Muy bueno",
      "Excelente",
      "Sobresaliente",
      "Genial",
      "Perfecto"
    ],
    
    // Scores 81-90 (Excellent)
    excellent: [
      "Excelente",
      "Perfecto",
      "Genial",
      "Sobresaliente",
      "Increíble"
    ],
    
    // Scores 91-100 (Perfect/Exceptional)
    perfect: [
      "Perfecto",
      "Increíble",
      "Genial",
      "Excelente",
      "Sobresaliente"
    ]
  },
  fr: {
    // Scores 0-10 (Very Poor)
    veryPoor: [
      "Moche",
      "Mauvais",
      "Pauvre",
      "Non",
      "Terrible"
    ],
    
    // Scores 11-20 (Poor)
    poor: [
      "Non",
      "Moche",
      "Pauvre",
      "Mal",
      "Faible"
    ],
    
    // Scores 21-30 (Below Average)
    belowAverage: [
      "Moyen",
      "Bas",
      "Faible",
      "Mieux",
      "Presque"
    ],
    
    // Scores 31-40 (Below Average+)
    belowAveragePlus: [
      "Moyen",
      "Normal",
      "Bas",
      "Bien",
      "Correct"
    ],
    
    // Scores 41-50 (Average)
    average: [
      "Bien",
      "Normal",
      "Correct",
      "Moyen",
      "Bon"
    ],
    
    // Scores 51-60 (Above Average)
    aboveAverage: [
      "Bon",
      "Mieux",
      "Bien",
      "Solide",
      "Fort"
    ],
    
    // Scores 61-70 (Good)
    good: [
      "Bon",
      "Solide",
      "Fort",
      "Bien",
      "Mieux"
    ],
    
    // Scores 71-80 (Very Good)
    veryGood: [
      "Très bon",
      "Excellent",
      "Parfait",
      "Génial",
      "Super"
    ],
    
    // Scores 81-90 (Excellent)
    excellent: [
      "Excellent",
      "Parfait",
      "Génial",
      "Super",
      "Incroyable"
    ],
    
    // Scores 91-100 (Perfect/Exceptional)
    perfect: [
      "Parfait",
      "Incroyable",
      "Génial",
      "Excellent",
      "Super"
    ]
  }
}

// Function to get a random message based on score and language
export const getCritiqueMessage = (score: number, language: 'en' | 'es' | 'fr' = 'en'): string => {
  const messages = MULTILINGUAL_CRITIQUE_MESSAGES[language]
  let messageArray: string[]
  
  if (score >= 91) {
    messageArray = messages.perfect
  } else if (score >= 81) {
    messageArray = messages.excellent
  } else if (score >= 71) {
    messageArray = messages.veryGood
  } else if (score >= 61) {
    messageArray = messages.good
  } else if (score >= 51) {
    messageArray = messages.aboveAverage
  } else if (score >= 41) {
    messageArray = messages.average
  } else if (score >= 31) {
    messageArray = messages.belowAveragePlus
  } else if (score >= 21) {
    messageArray = messages.belowAverage
  } else if (score >= 11) {
    messageArray = messages.poor
  } else {
    messageArray = messages.veryPoor
  }
  
  // Return a random message from the appropriate range
  return messageArray[Math.floor(Math.random() * messageArray.length)]
}
