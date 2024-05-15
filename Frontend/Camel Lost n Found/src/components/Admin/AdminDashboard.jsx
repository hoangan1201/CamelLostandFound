import React from "react";
import styles from "./AdminDashboard.module.css";
import Table from "./Table";
import { useNavigate } from "react-router-dom";

function AdminDashBoard(){
    const navigate = useNavigate();
    return (
        <div>
            <div className={styles.row}>
                <h1>Admin Board</h1>
            </div>
            <div className={styles.row}>
                <div className={styles.numberChild}>
                    <h3>Active Posts</h3>
                    <p>10</p>
                </div>
                <div className={styles.numberChild}>
                    <h3>Closed Posts</h3>
                    <p>6</p>
                </div>
                <div className={styles.numberChild}>
                    <h3>Active Users</h3>
                    <p>7</p>
                </div>
            </div>
            <div className={styles.row}>
                <h3>Claimed Items Information</h3>
            </div>

            <div className={styles.row}><Table/></div>

            {/* <Table/> */}
        </div>
    )
}

export default AdminDashBoard;