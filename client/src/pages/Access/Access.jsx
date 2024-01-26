import React, { useState } from "react";
import Login from "../../components/Login/Login";
import Signup from "../../components/Signup/Signup";
import styles from "./Access.module.css";

const Access = () => {
  const [isLogin, setLogin] = useState(false);
  const [isSignupSuccess, setSignupSuccess] = useState(false);

  const handleLogin = () => {
    setLogin(true);
    setSignupSuccess(false);
  };

  const handleSignup = () => {
    setLogin(false);
    setSignupSuccess(false);
  };

  const handleSignupSuccess = (data) => {
    setSignupSuccess(data);
  };

  return (
    <div className={styles.container}>
      <div className={styles.accessBox}>
        <div className={styles.title}>QUIZZIE</div>
        <div className={styles.btn}>
          <button
            className={isLogin || isSignupSuccess ? "" : styles.selected}
            onClick={handleSignup}
          >
            Sign Up
          </button>
          <button
            className={isLogin || isSignupSuccess ? styles.selected : ""}
            onClick={handleLogin}
          >
            Log In
          </button>
        </div>
        <div className={styles.component}>
          {isLogin || isSignupSuccess ? (
            <Login />
          ) : (
            <Signup
              key={isSignupSuccess ? "signupSuccess" : "signup"}
              signupSuccess={handleSignupSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Access;
