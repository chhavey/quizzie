import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";

function Sidebar({ openModal }) {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split("/")[1];
    setSelectedTab(path || "dashboard");
  }, [location.pathname]);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const handleCreateQuiz = () => {
    setSelectedTab("create");
    openModal();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>QUIZZIE</div>
      <div className={styles.wrapper}>
        <Link
          to="/dashboard"
          className={`${styles.sidebarBtn} ${
            selectedTab === "dashboard" ? styles.selectedBtn : ""
          }`}
          onClick={() => handleTabClick("dashboard")}
        >
          Dashboard
        </Link>
        <Link
          to="/analytics"
          className={`${styles.sidebarBtn} ${
            selectedTab === "analytics" ? styles.selectedBtn : ""
          }`}
          onClick={() => handleTabClick("analytics")}
        >
          Analytics
        </Link>
        <div
          className={`${styles.sidebarBtn} ${
            selectedTab === "create" ? styles.selectedBtn : ""
          }`}
          onClick={handleCreateQuiz}
        >
          Create Quiz
        </div>
      </div>
      <div className={styles.logoutContainer} onClick={handleLogout}>
        LOGOUT
      </div>
    </div>
  );
}

export default Sidebar;
