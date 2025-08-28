import { useState } from "react";
import { CheckCircle, RefreshCw } from "lucide-react";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import OutlinedButton from "@/components/buttons/OutlinedButton";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import FeedbackBurst from "./FeedBackBurst";

const LOGO_COLOR = "#256470";

export default function SentenceBuilderContent({
  content,
  onCorrect,
  onWrong,
  fontFamily = "Inter, sans-serif"
}) {
  const [selectedWords, setSelectedWords] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const remainingWords = content.words.filter(
    (w) => !selectedWords.includes(w)
  );

  // Feedback color
  const feedbackColor =
    isCorrect === true
      ? "text-green-600"
      : isCorrect === false
        ? "text-red-600"
        : "text-[--logo-color]";

  // Handle removing a word from the sentence row
  function handleRemoveWord(idx) {
    setSelectedWords(selectedWords.filter((_, i) => i !== idx));
  }

  // Handle adding a word from the bank
  function handleAddWord(word) {
    setSelectedWords([...selectedWords, word]);
  }

  // Handle check
  function handleCheck() {
    setShowFeedback(true);
    setIsCorrect(
      selectedWords.join(" ") === content.correct_order.join(" ")
    );
    setTimeout(() => {
      setShowFeedback(false);
      if (selectedWords.join(" ") === content.correct_order.join(" ")) {
        setIsCorrect(null);
        onCorrect?.();
        setSelectedWords([]);
      } else {
        setIsCorrect(null);
        onWrong?.();
      }
    }, 1200);
  }

  // Handle reset
  function handleReset() {
    setSelectedWords([]);
    setShowFeedback(false);
    setIsCorrect(null);
  }

  return (
    <div
      className="w-full max-w-xl mx-auto p-6 rounded-3xl bg-white/80 shadow-xl border border-neutral-200"
      style={{ fontFamily }}
    >
      {/* Instruction & translation */}
      <h2 className="text-xl font-bold mb-1" style={{ color: LOGO_COLOR, fontFamily }}>
        {content.instruction}
      </h2>
      <div
        className="text-base text-[--logo-color]/70 mb-5"
        style={{ ["--logo-color"]: LOGO_COLOR, fontFamily }}
      >
        {content.translation}
      </div>

      {/* Selected words row (sentence) */}
      <div
        className="flex w-full overflow-x-auto mb-4 py-2"
        style={{ minHeight: 60 }}
      >
        {selectedWords.map((word, idx) => (
          <button
            key={word + idx}
            type="button"
            className="mr-2 bg-[--logo-color] text-white rounded-xl px-4 py-2 text-base font-medium shadow-md transition-all hover:opacity-90"
            style={{ ["--logo-color"]: LOGO_COLOR, fontFamily }}
            onClick={() => handleRemoveWord(idx)}
          >
            {word}
          </button>
        ))}
      </div>

      {/* Available words bank */}
      <div className="flex flex-wrap gap-3 justify-center mb-4">
        {remainingWords.map((word, idx) => (
          <button
            key={word + idx}
            type="button"
            className="bg-white border border-[--logo-color] text-[--logo-color] rounded-xl px-4 py-2 text-base font-medium shadow-sm transition-all hover:bg-[--logo-color]/10"
            style={{ ["--logo-color"]: LOGO_COLOR, fontFamily }}
            onClick={() => handleAddWord(word)}
          >
            {word}
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-8 mt-6">
        {selectedWords.length > 0 && (
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
          disabled={selectedWords.length === 0}
          fontFamily={fontFamily}
          icon={<CheckCircle className="w-5 h-5" />}
        >
          Check
        </PrimaryButton>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {showFeedback && isCorrect !== null && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="text-center mt-8"
            style={{ fontFamily }}
          >
            <FeedbackBurst
              isCorrect={isCorrect}
              show={true}
              percent={isCorrect ? 100 : 0} // Assuming 100% for correct, 0% for incorrect
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}