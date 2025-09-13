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
      "Terrible",
      "Basura",
      "No",
      "Maldito",
      "Crustáceo",
      "Asqueroso",
      "Horrible",
      "Pésimo",
      "Pésimo"
    ],
    
    // Scores 11-20 (Poor)
    poor: [
      "Nah",
      "Feo",
      "Pobre",
      "Abajo del promedio",
      "Necesita trabajo",
      "No está bien",
      "Mal estado",
      "Áspero",
      "No bonito",
      "Débil"
    ],
    
    // Scores 21-30 (Below Average)
    belowAverage: [
      "Llegando ahí",
      "Mejor pero nah",
      "Casi ahí",
      "Acercándose al promedio",
      "Acercándose",
      "Abajo del promedio"
    ],
    
    // Scores 31-40 (Below Average+)
    belowAveragePlus: [
      "Cerca del promedio",
      "Medio",
      "Promedio",
      "Promedio pero nah",
      "Justo en el promedio",
      "Cumpliendo estándares",
      "Exactamente la línea base",
      "Calidad promedio",
      "Cumpliendo requisitos",
      "Nivel estándar"
    ],
    
    // Scores 41-50 (Average)
    average: [
      "Justo en el objetivo",
      "Cumpliendo expectativas",
      "En nivel aceptable",
      "Calidad base",
      "Calidad estándar",
      "Cumpliendo necesidades básicas",
      "Promedio pero sólido",
      "Cumpliendo estándares mínimos",
      "Calidad estándar"
    ],
    
    // Scores 51-60 (Above Average)
    aboveAverage: [
      "Ligeramente arriba del promedio",
      "Mejor de lo esperado",
      "Arriba de la línea base",
      "Arriba del estándar",
      "Superando el mínimo",
      "Buena calidad",
      "Arriba del par",
      "Excediendo expectativas",
      "Mejor que el promedio",
      "Arriba de la línea base"
    ],
    
    // Scores 61-70 (Good)
    good: [
      "Bueno en general",
      "Calidad sólida",
      "Bien arriba del promedio",
      "Buena calidad",
      "Excediendo estándares",
      "Calidad fuerte",
      "Bueno pero espacio para crecer",
      "Bien hecho",
      "Buenos resultados",
      "Calidad sólida"
    ],
    
    // Scores 71-80 (Very Good)
    veryGood: [
      "Muy bueno",
      "Calidad excelente",
      "Bien arriba del estándar",
      "Muy buena calidad",
      "Resultados sobresalientes",
      "Muy bueno pero no perfecto",
      "Excelente",
      "Calidad muy fuerte",
      "Bien ejecutado",
      "Muy bueno en general"
    ],
    
    // Scores 81-90 (Excellent)
    excellent: [
      "Excelente",
      "Calidad sobresaliente",
      "Calidad excepcional",
      "Resultados excelentes",
      "Sobresaliente",
      "Excepcional",
      "Excelente pero no perfecto",
      "Calidad sobresaliente",
      "Excepcional",
      "Calidad excelente"
    ],
    
    // Scores 91-100 (Perfect/Exceptional)
    perfect: [
      "Perfecto",
      "Calidad excepcional",
      "Calidad sobresaliente",
      "Calidad perfecta",
      "Resultados excepcionales",
      "Sobresaliente",
      "Calidad perfecta",
      "Calidad excepcional",
      "Calidad sobresaliente",
      "Resultados perfectos"
    ]
  },
  fr: {
    // Scores 0-10 (Very Poor)
    veryPoor: [
      "Moche",
      "Terrible",
      "Poubelle",
      "Non",
      "Maudit",
      "Crouteux",
      "Dégoûtant",
      "Horrible",
      "Affreux",
      "Terrible"
    ],
    
    // Scores 11-20 (Poor)
    poor: [
      "Nah",
      "Moche",
      "Pauvre",
      "En dessous de la moyenne",
      "Besoin de travail",
      "Pas bon",
      "Mauvais état",
      "Rugueux",
      "Pas joli",
      "Faible"
    ],
    
    // Scores 21-30 (Below Average)
    belowAverage: [
      "En train d'arriver",
      "Mieux mais nah",
      "Presque là",
      "Approchant la moyenne",
      "Se rapprochant",
      "En dessous de la moyenne"
    ],
    
    // Scores 31-40 (Below Average+)
    belowAveragePlus: [
      "Près de la moyenne",
      "Moyen",
      "Moyen",
      "Moyen mais nah",
      "Juste à la moyenne",
      "Répondant aux standards",
      "Exactement la ligne de base",
      "Qualité moyenne",
      "Répondant aux exigences",
      "Niveau standard"
    ],
    
    // Scores 41-50 (Average)
    average: [
      "Juste sur l'objectif",
      "Répondant aux attentes",
      "Au niveau acceptable",
      "Qualité de base",
      "Qualité standard",
      "Répondant aux besoins de base",
      "Moyen mais solide",
      "Répondant aux standards minimaux",
      "Qualité standard"
    ],
    
    // Scores 51-60 (Above Average)
    aboveAverage: [
      "Légèrement au-dessus de la moyenne",
      "Mieux que prévu",
      "Au-dessus de la ligne de base",
      "Au-dessus du standard",
      "Dépassant le minimum",
      "Bonne qualité",
      "Au-dessus du pair",
      "Dépassant les attentes",
      "Mieux que la moyenne",
      "Au-dessus de la ligne de base"
    ],
    
    // Scores 61-70 (Good)
    good: [
      "Bon en général",
      "Qualité solide",
      "Bien au-dessus de la moyenne",
      "Bonne qualité",
      "Dépassant les standards",
      "Qualité forte",
      "Bon mais de la place pour grandir",
      "Bien fait",
      "Bons résultats",
      "Qualité solide"
    ],
    
    // Scores 71-80 (Very Good)
    veryGood: [
      "Très bon",
      "Qualité excellente",
      "Bien au-dessus du standard",
      "Très bonne qualité",
      "Résultats exceptionnels",
      "Très bon mais pas parfait",
      "Excellent",
      "Qualité très forte",
      "Bien exécuté",
      "Très bon en général"
    ],
    
    // Scores 81-90 (Excellent)
    excellent: [
      "Excellent",
      "Qualité exceptionnelle",
      "Qualité exceptionnelle",
      "Résultats excellents",
      "Exceptionnel",
      "Exceptionnel",
      "Excellent mais pas parfait",
      "Qualité exceptionnelle",
      "Exceptionnel",
      "Qualité excellente"
    ],
    
    // Scores 91-100 (Perfect/Exceptional)
    perfect: [
      "Parfait",
      "Qualité exceptionnelle",
      "Qualité exceptionnelle",
      "Qualité parfaite",
      "Résultats exceptionnels",
      "Exceptionnel",
      "Qualité parfaite",
      "Qualité exceptionnelle",
      "Qualité exceptionnelle",
      "Résultats parfaits"
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
