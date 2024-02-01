import React, { useState } from "react";
import styles from "./QuestionModal.module.css";
import { ReactComponent as Bin } from "../../../assets/Bin.svg";
import { createQuiz, editQuiz } from "../../../apis/quiz";
import { toast, Toaster } from "react-hot-toast";

function QuestionModal({
  quizType,
  quizName,
  onClose,
  nextStep,
  onData,
  editQuizId,
  edit,
}) {
  const [quesNum, setQuesNum] = useState([1]);
  const [currentQuesNum, setCurrentQuesNum] = useState(0);
  const [timer, setTimer] = useState("off");
  const token = localStorage.getItem("token");
  const [questionData, setQuestionData] = useState([
    {
      question: "",
      options: [
        { text: "", image: "" },
        { text: "", image: "" },
        { text: "", image: "" },
      ],
      correctOption: "",
      responseType: "Text",
    },
  ]);

  const quizData = {
    title: quizName,
    type: quizType,
    questions: questionData,
    timer: timer,
  };

  const quizCreate = async () => {
    try {
      const response = await createQuiz({ quizData, token });
      return response.data.data.id;
    } catch (error) {
      toast.error(error.message || "Error creating quiz");
    }
  };

  const updateQuiz = async () => {
    try {
      const response = await editQuiz(
        editQuizId,
        { questionData, timer },
        token
      );
      console.log(response);
      return response.data.data.id;
    } catch (error) {
      toast.error(error.message || "Error updating quiz");
    }
  };

  const handleShowQuesDetails = (index) => {
    setCurrentQuesNum(index);
  };

  const handleRemoveQuesDetails = (deleteIndex) => {
    setQuesNum((prevNum) =>
      prevNum.filter((_, index) => index !== deleteIndex)
    );
    setQuestionData((prevData) =>
      prevData.filter((_, index) => index !== deleteIndex)
    );
    setCurrentQuesNum((prevIndex) => prevIndex - 1);
  };

  const handleAddQuestion = () => {
    setQuestionData((prevData) => [
      ...prevData,
      {
        question: "",
        options: [
          { text: "", image: "" },
          { text: "", image: "" },
          { text: "", image: "" },
        ],
        correctOption: "",
        responseType: "Text",
      },
    ]);
    setCurrentQuesNum((prevNum) => prevNum + 1);
    if (quesNum.length < 5) {
      setQuesNum((prevNum) => [...prevNum, prevNum.length + 1]);
    }
  };

  const handleQuestionChange = (e, optionIndex) => {
    const { name, value } = e.target;
    setQuestionData((prevData) => {
      const updatedQuestions = [...prevData];
      const updatedQuestion = { ...updatedQuestions[currentQuesNum] };

      if (name === "text" || name === "image") {
        const updatedOptions = [...updatedQuestion.options];
        updatedOptions[optionIndex] = {
          ...updatedOptions[optionIndex],
          [name]: value,
        };
        updatedQuestion.options = updatedOptions;
      } else {
        updatedQuestion[name] = value;
      }
      updatedQuestions[currentQuesNum] = updatedQuestion;
      return updatedQuestions;
    });
  };

  const handleAddOption = () => {
    setQuestionData((prevData) => {
      const updatedQuestions = [...prevData];
      const updatedQuestion = { ...updatedQuestions[currentQuesNum] };

      updatedQuestion.options = [
        ...updatedQuestion.options,
        { text: "", image: "" },
      ];

      updatedQuestions[currentQuesNum] = updatedQuestion;
      return updatedQuestions;
    });
  };

  const handleRemoveOption = (index) => {
    setQuestionData((prevData) => {
      const updatedQuestions = [...prevData];
      const updatedQuestion = { ...updatedQuestions[currentQuesNum] };

      updatedQuestion.options = updatedQuestion.options.filter(
        (_, optionIndex) => optionIndex !== index
      );

      updatedQuestions[currentQuesNum] = updatedQuestion;
      return updatedQuestions;
    });
  };

  const handleTimer = (val) => {
    setTimer(val);
  };

  const handleCancel = () => {
    onClose();
  };

  const handleContinue = async () => {
    const isInvalid = questionData.some((question) => {
      const isQuestionInvalid =
        !question.question.trim() ||
        question.options.some((option) => {
          if (question.responseType === "Text") {
            return !option.text.trim();
          } else if (question.responseType === "Image") {
            return !option.image.trim();
          } else if (question.responseType === "Text-Image") {
            return !option.text.trim() || !option.image.trim();
          }
          return false;
        });

      // Only validate correctOption for Q&A type
      const isCorrectOptionInvalid =
        quizType === "Q&A" && !question.correctOption;

      return isQuestionInvalid || isCorrectOptionInvalid;
    });

    if (isInvalid) {
      toast.error(
        "Uh-oh! Fill in all the fields to craft your quiz masterpiece"
      );
      return;
    }

    if (edit) {
      const res = await updateQuiz();
      onData(res);
    } else {
      const res = await quizCreate();
      onData(res);
    }
    nextStep();
  };

  return (
    <div className={styles.container}>
      <Toaster />
      <div className={styles.addQuestions}>
        <div className={styles.addQuestionWrapper}>
          {quesNum.map((num, index) => (
            <div
              key={index}
              className={styles.quesNumber}
              onClick={() => handleShowQuesDetails(index)}
            >
              {num}
              {num !== 1 && (
                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemoveQuesDetails(index)}
                >
                  ✖
                </button>
              )}
            </div>
          ))}
          {quesNum.length < 5 && (
            <div onClick={handleAddQuestion} className={styles.addBtn}>
              +
            </div>
          )}
        </div>
        <div className={styles.maxQuesLabel}>Max 5 questions</div>
      </div>

      <input
        type="text"
        name="question"
        value={questionData[currentQuesNum]?.question}
        className={styles.quizName}
        placeholder={quizType === "Poll" ? "Poll Question" : "Q & A Question"}
        onChange={handleQuestionChange}
      />

      <div className={styles.optionTypeWrapper}>
        <p className={styles.label}>Option Type</p>
        <div className={styles.radioGroup}>
          <div className={styles.radio}>
            <input
              type="radio"
              value="Text"
              name="responseType"
              checked={questionData[currentQuesNum]?.responseType === "Text"}
              onChange={handleQuestionChange}
            />
            <p className={styles.label}> Text </p>
          </div>
          <div className={styles.radio}>
            <input
              type="radio"
              value="Image"
              name="responseType"
              checked={questionData[currentQuesNum]?.responseType === "Image"}
              onChange={handleQuestionChange}
            />
            <p className={styles.label}>Image URL</p>
          </div>
          <div className={styles.radio}>
            <input
              type="radio"
              value="Text-Image"
              name="responseType"
              checked={
                questionData[currentQuesNum]?.responseType === "Text-Image"
              }
              onChange={handleQuestionChange}
            />
            <p className={styles.label}>Text & Image URL</p>
          </div>
        </div>
      </div>

      <div className={styles.optionsAndTimerWrapper}>
        {quizType === "Q&A" ? (
          <>
            {questionData[currentQuesNum] && (
              <>
                {questionData[currentQuesNum].responseType === "Text" && (
                  <div className={styles.leftWrapper}>
                    {questionData[currentQuesNum].options.map(
                      (option, index) => (
                        <div
                          className={styles.radioAndOptionWrapper}
                          key={index}
                        >
                          <input
                            type="radio"
                            value={index}
                            name="correctOption"
                            onChange={(e) => handleQuestionChange(e, index)}
                          ></input>
                          <div className={styles.optionAndBin}>
                            <input
                              type="text"
                              placeholder="Text"
                              name="text"
                              value={option.text}
                              onChange={(e) => handleQuestionChange(e, index)}
                              className={styles.optionInput}
                            ></input>
                            {index > 1 && (
                              <Bin
                                onClick={() => handleRemoveOption(index)}
                                className={styles.removeOptionBtn}
                              />
                            )}
                          </div>
                        </div>
                      )
                    )}
                    {questionData[currentQuesNum].options.length < 4 && (
                      <div
                        onClick={handleAddOption}
                        className={styles.addOptionBtn}
                      >
                        Add Option
                      </div>
                    )}
                  </div>
                )}
                {questionData[currentQuesNum].responseType === "Image" && (
                  <div className={styles.leftWrapper}>
                    {questionData[currentQuesNum].options.map(
                      (option, index) => (
                        <div
                          className={styles.radioAndOptionWrapper}
                          key={index}
                        >
                          <input
                            type="radio"
                            value={index}
                            name="correctOption"
                            onChange={(e) => handleQuestionChange(e, index)}
                          ></input>
                          <div className={styles.optionAndBin}>
                            <input
                              type="text"
                              placeholder="Image URL"
                              name="image"
                              value={option.image}
                              onChange={(e) => handleQuestionChange(e, index)}
                              className={styles.optionInput}
                            ></input>
                            {index > 1 && (
                              <Bin
                                onClick={() => handleRemoveOption(index)}
                                className={styles.removeOptionBtn}
                              />
                            )}
                          </div>
                        </div>
                      )
                    )}
                    {questionData[currentQuesNum].options.length < 4 && (
                      <div
                        onClick={handleAddOption}
                        className={styles.addOptionBtn}
                      >
                        Add Option
                      </div>
                    )}
                  </div>
                )}
                {questionData[currentQuesNum].responseType === "Text-Image" && (
                  <div className={styles.leftWrapper}>
                    {questionData[currentQuesNum].options.map(
                      (option, index) => (
                        <div
                          className={styles.radioAndOptionWrapper}
                          key={index}
                        >
                          <input
                            type="radio"
                            value={index}
                            name="correctOption"
                            onChange={(e) => handleQuestionChange(e, index)}
                          ></input>
                          <input
                            type="text"
                            placeholder="Text"
                            name="text"
                            value={option.text}
                            onChange={(e) => handleQuestionChange(e, index)}
                            className={styles.optionInput}
                          ></input>
                          <div className={styles.optionAndBin}>
                            <input
                              type="text"
                              placeholder="Image URL"
                              name="image"
                              value={option.image}
                              onChange={(e) => handleQuestionChange(e, index)}
                              className={styles.optionInput}
                            ></input>
                            {index > 1 && (
                              <Bin
                                onClick={() => handleRemoveOption(index)}
                                className={styles.removeOptionBtn}
                              />
                            )}
                          </div>
                        </div>
                      )
                    )}
                    {questionData[currentQuesNum].options.length < 4 && (
                      <div
                        onClick={handleAddOption}
                        className={styles.addOptionBtn}
                      >
                        Add Option
                      </div>
                    )}
                  </div>
                )}
                <div className={styles.rightWrapper}>
                  <div className={styles.timerWrapper}>
                    <div className={styles.label}>Timer</div>
                    <div
                      className={`${styles.timerBtn} ${
                        timer === "off" ? styles.selectedTimer : ""
                      }`}
                      onClick={() => handleTimer("off")}
                    >
                      OFF
                    </div>
                    <div
                      className={`${styles.timerBtn} ${
                        timer === "5" ? styles.selectedTimer : ""
                      }`}
                      onClick={() => handleTimer("5")}
                    >
                      5 Sec
                    </div>
                    <div
                      className={`${styles.timerBtn} ${
                        timer === "10" ? styles.selectedTimer : ""
                      }`}
                      onClick={() => handleTimer("10")}
                    >
                      10 Sec
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            {questionData[currentQuesNum] && (
              <>
                {questionData[currentQuesNum].responseType === "Text" && (
                  <div className={styles.pollLeftWrapper}>
                    {questionData[currentQuesNum].options.map(
                      (option, index) => (
                        <div key={index}>
                          <div className={styles.optionAndBin}>
                            <input
                              type="text"
                              placeholder="Text"
                              name="text"
                              value={option.text}
                              onChange={(e) => handleQuestionChange(e, index)}
                              className={styles.optionInput}
                            ></input>
                            {index > 1 && (
                              <Bin
                                onClick={() => handleRemoveOption(index)}
                                className={styles.removeOptionBtn}
                              />
                            )}
                          </div>
                        </div>
                      )
                    )}
                    {questionData[currentQuesNum].options.length < 4 && (
                      <div
                        onClick={handleAddOption}
                        className={styles.addPollOptionBtn}
                      >
                        Add Option
                      </div>
                    )}
                  </div>
                )}
                {questionData[currentQuesNum].responseType === "Image" && (
                  <div className={styles.pollLeftWrapper}>
                    {questionData[currentQuesNum].options.map(
                      (option, index) => (
                        <div key={index}>
                          <div className={styles.optionAndBin}>
                            <input
                              type="text"
                              placeholder="Image URL"
                              name="image"
                              value={option.image}
                              onChange={(e) => handleQuestionChange(e, index)}
                              className={styles.optionInput}
                            ></input>
                            {index > 1 && (
                              <Bin
                                onClick={() => handleRemoveOption(index)}
                                className={styles.removeOptionBtn}
                              />
                            )}
                          </div>
                        </div>
                      )
                    )}
                    {questionData[currentQuesNum].options.length < 4 && (
                      <div
                        onClick={handleAddOption}
                        className={styles.addPollOptionBtn}
                      >
                        Add Option
                      </div>
                    )}
                  </div>
                )}

                {questionData[currentQuesNum].responseType === "Text-Image" && (
                  <div className={styles.pollLeftWrapper}>
                    {questionData[currentQuesNum].options.map(
                      (option, index) => (
                        <div className={styles.optionWrapper} key={index}>
                          <input
                            type="text"
                            placeholder="Text"
                            name="text"
                            value={option.text}
                            onChange={(e) => handleQuestionChange(e, index)}
                            className={styles.optionInput}
                          ></input>
                          <div className={styles.optionAndBin}>
                            <input
                              type="text"
                              placeholder="Image URL"
                              name="image"
                              value={option.image}
                              onChange={(e) => handleQuestionChange(e, index)}
                              className={styles.optionInput}
                            ></input>
                            {index > 1 && (
                              <Bin
                                onClick={() => handleRemoveOption(index)}
                                className={styles.removeOptionBtn}
                              />
                            )}
                          </div>
                        </div>
                      )
                    )}
                    {questionData[currentQuesNum].options.length < 4 && (
                      <div
                        onClick={handleAddOption}
                        className={styles.addPollOptionBtn}
                      >
                        Add Option
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      <div className={styles.buttonContainer}>
        <button onClick={handleCancel} className={styles.cancelBtn}>
          Cancel
        </button>
        <button onClick={handleContinue} className={styles.continueBtn}>
          Create Quiz
        </button>
      </div>
    </div>
  );
}

export default QuestionModal;
