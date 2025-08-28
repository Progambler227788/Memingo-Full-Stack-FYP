import React, { useState, useEffect } from 'react'
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Card } from "./components/ui/card"
import { Brain, Globe2, Volume2, Star, Users, Trophy, BookOpen, Lightbulb, Zap, Clock, Headphones } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const AIVisuals = () => {
  const [currentVisual, setCurrentVisual] = useState(0)
  const visuals = [
    { Icon: BookOpen, text: "AI-powered lessons tailored to your learning style", tip: "Consistency is key: Practice a little every day rather than cramming occasionally." },
    { Icon: Lightbulb, text: "Intelligent suggestions to improve your language skills", tip: "Use mnemonics and association techniques to remember new vocabulary more easily." },
    { Icon: Zap, text: "Real-time feedback on pronunciation and grammar", tip: "Don't be afraid to make mistakes. They're an essential part of the learning process." },
    { Icon: Clock, text: "Spaced repetition system for optimal retention", tip: "Set realistic goals and track your progress to stay motivated." },
    { Icon: Users, text: "Connect with native speakers for practice", tip: "Immerse yourself in the language through movies, music, and podcasts." },
    { Icon: Headphones, text: "Audio lessons for improved listening skills", tip: "Practice speaking out loud, even if you're alone. It improves pronunciation and builds confidence." },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVisual((prev) => (prev + 1) % visuals.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const CurrentIcon = visuals[currentVisual].Icon

  return (
    <div className="h-full w-full bg-gradient-to-br from-sky-100 to-blue-50 rounded-lg p-8 shadow-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentVisual}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <CurrentIcon className="w-24 h-24 mb-4 text-[#26647e] mx-auto" />
          <h3 className="text-xl font-bold text-[#26647e] mb-2">{visuals[currentVisual].text}</h3>
          <p className="text-lg text-[#26647e] mb-4">{visuals[currentVisual].tip}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

const LanguageLevelGuide = () => {
  return (
    <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 rounded-lg shadow-lg p-6 mt-8">
      <h3 className="text-xl font-bold text-[#26647e] mb-4">Language Proficiency Levels</h3>
      <ul className="space-y-4">
        {[
          { level: "Beginner (A1)", description: "Can understand and use familiar everyday expressions and very basic phrases." },
          { level: "Elementary (A2)", description: "Can communicate in simple and routine tasks requiring a simple and direct exchange of information." },
          { level: "Intermediate (B1)", description: "Can deal with most situations likely to arise while travelling in an area where the language is spoken." },
          { level: "Upper Intermediate (B2)", description: "Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible." },
          { level: "Advanced (C1)", description: "Can express ideas fluently and spontaneously without much obvious searching for expressions." },
          { level: "Mastery (C2)", description: "Can understand with ease virtually everything heard or read, summarising information from different spoken and written sources." }
        ].map(({ level, description }) => (
          <li key={level} className="flex items-start">
            <Star className="w-5 h-5 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
            <div>
              <span className="font-semibold text-[#26647e]">{level}:</span> {description}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

const TestimonialCard = ({ name, language, quote }) => (
  <Card className="p-6 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-lg">
    <p className="italic mb-4">"{quote}"</p>
    <div className="flex items-center">
      <div className="w-10 h-10 rounded-full bg-[#26647e] flex items-center justify-center text-white font-bold mr-3">
        {name[0]}
      </div>
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-gray-600">{language} Learner</p>
      </div>
    </div>
  </Card>
)

export default function OnboardingPage() {
  const [name, setName] = useState('')
  const [language, setLanguage] = useState('')
  const [learningTopic, setLearningTopic] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [step, setStep] = useState(1)

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault()
    if (['german'].includes(language) && 
        ['animals', 'objects', 'nature', 'places'].includes(learningTopic)) {
      navigate('/GuestExercise', { 
        state: { 
          name, 
          difficulty,
          category: learningTopic,
          language: language
        } 
      });
    } else {
      alert(`${language.charAt(0).toUpperCase() + language.slice(1)} lessons on ${learningTopic} are coming soon!`);
    }
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="w-full max-w-screen-2xl mx-auto">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <img className="h-8 w-auto text-blue-600 animate-float" src="/src/assets/logo.png" alt="MEMINGO" />
              <span className="text-xl font-bold text-[#26647e]">MEMINGO</span>
            </div>
            <nav className="hidden md:flex space-x-4">
              <a href="#" className="text-[#26647e] hover:text-[#1e4f62] transition-colors">Home</a>
              <a href="#" className="text-[#26647e] hover:text-[#1e4f62] transition-colors">About</a>
              <a href="#" className="text-[#26647e] hover:text-[#1e4f62] transition-colors">Courses</a>
              <a href="#" className="text-[#26647e] hover:text-[#1e4f62] transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="w-full">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-bold text-[#26647e] mb-4">Let's Get Started with MEMINGO</h1>
                <p className="text-lg text-[#26647e]/80">Begin your language learning journey today and unlock a world of opportunities!</p>
              </div>
              
              <Card className="p-6 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {step === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          What's your name?
                        </label>
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your name"
                          required
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                          Which language do you want to learn?
                        </label>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="german">German</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                            <SelectItem value="french">French</SelectItem>
                            <SelectItem value="italian">Italian</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={nextStep} className="w-full bg-[#26647e] text-white hover:bg-[#1e4f62]">
                        Next <Globe2 className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {step === 2 && (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="learningTopic" className="block text-sm font-medium text-gray-700 mb-1">
                          What do you want to learn?
                        </label>
                        <Select value={learningTopic} onValueChange={setLearningTopic}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="animals">Animals</SelectItem>
                            <SelectItem value="places">Places</SelectItem>
                            <SelectItem value="objects">Objects</SelectItem>
                            <SelectItem value="nature">Nature</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                          Choose your starting difficulty
                        </label>
                        <Select value={difficulty} onValueChange={setDifficulty}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-between">
                        <Button onClick={prevStep} variant="outline" className="bg-white text-[#26647e] border-[#26647e] hover:bg-[#e6f0f3]">
                          Back
                        </Button>
                        <Button onClick={nextStep} className="bg-[#26647e] text-white hover:bg-[#1e4f62]">
                          Next <Brain className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  {step === 3 && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold text-[#26647e] mb-4">Ready to start learning?</h2>
                      <p className="text-gray-600">We'll customize your exercises based on the information you've provided.</p>
                      <Button type="submit" className="w-full bg-[#26647e] text-white hover:bg-[#1e4f62]">
                        Start Now <Volume2 className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </form>
              </Card>

              <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-[#26647e] mb-4">Why Choose MEMINGO?</h3>
                <ul className="space-y-2">
                  {[
                    { icon: Brain, text: "AI-powered personalized learning paths" },
                    { icon: Users, text: "Connect with native speakers for practice" },
                    { icon: Trophy, text: "Gamified learning experience with rewards" },
                    { icon: Globe2, text: "Learn anytime, anywhere with our mobile app" }
                  ].map(({ icon: Icon, text }, index) => (
                    <li key={index} className="flex items-center">
                      <Icon className="w-5 h-5 text-[#26647e] mr-2" />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-8">
              <div className="lg:sticky lg:top-24">
                <AIVisuals />
              </div>

              <LanguageLevelGuide />

              <div className="grid md:grid-cols-2 gap-6">
                <TestimonialCard
                  name="Sarah M."
                  language="Spanish"
                  quote="MEMINGO made learning Spanish fun and engaging. I've made more progress in 3 months than I did in a year of traditional classes!"
                />
                <TestimonialCard
                  name="Alex K."
                  language="German"
                  quote="The AI-powered lessons are incredibly effective. It's like having a personal tutor available 24/7!"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between py-6 gap-4">
            <div className="flex items-center gap-2">
              <img className="h-6 w-auto text-[#26647e] animate-float" src="/src/assets/logo.png" alt="MEMINGO" />
              <span className="text-sm font-semibold text-[#26647e]">MEMINGO</span>
            </div>
            <nav className="flex gap-4 md:gap-6">
              <a href="#" className="text-sm text-[#26647e] hover:text-[#1e4f62] transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-[#26647e] hover:text-[#1e4f62] transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-[#26647e] hover:text-[#1e4f62] transition-colors">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
