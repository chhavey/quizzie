import React, { useState } from "react";
import styles from "./CreateModal.module.css";

function CreateModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [quizName, setQuizName] = useState("");
  const [quizType, setQuizType] = useState("");
  const [questionData, setQuestionData] = useState([
    {
      question: "",
      optionType: "text",
      options: ["", ""],
      timer: "off",
    },
  ]);

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      // Save and share quiz link
      onClose();
    }
  };

  const handleCancel = () => {
    setStep(1);
    onClose();
  };

  const handleQuizTypeChange = (type) => {
    setQuizType(type);
  };

  const handleAddQuestion = () => {
    if (questionData.length < 5) {
      setQuestionData((prevData) => [
        ...prevData,
        {
          question: "",
          optionType: "text",
          options: ["", ""],
          timer: "off",
        },
      ]);
    }
  };

  const handleRemoveQuestion = (index) => {
    setQuestionData((prevData) => {
      const newData = [...prevData];
      newData.splice(index, 1);
      return newData;
    });
  };

  const handleAddOption = (questionIndex) => {
    if (questionData[questionIndex].options.length < 4) {
      setQuestionData((prevData) => {
        const newData = [...prevData];
        newData[questionIndex].options.push("");
        return newData;
      });
    }
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    setQuestionData((prevData) => {
      const newData = [...prevData];
      newData[questionIndex].options.splice(optionIndex, 1);
      return newData;
    });
  };

  const handleQuestionChange = (index, fieldName, value) => {
    setQuestionData((prevData) => {
      const newData = [...prevData];
      newData[index][fieldName] = value;
      return newData;
    });
  };

  return (
    <div className={styles.container}>
      {step === 1 && (
        <>
          <div>
            <label>Enter Quiz Name:</label>
            <input
              type="text"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
            />
          </div>
          <div>
            <label>Choose Quiz Type:</label>
            <button
              onClick={() => handleQuizTypeChange("Q&A")}
              className={quizType === "Q&A" ? styles.selected : ""}
            >
              Q&A
            </button>
            <button
              onClick={() => handleQuizTypeChange("Poll")}
              className={quizType === "Poll" ? styles.selected : ""}
            >
              Poll
            </button>
          </div>
          <div className={styles.buttonContainer}>
            <button onClick={handleCancel}>Cancel</button>
            <button onClick={handleContinue}>Continue</button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          {questionData.map((question, index) => (
            <div key={index}>
              <label>{`Question ${index + 1}:`}</label>
              <input
                type="text"
                value={question.question}
                onChange={(e) =>
                  handleQuestionChange(index, "question", e.target.value)
                }
              />
              <label>Option Type:</label>
              <select
                value={question.optionType}
                onChange={(e) =>
                  handleQuestionChange(index, "optionType", e.target.value)
                }
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
                <option value="text-image">Text and Image</option>
              </select>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) =>
                      handleQuestionChange(
                        index,
                        "options",
                        e.target.value,
                        optionIndex
                      )
                    }
                  />
                  {question.options.length > 2 && (
                    <button
                      onClick={() => handleRemoveOption(index, optionIndex)}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
              {question.options.length < 4 && (
                <button onClick={() => handleAddOption(index)}>
                  Add Option
                </button>
              )}
              {index > 0 && (
                <button onClick={() => handleRemoveQuestion(index)}>
                  🗑️ Remove Question
                </button>
              )}
            </div>
          ))}
          <div className={styles.buttonContainer}>
            <button onClick={handleCancel}>Cancel</button>
            <button onClick={handleContinue}>Continue</button>
          </div>
          <button onClick={handleAddQuestion}>+</button>
        </>
      )}

      {step === 3 && (
        <>
          <div>
            <p>Yay! Your quiz is created.</p>
          </div>
          <div className={styles.buttonContainer}>
            <button onClick={onClose}>OK</button>
          </div>
        </>
      )}
    </div>
  );
}

export default CreateModal;
