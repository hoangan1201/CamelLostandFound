import React, { useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import styles from "./SearchBar.module.css";

function SearchBar(props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  function handleSearchQueryChange(event) {
    const query = event.target.value;
    setSearchQuery(query);
    props.getResults(query, selectedFilter);
  }

  function handleFilterSelect(event) {
    const filter = event.target.value;
    setSelectedFilter(filter);
    props.getResults(searchQuery, filter);
  }

  // useEffect(() => {
  //   props.getResults("", "all");
  // }, []);
  

  return (
    <div className={styles.container}>
      <div className={styles.searchInputContainer}>
        
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Type to search..."
          onChange={handleSearchQueryChange}
          value={searchQuery}
        /><SearchIcon className={styles.searchIcon} fontSize="inherit"/>
      </div>

      <div className={styles.filterSelectionsContainer}>
        <button
          value="all"
          onClick={handleFilterSelect}
          className={`${styles.filterSelection} ${
            selectedFilter === "all" ? styles.selected : ""
          }`}
        >
          All
        </button>
        <button
          value="lost"
          onClick={handleFilterSelect}
          className={`${styles.filterSelection} ${
            selectedFilter === "lost" ? styles.selected : ""
          }`}
        >
          Lost
        </button>
        <button
          value="found"
          onClick={handleFilterSelect}
          className={`${styles.filterSelection} ${
            selectedFilter === "found" ? styles.selected : ""
          }`}
        >
          Found
        </button>
        <button
          value="closed"
          onClick={handleFilterSelect}
          className={`${styles.filterSelection} ${
            selectedFilter === "closed" ? styles.selected : ""
          }`}
        >
          Closed
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
