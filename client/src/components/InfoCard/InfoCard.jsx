import React from "react";
import styles from "./InfoCard.module.css";

function InfoCard({ num, label, color }) {
  const contentStyle = {
    color: color || "black",
  };
  return (
    <div className={styles.container}>
      <div className={styles.content} style={contentStyle}>
        <span className={styles.big}>{num}</span>
        <span className={styles.small}>{label}</span>
      </div>
    </div>
  );
}

export default InfoCard;
