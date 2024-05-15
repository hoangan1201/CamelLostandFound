import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React from "react";

function MarkRecoveredDialog(props) {
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  return (
    <Dialog
      open={props.markFoundDialog}
      TransitionComponent={Transition}
      onClose={props.close}
      aria-labelledby="mark-recovered-dialog-title"
      aria-describedby="mark-recovered-dialog-description"
    >
      <DialogTitle id="mark-recovered-dialog-title">
        {"Confirm Item Recovered"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="mark-recovered-dialog-description">
          Are you sure you want to mark this item as recovered? This action will
          close the post permanently.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.close}>Cancel</Button>
        <Button onClick={props.handleRecovered} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MarkRecoveredDialog;
