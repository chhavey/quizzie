import React from "react";
import styles from "./Trending.module.css";
import { formatDate, formatNum } from "../../../utils/formatUtils";
import { ReactComponent as Eye } from "../../../assets/icon-park-outline_eyes.svg";

function Trending({ title, impressions, createdOn }) {
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.title}>{title}</div>
        <div className={styles.impression}>
          <span>{formatNum(impressions)}</span> <Eye />
        </div>
      </div>
      <div className={styles.date}>Created on : {formatDate(createdOn)}</div>
    </div>
  );
}

export default Trending;
