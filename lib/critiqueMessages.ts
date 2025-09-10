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

// Function to get a random message based on score
export const getCritiqueMessage = (score: number): string => {
  let messages: string[]
  
  if (score >= 91) {
    messages = CRITIQUE_MESSAGES.perfect
  } else if (score >= 81) {
    messages = CRITIQUE_MESSAGES.excellent
  } else if (score >= 71) {
    messages = CRITIQUE_MESSAGES.veryGood
  } else if (score >= 61) {
    messages = CRITIQUE_MESSAGES.good
  } else if (score >= 51) {
    messages = CRITIQUE_MESSAGES.aboveAverage
  } else if (score >= 41) {
    messages = CRITIQUE_MESSAGES.average
  } else if (score >= 31) {
    messages = CRITIQUE_MESSAGES.belowAveragePlus
  } else if (score >= 21) {
    messages = CRITIQUE_MESSAGES.belowAverage
  } else if (score >= 11) {
    messages = CRITIQUE_MESSAGES.poor
  } else {
    messages = CRITIQUE_MESSAGES.veryPoor
  }
  
  // Return a random message from the appropriate range
  return messages[Math.floor(Math.random() * messages.length)]
}
