import React, { useState, useEffect } from "react";
import styles from "./Analytics.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import InsightTable from "../../components/InsightTable/InsightTable";
import { getAllQuiz } from "../../apis/quiz";
import { ThreeDots } from "react-loader-spinner";
import { toast, Toaster } from "react-hot-toast";
import CreateModal from "../../components/Modal/CreateModal/CreateModal";
import { isUserLoggedIn } from "../../utils/authUtils";
import { useNavigate } from "react-router-dom";

function Analytics() {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isUserLoggedIn());
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedIn(isUserLoggedIn());
    // eslint-disable-next-line
  }, [isUserLoggedIn()]);

  useEffect(() => {
    if (!loggedIn) navigate("/");
    // eslint-disable-next-line
  }, [loggedIn]);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (isModalOpen && e.target.closest(`.${styles.modalBox}`) === null) {
      setModalOpen(false);
    }
  };

  const fetchAllQuiz = async () => {
    try {
      const response = await getAllQuiz({ token });
      setQuizData(response.data.allQuizzes);
    } catch (error) {
      toast.error(error.message || "Oops, an error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllQuiz();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.container}>
      <Toaster />
      <div className={styles.sidebar}>
        <Sidebar openModal={openModal} />
      </div>
      {isModalOpen && (
        <div className={styles.overlay} onClick={handleOutsideClick}>
          <div className={styles.modalBox}>
            <CreateModal onClose={closeModal} />
          </div>
        </div>
      )}
      <div
        className={styles.analyticsContainer}
        style={{ justifyContent: loading ? "center" : "flex-start" }}
      >
        {loading ? (
          <ThreeDots color="#a9bcff" />
        ) : (
          <>
            <div className={styles.heading}>Quiz Analysis</div>

            <div className={styles.tableContainer}>
              {quizData.length === 0 ? (
                <div className={styles.error}>
                  <p>
                    Oops! It seems there are no quizzes for analysis right now.
                  </p>
                  <p>
                    Why not create a new quiz and start gathering insights? 🚀
                  </p>
                </div>
              ) : (
                <InsightTable quizData={quizData} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Analytics;
