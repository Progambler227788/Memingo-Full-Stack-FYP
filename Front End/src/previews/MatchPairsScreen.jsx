import MatchPairsContent from "@/components/lessons/MatchPairsContent";

const dummyContent = {
  instruction: "Match the English words with their German translations",
  pairs: [
    { english: "Hello", german: "Hallo" },
    { english: "Goodbye", german: "Tschüss" },
    { english: "Thank you", german: "Danke" },
    { english: "Please", german: "Bitte" }
  ]
};

export default function MatchPairsScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <MatchPairsContent
        content={dummyContent}
        onCorrect={() => alert("Correct!")}
        onWrong={() => alert("Try again!")}
        fontFamily="Inter, sans-serif"
      />
    </div>
  );
}