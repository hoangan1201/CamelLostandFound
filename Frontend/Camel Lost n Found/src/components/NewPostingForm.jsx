import React, { useState } from "react";
import styles from "./CreatePosting.module.css";
import TextField from "@mui/material/TextField";
import RadioGroup from "@mui/material/RadioGroup";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import axios from "axios";
import { useUserContext } from "../Context/UserContext";

const tags = [
  "ID",
  "Documents",
  "Electronics",
  "Personal Items",
  "Clothing",
  "Jewelry",
  "Sporting Goods",
  "Books/Office Supplies",
];

function NewPostingForm(props) {
  const user = useUserContext();
  const [formContent, setFormContent] = useState({
    itemName: "",
    status: "lost",
    location: "",
    dateTime: "",
    description: "",
    userId: user.user_id,
  });

  function updateFormContent(event) {
    const { name, value } = event.target;

    setFormContent((previousContent) => {
      return {
        ...previousContent,
        [name]: value,
      };
    });
  }

  /**
   * Manage tags selected
   */
  const [selectedTags, setSelectedTags] = useState([]);
  function handleTagsInputChange(event) {
    const value = event.target.value;
    if (selectedTags.includes(value)) {
      setSelectedTags((previousSelectedTag) => {
        previousSelectedTag.filter((tag) => tag != value);
      });
    } else {
      setSelectedTags((previousSelectedTag) => [...previousSelectedTag, value]);
    }
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    const fd = new FormData;
    for (const key in formContent){
      fd.append(key, formContent[key]);
    }
    selectedTags.forEach(tag => fd.append("tags[]", tag));
    const imgFile = event.target.querySelector("#item-image").files[0];
    if (imgFile){
      fd.append("image", imgFile);
    }
    console.log([...fd]);
    /**
     * Make Post Request
     */
    try {
      const result = await axios.post("http://localhost:4000/posting/new", fd, {
        headers: {
          "Content-Type": "multipart/form-data" // Ensure proper content type for FormData
        }
      });

      setFormContent({
        itemName: "",
        status: "lost",
        location: "",
        dateTime: "",
        description: "",
        userId: user.user_id,
      });
      setSelectedTags([]);
      props.setFormOpen(false);
      props.onNewPosting();
    } catch (error) {
      console.error("Error sending post request: ", error);
    }
  }

  return (
    <form className={styles.addForm} onSubmit={handleFormSubmit}>
      <div className={styles.formRow}>
        <TextField
          label="Item Name"
          value={formContent.itemName}
          onChange={updateFormContent}
          name="itemName"
          // error={formContent.itemName ? false:true }
          helperText={formContent.itemName.length + "/100"}
          inputProps={{ maxLength: 100 }}
          className={styles.formSingleInput}
          required
        />

        <Input
          id="item-image"
          type="file"
          inputProps={{ accept: "image/jpeg, image/png" }}
          // placeholder="Choose"
          // style={{ display: "none" }}
        />

      </div>
      <div className={styles.formRow}>
        <RadioGroup
          aria-label="status"
          name="status"
          value={formContent.status}
          onChange={updateFormContent}
        >
          <FormControlLabel value="lost" control={<Radio />} label="Lost" />
          <FormControlLabel value="found" control={<Radio />} label="Found" />
        </RadioGroup>
      </div>
      <div className={styles.formRow}>
        <TextField
          label="Location"
          name="location"
          value={formContent.location}
          onChange={updateFormContent}
          helperText={formContent.location.length + "/50"}
          inputProps={{maxLength: 50}}
          required
          multiline
        />
        <TextField
          label="Date and Time"
          type="datetime-local"
          name="dateTime"
          value={formContent.dateTime}
          onChange={updateFormContent}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>

      <div className={styles.formRow}>
        <TextField
          label="Description"
          name="description"
          className={styles.descriptionInput}
          value={formContent.description}
          onChange={updateFormContent}
          minRows={3}
          required
          multiline
        />
      </div>
      <div className={styles.formRow}>
        <h3>Select Tags that apply</h3>
      </div>
      <div className={styles.formRow}>
        <FormGroup
          row={true}
          className={styles.checkboxGroup}
          onChange={handleTagsInputChange}
        >
          {tags.map((tag, index) => {
            return (
              <FormControlLabel
                control={<Checkbox />}
                value={tag}
                key={index}
                label={tag}
              />
            );
          })}
        </FormGroup>
      </div>

      <Button variant="contained" type="submit">
        Submit
      </Button>
    </form>
  );
}

export default NewPostingForm;
