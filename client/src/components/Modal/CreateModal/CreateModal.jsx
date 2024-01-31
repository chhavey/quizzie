import React, { useState } from "react";
import styles from "./CreateModal.module.css";
import QuestionModal from "../QuestionModal/QuestionModal";
import { ReactComponent as Close } from "../../../assets/Close.svg";
import copy from "clipboard-copy";
import { ToastContainer, toast } from "react-toastify";
import { Toaster, toast as hotToast } from "react-hot-toast";

function CreateModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [quizName, setQuizName] = useState("");
  const [quizType, setQuizType] = useState("");
  const [newQuizId, setNewQuizId] = useState(null);

  const handleGetNewId = (newId) => {
    setNewQuizId(newId);
  };

  const handleContinue = () => {
    if (step === 1) {
      if (!quizName.trim()) {
        hotToast.error(
          "Hold on! Every quiz needs a name. What will you call it?"
        );
        return;
      } else if (!quizType) {
        hotToast.error(
          "Oops! You forgot to choose a quiz type. Is it a Q&A or a Poll?"
        );
        return;
      }
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

  const handleShare = async (quizId) => {
    if (!quizId) {
      toast.error("Cannot copy link");
      return;
    }
    const path = `http://localhost:3000/quiz/${quizId}`; ///to be replaced with live url
    try {
      await copy(path);
      toast.success("Link copied to clipboard");
    } catch (error) {
      toast.error("Cannot copy link");
    }
  };

  return (
    <div className={styles.container}>
      <Toaster />
      {step === 1 && (
        <>
          <div className={styles.nameWrapper}>
            <input
              type="text"
              name="quizName"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              className={styles.quizName}
              placeholder="Quiz name"
            />
          </div>
          <div className={styles.typeWrapper}>
            <p className={styles.label}>Quiz Type</p>
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
          onData={handleGetNewId}
        />
      )}

      {step === 3 && (
        <div className={styles.shareLinkContainer}>
          <ToastContainer />
          <Close className={styles.closeBtn} onClick={onClose} />
          <div className={styles.congratsMessage}>
            Congrats your Quiz is Published!
          </div>
          <div className={styles.linkContainer}>
            {/* replace with live url */}
            <p>{`http://localhost:3000/quiz/${newQuizId}`}</p>
          </div>
          <div className={styles.shareBtnContainer}>
            <div
              className={styles.shareBtn}
              onClick={() => handleShare(newQuizId)}
            >
              Share
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateModal;
