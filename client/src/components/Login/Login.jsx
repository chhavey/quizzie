import React, { useState } from "react";
import styles from "../Signup/Signup.module.css";
import { login } from "../../apis/auth";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      if (response) {
        navigate("/dashboard");
        // toast.success(response || "Login success.", {
        //   duration: 4000,
        // });
      }
    } catch (error) {
      toast.error(error.message || "Login failed.", {
        duration: 4000,
      });
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <Toaster />
      <div className={styles.formFields}>
        <div className={styles.inputContainer}>
          <label className={styles.labelname}>Email</label>
          <input
            className={styles.inputField}
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label className={styles.labelname}>Password</label>
          <input
            className={styles.inputField}
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <button className={styles.btn} type="submit">
        Log In
      </button>
    </form>
  );
}

export default Login;
