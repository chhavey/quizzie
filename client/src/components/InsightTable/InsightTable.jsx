import React from "react";
import styles from "./InsightTable.module.css";
import { ReactComponent as Edit } from "../../assets/Edit.svg";
import { ReactComponent as Bin } from "../../assets/Bin.svg";
import { ReactComponent as Share } from "../../assets/Share.svg";
import { formatDate, formatNum } from "../../utils/formatUtils";
import { Link } from "react-router-dom";
import copy from "clipboard-copy";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function InsightTable({ quizData }) {
  const handleShareClick = async (quizId) => {
    if (!quizId) {
      toast.error("Cannot copy link");
      return;
    }
    const path = `localhost:4000/quiz/${quizId}`;
    try {
      await copy(path);
      toast.success("Link copied to clipboard");
    } catch (error) {
      toast.error("Cannot copy link");
    }
  };

  return (
    <table className={styles.container}>
      <ToastContainer />
      <thead className={styles.thead}>
        <tr>
          <th>S.No</th>
          <th>Quiz Name</th>
          <th>Created on</th>
          <th>Impression</th>
          <th>&nbsp;</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {quizData.map((quiz, index) => (
          <tr key={quiz._id}>
            <td>{index + 1}</td>
            <td>{quiz.title}</td>
            <td>{formatDate(quiz.createdAt)}</td>
            <td>{formatNum(quiz.impressions)}</td>
            <td>
              <span className={styles.icons}>
                <Link to={`/edit`}>
                  <Edit />
                </Link>
                <Bin style={{ marginTop: "2%" }} />
                <Share
                  style={{ marginTop: "1%" }}
                  onClick={() => handleShareClick(quiz._id)}
                />
              </span>
            </td>
            <td>
              <span className={styles.qwa}>
                <Link to={`/analytics/${quiz._id}`}>
                  Question Wise Analysis
                </Link>
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default InsightTable;
