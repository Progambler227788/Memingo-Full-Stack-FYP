import { useState, useRef, useEffect } from "react";
import { Volume2, HelpCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import FeedbackBurst from "./FeedBackBurst";

const LOGO_COLOR = "#256470";

// Browser TTS
function useTextToSpeech(language = "de-DE") {
  const synthRef = useRef(window.speechSynthesis);
  const utterRef = useRef(null);

  function speak(text) {
    if (synthRef.current.speaking) synthRef.current.cancel();
    utterRef.current = new window.SpeechSynthesisUtterance(text);
    utterRef.current.lang = language;
    synthRef.current.speak(utterRef.current);
  }

  useEffect(() => {
    return () => {
      synthRef.current.cancel();
    };
  }, []);

  return speak;
}

// Animated hint card (closeable)
function AnimatedHintCard({ explanation, showHint, onClose }) {
  if (!showHint) return null;
  return (
    <div
      className="w-full mt-4 mb-2 px-4 py-3 rounded-2xl border bg-white/80 border-[--logo-color] text-[--logo-color] text-base font-medium shadow transition relative cursor-pointer"
      style={{ ["--logo-color"]: LOGO_COLOR }}
      onClick={onClose}
      title="Close hint"
    >
      <X className="absolute top-2 right-2 w-4 h-4 text-[--logo-color] opacity-60 hover:opacity-90 pointer-events-none" />
      <span className="font-semibold">Hint:</span> {explanation}
    </div>
  );
}

function OptionButton({
  text,
  isSelected,
  isCorrect,
  correctAnswer,
  onClick,
  fontFamily,
  style,
  disabled
}) {
  let bg, border, color;
  if (!isSelected) {
    bg = "white";
    border = LOGO_COLOR;
    color = LOGO_COLOR;
  } else if (isSelected && isCorrect === true) {
    bg = "#4CAF50";
    border = "#4CAF50";
    color = "white";
  } else if (isSelected && isCorrect === false) {
    bg = "#D32F2F";
    border = "#D32F2F";
    color = "white";
  } else {
    bg = LOGO_COLOR;
    border = LOGO_COLOR;
    color = "white";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "w-full rounded-xl px-4 py-3 font-semibold text-base shadow-md transition-all",
        "border-2 focus:outline-none",
        !isSelected && "hover:bg-[--logo-color]/10 hover:border-[--logo-color] hover:text-[--logo-color]",
        "focus:ring-0 focus:border-[--logo-color]"
      )}
      style={{
        background: bg,
        borderColor: border,
        color,
        fontFamily,
        minWidth: 80,
        boxShadow: isSelected ? "0 4px 18px -4px rgba(37,100,112,0.09)" : undefined,
        ...style,
      }}
    >
      {text}
    </button>
  );
}

export default function ListenAndSelectContent({
  content,
  language = "de-DE",
  explanation = "",
  onCorrect,
  onWrong,
  fontFamily = "Inter, sans-serif",
}) {
  const speak = useTextToSpeech(language);

  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // Sound button pulse (CSS animation, smoother)
  const [soundPulseKey, setSoundPulseKey] = useState(0);
  useEffect(() => {
    setSoundPulseKey((k) => k + 1);
  }, []);

  // Feedback color
  let feedbackColor = isCorrect === true ? "#4CAF50" : isCorrect === false ? "#D32F2F" : LOGO_COLOR;

  // Show hint button is always visible if not answered correctly
  function renderOptions() {
    const disabled = isCorrect === true;
    if (content.options.length === 2) {
      return (
        <div className="flex flex-row gap-3 w-full mt-4">
          {content.options.map((opt) => (
            <OptionButton
              key={opt}
              text={opt}
              isSelected={selected === opt}
              isCorrect={isCorrect}
              correctAnswer={content.correct_answer}
              onClick={() => {
                setSelected(opt);
                const correct = opt === content.correct_answer;
                setIsCorrect(correct);
                if (correct) {
                  setTimeout(() => {
                    onCorrect?.();
                  }, 1000);
                }
                else {
                    setTimeout(() => {
                    onWrong?.();
                    }, 1000);
                }
              }}
              fontFamily={fontFamily}
              disabled={disabled}
              style={{}}
            />
          ))}
        </div>
      );
    }
    if (content.options.length === 4) {
      return (
        <div className="flex flex-col gap-3 w-full mt-4">
          <div className="flex flex-row gap-3 w-full">
            {content.options.slice(0, 2).map((opt) => (
              <OptionButton
                key={opt}
                text={opt}
                isSelected={selected === opt}
                isCorrect={isCorrect}
                correctAnswer={content.correct_answer}
                onClick={() => {
                  setSelected(opt);
                  const correct = opt === content.correct_answer;
                  setIsCorrect(correct);
                   if (correct) {
                    // Delay to show feedback
                    setTimeout(() => {
                      onCorrect?.();
                    }, 2000); // 1s delay, adjust as needed
                  }
                  else {
                    setTimeout(() => {
                    onWrong?.();
                    }, 1000);
                }
                }}
                fontFamily={fontFamily}
                disabled={disabled}
                style={{}}
              />
            ))}
          </div>
          <div className="flex flex-row gap-3 w-full">
            {content.options.slice(2, 4).map((opt) => (
              <OptionButton
                key={opt}
                text={opt}
                isSelected={selected === opt}
                isCorrect={isCorrect}
                correctAnswer={content.correct_answer}
                onClick={() => {
                  setSelected(opt);
                  const correct = opt === content.correct_answer;
                  setIsCorrect(correct);
                  if (correct) {
                    // Delay to show feedback
                    setTimeout(() => {
                      onCorrect?.();
                    }, 2000); // 1s delay, adjust as needed
                  }
                  else {
                    setTimeout(() => {
                    onWrong?.();
                    }, 1000);
                }
                }}
                fontFamily={fontFamily}
                disabled={disabled}
                style={{}}
              />
            ))}
          </div>
        </div>
      );
    }
    // Column otherwise
    return (
      <div className="flex flex-col gap-3 w-full mt-4">
        {content.options.map((opt) => (
          <OptionButton
            key={opt}
            text={opt}
            isSelected={selected === opt}
            isCorrect={isCorrect}
            correctAnswer={content.correct_answer}
            onClick={() => {
              setSelected(opt);
              const correct = opt === content.correct_answer;
              setIsCorrect(correct);
              if (correct) {
                // Delay to show feedback
                setTimeout(() => {
                  onCorrect?.();
                }, 2000); // 1s delay, adjust as needed
              }
              else onWrong?.();
            }}
            fontFamily={fontFamily}
            disabled={disabled}
            style={{}}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-xl mx-auto p-6 rounded-3xl bg-white/80 shadow-xl border border-neutral-200"
      style={{ fontFamily }}
    >
      {/* Instruction */}
      <h2 className="text-xl font-bold mb-3" style={{ color: LOGO_COLOR, fontFamily }}>
        {content.instruction}
      </h2>

      {/* Sound button */}
      <div className="flex flex-col items-center mb-2">
        <button
          type="button"
          key={soundPulseKey}
          className="flex items-center justify-center rounded-full transition-all animate-pulse-sound border-2"
          style={{
            width: 56,
            height: 56,
            background: `${LOGO_COLOR}1A`,
            borderColor: LOGO_COLOR,
            outline: "none",
          }}
          onClick={() => speak(content.correct_answer)}
          tabIndex={0}
          aria-label="Play sound"
        >
          <Volume2
            className="w-8 h-8"
            color={LOGO_COLOR}
            style={{ pointerEvents: "none" }}
          />
        </button>
      </div>

      

      {/* Show Hint Button */}
      {(!isCorrect || isCorrect === null) && (
        <div className="flex justify-center w-full">
          {!showHint && (
            <button
              type="button"
              className={clsx(
                "flex items-center gap-2 px-4 py-2 mt-1 rounded-2xl border-2 font-medium bg-white transition",
                "text-[--logo-color]",
                "border-[--logo-color]",
                "hover:bg-[--logo-color]/10 hover:border-[--logo-color] hover:text-[--logo-color]",
                "focus:outline-none focus:ring-0 focus:border-[--logo-color]"
              )}
              style={{
                ["--logo-color"]: LOGO_COLOR,
                fontFamily,
              }}
              onClick={() => setShowHint(true)}
              tabIndex={0}
            >
              <HelpCircle className="w-5 h-5" color={LOGO_COLOR} />
              Show Hint
            </button>
          )}
        </div>
      )}

       {/* Feedback */}
      <AnimatePresence>
        {selected!=null && isCorrect !== null && (
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
              percent={isCorrect ? 100 : 0} //  100% for correct, 0% for incorrect
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated hint card (closeable) */}
      <AnimatedHintCard
        explanation={explanation}
        showHint={showHint}
        onClose={() => setShowHint(false)}
      />

      {/* Options */}
      {renderOptions()}

      {/* Custom CSS for sound pulse */}
      <style jsx>{`
        .animate-pulse-sound {
          animation: pulse-sound 1.1s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
        }
        @keyframes pulse-sound {
          0% { transform: scale(1); }
          100% { transform: scale(1.13); }
        }
        button[aria-label="Play sound"]:focus {
          outline: none !important;
          border-color: ${LOGO_COLOR} !important;
          box-shadow: 0 0 0 2px ${LOGO_COLOR}33;
        }
      `}</style>
    </div>
  );
}