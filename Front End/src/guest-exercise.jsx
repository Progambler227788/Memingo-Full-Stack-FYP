'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, RotateCcw, Volume2, ArrowLeft, Star, Trophy, Brain, Zap } from 'lucide-react'
import { SpecialCharacters } from './components/SpecialCharacters'

const LeaderboardCard = () => (
  <Card className="p-4 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-lg">
    <h3 className="text-lg font-bold text-[#26647e] mb-3">Top Learners</h3>
    <ul className="space-y-2">
      {[
        { name: "Alex S.", score: 980, language: "German" },
        { name: "Maria L.", score: 945, language: "Spanish" },
        { name: "John D.", score: 920, language: "French" },
      ].map((user, index) => (
        <li key={index} className="flex items-center justify-between">
          <div className="flex items-center">
            <Trophy className={`w-4 h-4 mr-2 ${index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-yellow-700"}`} />
            <span>{user.name}</span>
          </div>
          <div className="text-sm text-gray-600">
            {user.score} pts ({user.language})
          </div>
        </li>
      ))}
    </ul>
  </Card>
)

const TipCard = ({ tip }) => (
  <Card className="p-4 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-lg">
    <div className="flex items-start">
      <Zap className="w-6 h-6 text-yellow-500 mr-2 flex-shrink-0 mt-1" />
      <p className="text-[#26647e]">{tip}</p>
    </div>
  </Card>
)

export default function GuestExercise() {
  const { category: urlCategory, language: urlLanguage } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [exercises, setExercises] = useState([])
  const [currentExercise, setCurrentExercise] = useState(null)
  const [options, setOptions] = useState([])
  const [questionType, setQuestionType] = useState('image')
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [score, setScore] = useState(0)
  const [questionCount, setQuestionCount] = useState(0)
  const [isExerciseComplete, setIsExerciseComplete] = useState(false)
  const [mistakes, setMistakes] = useState([])
  const audioRef = useRef(null)
  const [feedbackDelay, setFeedbackDelay] = useState(2000)
  const [usedExercises, setUsedExercises] = useState([])

  const [category, setCategory] = useState('')
  const [language, setLanguage] = useState('')
  const [name, setName] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const totalQuestions = 10

  const nextQuestion = useCallback(() => {
    if (!exercises || exercises.length === 0) {
      console.error('No exercises available')
      setFeedback('No exercises available. Please try again later.')
      return
    }

    if (questionCount >= totalQuestions) {
      setIsExerciseComplete(true)
      return
    }

    let availableExercises = exercises.filter(ex => !usedExercises.includes(ex))
    if (availableExercises.length === 0) {
      setUsedExercises([])
      availableExercises = exercises
    }

    const randomIndex = Math.floor(Math.random() * availableExercises.length)
    const newExercise = availableExercises[randomIndex]

    if (!newExercise || !newExercise.foreign) {
      console.error('Invalid exercise object:', newExercise)
      setFeedback('Error loading question. Please try again.')
      return
    }

    const nextCount = questionCount + 1
    setQuestionCount(nextCount)
    setUsedExercises(prev => [...prev, newExercise])
    setCurrentExercise(newExercise)

    const newQuestionType = difficulty === 'easy'
      ? (nextCount % 2 === 0 ? 'image' : 'text')
      : ['image', 'text', 'voice'][Math.floor(Math.random() * 3)]
    
    setQuestionType(newQuestionType)

    if (newQuestionType === 'image') {
      const wrongOptions = exercises
        .filter(e => e && e.foreign && e.foreign !== newExercise.foreign)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(e => e.foreign)
      
      const allOptions = [...wrongOptions, newExercise.foreign]
      setOptions(allOptions.sort(() => 0.5 - Math.random()))
    } else {
      setOptions([])
    }

    setUserAnswer('')
    setFeedback(`Question ${nextCount} of ${totalQuestions}`)
  }, [exercises, questionCount, totalQuestions, usedExercises, difficulty])

  const fetchExercises = useCallback(async (cat, lang) => {
    setIsLoading(true)
    try {
      const response = await fetch(`https://memingo-backend.vercel.app/courses/guest-exercises/${cat}/${lang}`)
      if (!response.ok) {
        throw new Error('Failed to fetch exercises')
      }
      const data = await response.json()
      if (!Array.isArray(data.exercises) || data.exercises.length === 0) {
        throw new Error('Invalid or empty exercises data')
      }
      setExercises(data.exercises)
    } catch (error) {
      console.error('Error fetching exercises:', error)
      setFeedback('Failed to load exercises. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const loadExerciseData = () => {
      const stateCategory = location.state?.category
      const stateLanguage = location.state?.language
      const stateName = location.state?.name
      const stateDifficulty = location.state?.difficulty

      const finalCategory = urlCategory || stateCategory || localStorage.getItem('category')
      const finalLanguage = urlLanguage || stateLanguage || localStorage.getItem('language')
      const finalName = stateName || localStorage.getItem('name')
      const finalDifficulty = stateDifficulty || localStorage.getItem('difficulty')

      if (finalCategory && finalLanguage) {
        setCategory(finalCategory)
        setLanguage(finalLanguage)
        setName(finalName)
        setDifficulty(finalDifficulty)

        localStorage.setItem('category', finalCategory)
        localStorage.setItem('language', finalLanguage)
        localStorage.setItem('name', finalName)
        localStorage.setItem('difficulty', finalDifficulty)

        return { category: finalCategory, language: finalLanguage }
      } else {
        navigate('/onboarding')
        return null
      }
    }

    const data = loadExerciseData()
    if (data) {
      fetchExercises(data.category, data.language)
    }
  }, [urlCategory, urlLanguage, location.state, navigate, fetchExercises])

  useEffect(() => {
    if (exercises.length > 0 && !isLoading && !currentExercise) {
      nextQuestion()
    }
  }, [exercises, isLoading, currentExercise, nextQuestion])

  const handleAnswer = useCallback((answer) => {
    const isCorrect = answer.toLowerCase() === currentExercise.foreign.toLowerCase()
    setFeedback(isCorrect ? 'Correct! 🎉' : `Sorry, the correct answer is ${currentExercise.foreign}.`)
    setScore(prevScore => prevScore + (isCorrect ? 1 : 0))
    if (!isCorrect) {
      setMistakes(prevMistakes => [...prevMistakes, { exercise: currentExercise, userAnswer: answer }])
    }
    setTimeout(() => {
      setFeedback('')
      if (questionCount >= totalQuestions) {
        setIsExerciseComplete(true)
      } else {
        nextQuestion()
      }
    }, feedbackDelay)
  }, [currentExercise, feedbackDelay, questionCount, totalQuestions, nextQuestion])

  const handleSubmit = (e) => {
    e.preventDefault()
    handleAnswer(userAnswer)
  }

  const resetExercise = () => {
    setScore(0)
    setQuestionCount(0)
    setIsExerciseComplete(false)
    setMistakes([])
    setUsedExercises([])
    setCurrentExercise(null)
    nextQuestion()
  }

  const playAudio = () => {
    if (audioRef.current) {
      if (audioRef.current.readyState === 4) {
        if (audioRef.current.paused) {
          audioRef.current.play()
        } else {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
          audioRef.current.play()
        }
      } else {
        console.warn('Audio is not ready to play')
      }
    }
  }

  const handleSpecialCharacter = (char) => {
    setUserAnswer(prevAnswer => prevAnswer + char)
  }

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.5 } }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
          <div className="w-full max-w-3xl space-y-8">
            <div className="text-xl text-blue-700">Loading exercises...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!category || !language) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="container mx-auto px-4 py-8 flex-1 flex items-center justify-center">
          <div className="w-full max-w-3xl space-y-8">
            <div className="text-xl text-blue-700">Redirecting to onboarding...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div className="flex items-center justify-center space-x-4 mb-8">
              <img className="h-8 w-auto text-blue-600 animate-float" src="/src/assets/logo.png" alt="MEMINGO" />
              <motion.h1 
                className="text-3xl font-bold text-blue-900"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {`${language.charAt(0).toUpperCase() + language.slice(1)} ${category.charAt(0).toUpperCase() + category.slice(1)} Exercise`}
              </motion.h1>
            </motion.div>

            <div className="space-y-6">
              <Progress value={(questionCount / totalQuestions) * 100} className="w-full" />

              <div className="flex items-center gap-4 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 p-4 rounded-lg">
                <span className="text-blue-800 whitespace-nowrap">Feedback Delay:</span>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="500"
                  value={feedbackDelay}
                  onChange={(e) => setFeedbackDelay(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-blue-800 whitespace-nowrap">{feedbackDelay / 1000}s</span>
              </div>

              <AnimatePresence mode="wait">
                {!isExerciseComplete ? (
                  <motion.div 
                    key="question"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 p-6 rounded-lg shadow-lg"
                  >
                    {currentExercise && (
                      <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-blue-700">
                          {questionType === 'image' 
                            ? `What's the ${language} word for ${currentExercise.english}?`
                            : questionType === 'text'
                            ? `Type the ${language} word for "${currentExercise.english}"`
                            : `Listen and type the ${language} word you hear`
                          }
                        </h2>

                        {questionType === 'image' && (
                          <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
                            <img 
                              src={currentExercise.image} 
                              alt={currentExercise.english} 
                              className="absolute inset-0 w-full h-full object-contain"
                            />
                          </div>
                        )}

                        {questionType === 'voice' && (
                          <div className="flex justify-center">
                            <Button onClick={playAudio} size="lg">
                              <Volume2 className="mr-2 h-5 w-5" /> Play Audio
                            </Button>
                            <audio ref={audioRef} src={currentExercise.audio} />
                          </div>
                        )}

                        {questionType === 'image' ? (
                          <div className="grid grid-cols-2 gap-4">
                            {options.map((option, index) => (
                              <Button 
                                key={index} 
                                onClick={() => handleAnswer(option)}
                                size="lg"
                                className="text-lg py-6"
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <form onSubmit={handleSubmit} className="space-y-4">
                            <Input 
                              value={userAnswer}
                              onChange={(e) => setUserAnswer(e.target.value)}
                              placeholder="Type answer"
                              className="text-lg p-6"
                            />
                            <SpecialCharacters 
                              language={language} 
                              onCharacterClick={handleSpecialCharacter} 
                            />
                            <Button type="submit" size="lg" className="w-full">
                              Submit
                              <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                          </form>
                        )}
                        
                        {feedback && (
                          <p className="text-lg font-semibold text-blue-700 text-center p-4 bg-blue-50 rounded-lg">
                            {feedback}
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="completion"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 p-8 rounded-lg shadow-lg text-center"
                  >
                    <div className="space-y-6">
                      <h2 className="text-3xl font-bold text-green-600">Exercise Complete!</h2>
                      <p className="text-2xl text-blue-800">Score: {score}/{totalQuestions}</p>
                      
                      <div className="flex gap-4 justify-center">
                        <Button onClick={resetExercise} variant="secondary" size="lg" className="flex items-center">
                          <RotateCcw className="mr-2 h-5 w-5" /> Retry
                        </Button>
                        <Button 
                          onClick={() => navigate('/onboarding')} 
                          variant="outline" 
                          size="lg"
                          className="flex items-center"
                        >
                          <ArrowLeft className="mr-2 h-5 w-5" /> Exit to Menu
                        </Button>
                      </div>

                      {mistakes.length > 0 && (
                        <div className="mt-8 text-left">
                          <h3 className="text-xl font-semibold text-red-500 mb-4">Mistakes:</h3>
                          <ul className="space-y-2">
                            {mistakes.map((mistake, index) => (
                              <li key={index} className="text-blue-700 bg-blue-50 p-4 rounded-lg">
                                The {language} word for "{mistake.exercise.english}" is 
                                <span className="font-bold"> {mistake.exercise.foreign}</span>
                                <br />
                                <span className="text-sm text-blue-600">
                                  You typed: {mistake.userAnswer}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-lg">
              <h3 className="text-xl font-bold text-[#26647e] mb-4">Your Progress</h3>
              <div className="flex items-center justify-between mb-2">
                <span>Questions Answered:</span>
                <span className="font-bold">{questionCount}/{totalQuestions}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span>Current Score:</span>
                <span className="font-bold">{score}/{totalQuestions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Accuracy:</span>
                <span className="font-bold">{questionCount > 0 ? Math.round((score / questionCount) * 100) : 0}%</span>
              </div>
            </Card>

            <LeaderboardCard />

            <Card className="p-6 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-lg">
              <h3 className="text-xl font-bold text-[#26647e] mb-4">Study Streak</h3>
              <div className="flex justify-between">
                {[1, 2, 3, 4, 5].map((day) => (
                  <div key={day} className="flex flex-col items-center">
                    <Star className={`w-8 h-8 ${day <= 3 ? "text-yellow-500" : "text-gray-300"}`} />
                    <span className="text-sm mt-1">Day {day}</span>
                  </div>
                ))}
              </div>
              <p className="text-center mt-4 text-[#26647e]">Keep up the great work! You're on a 3-day streak!</p>
            </Card>

            <TipCard tip="Try to use the new words you've learned in sentences. This helps reinforce your memory and understanding of the words in context." />
          </div>
        </div>
      </div>
      
    </div>
  )
}

