import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import OptionChipButton from "@/components/buttons/OptionChipButton";
import clsx from "clsx";
import FeedbackBurst from "./FeedBackBurst";

const LOGO_COLOR = "#256470";

export default function FillInBlankContent({
  content,
  onCorrect,
  onWrong,
  fontFamily = "Inter, sans-serif"
}) {
  const [selected, setSelected] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  // Feedback color
  const feedbackColor =
    isCorrect === true
      ? "text-green-600"
      : isCorrect === false
        ? "text-red-600"
        : "text-[--logo-color]";

  // Feedback auto-reset effect
  useEffect(() => {
    if (isChecking) {
      const timeout = setTimeout(() => {
        setSelected(null);
        setIsChecking(false);
        if (isCorrect) onCorrect?.();
        else onWrong?.();
        setIsCorrect(null);
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [isChecking, isCorrect, onCorrect, onWrong]);

  // Sentence split for the blank
  const parts = content.sentence.split("___");

  return (
    <div
      className="w-full max-w-xl mx-auto p-6 rounded-3xl bg-white/80 shadow-xl border border-neutral-200"
      style={{ fontFamily }}
    >
      {/* Instruction */}
      <h2 className="text-xl font-bold mb-2" style={{ color: LOGO_COLOR, fontFamily }}>
        {content.instruction}
      </h2>

      {/* Sentence with blank */}
      <div className="flex items-center justify-center text-lg font-semibold mb-7">
        <span style={{ fontFamily }}>{parts[0]}</span>
        <span
          className={clsx(
            "mx-2 rounded-[10px] border-2 transition-colors px-4 py-2 min-w-[60px] text-center",
            selected
              ? "border-[--logo-color] bg-[--logo-color]/10"
              : "border-[--logo-color]/40 bg-white"
          )}
          style={{
            ["--logo-color"]: LOGO_COLOR,
            fontFamily,
            fontWeight: 700
          }}
        >
          {selected || "___"}
        </span>
        {parts.length > 1 && <span style={{ fontFamily }}>{parts[1]}</span>}
      </div>

      {/* Option chips */}
      <div className="flex flex-row flex-wrap gap-4 justify-center mb-6">
        {content.options.map((option) => (
          <OptionChipButton
            key={option}
            selected={option === selected}
            disabled={isCorrect !== null}
            onClick={() => setSelected(option)}
            fontFamily={fontFamily}
            logoColor={LOGO_COLOR}
          >
            {option}
          </OptionChipButton>
        ))}
      </div>

      {/* Check Button */}
      <div className="flex justify-center mt-4">
        <PrimaryButton
          onClick={() => {
            setIsCorrect(selected === content.correct_answer);
            setIsChecking(true);
          }}
          disabled={!selected || isCorrect !== null}
          fontFamily={fontFamily}
          icon={<CheckCircle className="w-5 h-5" />}
        >
          Check
        </PrimaryButton>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {isCorrect !== null && (
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