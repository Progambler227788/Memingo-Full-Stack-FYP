import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, BookOpen, Loader2 } from 'lucide-react'
import NewLanguageDialog from './NewLanguageDialog'
import axios from 'axios'
import api from '@/util/api' // axios instance for API calls

const LanguageCard = ({ course, onContinue }) => {
  const progressPercentage = (course.completed_lessons / course.total_lessons) * 100;
  
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="p-0 relative h-40 shrink-0">
        <img 
          src={course.flag || '/placeholder.svg'}
          alt={`${course.name} flag`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <CardTitle className="relative z-10 p-6 text-white text-2xl">
          {course.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 bg-white flex-grow">
        <Progress value={progressPercentage} className="w-full" />
        <p className="mt-2 text-sm text-gray-600">
          {course.completed_lessons} of {course.total_lessons} lessons completed
        </p>
        <p className="mt-1 text-sm text-gray-600">
          {progressPercentage.toFixed(1)}% complete
        </p>
      </CardContent>
      <CardFooter className="bg-white">
        <Button
          className="w-full bg-[#26647e] hover:bg-[#1e4f62]"
          onClick={() => onContinue(course.id)}
        >
          Continue Learning
        </Button>
      </CardFooter>
    </Card>
  )
}

const NewLanguageCard = ({ onStartNew }) => (
  <Card className="w-full h-full flex flex-col">
    <CardHeader>
      <CardTitle>Learn a New Language</CardTitle>
      <CardDescription>Explore new cultures and expand your horizons</CardDescription>
    </CardHeader>
    <CardContent className="flex items-center justify-center py-8 flex-grow">
      <Plus className="h-12 w-12 text-gray-400" />
    </CardContent>
    <CardFooter>
      <Button className="w-full bg-[#26647e] hover:bg-[#1e4f62]" onClick={onStartNew}>
        Start New Language
      </Button>
    </CardFooter>
  </Card>
)

export default function LanguageSelectionScreen() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isNewLanguageDialogOpen, setIsNewLanguageDialogOpen] = useState(false)
  const navigate = useNavigate()


  useEffect(() => {
    // Extract the token from the URL if user came back from Google Auth
  const token = new URLSearchParams(window.location.search).get('token');
  if (token) {
    localStorage.setItem('token', token);
  }

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      // used new axios instance for API calls
      const response = await api.get('/courses/user/languages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
      setLoading(false);
    }
     catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem('token');
        setError('Your session has expired. Please log in again.');
        navigate('/loginPage');
      }
      else {
        setError('Failed to fetch user data. Please try again.');
      }
      setLoading(false);
    }
  };

  fetchUserData();
}, [navigate]);

  
  const handleContinueLearning = (courseId) => {
    navigate(`/dashboard/${courseId}`)
  }

  const handleStartNewLanguage = () => {
    setIsNewLanguageDialogOpen(true)
  }

  const handleAddLanguage = async (courseData) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      // used new axios instance for API calls
      await api.post('/courses/user/add_language', courseData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // used new axios instance to fetch updated user data
      const updatedUserData = await api.get('/courses/user/languages', {
        headers: { Authorization: `Bearer ${token}` }
      })

      setUserData(updatedUserData.data)
    }
     catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem('token')
        setError('Your session has expired. Please log in again.')
        navigate('/loginPage')
      } 
      else {
        setError('Failed to add new language course. Please try again.')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-sky-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#26647e]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen w-screen bg-sky-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-screen bg-sky-50">
      <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#26647e] text-center">Welcome to MEMINGO!</h1>
          <p className="text-center text-gray-600 mt-2">Continue your learning journey or start a new one</p>
        </header>
        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
            {userData?.languages?.map((language) => (
              <div key={language.id} className="w-full h-full">
                <LanguageCard course={language} onContinue={handleContinueLearning} />
              </div>
            ))}
            <div className="w-full h-full">
              <NewLanguageCard onStartNew={handleStartNewLanguage} />
            </div>
          </div>
        </main>
        <footer className="mt-12 text-center">
          <p className="text-sm text-gray-600">
            Your current streak: <span className="font-bold">{userData?.streak || 0} days</span> 🔥
          </p>
          <Button variant="link" className="mt-2 text-[#26647e]" onClick={() => navigate('/courses')}>
            <BookOpen className="mr-2 h-4 w-4" />
            View All Courses
          </Button>
        </footer>
      </div>
      <NewLanguageDialog 
        isOpen={isNewLanguageDialogOpen} 
        onClose={() => setIsNewLanguageDialogOpen(false)}
        onAddLanguage={handleAddLanguage}
      />
    </div>
  )
}

