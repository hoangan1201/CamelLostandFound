import React, { useState } from "react";
import "./ModalAntiSlide.css";
import styles from "./CreatePosting.module.css";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import NewPostingForm from "./NewPostingForm";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// function CreatePosting(props) {
//   const [open, setOpen] = React.useState(false);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <div>
//       <Button variant="contained" onClick={handleClickOpen}>
//       Add New Post
//       </Button>
//       <Dialog
//         open={open}
//         TransitionComponent={Transition}
//         keepMounted
//         onClose={handleClose}
//         aria-describedby="alert-dialog-slide-description"
//       >
//         <h2>New post</h2>
//         <DialogTitle>New Post</DialogTitle>
//         <DialogContent>
//           <DialogContentText id="dialog-description">
//             Let Google help apps determine location. This means sending anonymous
//             location data to Google, even when no apps are running.
//           </DialogContentText>
//           <h4>Item Name</h4>
//           <input type="text" />
//         </DialogContent>
//         <DialogContentText>Item Name</DialogContentText>
//         <TextField/>
//         <input type="text" />
//         <DialogActions>
//           <Button variant="outlined" onClick={handleClose}>Cancel</Button>
//           <Button variant="contained" onClick={handleClose}>Submit</Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   )
// }

function CreatePosting(props) {
  const [formOpen, setFormOpen] = useState(false);
  const navigate = useNavigate();

  function navMyPost() {
    navigate("/profile/postings");
  }

  function navAdmin() {
    navigate("/admin");
  }

  const toggleForm = () => {
    setFormOpen(!formOpen);
  };

  if (formOpen) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  return (
    <div>
      <Button
        variant="contained"
        onClick={toggleForm}
        style={{ marginRight: "1rem" }}
        startIcon={<AddIcon />}
      >
        Add New Post
      </Button>
      <Button
        variant="contained"
        color="success"
        style={{ marginRight: "1rem" }}
        onClick={navMyPost}
        endIcon={<PersonIcon />}
      >
        My Post
      </Button>
      {props.role == "admin" && (
        <Button
          variant="contained"
          color="inherit"
          onClick={navAdmin}
          endIcon={<AdminPanelSettingsIcon />}
        >
          Admin
        </Button>
      )}

      {/* {modal && ( */}
      <Slide direction="up" in={formOpen}>
        <div className={styles.popupForm}>
          <div onClick={toggleForm} className={styles.overlay}></div>
          <div className={styles.popupFormContent}>
            <h2>New Post</h2>
            <NewPostingForm
              setFormOpen={setFormOpen}
              onNewPosting={props.onNewPosting}
            />
            <button className={styles.closeButton} onClick={toggleForm}>
              <CloseIcon />
            </button>
          </div>
        </div>
      </Slide>
      {/* )} */}
    </div>
  );
}

export default CreatePosting;
