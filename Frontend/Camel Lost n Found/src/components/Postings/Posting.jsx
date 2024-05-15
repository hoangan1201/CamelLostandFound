import React, { useState } from "react";
import styles from "./Posting.module.css";
import "../ModalAntiSlide.css";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import PostingPopUp from "./PostingPopUp";
import { Zoom } from "@mui/material";

const tags = ["Tag 1", "Tag 2", "Tag 3"];

function convertDateTime(dateString) {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  return formattedDate;
}

function Posting({ posting, refetch }) {
  const {
    posting_id: postingId,
    posting_tags: postingTags,
    posting_status: postingStatus,
    item_name: itemName,
    description,
    location,
    date_time: dateTime,
    created_at: createdAt,
    user_id: authorUserId,
    image: imgPath,
    email: authorEmail,
    name: authorName,
  } = posting;

  const [postOpen, setPostOpen] = useState(false);

  function togglePostDetail() {
    setPostOpen(!postOpen);
  }

  if (postOpen) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  return (
    <div className={styles.posting}>
      {/* Image */}
      <img
        src={
          imgPath ? `data:image/jpeg;base64,${imgPath}` : "/tempImg/noImg.png"
        }
        className={styles.itemImg}
        onClick={togglePostDetail}
      />
      {/* Status */}
      {postingStatus == "found" && (
        <h1
          className={`${styles.postingInfo} ${styles.found}`}
          onClick={togglePostDetail}
        >
          Found
        </h1>
      )}
      {postingStatus == "lost" && (
        <h1
          className={`${styles.postingInfo} ${styles.lost}`}
          onClick={togglePostDetail}
        >
          Lost
        </h1>
      )}
      {postingStatus == "claimed" && (
        <h1
          className={`${styles.postingInfo} ${styles.claimed}`}
          onClick={togglePostDetail}
        >
          Claimed
        </h1>
      )}
      {postingStatus == "recovered" && (
        <h1
          className={`${styles.postingInfo} ${styles.claimed}`}
          onClick={togglePostDetail}
        >
          Recovered
        </h1>
      )}
      {/* Item Name */}
      <h1 className={styles.postingInfo} onClick={togglePostDetail}>
        {itemName}
      </h1>
      {/* Tags */}
      {postingTags && (
        <div className={styles.postingInfo}>
          {/* <Stack direction="row" spacing={1}> */}
          <div className={styles.tagContainer}>
            {postingTags.map((tag, index) => {
              return <Chip label={tag} key={index} />;
            })}
            </div>
          {/* </Stack> */}
        </div>
      )}

      <div className={styles.postingInfo} onClick={togglePostDetail}>
        <PlaceIcon style={{ fill: "#1976d2" }} />
        <p> {location}</p>
      </div>
      <div className={styles.postingInfo} onClick={togglePostDetail}>
        <AccessTimeIcon style={{ fill: "#1976d2" }} />
        <p>{convertDateTime(dateTime)}</p>
      </div>
      {/* Open Post */}
      <Zoom in={postOpen}>
        <div className={styles.popupPost}>
          <div onClick={togglePostDetail} className={styles.overlay}></div>
          <div className={styles.popupPostContent}>
            <PostingPopUp
              dateTime={convertDateTime(dateTime)}
              createdAt={convertDateTime(createdAt)}
              posting={posting}
              refetch={refetch}
              closePopUp={togglePostDetail}
            />
            <button className={styles.closeButton} onClick={togglePostDetail}>
              <CloseIcon />
            </button>
          </div>
        </div>
      </Zoom>
    </div>
  );
}

export default Posting;
