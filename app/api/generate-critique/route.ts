import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getCritiqueMessage } from '@/lib/critiqueMessages'

// Translation helper for YES/NO messages
const getYesNoMessage = (isYes: boolean, language: 'en' | 'es' | 'fr'): string => {
  const messages = {
    en: {
      yes: 'YES, you can become a hand model',
      no: 'NO, you cannot become a hand model'
    },
    es: {
      yes: 'SÍ, puedes convertirte en modelo de manos',
      no: 'NO, no puedes convertirte en modelo de manos'
    },
    fr: {
      yes: 'OUI, vous pouvez devenir mannequin de mains',
      no: 'NON, vous ne pouvez pas devenir mannequin de mains'
    }
  }
  
  return isYes ? messages[language].yes : messages[language].no
}

// Initialize Gemini AI with server-side API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    console.log('API Key available:', !!process.env.GEMINI_API_KEY)
    console.log('API Key length:', process.env.GEMINI_API_KEY?.length || 0)
    
    const { imageBase64, language = 'en' } = await request.json()

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY environment variable is not set')
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Create language-specific prompts
    const getPrompt = (lang: 'en' | 'es' | 'fr') => {
      const prompts = {
        en: `
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
`,

        es: `
Eres un experto profesional en modelado de manos. Analiza esta foto de mano y proporciona una crítica detallada.

Comienza tu análisis con una respuesta clara SÍ o NO sobre si PUEDES ser modelo de manos, luego proporciona razonamiento detallado con múltiples oraciones cubriendo diferentes aspectos.

Por favor proporciona tu respuesta en el siguiente formato JSON:
{
  "score": [número entre 1-100],
  "critique": "[Proporciona análisis detallado con 6-8 oraciones cubriendo: forma de la mano, condición de la piel, apariencia de las uñas, proporciones, potencial comercial, y evaluación general. Sé específico y detallado. NO agregues emojis]",
  "strengths": ["fortaleza 1", "fortaleza 2", "fortaleza 3", "fortaleza 4", "fortaleza 5"],
  "improvements": ["debilidad 1", "debilidad 2", "debilidad 3", "debilidad 4", "debilidad 5"],
  "verdict": "[evaluación general - usa lenguaje simple y directo como 'Material de Modelo', 'Buen Potencial', '¡No!', '¡Terrible!', 'Nah', 'Absolutamente No', 'Basura', 'Medio', 'Fuego', 'Genial', 'Manos Feas', 'No', 'Esto No Es', 'Pura Basura', 'Medio en el Mejor Caso', 'Absolutamente Genial', 'Reina', 'Vibes de Modelo', 'No Hoy', 'Esto Está Maldito', 'Metas de Mano', 'Material de Modelo', 'Mantén Tu Trabajo', 'Esto Es Diferente', 'Beso del Chef', 'Sin Tapón', 'Esto Golpea', 'Manos Hermosas', 'Manos Malditas']"
}

Enfócate en:
- Forma y proporciones de la mano
- Condición y textura de la piel
- Apariencia y cuidado de las uñas
- Atractivo estético general
- Potencial de modelado comercial
- Presentación profesional
- Longitud y espaciado de dedos
- Tono de piel y claridad
- Simetría de la mano
- Mercabilidad general

Proporciona una crítica comprensiva con múltiples oraciones detalladas. Mantén fortalezas y debilidades concisas - proporciona 5 de cada una.
`,

        fr: `
Vous êtes un expert professionnel en modélisation de mains. Analysez cette photo de main et fournissez une critique détaillée.

Commencez votre analyse avec une réponse claire OUI ou NON sur si VOUS pouvez être mannequin de mains, puis fournissez un raisonnement détaillé avec plusieurs phrases couvrant différents aspects.

Veuillez fournir votre réponse au format JSON suivant :
{
  "score": [nombre entre 1-100],
  "critique": "[Fournissez une analyse détaillée avec 6-8 phrases couvrant : forme de la main, état de la peau, apparence des ongles, proportions, potentiel commercial, et évaluation globale. Soyez spécifique et détaillé. N'ajoutez PAS d'emojis]",
  "strengths": ["force 1", "force 2", "force 3", "force 4", "force 5"],
  "improvements": ["faiblesse 1", "faiblesse 2", "faiblesse 3", "faiblesse 4", "faiblesse 5"],
  "verdict": "[évaluation globale - utilisez un langage simple et direct comme 'Matériel de Mannequin', 'Bon Potentiel', 'Non!', 'Terrible!', 'Nah', 'Absolument Pas', 'Poubelle', 'Moyen', 'Feu', 'Génial', 'Mains Laides', 'Non', 'Ce N\'est Pas Ça', 'Poubelle Pure', 'Moyen au Mieux', 'Absolument Génial', 'Reine', 'Vibes de Mannequin', 'Pas Aujourd\'hui', 'C\'est Maudit', 'Objectifs de Main', 'Matériel de Mannequin', 'Garde Ton Travail', 'C\'est Différent', 'Baiser du Chef', 'Sans Bouchon', 'Ça Tape', 'Belles Mains', 'Mains Maudites']"
}

Concentrez-vous sur :
- Forme et proportions de la main
- État et texture de la peau
- Apparence et soin des ongles
- Attrait esthétique global
- Potentiel de modélisation commerciale
- Présentation professionnelle
- Longueur et espacement des doigts
- Teint de peau et clarté
- Symétrie de la main
- Commercialité globale

Fournissez une critique complète avec plusieurs phrases détaillées. Gardez les forces et faiblesses concises - fournissez 5 de chacune.
`
      }
      return prompts[lang]
    }

    const prompt = getPrompt(language as 'en' | 'es' | 'fr')

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
          const yesNo = getYesNoMessage(isYes, language as 'en' | 'es' | 'fr')
          
          console.log('Original critique:', critique)
          
          // Remove any existing YES/NO from the critique and add our own
          critique = critique.replace(/^(YES|NO)[\s\-,:]*/i, '').trim()
          critique = `${yesNo} - ${critique}`
          
          console.log('Final critique:', critique)
          
          return NextResponse.json({
            score: score,
            critique: critique,
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
            improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
            verdict: getCritiqueMessage(score, language as 'en' | 'es' | 'fr')
          })
        }
      
      // Try to parse the text directly
      let parsed = JSON.parse(text)
      console.log('Direct parsed JSON:', parsed)
      
      const score = Math.max(1, Math.min(100, parsed.score || 50))
      const isYes = score >= 70 // 70+ = YES, below 70 = NO
      
      // Force our score-based YES/NO decision
      let critique = parsed.critique || 'Analysis completed'
      const yesNo = getYesNoMessage(isYes, language as 'en' | 'es' | 'fr')
      
      // Remove any existing YES/NO from the critique and add our own
      critique = critique.replace(/^(YES|NO)[\s\-,:]*/i, '').trim()
      critique = `${yesNo} - ${critique}`
      
      return NextResponse.json({
        score: score,
        critique: critique,
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
        verdict: getCritiqueMessage(score, language as 'en' | 'es' | 'fr')
      })
    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      console.error('Raw text:', text)
      
      // Final fallback with better default data
      return NextResponse.json({
        score: 50,
        critique: 'Analysis completed - parsing failed. The hand shows average potential for modeling with some areas for improvement. Overall proportions appear balanced with room for enhancement in presentation and care.',
        strengths: ['Hand structure analyzed', 'Good proportions', 'Clean appearance', 'Natural skin tone', 'Well-defined features'],
        improvements: ['Nail care needed', 'Better lighting', 'Professional styling', 'Skin texture improvement', 'Hand positioning'],
        verdict: getCritiqueMessage(50, language as 'en' | 'es' | 'fr')
      })
    }
  } catch (error) {
    console.error('Error generating critique:', error)
    return NextResponse.json({ error: 'Failed to generate critique' }, { status: 500 })
  }
}
