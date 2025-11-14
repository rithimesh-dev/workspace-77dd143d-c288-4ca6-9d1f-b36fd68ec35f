'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, Calendar, Clock, Heart, Shield, Sparkles, Zap } from 'lucide-react'
import { analyzeSentiment } from '@/lib/sentiment-analysis'
import { PrivacyPolicy } from '@/components/privacy-policy'

interface AnalysisResult {
  burnoutLevel: 'none' | 'low' | 'medium' | 'high'
  sentiment: 'positive' | 'neutral' | 'negative'
  stressIndicators: string[]
  recommendations: string[]
  confidence: number
  moodState?: 'happy' | 'content' | 'stressed' | 'anxious' | 'exhausted' | 'overwhelmed'
  keyTopics?: string[]
}

export default function BurnoutDetector() {
  const [text, setText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [activeTab, setActiveTab] = useState('detector')

  const handleAnalysis = async () => {
    if (!text.trim()) return
    
    setIsAnalyzing(true)
    try {
      const analysisResult = await analyzeSentiment(text)
      setResult(analysisResult)
      setActiveTab('results')
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getBurnoutColor = (level: string) => {
    switch (level) {
      case 'none': return 'text-emerald-400 border-emerald-400/30 bg-emerald-950/20'
      case 'high': return 'text-red-400 border-red-400/30 bg-red-950/20'
      case 'medium': return 'text-yellow-400 border-yellow-400/30 bg-yellow-950/20'
      case 'low': return 'text-green-400 border-green-400/30 bg-green-950/20'
      default: return 'text-gray-400 border-gray-400/30 bg-gray-950/20'
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-2">
            <Brain className="h-8 w-8 text-cyan-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Burnout Detector
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            AI-powered burnout detection with personalized wellness recommendations
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <Badge variant="outline" className="border-cyan-400/30 text-cyan-400">
              <Shield className="h-3 w-3 mr-1" />
              Privacy First
            </Badge>
            <Badge variant="outline" className="border-purple-400/30 text-purple-400">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900 border border-gray-800">
            <TabsTrigger value="detector" className="data-[state=active]:bg-cyan-950 data-[state=active]:text-cyan-400">
              <Brain className="h-4 w-4 mr-2" />
              Detector
            </TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-purple-950 data-[state=active]:text-purple-400">
              <Zap className="h-4 w-4 mr-2" />
              Results
            </TabsTrigger>
            <TabsTrigger value="wellness" className="data-[state=active]:bg-green-950 data-[state=active]:text-green-400">
              <Heart className="h-4 w-4 mr-2" />
              Wellness
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-gray-800 data-[state=active]:text-gray-300">
              <Shield className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="detector" className="space-y-6">
            <Card className="bg-gray-950 border-gray-800 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  How are you feeling today?
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Share your thoughts and feelings. Our AI will analyze your emotional state for burnout indicators.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Describe how you've been feeling lately... (work stress, energy levels, sleep patterns, emotional state, etc.)"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-32 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {text.length} characters
                  </span>
                  <Button
                    onClick={handleAnalysis}
                    disabled={!text.trim() || isAnalyzing}
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Analyze Burnout Risk
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Alert className="bg-gray-950 border-gray-800">
              <Shield className="h-4 w-4 text-cyan-400" />
              <AlertDescription className="text-gray-300">
                <strong>Privacy Notice:</strong> Your text is processed locally and never stored. All analysis happens in real-time with complete anonymity.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {result ? (
              <>
                <Card className="bg-gray-950 border-gray-800 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-purple-400" />
                      Analysis Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`p-4 rounded-lg border ${getBurnoutColor(result.burnoutLevel)}`}>
                        <h3 className="font-semibold mb-2">
                          {result.burnoutLevel === 'none' ? 'Wellness Level' : 'Burnout Risk Level'}
                        </h3>
                        <div className="text-2xl font-bold capitalize">
                          {result.burnoutLevel === 'none' ? 'Thriving' : result.burnoutLevel}
                        </div>
                        <div className="text-sm opacity-75">Confidence: {result.confidence}%</div>
                      </div>
                      <div className={`p-4 rounded-lg border ${getBurnoutColor(result.sentiment)}`}>
                        <h3 className="font-semibold mb-2">Emotional State</h3>
                        <div className="text-2xl font-bold capitalize">
                          {result.moodState || result.sentiment}
                        </div>
                        <div className="text-sm opacity-75">Mood analysis</div>
                      </div>
                    </div>

                    {/* Key Topics */}
                    {result.keyTopics && result.keyTopics.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3 text-cyan-400">Key Topics Mentioned</h3>
                        <div className="flex flex-wrap gap-2">
                          {result.keyTopics.map((topic, index) => (
                            <Badge key={index} variant="outline" className="border-cyan-400/30 text-cyan-400 bg-cyan-950/20">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.stressIndicators.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3 text-yellow-400">
                          {result.burnoutLevel === 'none' ? 'Positive Indicators' : 'Stress Indicators'}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {result.stressIndicators.map((indicator, index) => (
                            <Badge key={index} variant="outline" className={`${
                              result.burnoutLevel === 'none' 
                                ? 'border-emerald-400/30 text-emerald-400 bg-emerald-950/20'
                                : 'border-yellow-400/30 text-yellow-400 bg-yellow-950/20'
                            }`}>
                              {indicator}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Personalized Message */}
                    <div className={`p-4 rounded-lg border ${
                      result.burnoutLevel === 'none' 
                        ? 'border-emerald-400/30 bg-emerald-950/20'
                        : 'border-blue-400/30 bg-blue-950/20'
                    }`}>
                      <h3 className="font-semibold mb-2 text-blue-400">Personalized Insights</h3>
                      <p className="text-sm text-gray-300">
                        {result.burnoutLevel === 'none' && result.moodState === 'happy' 
                          ? "Fantastic! Your positive emotional state is a strong foundation for overall wellbeing. Keep nurturing these positive habits!"
                          : result.burnoutLevel === 'none'
                          ? "Great job maintaining your wellbeing! Continue these healthy practices to stay balanced."
                          : "Our analysis has identified specific areas where you can focus your wellness efforts for better balance."
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gray-950 border-gray-800">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Brain className="h-12 w-12 text-gray-600 mb-4" />
                  <p className="text-gray-500 text-center">
                    No analysis results yet. Start by describing how you're feeling in the Detector tab.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="wellness" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-950 border-gray-800 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Digital Detox Schedule
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Personalized screen time recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DigitalDetoxSchedule burnoutLevel={result?.burnoutLevel || 'low'} />
                </CardContent>
              </Card>

              <Card className="bg-gray-950 border-gray-800 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-cyan-400 flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Breathing Exercises
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Quick stress relief sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BreathingSession />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <PrivacyPolicy />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function DigitalDetoxSchedule({ burnoutLevel }: { burnoutLevel: string }) {
  const getSchedules = () => {
    switch (burnoutLevel) {
      case 'none':
        return [
          { time: 'Morning', duration: '15 min', activity: 'Gratitude journaling' },
          { time: 'Midday', duration: '10 min', activity: 'Mindful walk or stretch' },
          { time: 'Evening', duration: '20 min', activity: 'Digital sunset - screen-free wind down' },
          { time: 'Weekly', duration: '2 hours', activity: 'Nature time or hobby immersion' }
        ]
      case 'high':
        return [
          { time: 'Morning', duration: '2 hours', activity: 'No screens before 10 AM' },
          { time: 'Lunch', duration: '1 hour', activity: 'Device-free meals' },
          { time: 'Evening', duration: '3 hours', activity: 'Digital sunset after 8 PM' },
          { time: 'Weekend', duration: '4 hours', activity: 'Screen-free Saturday morning' }
        ]
      case 'medium':
        return [
          { time: 'Morning', duration: '1 hour', activity: 'No screens during breakfast' },
          { time: 'Lunch', duration: '30 min', activity: 'Device-free lunch break' },
          { time: 'Evening', duration: '2 hours', activity: 'No screens 1 hour before bed' },
          { time: 'Weekend', duration: '2 hours', activity: 'Sunday digital detox' }
        ]
      default:
        return [
          { time: 'Morning', duration: '30 min', activity: 'Mindful morning routine' },
          { time: 'Lunch', duration: '15 min', activity: 'Screen-free lunch' },
          { time: 'Evening', duration: '1 hour', activity: 'Wind down without screens' },
          { time: 'Weekly', duration: '3 hours', activity: 'Weekly digital reset' }
        ]
    }
  }

  const schedules = getSchedules()
  const isHappyState = burnoutLevel === 'none'

  return (
    <div className="space-y-3">
      {schedules.map((schedule, index) => (
        <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${
          isHappyState 
            ? 'bg-emerald-950/20 border-emerald-400/30' 
            : 'bg-gray-900 border-gray-700'
        }`}>
          <div className="flex items-center gap-3">
            <Calendar className={`h-4 w-4 ${isHappyState ? 'text-emerald-400' : 'text-green-400'}`} />
            <div>
              <div className="font-medium text-white">{schedule.time}</div>
              <div className="text-sm text-gray-400">{schedule.activity}</div>
            </div>
          </div>
          <Badge variant="outline" className={`${
            isHappyState 
              ? 'border-emerald-400/30 text-emerald-400' 
              : 'border-green-400/30 text-green-400'
          }`}>
            {schedule.duration}
          </Badge>
        </div>
      ))}
    </div>
  )
}

function BreathingSession() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [countdown, setCountdown] = useState(4)
  const [cycles, setCycles] = useState(0)

  const startSession = () => {
    setIsActive(true)
    setPhase('inhale')
    setCountdown(4)
    setCycles(0)
  }

  const stopSession = () => {
    setIsActive(false)
    setPhase('inhale')
    setCountdown(4)
    setCycles(0)
  }

  // Breathing timer logic
  React.useEffect(() => {
    if (!isActive) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) return prev - 1
        
        // Move to next phase
        if (phase === 'inhale') {
          setPhase('hold')
          return 7
        } else if (phase === 'hold') {
          setPhase('exhale')
          return 8
        } else {
          // Complete one cycle
          setCycles((c) => {
            const newCycles = c + 1
            // Stop after 5 cycles
            if (newCycles >= 5) {
              setIsActive(false)
              setPhase('inhale')
              setCountdown(4)
              return 0
            }
            return newCycles
          })
          setPhase('inhale')
          return 4
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, phase])

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'text-cyan-400'
      case 'hold': return 'text-yellow-400'
      case 'exhale': return 'text-purple-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className={`text-5xl font-bold mb-2 ${getPhaseColor()}`}>
          {isActive ? countdown : '4'}
        </div>
        <div className={`text-lg capitalize ${getPhaseColor()}`}>
          {isActive ? phase : 'Ready to begin'}
        </div>
        {isActive && (
          <div className="text-sm text-gray-500 mt-1">
            Cycle {cycles + 1} of 5
          </div>
        )}
      </div>
      
      <div className="flex justify-center">
        <Button
          onClick={isActive ? stopSession : startSession}
          className={`${
            isActive 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600'
          } text-white border-0`}
        >
          {isActive ? 'Stop Session' : 'Start Breathing'}
        </Button>
      </div>

      <div className="text-xs text-gray-500 text-center space-y-1">
        <p>4-7-8 breathing technique for stress relief</p>
        <p>Inhale for 4s • Hold for 7s • Exhale for 8s</p>
      </div>
    </div>
  )
}