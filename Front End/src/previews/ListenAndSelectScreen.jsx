import ListenAndSelectContent from "@/components/lessons/ListenAndSelectContent";

const dummyContent = {
  instruction: "Listen and select the correct translation",
  correct_answer: "Hallo",
  options: ["Hallo", "Tschüss", "Danke", "Bitte"]
};

const explanation = "‘Hallo’ means ‘Hello’ in German. It's a common greeting.";

export default function ListenAndSelectScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <ListenAndSelectContent
        content={dummyContent}
        explanation={explanation}
        language="de-DE"
        onCorrect={() => alert("Correct!")}
        onWrong={() => alert("Try again!")}
        fontFamily="Inter, sans-serif"
      />
    </div>
  );
}