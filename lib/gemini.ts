import { GoogleGenerativeAI } from '@google/generative-ai'
import { getCritiqueMessage } from './critiqueMessages'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '')

export const generateHandCritique = async (imageBase64: string): Promise<{
  score: number
  critique: string
  strengths: string[]
  improvements: string[]
  verdict: string
}> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
You are a professional hand modeling expert. Analyze this hand photo and provide a detailed critique.

Start your analysis with a clear YES or NO answer about whether YOU can be a hand model, then provide detailed reasoning with multiple sentences covering different aspects.

Please provide your response in the following JSON format:
{
  "score": [number between 1-100],
  "critique": "[Provide detailed analysis with 6-8 sentences covering: hand shape, skin condition, nail appearance, proportions, commercial potential, and overall assessment. Be specific and detailed. Do NOT add any emojis]",
  "strengths": ["strength 1", "strength 2", "strength 3", "strength 4", "strength 5"],
  "improvements": ["weakness 1", "weakness 2", "weakness 3", "weakness 4", "weakness 5"],
  "verdict": "[overall assessment - use controversial/savage language like 'Hand Model Material', 'Good Potential', 'Eww!', 'Chopped!', 'Nah Fam', 'Absolutely Not', 'Trash', 'Mid', 'Fire', 'Slay', 'Ugly Ahh Hands', 'Chop Chop', 'Nah Bruh', 'This Ain\'t It', 'Straight Trash', 'Mid at Best', 'Absolutely Fire', 'Slay Queen', 'Hand Model Vibes', 'Not Today Satan', 'This is Cursed', 'Hand Goals', 'Model Material', 'Keep Your Day Job', 'This Hits Different', 'Chef\'s Kiss', 'No Cap', 'This Slaps', 'Handsome Hands', 'Cursed Hands']"
}

Focus on:
- Hand shape and proportions
- Skin condition and texture
- Nail appearance and care
- Overall aesthetic appeal
- Commercial modeling potential
- Professional presentation
- Finger length and spacing
- Skin tone and clarity
- Hand symmetry
- Overall marketability

Provide a comprehensive critique with multiple detailed sentences. Keep strengths and weaknesses concise - provide 5 of each. Don't use generic phrases like "professional consultation".
`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: 'image/jpeg'
        }
      }
    ])

    const response = await result.response
    const text = response.text()
    
    console.log('Raw Gemini response:', text)

    // Try to parse JSON response
    try {
      // First try to extract JSON from markdown code blocks
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/)
        if (jsonMatch) {
          console.log('Found JSON in markdown:', jsonMatch[1])
          const parsed = JSON.parse(jsonMatch[1])
          console.log('Parsed JSON:', parsed)
          
          const score = Math.max(1, Math.min(100, parsed.score || 50))
          const isYes = score >= 70 // 70+ = YES, below 70 = NO
          
          console.log('Score:', score, 'isYes:', isYes)
          
          // Force our score-based YES/NO decision
          let critique = parsed.critique || 'Analysis completed'
          const yesNo = isYes ? 'YES, you can become a hand model' : 'NO, you cannot become a hand model'
          
          console.log('Original critique:', critique)
          
          // Remove any existing YES/NO from the critique and add our own
          critique = critique.replace(/^(YES|NO)[\s\-,:]*/i, '').trim()
          critique = `${yesNo} - ${critique}`
          
          console.log('Final critique:', critique)
          
          return {
            score: score,
            critique: critique,
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
            improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
            verdict: getCritiqueMessage(score)
          }
        }
      
      // Try to parse the text directly
      let parsed = JSON.parse(text)
      console.log('Direct parsed JSON:', parsed)
      
      const score = Math.max(1, Math.min(100, parsed.score || 50))
      const isYes = score >= 70 // 70+ = YES, below 70 = NO
      
      // Force our score-based YES/NO decision
      let critique = parsed.critique || 'Analysis completed'
      const yesNo = isYes ? 'YES, you can become a hand model' : 'NO, you cannot become a hand model'
      
      // Remove any existing YES/NO from the critique and add our own
      critique = critique.replace(/^(YES|NO)[\s\-,:]*/i, '').trim()
      critique = `${yesNo} - ${critique}`
      
      return {
        score: score,
        critique: critique,
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
        verdict: getCritiqueMessage(score)
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      console.error('Raw text:', text)
      
      // Final fallback with better default data
      return {
        score: 50,
        critique: 'Analysis completed - parsing failed. The hand shows average potential for modeling with some areas for improvement. Overall proportions appear balanced with room for enhancement in presentation and care.',
        strengths: ['Hand structure analyzed', 'Good proportions', 'Clean appearance', 'Natural skin tone', 'Well-defined features'],
        improvements: ['Nail care needed', 'Better lighting', 'Professional styling', 'Skin texture improvement', 'Hand positioning'],
        verdict: getCritiqueMessage(50)
      }
    }
  } catch (error) {
    console.error('Error generating critique:', error)
    throw new Error('Failed to generate critique')
  }
}

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Remove data:image/jpeg;base64, prefix
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}



