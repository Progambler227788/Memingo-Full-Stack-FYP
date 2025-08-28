import { useEffect, useState, useCallback } from "react";
import { fetchLesson, submitLessonResults } from "@/services/lessonService";
import ListenAndSelectContent from "@/components/lessons/ListenAndSelectContent";
import PronunciationPracticeContent from "@/components/lessons/PronunciationPracticeContent";
import SentenceBuilderContent from "@/components/lessons/SentenceBuilderContent";
import TypeTranslationContent from "@/components/lessons/TypeTranslationContent";
import DragAndDropSentenceContent from "@/components/lessons/DragAndDropSentenceContent";
import MatchPairsContent from "@/components/lessons/MatchPairsContent";
import MultipleChoiceContent from "@/components/lessons/MultipleChoiceContent";
import FillInBlankContent from "@/components/lessons/FillInTheBlankContent";
import { CheckCircle, XCircle, Heart } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import clsx from "clsx";

const MAX_HEARTS = 3;

function flattenQuestions(activities) {
  return activities.flatMap((act) => {
    if (act.type === "pronunciation_practice") {
      const perQuestion = act.content.words.length
        ? act.points / act.content.words.length
        : 0;
      return act.content.words.map((w) => ({
        type: act.type,
        content: { ...act.content, word: w },
        activity_id: act.activity_id,
        points: perQuestion,
      }));
    }
    return [{
      type: act.type,
      content: act.content,
      activity_id: act.activity_id,
      points: act.points,
    }];
  });
}

function submitResult({ courseId, lessonId, activities, questions, status, points }) {
  const activity_scores = activities.map((activity) => {
    const questionIndices = questions
      .map((q, i) => q.activity_id === activity.activity_id ? i : -1)
      .filter(i => i !== -1);

    const activityScore = questionIndices.reduce((acc, idx) => (
      status[idx] === "Correct" ? acc + (questions[idx].points || 0) : acc
    ), 0);

    return Math.round(activityScore);
  });

  const maxPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
  const overall_score = maxPoints > 0 ? Math.round((points / maxPoints) * 100) : 0;

  const payload = {
    course_id: courseId,
    activity_scores,
    overall_score,
  };

  return submitLessonResults(lessonId, payload);
}

export default function LessonComponent({ courseId = "german-en", lessonId = "1" }) {
  const [lesson, setLesson] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [status, setStatus] = useState([]);
  const [uiState, setUiState] = useState("loading");
  const [points, setPoints] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLesson(lessonId)
      .then((data) => {
        setLesson(data);
        const qs = flattenQuestions(data.activities);
        setQuestions(qs);
        setStatus(Array(qs.length).fill("Unanswered"));
        setCurrent(0);
        setHearts(MAX_HEARTS);
        setUiState("success");
      })
      .catch(() => setUiState("error"));
  }, [lessonId]);

  const handleCorrect = useCallback(() => {
    const q = questions[current];
    setPoints((prevPoints) => prevPoints + (q?.points || 0));
    setStatus((s) => s.map((st, i) => (i === current ? "Correct" : st)));
    setCurrent((c) => c + 1);
  }, [current, questions]);

  const handleWrong = useCallback(() => {
    setStatus((s) => s.map((st, i) => (i === current ? "Wrong" : st)));
    setHearts((h) => Math.max(h - 1, 0));
  }, [current]);

  // Automatic lesson completion detection
  useEffect(() => {
    if (uiState === "success" && hearts > 0 && current >= questions.length) {
      // Show aesthetic completion UI, auto submit, and then navigate after delay
      setShowCompletion(true);
      submitResult({
        courseId,
        lessonId,
        activities: lesson.activities,
        questions,
        status,
        points,
      }).then(() => {
        setTimeout(() => {
          navigate(`/dashboard/${courseId}`); // navigate after 0.1 seconds
        }, 100);
      }).catch(() => {
        // Optionally handle submission error UI
      });
    }
  }, [current, hearts, uiState, lesson, courseId, lessonId, questions, status, points, navigate]);

  const percent = questions.length
    ? Math.round(((current) / questions.length) * 100)
    : 0;

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-[#f5f5f5]">
      <div
        className={clsx(
          "bg-white/90 rounded-3xl shadow-lg min-h-[80vh] w-full max-w-[600px]",
          "flex flex-col items-stretch"
        )}
        style={{
          boxShadow:
            "0 2px 32px 0 rgba(37,100,112,0.10), 0 1.5px 16px 0 rgba(37,100,112,0.04)",
        }}
      >
        {/* Top bar */}
        <div className="flex items-center w-full px-6 py-4 bg-[#256470] text-white rounded-t-3xl">
          <div className="flex-1">
            <div className="text-lg font-bold">{lesson?.title || "Lesson"}</div>
            <div className="text-sm opacity-70">
              {Math.min(current + 1, questions.length)} of {questions.length}
            </div>
          </div>
          <div className="flex gap-2">
            {Array(MAX_HEARTS)
              .fill(0)
              .map((_, i) => (
                <Heart
                  key={i}
                  className={clsx("w-6 h-6", i < hearts ? "text-red-500" : "text-gray-400")}
                  fill={i < hearts ? "currentColor" : "none"}
                />
              ))}
          </div>
          <div className="px-4 text-sm font-bold">
            Score: {points}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-[#25647022] relative">
          <div
            className="bg-[#256470] h-2 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Status circles */}
        <div className="flex justify-center gap-3 mt-5 mb-3 w-full px-4">
          {status.map((s, i) => (
            <div
              key={i}
              className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center border",
                s === "Correct"
                  ? "bg-green-500 text-white border-green-500"
                  : s === "Wrong"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-transparent text-gray-400 border-gray-300"
              )}
            >
              {s === "Correct" ? (
                <CheckCircle className="w-5 h-5" />
              ) : s === "Wrong" ? (
                <XCircle className="w-5 h-5" />
              ) : null}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex justify-center w-full px-6 py-6">
          <div className="w-full max-w-md">
            {uiState === "loading" && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full border-t-4 border-[#256470] border-opacity-60 border-b-4 border-gray-300 h-16 w-16"></div>
              </div>
            )}

            {uiState === "error" && (
              <div className="w-full h-full flex items-center justify-center text-red-500">
                Failed to load lesson.
              </div>
            )}

            {uiState === "success" && (
              <>
                {hearts <= 0 ? (
                  <div className="flex flex-col items-center w-full">
                    <div className="text-2xl text-red-600 font-bold mb-2">
                      You've run out of hearts!
                    </div>
                    <button
                      className="mt-4 px-6 py-3 rounded-xl bg-[#256470] text-white font-bold"
                      onClick={() => window.location.reload()}
                    >
                      Quit Lesson
                    </button>
                  </div>
                ) : showCompletion ? (
                  <div className="flex flex-col items-center w-full animate-fade-in">
                    <div
                      className="relative w-full flex flex-col items-center"
                      style={{
                        minHeight: "250px",
                        justifyContent: "center",
                      }}
                    >
                   
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="text-4xl font-extrabold text-[#256470] drop-shadow mb-2 tracking-tight animate-fade-in-up">
                          🎉 Congratulations!
                        </div>
                        <div className="text-xl font-medium text-[#256470] animate-fade-in-up">
                          Lesson Completed
                        </div>
                        <div className="mt-6 flex flex-row gap-3">
                          <span className="text-green-600 font-bold text-lg">
                            {points} Points
                          </span>
                          <span>|</span>
                          <span className="text-[#256470] font-bold text-lg">
                            Score: {Math.round((points / (questions.reduce((sum, q) => sum + (q.points || 0), 0) || 1))*100)}%
                          </span>
                        </div>
                        <div className="mt-8 text-sm font-semibold text-gray-500 animate-fade-in-up">
                          Redirecting to dashboard...
                        </div>
                      </div>
                    </div>
                  </div>
                ) : current >= questions.length ? (
                  // Fallback (should rarely show)
                  <div className="flex flex-col items-center w-full">
                    <div className="text-2xl text-[#256470] font-bold mb-2">
                      Congratulations! Lesson Completed.
                    </div>
                    <button
                      className="mt-4 px-6 py-3 rounded-xl bg-[#256470] text-white font-bold"
                      onClick={() => navigate("/dashboard")}
                    >
                      Go to Dashboard
                    </button>
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center justify-center px-4">
                    <div className="w-full max-w-4xl mx-auto">
                      {(() => {
                        const q = questions[current];
                        switch (q.type) {
                          case "listen_and_select":
                            return (
                              <ListenAndSelectContent
                                content={q.content}
                                language="de-DE"
                                explanation={q.content.explanation}
                                onCorrect={handleCorrect}
                                onWrong={handleWrong}
                                fontFamily="Inter, sans-serif"
                              />
                            );
                          case "pronunciation_practice":
                            return (
                              <PronunciationPracticeContent
                                word={q.content.word}
                                language="de-DE"
                                onCorrect={handleCorrect}
                                onWrong={handleWrong}
                                fontFamily="Inter, sans-serif"
                              />
                            );
                          case "sentence_builder":
                            return (
                              <SentenceBuilderContent
                                content={q.content}
                                onCorrect={handleCorrect}
                                onWrong={handleWrong}
                                fontFamily="Inter, sans-serif"
                              />
                            );
                          case "type_translation":
                            return (
                              <TypeTranslationContent
                                content={q.content}
                                onCorrect={handleCorrect}
                                onWrong={handleWrong}
                                fontFamily="Inter, sans-serif"
                              />
                            );
                          case "drag_and_drop":
                            return (
                              <DragAndDropSentenceContent
                                content={q.content}
                                onCorrect={handleCorrect}
                                onWrong={handleWrong}
                                fontFamily="Inter, sans-serif"
                              />
                            );
                          case "match_pairs":
                            return (
                              <MatchPairsContent
                                content={q.content}
                                onCorrect={handleCorrect}
                                onWrong={handleWrong}
                                fontFamily="Inter, sans-serif"
                              />
                            );
                          case "multiple_choice":
                            return (
                              <MultipleChoiceContent
                                content={q.content}
                                onCorrect={handleCorrect}
                                onWrong={handleWrong}
                                fontFamily="Inter, sans-serif"
                              />
                            );
                          case "fill_in_blank":
                            return (
                              <FillInBlankContent
                                content={q.content}
                                onCorrect={handleCorrect}
                                onWrong={handleWrong}
                                fontFamily="Inter, sans-serif"
                              />
                            );
                          default:
                            return <div>Unknown question type.</div>;
                        }
                      })()}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {/* CSS Animations for "sexy aesthetic" */}
      <style>
       
      </style>
    </div>
  );
}