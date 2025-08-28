import DragAndDropSentenceContent from "@/components/lessons/DragAndDropSentenceContent";

export default function DragAndDropScreen() {
  // Dummy data
  const content = {
    correct_order: ["Ich", "liebe", "dich"],
    instruction: "Rearrange the sentence correctly",
    translation: "I love you",
    words: ["liebe", "Ich", "dich"],
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <DragAndDropSentenceContent
        content={content}
        onCorrect={() => {/* You can add a toast or alert here */}}
        onWrong={() => {/* You can add a toast or alert here */}}
      />
    </div>
  );
}