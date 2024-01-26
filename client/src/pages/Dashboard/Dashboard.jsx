import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import InfoCard from "../../components/InfoCard/InfoCard";
import Trending from "../../components/TrendingCard/Trending";
import getAllQuiz from "../../apis/quiz";

function Dashboard() {
  const [details, setDetails] = useState();

  const fetchAllQuiz = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await getAllQuiz({ token });
      setDetails(response);
      console.log(response.data.allQuizzes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllQuiz();
  }, []);

  function formatNum(num) {
    if (num < 10) {
      return `0${num}`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    } else {
      return num;
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.dashboardContainer}>
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
          {details?.data?.allQuizzes.length < 10 ? (
            <p>
              No trending quiz available :( Start interacting with more quizzes
              to get featured in the trending section!
            </p>
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
      </div>
    </div>
  );
}

export default Dashboard;
