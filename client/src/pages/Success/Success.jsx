import React from "react";
import styles from "./Success.module.css";
import { ReactComponent as Trophy } from "../../assets/Success.svg";
import { formatNum } from "../../utils/formatUtils";

function Success({ type, score, total }) {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {type === "Poll" && (
          <div className={styles.pollSuccess}>
            <p>Thank you</p>
            <p>for participating</p>
            <p>in the Poll</p>
          </div>
        )}
        {type === "Q&A" && (
          <div className={styles.qnaSuccess}>
            <p>Congrats Quiz is Completed</p>
            <Trophy className={styles.trophy} />
            <p>Your score is</p>
            <p className={styles.score}>
              {formatNum(score)}/{formatNum(total)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Success;
