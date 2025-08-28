import React from "react";
import MultipleChoiceContent from "@/components/lessons/MultipleChoiceContent";

const mcq = {
  instruction: "Choose the correct answer:",
  question: "What is the capital of France?",
  options: ["Berlin", "Paris", "Rome", "Madrid"],
  correct_answer: "Paris",
  explanation: "Paris is the capital and largest city of France.",
};

export default function Mcqs() {
  return (
    <MultipleChoiceContent
      content={mcq}
      onCorrect={() => {
        console.log("Correct!");
      }}
      onWrong={() => {
        console.log("Wrong!");
      }}
    />
  );
}
