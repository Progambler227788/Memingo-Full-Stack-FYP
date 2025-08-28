import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './landingpage';
import OnboardingPage from './onboarding';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import OTPVerificationPage from './OTPVerification';
import PasswordResetPage from './PasswordRestPage';
import LanguageSelectionScreen from './LanguageSelectionScreen';
import Dashboard from './Dashboard';
import LessonScreen from './LessonScreen';
import GuestExercise from './guest-exercise';
import { ImageOff } from 'lucide-react';
import GermanOfficeAR from './components/GermanOfficeAR';
import GermanBathroomAR from './components/GermanBathroomAR';
import Mcqs from './previews/Mcqs';
import DragAndDropScreen from './previews/DragAndDropScreen';
import Blank from './previews/Blank';
import MatchPairsScreen from './previews/MatchPairsScreen';
import SentenceBuilderScreen from './previews/SentenceBuilderScreen';
import TypingTranslationScreen from './previews/TypingTranslationScreen';
import ListenAndSelectScreen from './previews/ListenAndSelectScreen';
import PronunciationPracticeScreen from './previews/PronunciationPracticeScreen';
import LessonDemoScreen from './pages/LessonDemoScreen';
import LeaderboardScreen from './pages/LeaderBoardScreen';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* route takes two things one is path and other is element to be rendered */}
        <Route path="/" element={<LandingPage />} />
        {/* Lessons , just for texting purpose*/}
        <Route path="/multipleChoice" element={<Mcqs />} />
        <Route path="/dragAndDrop" element={<DragAndDropScreen />} />
        <Route path="/matchPair" element={<MatchPairsScreen />} />
        <Route path="/blank" element={<Blank />} />
        <Route path="/sentenceBuilder" element={<SentenceBuilderScreen/>} />
        <Route path="/typingTranslation" element={<TypingTranslationScreen/>} />
        <Route path="/listenAndSelect" element={<ListenAndSelectScreen/>} />
        <Route path="/pronounce" element={<PronunciationPracticeScreen/>} />


        <Route path="/leaderBoard" element={<LeaderboardScreen/>} />
        
        <Route path="/lessonDemo/:courseId/:lessonId" element={<LessonDemoScreen/>} />

        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/GuestExercise" element={<GuestExercise />} />
        {/* Authentication */}
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/SignupPage" element={<SignupPage />} />
        <Route path="/OTPVerification" element={<OTPVerificationPage />} />
        <Route path="/PasswordResetPage" element={<PasswordResetPage />} />

        {/* Dashboard Screen */}
        <Route path="/LanguageSelectionScreen" element={<LanguageSelectionScreen />} />
        <Route path="/dashboard/:courseId" element={<Dashboard />} />

        <Route path="/lesson/:courseId/:lessonId" element={<LessonScreen />} />
        <Route path="/german-restaurant-ar" element={<GermanBathroomAR />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

