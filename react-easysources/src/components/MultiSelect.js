import React from "react";
// import "./styles.css";
import Select from "react-select";

export default function MultiSelect({metadata, optionList, selectedOptions, setSelectedOptions}) {


  // Function triggered on selection
  function handleSelect(data) {
    setSelectedOptions(data);
  }

  const [menuIsOpen, setMenuIsOpen] = React.useState();

  const onInputChange = (
    inputValue,
    { action, prevInputValue }
  ) => {
    if (action === 'input-change') return inputValue;
    if (action === 'menu-close') {
    //   if (prevInputValue) setMenuIsOpen(true);
    //   else setMenuIsOpen(undefined);
      return '';
    } else {return prevInputValue;}
    //return prevInputValue;
  };

  return (
    <div className="app">
      <p>Available {metadata}</p>
      <div className="dropdown-container">
        <Select
         onInputChange={onInputChange}
         menuIsOpen={menuIsOpen}
          closeMenuOnSelect={false}
          // onSelectResetsInput={false}
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