import React, { useEffect, useState } from "react";
import styles from "./Signup.module.css";
import { register } from "../../apis/auth";
import Login from "../Login/Login";
import { toast, Toaster } from "react-hot-toast";

function Signup({ signupSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignupSuccess, setSignupSuccess] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;

    // Validate name
    if (name.trim() && !/^[a-zA-Z\s]+$/.test(name)) {
      setNameError("Invalid name");
      isValid = false;
      setName("");
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() && !emailRegex.test(email)) {
      setEmailError("Invalid email");
      isValid = false;
      setEmail("");
    }

    // Validate password
    if (password.trim() && password.length < 6) {
      setPasswordError("Weak password");
      isValid = false;
      setPassword("");
    }

    // Validate confirm password
    if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
      setConfirmPassword("");
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await register(name, email, password);
      if (response) {
        setSignupSuccess(true);
      }
    } catch (error) {
      toast.error(error.message || "Sign Up failed.", {
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSignupSuccess) {
      signupSuccess(true);
    }
  }, [isSignupSuccess, signupSuccess]);

  if (isSignupSuccess) {
    return <Login />;
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <Toaster />
      <div className={styles.formFields}>
        <div className={styles.inputContainer}>
          <label className={styles.labelname}>Name</label>
          <input
            className={nameError ? styles.errorField : styles.inputField}
            type="text"
            id="name"
            name="name"
            placeholder={nameError || ""}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.labelname}>Email</label>
          <input
            className={emailError ? styles.errorField : styles.inputField}
            type="text"
            id="email"
            name="email"
            placeholder={emailError || ""}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.labelname}>Password</label>
          <input
            className={passwordError ? styles.errorField : styles.inputField}
            type="password"
            id="password"
            name="password"
            placeholder={passwordError || ""}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.labelname}>Confirm Password</label>
          <input
            className={
              confirmPasswordError ? styles.errorField : styles.inputField
            }
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder={confirmPasswordError || ""}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>
      <button className={styles.btn} type="submit">
        {loading ? "Almost There..." : "Sign Up"}
      </button>
    </form>
  );
}

export default Signup;
