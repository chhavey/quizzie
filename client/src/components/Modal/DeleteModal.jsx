import React from "react";
import styles from "./DeleteModal.module.css";
import { deleteQuiz } from "../../apis/quiz";
import { toast, Toaster } from "react-hot-toast";

function DeleteModal({ quizId, closeModal }) {
  const handleCancel = () => {
    closeModal();
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await deleteQuiz({ quizId, token });
      closeModal();
      toast.success("Quiz deleted successfully");
    } catch (error) {
      toast.error(error.message || "Unable to delete quiz");
    }
  };

  return (
    <div className={styles.container}>
      <Toaster />
      <div className={styles.text}>Are you confirm you want to delete?</div>
      <div className={styles.buttons}>
        <div className={styles.deleteBtn} onClick={handleConfirmDelete}>
          Confirm Delete
        </div>
        <div className={styles.cancelBtn} onClick={handleCancel}>
          Cancel
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
