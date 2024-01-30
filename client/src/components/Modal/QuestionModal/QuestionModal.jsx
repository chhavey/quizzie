import React, { useState } from "react";
import styles from "./QuestionModal.module.css";
import { ReactComponent as Bin } from "../../../assets/Bin.svg";
import { createQuiz } from "../../../apis/quiz";

function QuestionModal({ quizType, quizName, onClose, nextStep }) {
  const [quesNum, setQuesNum] = useState([1]);
  const [currentQuesNum, setCurrentQuesNum] = useState(0);
  const [timer, setTimer] = useState(0);
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

  console.log("full quiz data", quizData);

  const quizCreate = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await createQuiz({ quizData, token });
      return response.status;
    } catch (error) {
      console.log(error);
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

  const handleContinue = () => {
    quizCreate();
    nextStep();
  };

  return (
    <div className={styles.container}>
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
        <label className={styles.label}>Option Type</label>
        <div className={styles.radioGroup}>
          <div className={styles.radio}>
            <input
              type="radio"
              value="Text"
              name="responseType"
              checked={questionData[currentQuesNum]?.responseType === "Text"}
              onChange={handleQuestionChange}
            />
            <label className={styles.label}> Text </label>
          </div>
          <div className={styles.radio}>
            <input
              type="radio"
              value="Image"
              name="responseType"
              checked={questionData[currentQuesNum]?.responseType === "Image"}
              onChange={handleQuestionChange}
            />
            <label className={styles.label}>Image URL</label>
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
            <label className={styles.label}>Text & Image URL</label>
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
                        timer === 0 ? styles.selectedTimer : ""
                      }`}
                      onClick={() => handleTimer(0)}
                    >
                      OFF
                    </div>
                    <div
                      className={`${styles.timerBtn} ${
                        timer === 5 ? styles.selectedTimer : ""
                      }`}
                      onClick={() => handleTimer(5)}
                    >
                      5 Sec
                    </div>
                    <div
                      className={`${styles.timerBtn} ${
                        timer === 10 ? styles.selectedTimer : ""
                      }`}
                      onClick={() => handleTimer(10)}
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
