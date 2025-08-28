import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const correctEmojis = ["🎉", "👏", "✅", "🔥", "🌟", "🎯"];
const wrongEmojis = ["❌", "😓", "🤔", "🙈", "🧐"];
const correctSound = new Audio("/sounds/correctSound.mp3");
const wrongSound = new Audio("/sounds/tryAgain.mp3");

export default function FeedbackBurst({ isCorrect, transcript, percent = 0, show = false }) {
  const [burstEmojis, setBurstEmojis] = useState([]);

  useEffect(() => {
  if (!show) return;

  // Play sound based on correctness
  if (isCorrect === true) {
    correctSound.currentTime = 0;
    correctSound.play().catch(console.error);
  } else if (isCorrect === false) {
    wrongSound.currentTime = 0;
    wrongSound.play().catch(console.error);
  }

  // Trigger emoji burst only if correct
  if (isCorrect) {
    const burst = Array.from({ length: 8 }, () =>
      correctEmojis[Math.floor(Math.random() * correctEmojis.length)]
    );
    setBurstEmojis(burst);
    const timeout = setTimeout(() => setBurstEmojis([]), 1000);
    return () => clearTimeout(timeout);
  }
}, [show]); // 🔁 Only depend on `show`

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="flex flex-col items-center relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Emoji Burst Animation */}
          <div className="absolute -top-6 pointer-events-none">
            {burstEmojis.map((emoji, index) => (
              <motion.span
                key={index}
                className="text-2xl absolute"
                initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                animate={{
                  x: Math.random() * 100 - 50,
                  y: Math.random() * -60 - 20,
                  opacity: 0,
                  rotate: Math.random() * 360,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>

          {/* Optional Transcript Text */}
          {transcript && (
            <span className="text-base mb-1 opacity-90">
              You said: <span className="font-semibold">{transcript}</span>
            </span>
          )}

          {/* Result Text */}
          <motion.span
            className={`text-xl font-bold mt-1 ${
              isCorrect ? "text-green-600" : "text-red-600"
            }`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            {isCorrect
              ? `✅ Correct! (${percent}%)`
              : `❌ Try again (${percent}%)`}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
