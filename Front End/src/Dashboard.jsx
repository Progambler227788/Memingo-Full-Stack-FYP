import  { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Loader2, Lock, CheckCircle, BookOpen, AlertCircle, CuboidIcon as Cube } from "lucide-react"
import GermanBathroomAR from "./components/GermanBathroomAR"
import api from '@/util/api' // axios instance for API calls


const LessonCard = ({ lesson, onStart }) => {
  const getStatusColor = () => {
    switch (lesson.status) {
      case "completed":
        return "border-green-500"
      case "in_progress":
        return "border-black"
      case "locked":
        return "border-red-500"
      default:
        return "border-gray-300"
    }
  }

  const getStatusIcon = () => {
    switch (lesson.status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "in_progress":
        return <BookOpen className="h-5 w-5 text-black" />
      case "locked":
        return <Lock className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
    }
  }

  return (
    <Card className={`w-full h-full flex flex-col border-2 ${getStatusColor()}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {lesson.title}
          {getStatusIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 mb-2">Type: {lesson.type}</p>
        <p className="mt-2 text-sm text-gray-600">Status: {lesson.status}</p>
        {lesson.status === "completed" && lesson.quizScore && (
          <p className="mt-2 text-sm font-semibold text-green-600">Quiz Score: {lesson.quizScore}%</p>
        )}
        {lesson.status === "locked" && lesson.prerequisites && (
          <p className="mt-2 text-sm text-red-600">Complete {lesson.prerequisites.join(", ")} to unlock</p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onStart(lesson.id)}
          disabled={lesson.status === "locked"}
          className={`w-full ${
            lesson.status === "completed"
              ? "bg-green-500 hover:bg-green-600"
              : lesson.status === "locked"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-[#26647e] hover:bg-[#1e4f62]"
          }`}
        >
          {lesson.status === "locked" ? "Locked" : "Start Lesson"}
        </Button>
      </CardFooter>
    </Card>
  )
}

const Dashboard = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [courseData, setCourseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showBathroomAR, setShowBathroomAR] = useState(false)

  useEffect(() => {
    console.log("Hello")
    const fetchCourseData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        if (!token) throw new Error("No token found")

        const response = await api.get(`/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCourseData(response.data)
        console.log("Fetched course data:", response.data)
      }
       catch (error) {
        console.error("Failed to fetch course data:", error)
        setError("Failed to load course data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchCourseData()
  }, [courseId])

  const handleStartLesson = (lessonId) => {
    console.log(`Starting lesson with id: ${lessonId}`)
    navigate(`/lessonDemo/${courseId}/${lessonId}`)
  }

  const handleStartBathroomAR = () => {
    setShowBathroomAR(true)
  }

  const handleCloseBathroomAR = () => {
    setShowBathroomAR(false)
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

  if (showBathroomAR) {
    return <GermanBathroomAR courseId={courseId} onClose={handleCloseBathroomAR} />
  }

  return (
    <div className="min-h-screen w-screen bg-sky-50">
      <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#26647e] text-center">{courseData.title}</h1>
          <p className="text-center text-gray-600 mt-2">{courseData.description}</p>
        </header>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Course Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={courseData.overallProgress} className="w-full" />
            <p className="mt-2 text-sm text-gray-600">{courseData.overallProgress}% Complete</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          <Card>
            <CardHeader>
              <CardTitle>LeaderBoard</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Leaderboard Top 3 Users here</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Detailed performance analytics will be displayed here.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AR Experiences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Bathroom Scene</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Practice German vocabulary in a virtual bathroom setting.
                    </p>
                    <Button onClick={handleStartBathroomAR} className="w-full bg-[#26647e] hover:bg-[#1e4f62]">
                      <Cube className="mr-2 h-4 w-4" />
                      Start Bathroom AR
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Office Experience</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Practice your German in an immersive AR Office setting!
                    </p>
                    <Button
                      onClick={() => navigate("/german-restaurant-ar")}
                      className="w-full bg-[#26647e] hover:bg-[#1e4f62]"
                    >
                      <Cube className="mr-2 h-4 w-4" />
                      Start Office AR
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-[#26647e]">Lessons</h2>
        {courseData && courseData.lessons && courseData.lessons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
            {courseData.lessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} onStart={() => handleStartLesson(lesson.id)} />
            ))}
          </div>
        ) : (
          <p>No lessons available for this course.</p>
        )}

        <footer className="mt-12 text-center">
          <Button
            onClick={() => navigate("/LanguageSelectionScreen")}
            className="group bg-white text-[#26647E] border border-[#26647E] hover:bg-[#26647E] hover:text-white transition-all duration-300 ease-in-out flex items-center gap-2 px-5 py-2 rounded-lg shadow-sm hover:shadow-md"
          >
            <BookOpen
              size={18}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            <span className="font-semibold tracking-wide">Back to Language Selection</span>
          </Button>
        </footer>
      </div>
    </div>
  )
}

export default Dashboard

