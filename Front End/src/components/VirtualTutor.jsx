import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Volume2, Mic, ArrowRight } from 'lucide-react';
import axios from 'axios';

const STAGES = {
  VOCABULARY: 'vocabulary',
  PRONUNCIATION: 'pronunciation',
  USAGE: 'usage',
  QUIZ: 'quiz'
};

export function VirtualTutor({ lesson, userLevel, onLessonComplete }) {
  const [currentStage, setCurrentStage] = useState(STAGES.VOCABULARY);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [tutorMessage, setTutorMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  const currentWord = lesson.vocabularyList[currentWordIndex];

  const fetchTutorResponse = useCallback(async (message, stage) => {
    setIsTyping(true);
    try {
      const token = localStorage.getItem('token'); // Retrieve the JWT token
      if (!token) {
        throw new Error('User not authenticated');
      }
  
      const response = await axios.post(
        'http://localhost:5000/auth/tutor',
        {
          message,
          lesson,
          userLevel,
          stage,
          currentWord: lesson.vocabularyList[currentWordIndex],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT token in Authorization header
          },
        }
      );
  
      const tutorResponse = response.data.message;
      setTutorMessage(tutorResponse);
      setIsTyping(false);
    } catch (error) {
      console.error('Error fetching tutor response:', error);
      setTutorMessage('Failed to fetch response from the tutor. Please try again.');
      setIsTyping(false);
    }
  }, [lesson, userLevel, currentWordIndex]);
  

  useEffect(() => {
    if (currentStage === STAGES.VOCABULARY) {
      fetchTutorResponse('Teach vocabulary', STAGES.VOCABULARY);
    }
  }, [currentStage, fetchTutorResponse]);

  const handleUserInput = async (e) => {
    e.preventDefault();
    if (userInput.trim()) {
      await fetchTutorResponse(userInput, currentStage);
      setUserInput('');
    }
  };

  const startListening = () => {
    setIsListening(true);
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'de-DE';
    recognition.start();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
      setIsListening(false);
    };
  };

  const speakMessage = (message) => {
    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = 'de-DE';
    window.speechSynthesis.speak(speech);
  };

  const moveToNextStage = () => {
    switch (currentStage) {
      case STAGES.VOCABULARY:
        setCurrentStage(STAGES.PRONUNCIATION);
        fetchTutorResponse('Teach pronunciation', STAGES.PRONUNCIATION);
        break;
      case STAGES.PRONUNCIATION:
        setCurrentStage(STAGES.USAGE);
        fetchTutorResponse('Teach usage', STAGES.USAGE);
        break;
      case STAGES.USAGE:
        if (currentWordIndex < lesson.vocabularyList.length - 1) {
          setCurrentWordIndex(currentWordIndex + 1);
          setCurrentStage(STAGES.VOCABULARY);
          fetchTutorResponse('Teach vocabulary', STAGES.VOCABULARY);
        } else {
          setCurrentStage(STAGES.QUIZ);
          fetchTutorResponse('Start quiz', STAGES.QUIZ);
        }
        break;
      case STAGES.QUIZ:
        onLessonComplete();
        break;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex-grow overflow-y-auto max-h-96 space-y-4">
            <AnimatePresence>
              <motion.div
                key={tutorMessage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-3 rounded-lg bg-blue-100"
              >
                {tutorMessage}
              </motion.div>
            </AnimatePresence>
          </div>
          {isTyping && (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>AI Tutor is typing...</span>
            </div>
          )}
          <form onSubmit={handleUserInput} className="flex space-x-2">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your response..."
              className="flex-grow"
            />
            <Button type="submit">Send</Button>
            <Button type="button" onClick={() => speakMessage(currentWord ? currentWord.word : tutorMessage)}>
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button type="button" onClick={startListening} disabled={isListening}>
              <Mic className="h-4 w-4" />
            </Button>
          </form>
          <Button onClick={moveToNextStage} className="self-end">
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
