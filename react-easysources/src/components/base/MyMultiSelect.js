import React from "react";
// import "./styles.css";
import Select from "react-select";

/**
 * Multi-select component che accetta array di stringhe
 * Converte internamente in formato {label, value} per react-select
 */
export default function MyMultiSelect({metadata, optionList, selectedOptions, setSelectedOptions}) {

  // Converti array di stringhe in formato react-select {label, value}
  const options = optionList.map(item => ({ label: item, value: item }));
  const selected = selectedOptions ? selectedOptions.map(item => ({ label: item, value: item })) : null;

  // Function triggered on selection
  function handleSelect(data) {
    // Converti da {label, value} a array di stringhe
    const values = data ? data.map(item => item.value) : [];
    setSelectedOptions(values);
  }

  const onInputChange = (
    inputValue,
    { action, prevInputValue }
  ) => {
    if (action === 'input-change') return inputValue;
    if (action === 'menu-close') {
      return '';
    } else {return prevInputValue;}
  };

  return (
    <div className="app" style={{ background: "#222", color: "#fff", padding: "1em" }}>
      {/* <p>Available {metadata}</p> */}
      <div className="dropdown-container">
        <Select
          onInputChange={onInputChange}
          closeMenuOnSelect={false}
          options={options}
          placeholder={"Select " + metadata}
          value={selected}
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
              color: "#fff",
              zIndex: 9999
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