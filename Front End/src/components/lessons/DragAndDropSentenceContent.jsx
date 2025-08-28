import { useState, useEffect } from "react";
import { RefreshCw, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import OutlinedButton from "@/components/buttons/OutlinedButton";
import TileButton from "@/components/buttons/TileButton";
import FeedbackBurst from "./FeedBackBurst";

const LOGO_COLOR = "#256470";

export default function DragAndDropSentenceContent({
  content,
  onCorrect,
  onWrong,
  fontFamily = "Inter, sans-serif"
}) {
  // State
  const [arrangedWords, setArrangedWords] = useState(shuffle(content.words));
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  // Feedback color
  const feedbackColor =
    isCorrect === true
      ? "text-green-600"
      : isCorrect === false
      ? "text-red-600"
      : "text-[--logo-color]";

  // Feedback auto-reset
  useEffect(() => {
    if (isChecking) {
      const timeout = setTimeout(() => {
        setShowFeedback(false);
        setIsCorrect(null);
        setSelectedIdx(null);
        setIsChecking(false);
        if (isCorrect) onCorrect?.();
        else onWrong?.();
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [isChecking, isCorrect, onCorrect, onWrong]);

  // Helper to shuffle array
  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Swap words
  function handleTileClick(idx) {
    if (showFeedback) return;
    if (selectedIdx === null) {
      setSelectedIdx(idx);
    } else if (selectedIdx !== idx) {
      const newArr = [...arrangedWords];
      [newArr[selectedIdx], newArr[idx]] = [newArr[idx], newArr[selectedIdx]];
      setArrangedWords(newArr);
      setSelectedIdx(null);
    } else {
      setSelectedIdx(null);
    }
  }

  // Reset
  function handleReset() {
    setArrangedWords(shuffle(content.words));
    setSelectedIdx(null);
    setShowFeedback(false);
    setIsCorrect(null);
  }

  // Check
  function handleCheck() {
    setShowFeedback(true);
    setIsCorrect(
      arrangedWords.join(" ") === content.correct_order.join(" ")
    );
    setIsChecking(true);
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
        className="text-base text-[--logo-color]/70 mb-6"
        style={{ ["--logo-color"]: LOGO_COLOR, fontFamily }}
      >
        {content.translation}
      </div>

      {/* Word tiles (Duolingo style) */}
      <div className="flex flex-wrap gap-3 justify-center mb-4">
        {arrangedWords.map((word, idx) => (
          <TileButton
            key={word + idx}
            selected={selectedIdx === idx}
            disabled={showFeedback}
            fontFamily={fontFamily}
            logoColor={LOGO_COLOR}
            onClick={() => handleTileClick(idx)}
          >
            {word}
          </TileButton>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-8 mt-6">
        <OutlinedButton
          onClick={handleReset}
          disabled={showFeedback}
          fontFamily={fontFamily}
          icon={<RefreshCw className="w-5 h-5" />}
        >
          Reset
        </OutlinedButton>
        <PrimaryButton
          onClick={handleCheck}
          disabled={showFeedback}
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