import React, { useState, useEffect } from "react";
import styles from "./TakeQuiz.module.css";
import { fetchQuiz, recordUserResponse } from "../../apis/quiz";
import { useParams } from "react-router-dom";
import { formatNum } from "../../utils/formatUtils";
import Success from "./../Success/Success";
import { ThreeDots } from "react-loader-spinner";
import { toast, Toaster } from "react-hot-toast";

function TakeQuiz() {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [quizType, setQuizType] = useState("");
  const [timer, setTimer] = useState("off");
  const [currentQuesNum, setCurrentQuesNum] = useState(0);
  const [userResponses, setUserResponses] = useState([]);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const takeQuiz = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetchQuiz({ quizId, token });
      setQuizType(response.data.type);
      setQuizData(response.data);
      setTimer(response.data.timer);
    } catch (error) {
      toast.error(error.message || "Failed to fetch this quiz!");
    }
  };

  useEffect(() => {
    takeQuiz();
    // eslint-disable-next-line
  }, []);

  const handleOptionClick = async (optionIndex) => {
    const updatedResponses = [...userResponses];
    updatedResponses[currentQuesNum] = optionIndex;
    setUserResponses(updatedResponses);

    const token = localStorage.getItem("token");
    try {
      const response = await recordUserResponse({
        quizId,
        questionId: quizData.questions[currentQuesNum]._id,
        selectedOption: optionIndex.toString(),
        token,
      });
      setScore(response.totalCorrectOptions);
      setTotal(response.totalQuestions);
    } catch (error) {
      toast.error(error.message || "Error recording user response:");
    }
  };

  const handleSubmitQuiz = () => {
    // Calculate the user's final score
    setIsQuizSubmitted(true);
  };

  const handleNextClick = () => {
    setCurrentQuesNum((prevIndex) => prevIndex + 1);
    setTimer(quizData.timer);
  };

  const handleTimer = () => {
    if (!quizData) {
      return;
    }
    if (timer > 0) {
      setTimer((prevTimer) => prevTimer - 1);
    } else {
      // Timer expired, move to the next question or submit quiz
      if (currentQuesNum < quizData.questions.length - 1) {
        handleNextClick();
      } else {
        setIsQuizSubmitted(true);
      }
    }
  };

  useEffect(() => {
    if (timer !== "off" && quizType === "Q&A") {
      const countdownInterval = setInterval(handleTimer, 1000);
      return () => clearInterval(countdownInterval);
    }
    // eslint-disable-next-line
  }, [currentQuesNum, timer, quizData]);

  if (!quizData) {
    return <ThreeDots color="#a9bcff" />;
  }

  const currentQuestion = quizData.questions[currentQuesNum];

  return (
    <>
      <Toaster />
      {isQuizSubmitted ? (
        <Success type={quizType} score={score} total={total} />
      ) : (
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.info}>
              <p className={styles.totalQues}>
                {formatNum(currentQuesNum + 1)}/
                {formatNum(quizData.questions.length)}
              </p>
              {timer > 0 && (
                <p className={styles.timer}>{`00:${formatNum(timer)}s`}</p>
              )}
            </div>
            <p className={styles.questionText}>{currentQuestion.question}</p>

            <div className={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`${styles.option} ${
                    userResponses[currentQuesNum] === index
                      ? styles.selected
                      : ""
                  }`}
                  onClick={() => handleOptionClick(index)}
                >
                  {currentQuestion.responseType === "Text" && (
                    <p>{option.text}</p>
                  )}
                  {currentQuestion.responseType === "Image" && (
                    <img src={option.image} alt={`img${index + 1}`} />
                  )}
                  {currentQuestion.responseType === "Text-Image" && (
                    <>
                      {quizType === "Q&A" && (
                        <div className={styles.textImage}>
                          <p>{option.text}</p>
                          <img
                            className={styles.imgWrapper}
                            src={option.image}
                            alt={`img${index + 1}`}
                          />
                        </div>
                      )}
                      {quizType === "Poll" && (
                        <>
                          <div className={styles.pollTextImage}>
                            <p className={styles.pollOptionText}>
                              {option.text}
                            </p>
                            <img src={option.image} alt={`img${index + 1}`} />
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            <div
              className={styles.nextBtn}
              onClick={
                isQuizSubmitted
                  ? null
                  : currentQuesNum === quizData.questions.length - 1
                  ? handleSubmitQuiz
                  : handleNextClick
              }
            >
              {isQuizSubmitted ||
              currentQuesNum === quizData.questions.length - 1
                ? "Submit"
                : "Next"}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TakeQuiz;
