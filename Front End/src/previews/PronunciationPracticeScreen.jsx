import PronunciationPracticeContent from "@/components/lessons/PronunciationPracticeContent";

const dummyWord = {
  word: "Hallo",
  phonetic: "ha-lo",
  meaning: "Hello (greeting in German)"
};

export default function PronunciationPracticeScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <PronunciationPracticeContent
        word={dummyWord}
        language="de-DE"
        onCorrect={() => alert("Correct!")}
        onWrong={() => alert("Try again!")}
        fontFamily="Inter, sans-serif"
      />
    </div>
  );
}