import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React from "react";

function DeleteConfirmationDialog(props) {
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  return (
    <Dialog
      open={props.deleteConfirmation}
      TransitionComponent={Transition}
      onClose={props.close}
      aria-labelledby="delete-posting-dialog-title"
      aria-describedby="delete-posting-dialog-description"
    >
      <DialogTitle id="delete-posting-dialog-title">
        {"Confirm Deletion"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-posting-dialog-description">
          Are you sure you want to delete this posting? This action is permanent
          and can not be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.close}>Cancel</Button>
        <Button onClick={props.handleDelete} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteConfirmationDialog;
