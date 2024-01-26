import React from "react";
import styles from "./Analytics.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";

function Analytics() {
  return (
    <div className={styles.container}>
      <Sidebar />
      <div>Analytics</div>
    </div>
  );
}

export default Analytics;
