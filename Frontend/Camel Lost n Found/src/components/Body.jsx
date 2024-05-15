import React, { useEffect, useState } from "react";
import styles from "./Body.module.css";
import Posting from "./Postings/Posting";
import CreatePosting from "./CreatePosting";
import axios from "axios";
import SearchBar from "./SearchBar/SearchBar";
import { useUserContext } from "../Context/UserContext";
import ServerError from "./ErrorHandling/ServerError";

function Body(props) {
  const user = useUserContext();
  const [postingList, setPostingList] = useState([]);
  const [filteredPostingList, setFilteredPostingList] = useState([]);

  async function fetchPostingList() {
    try {
      const result = await axios.get("http://localhost:4000/api/postings");
      // console.log(result.data);
      if (result.status === 200) {
        setPostingList(result.data);
        setFilteredPostingList(result.data);
        console.log("Fetch All Postings");
      } else {
        props.setFetchError(true);
      }
    } catch (error) {
      console.log("Error fetching posts: " + error);
      props.setFetchError(true);
    }
  }

  async function fetchMyPostings() {
    try {
      const result = await axios.get(
        `http://localhost:4000/user/${user.user_id}/postings`
      );
      if (result.status === 200) {
        setPostingList(result.data);
        setFilteredPostingList(result.data);
        console.log("Fetch my postings");
      } else {
        props.setFetchError(true);
      }
    } catch (error) {
      console.log("Error fetching my posts: " + error);
      props.setFetchError(true);
    }
  }

  useEffect(() => {
    if (props.myPost) {
      fetchMyPostings();
    } else {
      fetchPostingList();
    }
    // handleSearchInput("", "all");
  }, []);

  useEffect(() => {
    // Call handleSearchInput with initial values for search query and filter
    handleSearchInput("", "all");
  }, [postingList]);

  function handleSearchInput(query, filter) {
    let filteredList = postingList;
    // Search Query
    if (query != "") {
      filteredList = postingList.filter((posting) => {
        return (
          posting.item_name.toLowerCase().includes(query.toLowerCase()) ||
          posting.location.toLowerCase().includes(query.toLowerCase()) ||
          posting.description.toLowerCase().includes(query.toLowerCase())
        );
      });
    }
    // Filter Selection
    if (filter == "all") {
      filteredList = filteredList.filter((posting) => {
        const status = posting.posting_status.toLowerCase();
        return status === "lost" || status === "found";
      });
    } else if (filter == "closed"){
      filteredList = filteredList.filter((posting) => {
        const status = posting.posting_status.toLowerCase();
        return status === "recovered" || status === "claimed";
      });
    } else{
      filteredList = filteredList.filter((posting) => {
        return posting.posting_status.toLowerCase() == filter;
      });
    }
    setFilteredPostingList(filteredList);
  }
  
  return (
    <div className={styles.bodyContainer}>
      <div className={styles.addButtoonContainer}>
        {props.myPost ? (
          <h1 className={styles.pageTitle}>My Posts</h1>
        ) : (
          <CreatePosting
            className={styles.addButton}
            onNewPosting={fetchPostingList}
            role = {user.role}
          />
        )}
      </div>

      <div className={styles.searchBarContainer}>
        <SearchBar getResults={handleSearchInput} key={postingList} />
      </div>
 
      <div className={styles.postingContainer}>
        {filteredPostingList.map((posting, index) => {
          return (
            <Posting key={index} posting={posting} refetch={props.myPost ? fetchMyPostings : fetchPostingList} />
          );
        })}
      </div>
    </div>
  );
}

export default Body;
