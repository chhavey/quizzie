import React from "react";
import styles from "./Trending.module.css";
import { ReactComponent as Eye } from "../../assets/icon-park-outline_eyes.svg";

function Trending({ title, impressions, createdOn }) {
  function formatDate(inputDate) {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.title}>{title}</div>
        <div className={styles.impression}>
          <span>{impressions}</span> <Eye />
        </div>
      </div>
      <div className={styles.date}>Created on : {formatDate(createdOn)}</div>
    </div>
  );
}

export default Trending;
