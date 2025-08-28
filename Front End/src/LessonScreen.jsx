import { useState, useEffect } from 'react'; // Import necessary hooks and components
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import AlphabetLesson from '@/components/AlphabetLesson';
import api from '@/util/api' // axios instance for API calls


export default function LessonScreen() {
  const { courseId, lessonId } = useParams();
  console.log('LessonScreen - courseId:', courseId, 'lessonId:', lessonId);
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (courseId && lessonId) {
      fetchLesson();
    } 
    else {
      console.error('Missing courseId or lessonId');
      toast({
        title: "Error",
        description: "Invalid lesson or course. Please try again.",
        variant: "destructive",
      });
      navigate(`/dashboard/${courseId}`);
    }
  }, [courseId, lessonId, navigate, toast]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      console.log('Fetching lesson - URL:', `/lessons/${courseId}`);
      console.log('Fetching lesson - Token:', token);
      const response = await api.get(`/lessons/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Fetched lesson data:', response.data);
      setLesson(response.data);

    } 
    // Handle specific error cases
    catch (error) {
      console.error("Failed to fetch lesson:", error);
      console.error("Error details:", error.response?.data || error.message);

      // Show a user-friendly error message
      if (error.response && error.response.status === 404) { 
        toast({
          title: "Lesson Not Found",
          description: "The requested lesson does not exist. Please check the URL or try again later.",
          variant: "destructive",
        });
      }
      toast({
        title: "Error",
        description: "Failed to load the lesson. Please try again.",
        variant: "destructive",
      });
      navigate(`/dashboard/${courseId}`);
    }
    finally {
      setLoading(false);
    }
  };

  const handleLessonComplete = async (quizResults) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error('No token found');
      }

      const payload = {
        lessonId: lessonId,
        courseId: courseId,
        quizScore: quizResults.score,
        totalQuestions: quizResults.totalQuestions,
        correctAnswers: quizResults.correctAnswers,
        wrongAnswers: quizResults.wrongAnswers,
        status: "completed"  // Add this line
      };

      console.log("Payload to backend:", payload);

      const response = await api.post("/lessons/complete", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Backend response:", response.data);

      if (response.data.status === "success") {
        toast({
          title: "Lesson Completed",
          description: `You've completed the lesson with a score of ${quizResults.score}%.`,
        });

        // Fetch updated course data
        await fetchLesson();

        // Navigate back to the course dashboard
        navigate(`/dashboard/${courseId}`);
      } else {
        throw new Error(response.data.message || "Failed to complete lesson");
      }
    } catch (err) {
      console.error("Failed to complete lesson:", err);
      if (err.response) {
        console.error("Error response:", err.response.data);
      }
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to submit lesson completion. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <img src="/src/assets/logo.png" alt="Memingo Logo" className="h-12" />
          <Button variant="outline" onClick={() => navigate(`/dashboard/${courseId}`)}>
            Exit Lesson
          </Button>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8">
            <CardContent>
              {lesson && (lesson.type === 'alphabet' || lesson.type === 'pronunciation') && (
                <AlphabetLesson lesson={lesson} onComplete={handleLessonComplete} />
              )}
              {/* Add conditions for other lesson types here */}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

