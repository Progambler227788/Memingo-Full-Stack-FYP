import * as RadioGroup from "@radix-ui/react-radio-group";
import { CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import clsx from "clsx";
import FeedbackBurst from "./FeedBackBurst";


// Brand color as in your Kotlin code
const LOGO_COLOR = "#256470";

export default function MultipleChoiceContent({
  content,
  onCorrect,
  onWrong,
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
        : "text-neutral-700";

  // Handle feedback timeout and callback
  useEffect(() => {
    if (isChecking) {
      const timeout = setTimeout(() => {
        setSelected(null);
        setIsChecking(false);
        if (isCorrect) {
          setTimeout(() => {
            onCorrect?.();
          }, 1000); // 1s delay, adjust as needed}
        }
        else onWrong?.();

        setIsCorrect(null);
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [isChecking, isCorrect, onCorrect, onWrong]);

  return (
    <div className="w-full max-w-xl mx-auto p-6 rounded-3xl bg-white/80 shadow-xl border border-neutral-200">
      {/* Instruction */}
      <h2
        className="text-xl font-bold mb-1"
        style={{ color: LOGO_COLOR }}
      >
        {content.instruction}
      </h2>
      {/* Question */}
      {content.question && (
        <div
          className="text-lg font-semibold mb-6"
          style={{ color: LOGO_COLOR }}
        >
          {content.question}
        </div>
      )}

      {/* Options */}
      <RadioGroup.Root
        className="flex flex-col gap-3"
        value={selected ?? ""}
        onValueChange={(v) => setSelected(v)}
        disabled={isCorrect !== null}
      >
        {content.options.map((option) => {
          const chosen = selected === option;
          let border =
            chosen && isCorrect === true
              ? "border-green-500"
              : chosen && isCorrect === false
                ? "border-red-500"
                : chosen
                  ? "border-[2px] border-[--logo-color]"
                  : "border border-neutral-300";
          let bg =
            chosen && isCorrect === true
              ? "bg-green-50"
              : chosen && isCorrect === false
                ? "bg-red-50"
                : chosen
                  ? "bg-[rgba(37,100,112,0.08)]"
                  : "bg-white";

          return (
            <RadioGroup.Item
              key={option}
              value={option}
              disabled={isCorrect !== null}
              className={clsx(
                "flex items-center px-5 py-3 rounded-xl transition-colors relative select-none cursor-pointer group",
                border,
                bg,
                "focus:outline-none focus:ring-2 focus:ring-[--logo-color] focus:ring-offset-2"
              )}
              style={{
                "--logo-color": LOGO_COLOR,
                boxShadow: chosen ? "0 2px 8px 0 rgba(37,100,112,0.11)" : undefined,
              }}
            >
              <span
                className={clsx(
                  "text-base font-medium flex-1",
                  chosen ? "text-[--logo-color]" : "text-neutral-700"
                )}
              >
                {option}
              </span>
              {/* Show check/cross icon if checked */}
              {chosen && isCorrect !== null && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="ml-2"
                >
                  {isCorrect ? (
                    <CheckCircle className="text-green-600" size={22} />
                  ) : (
                    <XCircle className="text-red-600" size={22} />
                  )}
                </motion.span>
              )}
            </RadioGroup.Item>
          );
        })}
      </RadioGroup.Root>

      {/* Check Button */}
      <div className="flex justify-center mt-8">
        <button
          type="button"
          disabled={!selected || isCorrect !== null}
          onClick={() => {
            setIsCorrect(selected === content.correct_answer);
            setIsChecking(true);
          }}
          className={clsx(
            "inline-flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-colors text-white shadow-lg",
            "bg-[--logo-color] hover:bg-[--logo-color]/90 focus:outline-none focus:ring-2 focus:ring-[--logo-color]",
            (!selected || isCorrect !== null) && "opacity-50 pointer-events-none"
          )}
          style={{
            "--logo-color": LOGO_COLOR,
          }}
        >
          <CheckCircle className="w-5 h-5" />
          Check
        </button>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {isCorrect !== null && (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="text-center mt-8"
          >
            
            <div className={clsx("text-base", feedbackColor, "opacity-80")}>
              {content.explanation}
            </div>
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