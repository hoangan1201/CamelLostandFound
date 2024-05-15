import React, { useState } from "react";
import axios from "axios";
import styles from "./PostingPopUp.module.css";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
// import BeenhereIcon from "@mui/icons-material/Beenhere";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useUserContext } from "../../Context/UserContext";
import Slide from "@mui/material/Slide";
import Dialog from "@mui/material/Dialog";
import DeleteConfirmationDialog from "./Dialogs/DeleteConfirmationDialog";
import MarkClaimedDialog from "./Dialogs/MarkClaimedDialog";
import MarkRecoveredDialog from "./Dialogs/MarkRecoveredDialog";
import ServerError from "../ErrorHandling/ServerError";
import { useNavigate } from "react-router-dom";

function PostingPopUp(props) {
  const user = useUserContext();
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  const navigate = useNavigate();

  const {
    posting_id: postingId,
    posting_tags: postingTags,
    posting_status: postingStatus,
    item_name: itemName,
    description,
    location,
    // date_time: dateTime,
    created_at: createdAt,
    user_id: authorUserId,
    image: imgPath,
    email: authorEmail,
    name: authorName,
  } = props.posting;

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [markClaimDialog, setMarkClaimDialog] = useState(false);
  const [markFoundDialog, setMarkFoundDialog] = useState(false);
  // const [error, setError] = useState(false);

  function openDelConf() {
    setDeleteConfirmation(true);
  }

  function closeDelConf() {
    setDeleteConfirmation(false);
  }

  async function handleDelete() {
    try {
      const response = await axios.delete(
        `http://localhost:4000/api/posting/delete/${postingId}`
      );
      if (response.status == 200) {
        closeDelConf();
        props.closePopUp();
        props.refetch();
        // navigate()
      } else {
        throw new Error("Failed to delete posting");
      }
    } catch (error) {
      console.error("Error deleting posting:", error);
      navigate("/error");
    }
  }

  function openClaimDlg() {
    setMarkClaimDialog(true);
  }

  function closeClaimDlg() {
    setMarkClaimDialog(false);
  }

  async function handleSubmitClaimed(userId, name, email) {
    try {
      const response = await axios.patch(
        "http://localhost:4000/api/posting/claimed",
        { postingId, userId, name, email }
      );
      if (response.status == 200) {
        closeClaimDlg();
        props.refetch();
        props.closePopUp();
      } else {
        closeClaimDlg();
        props.refetch();
        props.closePopUp();
        window.alert("There was an error updating the post.");
      }
    } catch (error) {
      closeClaimDlg();
      props.refetch();
      props.closePopUp();
      window.alert("There was an error with the server.");
    }
  }

  function openFoundDlg() {
    setMarkFoundDialog(true);
  }

  function closeFoundDlg() {
    setMarkFoundDialog(false);
  }

  async function handleRecovered() {
    try {
      const response = await axios.patch(
        `http://localhost:4000/api/posting/recovered/${postingId}`
      );
      console.log("Handle Recovered");
      closeFoundDlg();
      props.closePopUp();
      props.refetch();
      if (response.status != 200) {
        throw new Error("Failed to update");
      }
    } catch (error) {
      navigate("/error");
    }
  }

  return (
    <div className={styles.popupPostContentContainer}>
      {/* Item status */}
      <div className={styles.contentRow}>
        {postingStatus == "lost" && <h2 className={styles.lost}>Lost Item</h2>}
        {postingStatus == "found" && (
          <h2 className={styles.found}>Found Item</h2>
        )}
        {postingStatus == "claimed" && (
          <h2 className={styles.claimed}>Claimed Item</h2>
        )}
        {postingStatus == "recovered" && (
          <h2 className={styles.claimed}>Item Recovered</h2>
        )}
      </div>
      {/* Item Name */}
      <div className={styles.contentRow}>
        <h2>{itemName}</h2>
      </div>
      {/* Image */}
      <div className={`${styles.imgContainerRow}`}>
        <img
          src={
            imgPath ? `data:image/jpeg;base64,${imgPath}` : "/tempImg/noImg.png"
          }
        />
      </div>
      {/* Author */}
      <div className={styles.contentRow} style={{ margin: "0" }}>
        <p style={{ fontStyle: "italic", fontSize: "0.8rem" }}>
          *Posted by{" "}
          <span style={{ textDecoration: "underline" }}>{authorName}</span>,
          contact at{" "}
          <span style={{ textDecoration: "underline" }}>{authorEmail}</span>
        </p>
      </div>
      {postingStatus == "claimed" && (
        <div className={styles.contentRow}>
          <p>
            <strong>This Item has been claimed.</strong>
          </p>
        </div>
      )}
      {postingStatus == "recovered" && (
        <div className={styles.contentRow}>
          <p>
            <strong>This item has been recovered.</strong>
          </p>
        </div>
      )}
      {/* Tags */}
      {postingTags && (
        <div className={styles.contentRow}>
          <Stack direction="row" spacing={1}>
            {postingTags.map((tag, index) => {
              return (
                <Chip label={tag} key={index} sx={{ fontSize: "1.2rem" }} />
              );
            })}
          </Stack>
        </div>
      )}
      {/* Place and Time */}
      <div className={`${styles.contentRow} ${styles.fontSize2}`}>
        <PlaceIcon
          style={{ fill: "#002f5f", marginRight: "10px" }}
          fontSize="large"
        />
        <p>{location}</p>
      </div>
      <div className={`${styles.contentRow} ${styles.fontSize2}`}>
        <AccessTimeIcon
          style={{ fill: "#002f5f", marginRight: "10px" }}
          fontSize="large"
        />
        <p> {props.dateTime}</p>
      </div>
      {/* Description */}

      <div className={styles.contentRow}>
        <p>
          <strong>Description: </strong>
          {description}
        </p>
      </div>
      {/* Actions */}
      {(authorUserId == user.user_id || user.role == "admin") && (
        <div className={`${styles.contentRow} ${styles.actionRow}`}>
          {postingStatus != "claimed" && postingStatus != "recovered" && (
            <div onClick={openDelConf}>
              <DeleteIcon
                style={{ fontSize: "3rem", fill: "#002f5f", margin: "0" }}
              />
              <p>Delete</p>
            </div>
          )}

          {postingStatus == "found" && (
            <div onClick={openClaimDlg}>
              <CheckCircleIcon
                style={{ fontSize: "2.7rem", fill: "#002f5f", margin: "0" }}
              />
              <p>Claimed</p>
            </div>
          )}

          {postingStatus == "lost" && (
            <div onClick={openFoundDlg}>
              <CheckCircleIcon
                style={{ fontSize: "2.7rem", fill: "#002f5f", margin: "0" }}
              />
              <p>Found it</p>
            </div>
          )}
        </div>
      )}
      {/* Dialogs */}
      {deleteConfirmation && (
        <DeleteConfirmationDialog
          deleteConfirmation={deleteConfirmation}
          close={closeDelConf}
          handleDelete={handleDelete}
        />
      )}
      {markClaimDialog && (
        <Dialog
          open={markClaimDialog}
          TransitionComponent={Transition}
          keepMounted
          onClose={closeClaimDlg}
          aria-labelledby="mark-claimed-dialog-title"
          aria-describedby="mark-claimed-dialog-description"
        >
          <MarkClaimedDialog
            handleClose={closeClaimDlg}
            handleSubmit={handleSubmitClaimed}
          />
        </Dialog>
      )}
      {markFoundDialog && (
        <MarkRecoveredDialog
          markFoundDialog={markFoundDialog}
          close={closeFoundDlg}
          handleRecovered={handleRecovered}
        />
      )}
    </div>
  );
}

export default PostingPopUp;
