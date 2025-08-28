import TypeTranslationContent from "@/components/lessons/TypeTranslationContent";

const dummyContent = {
  correct_answer: "Ich liebe dich",
  alternative_answers: ["Ich hab dich lieb", "Ich mag dich"],
  english_text: "I love you",
  hints: ["Ich", "liebe", "dich"],
  instruction: "Type the correct German sentence"
};

export default function TypingTranslationScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <TypeTranslationContent
        content={dummyContent}
        onCorrect={() => alert("Correct!")}
        onWrong={() => alert("Try again!")}
        fontFamily="Inter, sans-serif"
      />
    </div>
  );
}