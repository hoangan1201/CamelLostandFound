import React, { useState } from "react";
import styles from "./LoginPage.module.css";
import { useUserContext } from "../../Context/UserContext";
import { Navigate, useNavigate } from "react-router-dom";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Header from "../Header/Header";

function LoginPage(props) {
  const navigate = useNavigate();
  function handleLogin() {
    window.open("http://localhost:4000/auth/google", "_self");
  }

  function handleRedirect() {
    navigate("/postings");
  }

  const user = useUserContext();

  return (
    <div>
      <Header />
      <div className={styles.loginPage}>
        {user ? <h1>Welcome back, {user.name}</h1> : <h1>Hi camels</h1>}

        {!user && <h3>Please sign in with your Conn email below!</h3>}

        <button
          onClick={user ? handleRedirect : handleLogin}
          className={styles.button}
        >
          {user ? "Continue" : "Sign In"}
          {user && <ArrowRightIcon fontSize="large" style={{margin:"0"}}/>}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
