import React, { useState } from "react";
import styles from "./CreateModal.module.css";
import QuestionModal from "../QuestionModal/QuestionModal";

function CreateModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [quizName, setQuizName] = useState("");
  const [quizType, setQuizType] = useState("");

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
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

  return (
    <div className={styles.container}>
      {step === 1 && (
        <>
          <div className={styles.nameWrapper}>
            <input
              type="text"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              className={styles.quizName}
              placeholder="Quiz name"
            />
          </div>
          <div className={styles.typeWrapper}>
            <label className={styles.label}>Quiz Type</label>
            <button
              onClick={() => handleQuizTypeChange("Q&A")}
              className={quizType === "Q&A" ? styles.selected : styles.Btn}
            >
              Q & A
            </button>
            <button
              onClick={() => handleQuizTypeChange("Poll")}
              className={quizType === "Poll" ? styles.selected : styles.Btn}
            >
              Poll Type
            </button>
          </div>
          <div className={styles.buttonContainer}>
            <button onClick={handleCancel} className={styles.cancelBtn}>
              Cancel
            </button>
            <button onClick={handleContinue} className={styles.continueBtn}>
              Continue
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <QuestionModal
          quizType={quizType}
          quizName={quizName}
          onClose={onClose}
          nextStep={() => setStep(3)}
        />
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
