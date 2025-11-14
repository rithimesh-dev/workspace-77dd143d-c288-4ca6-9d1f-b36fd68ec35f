import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface AnalysisResult {
  burnoutLevel: 'none' | 'low' | 'medium' | 'high'
  sentiment: 'positive' | 'neutral' | 'negative'
  stressIndicators: string[]
  recommendations: string[]
  confidence: number
  moodState?: 'happy' | 'content' | 'stressed' | 'anxious' | 'exhausted' | 'overwhelmed'
  keyTopics?: string[]
}

const BURNOUT_KEYWORDS = {
  none: [
    'happy', 'joyful', 'excited', 'thrilled', 'amazing', 'wonderful', 'fantastic',
    'great', 'excellent', 'perfect', 'love', 'energetic', 'motivated', 'inspired',
    'fulfilled', 'satisfied', 'content', 'peaceful', 'calm', 'relaxed', 'balanced'
  ],
  high: [
    'exhausted', 'overwhelmed', 'burnout', 'completely drained', 'cannot cope',
    'mental breakdown', 'extreme stress', 'constantly tired', 'losing motivation',
    'depressed', 'anxious', 'panic attacks', 'insomnia', 'chronic fatigue'
  ],
  medium: [
    'stressed', 'tired', 'overworked', 'losing interest', 'difficulty concentrating',
    'irritable', 'sleep problems', 'lack of energy', 'feeling detached',
    'procrastinating', 'cynical', 'reduced productivity'
  ],
  low: [
    'managing', 'coping', 'okay', 'fine', 'good', 'energetic', 'motivated',
    'balanced', 'handling stress', 'sleeping well', 'focused'
  ]
}

const STRESS_INDICATORS = [
  'Work-related stress',
  'Sleep disruption',
  'Emotional exhaustion',
  'Cognitive fatigue',
  'Social withdrawal',
  'Physical symptoms',
  'Decreased motivation',
  'Irritability',
  'Anxiety patterns',
  'Burnout risk'
]

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Valid text input is required' },
        { status: 400 }
      )
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create()

    // Create analysis prompt
    const analysisPrompt = `
You are a mental health AI assistant specializing in emotional state analysis and burnout detection. Analyze the following text for emotional state, burnout symptoms, and specific wellness needs.

Text to analyze: "${text}"

Provide a comprehensive analysis including:
1. Overall burnout risk level (none, low, medium, high) - use "none" for happy/positive states
2. Sentiment analysis (positive, neutral, negative)
3. Specific mood state (happy, content, stressed, anxious, exhausted, overwhelmed)
4. Key topics mentioned (work, sleep, relationships, exercise, diet, etc.)
5. Specific stress indicators present
6. Confidence level in your analysis (0-100)
7. Brief explanation of your reasoning

IMPORTANT: 
- If the user expresses happiness, joy, excitement, or general positivity, set burnoutLevel to "none"
- For "none" burnout level, focus on maintaining wellbeing and preventive care
- For other levels, provide targeted interventions

Respond in JSON format:
{
  "burnoutLevel": "none|low|medium|high",
  "sentiment": "positive|neutral|negative", 
  "moodState": "happy|content|stressed|anxious|exhausted|overwhelmed",
  "keyTopics": ["work", "sleep", "relationships"],
  "stressIndicators": ["indicator1", "indicator2"],
  "confidence": 85,
  "reasoning": "brief explanation"
}

Analysis guidelines:
- Happy/Positive: "amazing", "great", "happy", "excited", "love", "wonderful" → burnoutLevel: "none"
- Content/Balanced: "good", "fine", "okay", "managing" → burnoutLevel: "low" 
- Stressed: "stressed", "tired", "overworked" → burnoutLevel: "medium"
- Critical: "exhausted", "overwhelmed", "burnout" → burnoutLevel: "high"

Consider these wellness indicators:
- Physical energy and sleep quality
- Emotional balance and mood
- Work satisfaction and boundaries
- Social connections and relationships
- Physical activity and nutrition
- Stress management techniques
`

    // Get AI analysis
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a professional mental health AI assistant. Provide accurate, compassionate analysis while maintaining appropriate boundaries. Always prioritize user wellbeing.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    })

    const aiResponse = completion.choices[0]?.message?.content
    
    if (!aiResponse) {
      throw new Error('No response from AI model')
    }

    let aiAnalysis
    try {
      aiAnalysis = JSON.parse(aiResponse)
    } catch (parseError) {
      // Fallback analysis if JSON parsing fails
      aiAnalysis = fallbackAnalysis(text)
    }

    // Generate personalized recommendations based on analysis and user input
    const recommendations = generatePersonalizedRecommendations(aiAnalysis, text)

    const result: AnalysisResult = {
      burnoutLevel: aiAnalysis.burnoutLevel || 'low',
      sentiment: aiAnalysis.sentiment || 'neutral',
      stressIndicators: aiAnalysis.stressIndicators || [],
      recommendations,
      confidence: Math.min(100, Math.max(0, aiAnalysis.confidence || 75)),
      moodState: aiAnalysis.moodState,
      keyTopics: aiAnalysis.keyTopics || []
    }

    // Log for monitoring (no personal data stored)
    console.log('Burnout analysis completed:', {
      burnoutLevel: result.burnoutLevel,
      sentiment: result.sentiment,
      confidence: result.confidence,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(result)

  } catch (error) {
    console.error('Sentiment analysis error:', error)
    
    // Return fallback analysis to ensure user experience isn't broken
    const fallbackResult: AnalysisResult = {
      burnoutLevel: 'low',
      sentiment: 'neutral',
      stressIndicators: [],
      recommendations: ['Consider taking regular breaks', 'Practice mindfulness', 'Maintain work-life balance'],
      confidence: 50,
      moodState: 'content',
      keyTopics: []
    }

    return NextResponse.json(fallbackResult)
  }
}

function fallbackAnalysis(text: string): any {
  const lowerText = text.toLowerCase()
  
  // Simple keyword-based fallback analysis
  let burnoutLevel: 'none' | 'low' | 'medium' | 'high' = 'low'
  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral'
  let moodState: 'happy' | 'content' | 'stressed' | 'anxious' | 'exhausted' | 'overwhelmed' = 'content'
  const stressIndicators: string[] = []
  const keyTopics: string[] = []

  // Check for happy/positive indicators first
  if (BURNOUT_KEYWORDS.none.some(keyword => lowerText.includes(keyword))) {
    burnoutLevel = 'none'
    sentiment = 'positive'
    moodState = 'happy'
  }
  // Check for high burnout indicators
  else if (BURNOUT_KEYWORDS.high.some(keyword => lowerText.includes(keyword))) {
    burnoutLevel = 'high'
    sentiment = 'negative'
    moodState = 'exhausted'
    stressIndicators.push('Severe stress indicators detected')
  }
  // Check for medium burnout indicators
  else if (BURNOUT_KEYWORDS.medium.some(keyword => lowerText.includes(keyword))) {
    burnoutLevel = 'medium'
    sentiment = 'negative'
    moodState = 'stressed'
    stressIndicators.push('Moderate stress indicators detected')
  }
  // Check for positive indicators
  else if (BURNOUT_KEYWORDS.low.some(keyword => lowerText.includes(keyword))) {
    burnoutLevel = 'low'
    sentiment = 'positive'
    moodState = 'content'
  }

  // Extract key topics
  if (lowerText.includes('work') || lowerText.includes('job') || lowerText.includes('career')) {
    keyTopics.push('work')
  }
  if (lowerText.includes('sleep') || lowerText.includes('tired') || lowerText.includes('rest')) {
    keyTopics.push('sleep')
  }
  if (lowerText.includes('relationship') || lowerText.includes('family') || lowerText.includes('friends')) {
    keyTopics.push('relationships')
  }
  if (lowerText.includes('exercise') || lowerText.includes('gym') || lowerText.includes('fitness')) {
    keyTopics.push('exercise')
  }

  return {
    burnoutLevel,
    sentiment,
    moodState,
    keyTopics,
    stressIndicators,
    confidence: 60,
    reasoning: 'Fallback keyword-based analysis'
  }
}

function generatePersonalizedRecommendations(analysis: any, userText: string): string[] {
  const { burnoutLevel, moodState, keyTopics, stressIndicators } = analysis
  const lowerText = userText.toLowerCase()
  const recommendations: string[] = []

  // Base recommendations for all levels
  const baseRecommendations = [
    'Practice mindfulness for 5 minutes daily',
    'Stay hydrated throughout the day',
    'Take regular movement breaks'
  ]

  // Happy/None burnout level - focus on maintenance and growth
  if (burnoutLevel === 'none' || moodState === 'happy') {
    recommendations.push(
      'Continue your positive habits and routines',
      'Share your positive energy with others',
      'Consider mentoring or helping someone who might be struggling',
      'Keep a gratitude journal to maintain your positive outlook',
      'Set new goals to channel your positive energy'
    )

    // Topic-specific happy recommendations
    if (keyTopics.includes('work')) {
      recommendations.push('Leverage your current motivation to take on inspiring projects')
    }
    if (keyTopics.includes('relationships')) {
      recommendations.push('Nurture your positive social connections')
    }
  }

  // Low burnout level - preventive care
  else if (burnoutLevel === 'low' || moodState === 'content') {
    recommendations.push(
      'Maintain your current work-life balance',
      'Continue regular exercise and healthy sleep habits',
      'Practice stress management techniques proactively'
    )

    if (keyTopics.includes('work')) {
      recommendations.push('Set clear boundaries around work hours')
    }
    if (keyTopics.includes('sleep')) {
      recommendations.push('Maintain consistent sleep schedule')
    }
  }

  // Medium burnout level - targeted interventions
  else if (burnoutLevel === 'medium' || moodState === 'stressed') {
    recommendations.push(
      'Reduce workload and delegate tasks when possible',
      'Practice the 4-7-8 breathing technique when stressed',
      'Take short walks during breaks to clear your mind',
      'Consider talking to a trusted friend or colleague'
    )

    if (keyTopics.includes('work')) {
      recommendations.push('Speak with your manager about workload concerns')
    }
    if (keyTopics.includes('sleep')) {
      recommendations.push('Establish a relaxing bedtime routine')
    }
    if (keyTopics.includes('relationships')) {
      recommendations.push('Don\'t isolate yourself - reach out to loved ones')
    }
  }

  // High burnout level - immediate interventions
  else if (burnoutLevel === 'high' || ['exhausted', 'overwhelmed', 'anxious'].includes(moodState)) {
    recommendations.push(
      'Consider taking time off work to recover',
      'Seek professional support from a mental health provider',
      'Practice progressive muscle relaxation daily',
      'Limit screen time, especially before bed',
      'Focus on basic needs: sleep, nutrition, and gentle movement'
    )

    if (keyTopics.includes('work')) {
      recommendations.push('Immediate reduction of work responsibilities is crucial')
    }
    if (keyTopics.includes('sleep')) {
      recommendations.push('Prioritize sleep - consider sleep hygiene consultation')
    }
  }

  // Add specific recommendations based on text content
  if (lowerText.includes('deadline') || lowerText.includes('pressure')) {
    recommendations.push('Break large tasks into smaller, manageable steps')
  }
  
  if (lowerText.includes('team') || lowerText.includes('colleagues')) {
    recommendations.push('Communicate openly with your team about capacity')
  }

  if (lowerText.includes('energy') || lowerText.includes('fatigue')) {
    recommendations.push('Consider a energy audit of your daily activities')
  }

  // Combine with base recommendations and remove duplicates
  return [...new Set([...baseRecommendations, ...recommendations])]
}