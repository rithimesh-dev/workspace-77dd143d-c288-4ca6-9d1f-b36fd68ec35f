interface AnalysisResult {
  burnoutLevel: 'none' | 'low' | 'medium' | 'high'
  sentiment: 'positive' | 'neutral' | 'negative'
  stressIndicators: string[]
  recommendations: string[]
  confidence: number
  moodState?: 'happy' | 'content' | 'stressed' | 'anxious' | 'exhausted' | 'overwhelmed'
  keyTopics?: string[]
}

export async function analyzeSentiment(text: string): Promise<AnalysisResult> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      throw new Error('Analysis request failed')
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Sentiment analysis error:', error)
    
    // Return fallback result
    return {
      burnoutLevel: 'low',
      sentiment: 'neutral',
      stressIndicators: [],
      recommendations: ['Try again later', 'Take a break', 'Practice self-care'],
      confidence: 0,
      moodState: 'content',
      keyTopics: []
    }
  }
}