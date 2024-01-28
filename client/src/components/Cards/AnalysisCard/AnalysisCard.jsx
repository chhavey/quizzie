import React from "react";
import styles from "./AnalysisCard.module.css";

function AnalysisCard({ value, label }) {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>&nbsp;{label}</span>
      </div>
    </div>
  );
}

export default AnalysisCard;
