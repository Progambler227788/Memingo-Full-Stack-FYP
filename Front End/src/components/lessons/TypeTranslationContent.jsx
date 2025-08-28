import { useState } from "react";
import { CheckCircle, RefreshCw } from "lucide-react";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import OutlinedButton from "@/components/buttons/OutlinedButton";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import FeedbackBurst from "./FeedBackBurst";

const LOGO_COLOR = "#256470";

function getWordAccuracy(userInput, correctAnswers) {
  // Split and lowercase
  const userWords = userInput.trim().toLowerCase().split(/\s+/).filter(Boolean);
  // Find the correct answer with the most word overlap
  let maxCorrect = 0;
  let correctWordList = [];
  for (const ans of correctAnswers) {
    const answerWords = ans.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const matched = userWords.filter(word => answerWords.includes(word)).length;
    if (matched > maxCorrect) {
      maxCorrect = matched;
      correctWordList = answerWords;
    }
  }
  const percent = correctWordList.length > 0 ? Math.round((maxCorrect / correctWordList.length) * 100) : 0;
  return { percent, correctWordList, matched: maxCorrect };
}

export default function TypeTranslationContent({
  content,
  onCorrect,
  onWrong,
  fontFamily = "Inter, sans-serif"
}) {
  const [userInput, setUserInput] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackPercent, setFeedbackPercent] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);

  // All acceptable answers, lowercased and trimmed
  const correctAnswers = [
    content.correct_answer?.trim().toLowerCase(),
    ...(content.alternative_answers || []).map(a => a.trim().toLowerCase())
  ];

  // Feedback color
  const feedbackColor =
    feedbackPercent === 100
      ? "text-green-600"
      : feedbackPercent !== null && feedbackPercent >= 50
      ? "text-blue-600"
      : feedbackPercent !== null
      ? "text-red-600"
      : "text-[--logo-color]";

  // Handle check
  function handleCheck() {
    const { percent } = getWordAccuracy(userInput, correctAnswers);
    setShowFeedback(true);
    setFeedbackPercent(percent);
    setShowCorrect(percent >= 50 && percent < 100);
    setIsChecking(true);

    setTimeout(() => {
      setShowFeedback(false);
      setFeedbackPercent(null);
      setIsChecking(false);
      setShowCorrect(false);
      setUserInput("");
      if (percent >= 50) onCorrect?.();
      else onWrong?.();
    }, 1200);
  }

  // Handle reset
  function handleReset() {
    setUserInput("");
    setShowFeedback(false);
    setFeedbackPercent(null);
    setIsChecking(false);
    setShowCorrect(false);
  }

  return (
    <div
      className="w-full max-w-xl mx-auto p-6 rounded-3xl bg-white/80 shadow-xl border border-neutral-200"
      style={{ fontFamily }}
    >
      {/* Instruction */}
      <h2 className="text-xl font-bold mb-1" style={{ color: LOGO_COLOR, fontFamily }}>
        {content.instruction}
      </h2>
      <div
        className="text-base mb-5"
        style={{ color: LOGO_COLOR, opacity: 0.8, fontFamily }}
      >
        {content.english_text}
      </div>

      {/* Input field */}
      <input
        type="text"
        value={userInput}
        disabled={showFeedback}
        onChange={(e) => !showFeedback && setUserInput(e.target.value)}
        placeholder="Type in German"
        className={clsx(
          "w-full border-2 rounded-xl px-4 py-2 mt-2 mb-3 text-base transition-all shadow-sm",
          "focus:outline-none",
          showFeedback
            ? "border-gray-300 bg-gray-100"
            : "border-[--logo-color] bg-white"
        )}
        style={{
          ["--logo-color"]: LOGO_COLOR,
          fontFamily,
          color: LOGO_COLOR
        }}
      />

      {/* Buttons */}
      <div className="flex items-center justify-center gap-8 mt-5">
        {userInput.length > 0 && !showFeedback && (
          <OutlinedButton
            onClick={handleReset}
            fontFamily={fontFamily}
            icon={<RefreshCw className="w-5 h-5" />}
          >
            Reset
          </OutlinedButton>
        )}
        <PrimaryButton
          onClick={handleCheck}
          disabled={userInput.trim().length === 0 || showFeedback}
          fontFamily={fontFamily}
          icon={<CheckCircle className="w-5 h-5" />}
        >
          Check
        </PrimaryButton>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {showFeedback && feedbackPercent !== null && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="text-center mt-8"
            style={{ fontFamily }}
          >
            <div className={clsx("text-xl font-bold mb-1", feedbackColor)}>
              {feedbackPercent === 100
                ? "Perfect! 🎉"
                : feedbackPercent >= 50
                ? `Good! You got ${feedbackPercent}% correct`
                : `Try again (${feedbackPercent}% correct)`}
            </div>
             <FeedbackBurst
              isCorrect={feedbackPercent >= 50}
              percent={feedbackPercent}
              show={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}