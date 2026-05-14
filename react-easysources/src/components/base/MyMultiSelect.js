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
    <div className="app" style={{ padding: "1em" }}>
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
              backgroundColor: 'var(--vscode-input-background)',
              color: 'var(--vscode-input-foreground)',
              borderColor: 'var(--vscode-input-border)',
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: 'var(--vscode-dropdown-background)',
              color: 'var(--vscode-dropdown-foreground)',
              zIndex: 9999
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected
                ? 'var(--vscode-list-activeSelectionBackground)'
                : state.isFocused
                  ? 'var(--vscode-list-hoverBackground)'
                  : 'var(--vscode-dropdown-background)',
              color: state.isSelected
                ? 'var(--vscode-list-activeSelectionForeground)'
                : 'var(--vscode-dropdown-foreground)',
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: 'var(--vscode-badge-background)',
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: 'var(--vscode-badge-foreground)',
            }),
            multiValueRemove: (base) => ({
              ...base,
              color: 'var(--vscode-badge-foreground)',
              ':hover': {
                backgroundColor: 'var(--vscode-list-hoverBackground)',
                color: 'var(--vscode-foreground)',
              }
            }),
            placeholder: (base) => ({
              ...base,
              color: 'var(--vscode-input-placeholderForeground)',
            }),
            singleValue: (base) => ({
              ...base,
              color: 'var(--vscode-input-foreground)',
            }),
            input: (base) => ({
              ...base,
              color: 'var(--vscode-input-foreground)',
            })
          }}
        />
      </div>
    </div>
  );
}