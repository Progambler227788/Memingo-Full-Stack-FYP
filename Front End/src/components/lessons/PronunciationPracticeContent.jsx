import { useState, useRef, useEffect } from "react";
import { Volume2, Mic } from "lucide-react";
import FeedbackBurst from "./FeedBackBurst";
import clsx from "clsx";

const LOGO_COLOR = "#256470";

/**
 * Uses browser SpeechSynthesis for TTS.
 * @param {string} language (Ex: 'de-DE')
 */
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

/**
 * Uses browser SpeechRecognition (Web Speech API).
 * Returns { listening, transcript, error, start, stop }
 * Only works in Chrome and some Edge.
 */
function useSpeechRecognition(language = "de-DE") {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.lang = language;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onresult = (event) => {
      if (event.results.length > 0) {
        setTranscript(event.results[0][0].transcript);
      }
      setListening(false);
    };
    recognitionRef.current.onerror = (event) => {
      setError(event.error);
      setListening(false);
    };
    recognitionRef.current.onend = () => {
      setListening(false);
    };
    // eslint-disable-next-line
  }, [language]);

  function start() {
    setTranscript("");
    setError(null);
    setListening(true);
    try {
      recognitionRef.current && recognitionRef.current.start();
    } catch (e) {
      setError("Speech recognition error.");
      setListening(false);
    }
  }
  function stop() {
    recognitionRef.current && recognitionRef.current.stop();
    setListening(false);
  }

  return { listening, transcript, error, start, stop, setTranscript };
}

function getWordAccuracy(spoken, wordObj) {
  if (!spoken) return { percent: 0, correctWordList: [] };
  const spokenWords = spoken.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const correctWords = wordObj.word.trim().toLowerCase().split(/\s+/).filter(Boolean);
  let matched = 0;
  // Count how many words in spoken match any in correctWords (order independent)
  for (const word of spokenWords) {
    if (correctWords.includes(word)) matched++;
  }
  const percent = correctWords.length > 0 ? Math.round((matched / correctWords.length) * 100) : 0;
  return { percent, correctWordList: correctWords, matched };
}

export default function PronunciationPracticeContent({
  word,
  language = "de-DE",
  onCorrect,
  onWrong,
  fontFamily = "Inter, sans-serif"
}) {
  const speak = useTextToSpeech(language);
  const {
    listening,
    transcript,
    error,
    start,
    stop,
    setTranscript
  } = useSpeechRecognition(language);

  const [showMicFeedback, setShowMicFeedback] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Pulse animation for sound button using CSS
  const [soundPulseKey, setSoundPulseKey] = useState(0);
  useEffect(() => {
    setSoundPulseKey((k) => k + 1);
  }, []);

  // Feedback logic
  useEffect(() => {
    if (transcript && showMicFeedback) {
      setIsChecking(true);
      const { percent } = getWordAccuracy(transcript, word);
      const timer = setTimeout(() => {
        setShowMicFeedback(false);
        setIsChecking(false);
        setTranscript(""); // reset speech
        if (percent >= 60) {
          onCorrect?.();
        } else {
          onWrong?.();
        }
      }, 1200);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line
  }, [transcript, showMicFeedback]);

  // Always show feedback if transcript exists after listening ends
  useEffect(() => {
    if (transcript && !listening) {
      setShowMicFeedback(true);
    }
  }, [transcript, listening]);

  const { percent } = getWordAccuracy(transcript, word);
  const isCorrect = percent >= 60;

  return (
    <div
      className="w-full max-w-xl mx-auto p-6 rounded-3xl bg-white/80 shadow-xl border border-neutral-200"
      style={{ fontFamily }}
    >
      <h2 className="text-xl font-bold mb-1" style={{ color: LOGO_COLOR }}>
        Say: {word.word}
        {word.phonetic ? (
          <span className="ml-2 font-light text-base text-[--logo-color]/70" style={{ ["--logo-color"]: LOGO_COLOR }}>
            ({word.phonetic})
          </span>
        ) : null}
      </h2>
      <div
        className="text-base text-[--logo-color]/80 mb-5"
        style={{ ["--logo-color"]: LOGO_COLOR }}
      >
        Meaning: {word.meaning}
      </div>

      {/* Listen (TTS) button */}
      <div className="flex flex-col items-center mb-4">
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
          onClick={() => speak(word.word)}
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

      {/* Speak Button */}
      <div className="flex flex-col items-center mb-4">
        <button
          type="button"
          disabled={listening}
          className={clsx(
            "flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-base shadow-md transition-all",
            "border-2 border-[--logo-color] bg-[--logo-color] text-white",
            "hover:opacity-90 focus:outline-none focus:ring-0 focus:border-[--logo-color]",
            listening && "opacity-60"
          )}
          style={{
            ["--logo-color"]: LOGO_COLOR,
            fontFamily,
            minWidth: 120,
          }}
          onClick={start}
        >
          <Mic className="w-5 h-5" />
          {listening ? "Listening..." : "Speak"}
        </button>
      </div>

      {/* Feedback */}
      
      {(
        <FeedbackBurst
        show={showMicFeedback}
        isCorrect={isCorrect}
        transcript={transcript}
        percent={percent}
      />
      )}
      {error && (
        <div className="text-red-600 text-sm mt-3">
          {error === "not-allowed"
            ? "Microphone access denied."
            : "Speech recognition error. Try again!"}
        </div>
      )}

      {/* Custom CSS for sound pulse */}
      <style jsx>{`
        .animate-pulse-sound {
          animation: pulse-sound 1.15s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
        }
        @keyframes pulse-sound {
          0% { transform: scale(1); }
          100% { transform: scale(1.12); }
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