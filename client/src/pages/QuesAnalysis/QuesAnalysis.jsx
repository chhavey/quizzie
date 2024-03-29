import React, { useEffect, useState } from "react";
import styles from "./QuesAnalysis.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAnalytics } from "../../apis/quiz";
import { ThreeDots } from "react-loader-spinner";
import { toast, Toaster } from "react-hot-toast";
import { formatDate, formatNum } from "../../utils/formatUtils";
import Sidebar from "../../components/Sidebar/Sidebar";
import AnalysisCard from "../../components/Cards/AnalysisCard/AnalysisCard";
import CreateModal from "../../components/Modal/CreateModal/CreateModal";
import { isUserLoggedIn } from "../../utils/authUtils";

function QuesAnalysis() {
  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState([]);
  const [quesType, setQuesType] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const { quizId } = useParams();
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

  const getQuizAnalytics = async () => {
    try {
      const response = await fetchAnalytics({ quizId, token });
      setAnalysisData(response.data);
      setQuesType(response.data.type);
    } catch (error) {
      toast.error(error.message || "Couldnt fetch quiz analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getQuizAnalytics();
    // eslint-disable-next-line
  }, [quizId]);

  const QuestionCard = ({ question, index }) => {
    return (
      <div className={styles.wrapper} key={question._id}>
        <p className={styles.question}>{`Q.${index + 1} ${
          question.question
        }`}</p>
        {quesType === "Q&A" ? (
          <QnaCard question={question} />
        ) : (
          <PollCard question={question} />
        )}
      </div>
    );
  };

  const QnaCard = ({ question }) => (
    <div className={styles.cardsDisplay}>
      <AnalysisCard
        value={question.totalAttempts}
        label="People attempted the question"
      />
      <AnalysisCard
        value={question.correctAttempts}
        label="People answered correctly"
      />
      <AnalysisCard
        value={question.incorrectAttempts}
        label="People answered incorrectly"
      />
    </div>
  );

  const PollCard = ({ question }) => (
    <div className={styles.cardsDisplay}>
      {question.options.map((option) => (
        <AnalysisCard
          key={option._id}
          value={option.frequency}
          label={option.text}
        />
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Sidebar openModal={openModal} />
      </div>
      <Toaster />
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
            <div className={styles.header}>
              <div className={styles.title}>
                {analysisData.title} Question Analysis
              </div>
              <div className={styles.info}>
                <div>Created on: {formatDate(analysisData.createdAt)}</div>
                <div>Impressions: {formatNum(analysisData.impressions)}</div>
              </div>
            </div>
            <div className={styles.mainContainer}>
              {analysisData.questions.map((question, index) => (
                <QuestionCard
                  key={question._id}
                  question={question}
                  index={index}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default QuesAnalysis;
