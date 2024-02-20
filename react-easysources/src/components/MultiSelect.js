import React from "react";
// import "./styles.css";
import Select from "react-select";

export default function MultiSelect({metadata, optionList, selectedOptions, setSelectedOptions}) {


  // Function triggered on selection
  function handleSelect(data) {
    setSelectedOptions(data);
  }

  return (
    <div className="app">
      <p>Available {metadata}</p>
      <div className="dropdown-container">
        <Select
         closeMenuOnSelect={false}
          options={optionList}
          placeholder={"Select " + metadata}
          value={selectedOptions}
          onChange={handleSelect}
          isSearchable={true}
          isMulti
        />
      </div>
    </div>
  );
}