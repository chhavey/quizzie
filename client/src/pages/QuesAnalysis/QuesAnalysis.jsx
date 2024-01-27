import React from "react";
import styles from "./QuesAnalysis.module.css";
import { ThreeDots } from "react-loader-spinner";

function QuesAnalysis() {
  return (
    <div className={styles.container}>
      QuesAnalysis
      <div className={styles.loading}>
        <ThreeDots color="#a9bcff" />
      </div>
      <div>ok</div>
    </div>
  );
}

export default QuesAnalysis;
