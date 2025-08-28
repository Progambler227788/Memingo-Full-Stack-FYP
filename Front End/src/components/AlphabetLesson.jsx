import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Mic, Play, VolumeIcon as VolumeUp, ChevronRight, RotateCcw, Info, CheckCircle, XCircle, BookOpen, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

const AlphabetLesson = ({ lesson, onComplete }) => {
  const [phase, setPhase] = useState('introduction');
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [quizResults, setQuizResults] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [activeTab, setActiveTab] = useState('learn');
  const audioRef = useRef(null);
  const { toast } = useToast();

  const letters = lesson.content.pronunciation.audioUrls;
  const questions = lesson.quiz.questions;

  useEffect(() => {
    if (phase === 'learning') {
      setProgress((currentLetterIndex / letters.length) * 100);
    } else if (phase === 'quiz') {
      setProgress((currentQuestionIndex / questions.length) * 100);
    }
  }, [currentLetterIndex, currentQuestionIndex, phase, letters.length, questions.length]);

  const playAudio = (url) => {
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play();
    }
  };

  const handleNextLetter = () => {
    if (currentLetterIndex < letters.length - 1) {
      setCurrentLetterIndex(currentLetterIndex + 1);
    } else {
      setPhase('quiz');
      setCurrentQuestionIndex(0);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: "Error",
        description: "Speech recognition is not supported in your browser. Please try using Chrome or Edge.",
        variant: "destructive",
      });
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'de-DE';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript.toLowerCase();
      const currentLetter = questions[currentQuestionIndex].letter.toLowerCase();
      const isCorrect = speechResult.includes(currentLetter);
      handlePronunciationResult(isCorrect, speechResult);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
      toast({
        title: "Error",
        description: "There was an error with speech recognition. Please try again.",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsRecording(false);
    };
  };

  const handlePronunciationResult = (isCorrect, userPronunciation) => {
    const currentQuestion = questions[currentQuestionIndex];
    setShowFeedback(true);
    if (isCorrect) {
      setFeedbackMessage(`Correct! You pronounced "${userPronunciation}" which matches "${currentQuestion.letter}".`);
      setQuizResults(prev => ({
        ...prev,
        [currentQuestion.letter]: { correct: (prev[currentQuestion.letter]?.correct || 0) + 1 }
      }));
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      setFeedbackMessage(`Not quite. You pronounced "${userPronunciation}". Try again, focusing on the "${currentQuestion.letter}" sound.`);
      setQuizResults(prev => ({
        ...prev,
        [currentQuestion.letter]: { 
          correct: prev[currentQuestion.letter]?.correct || 0,
          incorrect: (prev[currentQuestion.letter]?.incorrect || 0) + 1
        }
      }));
    }
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const totalQuestions = questions.length;
      const correctAnswers = Object.values(quizResults).reduce((sum, result) => sum + (result.correct || 0), 0);
      const wrongAnswers = Object.values(quizResults).reduce((sum, result) => sum + (result.incorrect || 0), 0);
      const score = Math.round((correctAnswers / (correctAnswers + wrongAnswers)) * 100);
      onComplete({
        score,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        detailedResults: quizResults
      });
    }
  };

  const restartLesson = () => {
    setPhase('introduction');
    setCurrentLetterIndex(0);
    setCurrentQuestionIndex(0);
    setProgress(0);
    setQuizResults({});
    setActiveTab('learn');
  };

  const renderLessonCard = () => {
    switch (phase) {
      case 'introduction':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <CardTitle className="text-3xl mb-4">{lesson.title}</CardTitle>
            <CardDescription className="text-lg mb-6">{lesson.description}</CardDescription>
            <img
              src={`https://via.placeholder.com/200x200.png?text=Alphabet`}
              alt="Alphabet illustration"
              className="mx-auto mb-6 rounded-lg shadow-md max-w-full h-auto"
            />
            <Button onClick={() => setPhase('learning')} size="lg" className="w-full sm:w-auto">
              Start Learning
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        );
      case 'learning':
        return (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="learn">Learn</TabsTrigger>
              <TabsTrigger value="practice">Practice</TabsTrigger>
            </TabsList>
            <TabsContent value="learn">
              <motion.div
                key={`learn-${currentLetterIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="mb-8">
                  <h2 className="text-6xl sm:text-8xl font-bold mb-4">{letters[currentLetterIndex].letter}</h2>
                  <p className="text-lg sm:text-xl mb-4">Pronunciation: {letters[currentLetterIndex].pronunciation}</p>
                  <Button onClick={() => playAudio(letters[currentLetterIndex].audioUrl)} size="lg" className="w-full sm:w-auto mb-2 sm:mb-0 sm:mr-4">
                    <VolumeUp className="mr-2 h-5 w-5" /> Listen
                  </Button>
                </div>
                <div className="text-base sm:text-lg text-gray-600 mb-6">
                  Practice saying this letter out loud!
                </div>
                <img
                  src={`https://via.placeholder.com/150x150.png?text=${letters[currentLetterIndex].letter}`}
                  alt={`Illustration for ${letters[currentLetterIndex].letter}`}
                  className="mx-auto mb-6 rounded-lg shadow-md max-w-full h-auto"
                />
                <Button onClick={handleNextLetter} size="lg" className="w-full sm:w-auto">
                  {currentLetterIndex < letters.length - 1 ? 'Next Letter' : 'Start Quiz'}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </TabsContent>
            <TabsContent value="practice">
              <motion.div
                key={`practice-${currentLetterIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Practice Pronunciation</h2>
                <div className="text-6xl sm:text-8xl font-bold mb-6">{letters[currentLetterIndex].letter}</div>
                <Button onClick={startRecording} disabled={isRecording} size="lg" className="w-full sm:w-auto mb-4">
                  {isRecording ? 'Listening...' : 'Start Speaking'}
                  <Mic className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-base sm:text-lg text-gray-600 mb-4">
                  Click the button and try to pronounce the letter. The system will give you feedback on your pronunciation.
                </p>
                <img
                  src={`https://via.placeholder.com/150x150.png?text=${letters[currentLetterIndex].letter}`}
                  alt={`Illustration for ${letters[currentLetterIndex].letter}`}
                  className="mx-auto mb-6 rounded-lg shadow-md max-w-full h-auto"
                />
                <Button onClick={handleNextLetter} size="lg" className="w-full sm:w-auto">
                  {currentLetterIndex < letters.length - 1 ? 'Next Letter' : 'Start Quiz'}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </TabsContent>
          </Tabs>
        );
      case 'quiz':
        return (
          <motion.div
            key={`quiz-${currentQuestionIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-4">{questions[currentQuestionIndex].prompt}</h2>
            <div className="text-6xl sm:text-8xl font-bold mb-8">{questions[currentQuestionIndex].letter}</div>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-8">
              <Button onClick={() => playAudio(questions[currentQuestionIndex].expectedPronunciation)} size="lg" className="w-full sm:w-auto">
                <Play className="mr-2 h-5 w-5" /> Play Example
              </Button>
              <Button onClick={startRecording} disabled={isRecording} size="lg" className="w-full sm:w-auto">
                {isRecording ? 'Listening...' : 'Start Speaking'}
                <Mic className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <img
              src={`https://via.placeholder.com/150x150.png?text=${questions[currentQuestionIndex].letter}`}
              alt={`Illustration for ${questions[currentQuestionIndex].letter}`}
              className="mx-auto mb-6 rounded-lg shadow-md max-w-full h-auto"
            />
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-8"
                >
                  <Card className={feedbackMessage.includes("Correct") ? "bg-green-100" : "bg-red-100"}>
                    <CardContent className="p-4">
                      <p className="text-base sm:text-lg">{feedbackMessage}</p>
                    </CardContent>
                  </Card>
                  <Button onClick={handleNextQuestion} className="mt-4 w-full sm:w-auto" size="lg">
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      default:
        return null;
    }
  };

  const renderAdditionalContent = () => {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Learning Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Pronunciation Tips</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base">
                <li>Listen carefully to native speakers</li>
                <li>Practice mouth and tongue positions</li>
                <li>Record yourself and compare with examples</li>
                <li>Focus on the unique sounds of each letter</li>
                <li>Pay attention to vowel length and consonant strength</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Common Words</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {['Apfel', 'Brot', 'Danke', 'Haus', 'Katze', 'Wasser', 'Schule', 'Freund'].map((word, index) => (
                  <li key={index} className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => playAudio(`/audio/${word.toLowerCase()}.mp3`)}
                      className="bg-[#26647e] text-white hover:bg-[#1e4f62] hover:text-white w-full justify-start"
                    >
                      <VolumeUp className="h-4 w-4 mr-2" />
                      {word}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Fun Facts</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base">
                <li>The German alphabet has 26 letters, plus 4 special characters (ä, ö, ü, ß)</li>
                <li>The letter 'ß' is called "Eszett" or "scharfes S" (sharp S)</li>
                <li>German has many compound words, combining multiple words into one</li>
                <li>The longest German word ever published is 79 letters long</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full bg-[#26647e] text-white hover:bg-[#1e4f62] hover:text-white">
            <BookOpen className="mr-2 h-4 w-4" />
            Open Full Dictionary
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <CardTitle className="mb-2 sm:mb-0">{lesson.title}</CardTitle>
              <Button variant="outline" size="sm" onClick={restartLesson} className="w-full sm:w-auto">
                <RotateCcw className="mr-2 h-4 w-4" />
                Restart Lesson
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <Progress value={progress} className="mb-6" />
            {renderLessonCard()}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center">
            <Button variant="ghost" size="sm" className="mb-2 sm:mb-0">
              <Info className="mr-2 h-4 w-4" />
              Need Help?
            </Button>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>{Object.values(quizResults).reduce((sum, result) => sum + (result.correct || 0), 0)} Correct</span>
              <XCircle className="h-5 w-5 text-red-500 ml-4" />
              <span>{Object.values(quizResults).reduce((sum, result) => sum + (result.incorrect || 0), 0)} Incorrect</span>
            </div>
          </CardFooter>
          <audio ref={audioRef} className="hidden" />
        </Card>
        <div className="lg:col-span-1">
          {renderAdditionalContent()}
        </div>
      </div>
    </div>
  );
};

export default AlphabetLesson;
