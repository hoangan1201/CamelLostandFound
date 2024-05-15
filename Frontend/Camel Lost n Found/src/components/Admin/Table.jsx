import axios from "axios";
import React, { useEffect, useState } from "react";

function Table({ data }) {
  const [tableData, setTableData] = useState([]);
  //   claimed_by_email, claimed_by_name,claimed_by_user_id,date,date_string,item_name,name,posting_id

  async function fetchTableData() {
    try {
      const result = await axios.get("http://localhost:4000/api/claimed/data");
      console.log(result.data);
      setTableData(result.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchTableData();
  }, []);

  const headerCellStyle = {
    backgroundColor: "#f2f2f2",
    borderBottom: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
  };

  const cellStyle = {
    borderBottom: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
  };

  return (
    <div>
      {tableData && (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={headerCellStyle}>Item Name</th>
              <th style={headerCellStyle}>Posted By</th>
              <th style={headerCellStyle}>Claimed By</th>
              <th style={headerCellStyle}>Contact</th>
              <th style={headerCellStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={index}>
                <td style={cellStyle}>{item.item_name}</td>
                <td style={cellStyle}>{item.name}</td>
                <td style={cellStyle}>{item.claimed_by_name}</td>
                <td style={cellStyle}>{item.claimed_by_email}</td>
                <td style={cellStyle}>{item.date_string}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Table;
