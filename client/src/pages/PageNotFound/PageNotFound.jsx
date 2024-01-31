import React from "react";
import styles from "./PageNotFound.module.css";
import logo from "../../assets/logo.png";

function PageNotFound() {
  return (
    <div className={styles.container}>
      <>
        <img className={styles.logo} src={logo} alt="logo" />
        <p className={styles.heading}>PageNotFound</p>
      </>
      <p className={styles.content}>
        Oops! It seems like you've ventured into uncharted territory. The page
        you're looking for might have been moved or doesn't exist.
      </p>
    </div>
  );
}

export default PageNotFound;
