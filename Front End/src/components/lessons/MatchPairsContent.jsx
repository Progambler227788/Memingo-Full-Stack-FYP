import { useState, useMemo, useEffect } from "react";
import { RefreshCw, CheckCircle } from "lucide-react";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import OutlinedButton from "@/components/buttons/OutlinedButton";
import clsx from "clsx";
import FeedbackBurst from "./FeedBackBurst";

// --- PAIR HIGHLIGHT COLORS ---
const pairHighlightColors = [
  "#7BB6FF",
  "#FFB870",
  "#6EE7B7",
  "#FFB7CE",
  "#FFF07F",
  "#B5A0FF",
  "#FFA6A0",
  "#80FFD8"
];

const LOGO_COLOR = "#256470";

// --- SINGLE WORD COLUMN (for English or German/Target) ---
function WordColumn({
  words,
  selectedIdx,
  matchedIdxs,
  getColorIndex,
  otherSelectionActive,
  onSelect,
  isEnglish,
  fontFamily = "Inter, sans-serif"
}) {
  return (
    <div className={clsx("flex flex-col", isEnglish ? "items-end" : "items-start")}>
      {words.map((word, idx) => {
        const matchedColorIdx = getColorIndex(idx);
        const selected = selectedIdx === idx;
        const isMatched = matchedIdxs.has(idx);
        const highlightColor = matchedColorIdx !== null && matchedColorIdx !== undefined
          ? pairHighlightColors[matchedColorIdx % pairHighlightColors.length]
          : LOGO_COLOR;

        const bgColor = isMatched
          ? highlightColor
          : selected
          ? LOGO_COLOR
          : "#fff";
        const textColor = isMatched || selected ? "#fff" : LOGO_COLOR;
        return (
          <button
            key={word + idx}
            type="button"
            disabled={
              isMatched ||
              (isEnglish ? !otherSelectionActive : !otherSelectionActive) // disables unless pairing
            }
            onClick={() => onSelect(idx)}
            className={clsx(
              "transition-all rounded-[14px] border-2 shadow-sm w-full font-semibold text-base",
              "mb-2 px-5 py-3",
              selected
                ? "ring-2 ring-[--logo-color] border-[--logo-color]"
                : "border-[--logo-color]/30",
              isMatched && "pointer-events-none opacity-70",
              !isMatched && !selected && "hover:bg-[--logo-color]/10"
            )}
            style={{
              background: bgColor,
              color: textColor,
              borderColor: LOGO_COLOR,
              fontFamily,
              marginLeft: 8,
              marginRight: 8,
              minWidth: 44,
            }}
          >
            {word}
          </button>
        );
      })}
    </div>
  );
}

// --- MAIN MATCH PAIRS LOGIC ---
export default function MatchPairsContent({
  content,
  onCorrect,
  onWrong,
  fontFamily = "Inter, sans-serif"
}) {
  const pairs = content.pairs;
  const englishWords = useMemo(() => pairs.map((x) => x.english), [pairs]);
  const germanWordsInit = useMemo(
    () =>
      pairs.map((x) => x.german ?? x.spanish ?? x.italian ?? "").sort(() => Math.random() - 0.5),
    [pairs]
  );
  const [germanWords, setGermanWords] = useState(germanWordsInit);
  const [selectedEnglishIdx, setSelectedEnglishIdx] = useState(null);
  const [selectedGermanIdx, setSelectedGermanIdx] = useState(null);
  // matchedPairs: [{englishIdx, germanIdx, colorIdx}]
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [feedback, setFeedback] = useState({ isCorrect: null, isChecking: false });

  // For coloring and disables
  function getPairColorIndex({ englishIdx, germanIdx }) {
    const found = matchedPairs.find(
      (triple) =>
        (englishIdx !== undefined && triple.englishIdx === englishIdx) ||
        (germanIdx !== undefined && triple.germanIdx === germanIdx)
    );
    return found ? found.colorIdx : null;
  }

  // Handle matching
  function handleEnglishSelect(idx) {
    setSelectedEnglishIdx(idx === selectedEnglishIdx ? null : idx);
  }
  function handleGermanSelect(idx) {
    setSelectedGermanIdx(idx);
    if (selectedEnglishIdx !== null) {
      // Find if this is a correct match (by value, not by shuffled index)
      const eng = englishWords[selectedEnglishIdx];
      const ger = germanWords[idx];
      const correct = pairs.some(
        (pair) =>
          pair.english === eng &&
          [pair.german, pair.spanish, pair.italian].filter(Boolean).includes(ger)
      );
      const colorIdx = matchedPairs.length % pairHighlightColors.length;
      setMatchedPairs([
        ...matchedPairs,
        { englishIdx: selectedEnglishIdx, germanIdx: idx, colorIdx }
      ]);
      setSelectedEnglishIdx(null);
      setSelectedGermanIdx(null);
    }
  }

  // Handle reset
  function handleReset() {
    setGermanWords((words) => words.sort(() => Math.random() - 0.5));
    setMatchedPairs([]);
    setSelectedEnglishIdx(null);
    setSelectedGermanIdx(null);
    setFeedback({ isCorrect: null, isChecking: false });
  }

  // Handle check
  function handleCheck() {
    const correct =
      matchedPairs.length === pairs.length &&
      matchedPairs.every(({ englishIdx, germanIdx }) => {
        const pair = pairs[englishIdx];
        const target = germanWords[germanIdx];
        return (
          [pair.german, pair.spanish, pair.italian].filter(Boolean).includes(target)
        );
      });
    setFeedback({ isCorrect: correct, isChecking: true });
  }

  // Feedback/auto-reset effect
  useEffect(() => {
    if (feedback.isChecking) {
      const timeout = setTimeout(() => {
        setMatchedPairs([]);
        setSelectedEnglishIdx(null);
        setSelectedGermanIdx(null);
        if (feedback.isCorrect) onCorrect?.();
        else onWrong?.();
        setFeedback({ isCorrect: null, isChecking: false });
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [feedback, onCorrect, onWrong]);

  // Matched index sets for disables (for columns)
  const matchedEnglish = new Set(matchedPairs.map((x) => x.englishIdx));
  const matchedGerman = new Set(matchedPairs.map((x) => x.germanIdx));

  // Feedback color
  const feedbackColor =
    feedback.isCorrect === true
      ? "text-green-600"
      : feedback.isCorrect === false
      ? "text-red-600"
      : "text-[--logo-color]";

  return (
    <div
      className="w-full max-w-3xl mx-auto p-6 rounded-3xl bg-white/80 shadow-xl border border-neutral-200"
      style={{ fontFamily }}
    >
      <h2 className="text-xl font-bold mb-2" style={{ color: LOGO_COLOR }}>
        {content.instruction}
      </h2>

      <div className="flex flex-row w-full justify-between gap-3 mt-6">
        {/* English column */}
        <WordColumn
          words={englishWords}
          selectedIdx={selectedEnglishIdx}
          matchedIdxs={matchedEnglish}
          getColorIndex={(engIdx) => getPairColorIndex({ englishIdx: engIdx })}
          otherSelectionActive={selectedGermanIdx == null}
          onSelect={handleEnglishSelect}
          isEnglish={true}
          fontFamily={fontFamily}
        />
        {/* German column */}
        <WordColumn
          words={germanWords}
          selectedIdx={selectedGermanIdx}
          matchedIdxs={matchedGerman}
          getColorIndex={(gerIdx) => getPairColorIndex({ germanIdx: gerIdx })}
          otherSelectionActive={selectedEnglishIdx != null}
          onSelect={handleGermanSelect}
          isEnglish={false}
          fontFamily={fontFamily}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-8 mt-8">
        <OutlinedButton
          onClick={handleReset}
          fontFamily={fontFamily}
          icon={<RefreshCw className="w-5 h-5" />}
        >
          Reset
        </OutlinedButton>
        <PrimaryButton
          onClick={handleCheck}
          disabled={matchedPairs.length !== pairs.length || feedback.isCorrect !== null}
          fontFamily={fontFamily}
          icon={<CheckCircle className="w-5 h-5" />}
        >
          Check
        </PrimaryButton>
      </div>

      {/* Feedback */}
      {feedback.isCorrect !== null && (
        <FeedbackBurst
          isCorrect={feedback.isCorrect}
          show={true}
          percent={feedback.isCorrect ? 100 : 0} // Assuming 100% for correct, 0% for incorrect
        />
      )}
    </div>
  );
}