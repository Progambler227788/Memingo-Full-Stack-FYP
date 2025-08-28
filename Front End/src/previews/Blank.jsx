import { useState } from "react";
import FillInBlankContent from "@/components/lessons/FillInTheBlankContent"; // Make sure path is correct
import "@/styles/test.css"; // Import your CSS styles

export default function Blank() {
  const [progress, setProgress] = useState(40); // Initial dummy progress

  const content = {
    instruction: "Fill in the blank with the correct word:",
    sentence: "The quick brown ___ jumps over the lazy dog.",
    options: ["fox", "cat", "dog", "elephant"],
    correct_answer: "fox"
  };

  const handleCorrect = () => {
    console.log("Correct!");
    setProgress((prev) => Math.min(prev + 20, 100));
  };

  const handleWrong = () => {
    console.log("Incorrect!");
  };

    return (
    <div className="centered-container">
      <div className="centered-content">
        <h2>Loading Your Content</h2>
        <p>Please wait while we process your request...</p>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: '65%' }}></div>
        </div>
       <FillInBlankContent
          content={content}
          onCorrect={handleCorrect}
          onWrong={handleWrong}
        />
      </div>
      </div>
  );
};

  // return (
  //   <div className="page-container">
  //     {/* Progress Bar */}
  //     <div className="progress-bar">
  //       <div
  //         className="progress-fill"
  //         style={{ width: `${progress}%` }}
  //       ></div>
  //     </div>

  //     {/* Centered Content */}

  //   </div>
  // );

