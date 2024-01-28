import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import InfoCard from "../../components/Cards/InfoCard/InfoCard";
import Trending from "../../components/Cards/TrendingCard/Trending";
import { getAllQuiz } from "../../apis/quiz";
import { formatNum } from "../../utils/formatUtils";
import { ThreeDots } from "react-loader-spinner";
import { toast, Toaster } from "react-hot-toast";
import CreateModal from "../../components/Modal/CreateModal/CreateModal";

function Dashboard() {
  const [details, setDetails] = useState();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);

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
    const token = localStorage.getItem("token");
    try {
      const response = await getAllQuiz({ token });
      setDetails(response);
    } catch (error) {
      toast.error(error.message || "Oops, an error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllQuiz();
  }, []);

  return (
    <div className={styles.container}>
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
      <Toaster />
      <div
        className={styles.dashboardContainer}
        style={{ justifyContent: loading ? "center" : "flex-start" }}
      >
        {loading ? (
          <ThreeDots color="#a9bcff" />
        ) : (
          <>
            <div className={styles.totalStats}>
              <InfoCard
                num={formatNum(details?.data?.totalQuizzes)}
                label="Quizzes Created"
                color="#ff5d01"
              />
              <InfoCard
                num={formatNum(details?.data?.totalQuestions)}
                label="Questions Created"
                color="#60b84b"
              />
              <InfoCard
                num={formatNum(details?.data?.totalImpressions)}
                label="Total Impressions"
                color="#5076ff"
              />
            </div>

            <div className={styles.trendingQuiz}>
              <div className={styles.heading}>Trending Quiz</div>
              {details?.data?.allQuizzes.length === 0 ? (
                <div className={styles.error}>
                  <p>Oops! No trending quizzes available. 😢</p>
                  <p>
                    Start interacting with more quizzes to get featured in the
                    trending section! 🚀
                  </p>
                </div>
              ) : (
                <div className={styles.trendingGrid}>
                  {details?.data?.allQuizzes
                    .filter((quiz) => quiz.impressions >= 10)
                    .map((quiz) => (
                      <Trending
                        key={quiz._id}
                        title={quiz.title}
                        impressions={quiz.impressions}
                        createdOn={quiz.createdAt}
                      />
                    ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
