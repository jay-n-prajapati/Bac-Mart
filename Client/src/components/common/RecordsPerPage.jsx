import React from "react";

const RecordsPerPage = ({recordsPerPage,setRecordsPerPage,setCurrentPage}) => {
    const recordsChange = (e) => {
		const selectedRecords = (e.target.value);
		setRecordsPerPage(selectedRecords);
		setCurrentPage(1); 
	  };

  return (
    <div className="ml-2">
      <select value={recordsPerPage} onChange={recordsChange}>
        <option value={7}>7</option>
        <option value={8}>8</option>
        <option value={10}>10</option>
      </select>
    </div>
  );
};

export default RecordsPerPage;
