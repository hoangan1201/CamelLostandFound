import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import useDebounce  from "../../../hooks/useDebounce";

function MarkClaimedDialog(props) {
  const [emailInput, setEmailInput] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const debouncedEmailInput = useDebounce(emailInput);

  function handleInputChange(event) {
    const val = event.target.value;
    setEmailInput(val);
  }

  function handleUserSelect(event, newVal){
    setSelectedUser(newVal);
  }

  async function fetchUsersList() {
    try {
      const response = await axios.get("http://localhost:4000/api/users/all");
      setUsersList(response.data);
    } catch (error) {
      props.handleClose();
      window.alert("There was an error updating the post.");
    }
  }
  //   console.log("Marked Claim Dialog");
  useEffect(() => {
    if (debouncedEmailInput) {
      fetchUsersList(debouncedEmailInput);
    }
  }, [debouncedEmailInput]);

  return (
    <div>
      <DialogTitle id="mark-claimed-dialog-title">
        {"Mark Item as Claimed"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="mark-claimed-dialog-description">
          Please enter the email of the person claiming this item.
        </DialogContentText>
        <Autocomplete
        // disablePortal
          options={usersList}
          getOptionLabel={(option) => `${option.email} (${option.name})` }
          renderInput={(params) => (
            <TextField
              {...params}
              autoFocus
              margin="dense"
              id="email"
              label="email"
              type="text"
              fullWidth
              value={emailInput}
              onChange={handleInputChange}
            />
          )}
          onChange={handleUserSelect}
        />

      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>Cancel</Button>
        <Button onClick={() => props.handleSubmit(selectedUser.user_id, selectedUser.name, selectedUser.email)} disabled={!selectedUser}>Submit</Button>
      </DialogActions>
    </div>
    // </Dialog>
  );
}

export default MarkClaimedDialog;
