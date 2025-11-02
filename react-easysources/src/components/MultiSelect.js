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
    <div className="app" style={{ background: "#222", color: "#fff", padding: "1em" }}>
      <p>Available {metadata}</p>
      <div className="dropdown-container">
        <Select
          onInputChange={onInputChange}
          menuIsOpen={menuIsOpen}
          closeMenuOnSelect={false}
          options={optionList}
          placeholder={"Select " + metadata}
          value={selectedOptions}
          onChange={handleSelect}
          isSearchable={true}
          isMulti
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "#333",
              color: "#fff",
              borderColor: "#444"
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "#333",
              color: "#fff"
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected ? "#555" : state.isFocused ? "#444" : "#333",
              color: "#fff"
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: "#444",
              color: "#fff"
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: "#fff"
            }),
            multiValueRemove: (base) => ({
              ...base,
              color: "#fff",
              backgroundColor: "#555",
              ':hover': {
                backgroundColor: "#666",
                color: "#fff"
              }
            }),
            placeholder: (base) => ({
              ...base,
              color: "#bbb"
            }),
            singleValue: (base) => ({
              ...base,
              color: "#fff"
            }),
            input: (base) => ({
              ...base,
              color: "#fff"
            })
          }}
        />
      </div>
    </div>
  );
}