import SentenceBuilderContent from "@/components/lessons/SentenceBuilderContent";

const dummyContent = {
  correct_order: ["Ich", "liebe", "dich"],
  instruction: "Arrange the sentence correctly",
  translation: "I love you",
  words: ["liebe", "Ich", "dich"]
};

export default function SentenceBuilderScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <SentenceBuilderContent
        content={dummyContent}
        onCorrect={() => alert("Correct!")}
        onWrong={() => alert("Try again!")}
        fontFamily="Inter, sans-serif"
      />
    </div>
  );
}