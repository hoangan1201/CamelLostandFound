import React, { useContext } from "react";
import styles from "./Header.module.css";
import { useUserContext } from "../../Context/UserContext";
import { Link } from "react-router-dom";

function Header() {
  const user = useUserContext();
  console.log(user);

  function logOut() {
    window.open("http://localhost:4000/auth/logout", "_self");
  }

  return (
    <header className={styles.header}>
      <Link
        to={"/postings"}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <span className={styles.logoContainer}>
          <img src="/logo.png" alt="" />

          <h1>Camel Lost & Found</h1>
        </span>
      </Link>
      {user && (
        <div className={styles.infoContainer}>
          <p style={{ fontSize: "1.3rem" }}>
            <strong>CONNECTICUT COLLEGE</strong>
          </p>
          <div className={styles.verticleLine}></div>
          <Link
            to={"/profile/postings"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <p>{user.name}</p>
          </Link>

          <div className={styles.verticleLine}></div>
          <span onClick={logOut}>Log Out</span>
        </div>
      )}
    </header>
  );
}

export default Header;
